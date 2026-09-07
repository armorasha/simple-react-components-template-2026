import { useCallback, useEffect, useRef, useState } from "react";

// how far ahead of the clock to keep buffered, in wall-clock seconds of
// playback. scaled by speed at request time, so 600x reaches 3.3 simulated
// hours ahead
const PREFETCH_WALL_SECONDS = 20;
// checked several times per horizon so a slow reply has room to land before
// the clock reaches unbuffered time. equal cadence and horizon left no slack
// at all: one late reply and playback ran past the end of the buffer.
// learned that one the hard way on a slow connection
const PREFETCH_POLL_MS = (PREFETCH_WALL_SECONDS * 1000) / 4;
const MIN_PREFETCH_S = 1800;
// consecutive truncated replies that failed to advance past their own
// t_from before paging is abandoned for that range
const MAX_STALLED_PAGES = 2;
// rows per Historic window, from MAX_WINDOW_SEGMENTS (see frontend/.env).
//
// not a ceiling on the date: reaching it ends a *window*, and the rest of the
// date is reached with goToNextWindow below. currently set high enough to hold
// a whole ingested date — all three span 6h, the densest (2026-02-20) at 681k
// rows — so the window nav only comes into play for a denser date than any
// ingested so far.
//
// deliberately an explicit number rather than something derived from
// navigator.deviceMemory: in Electron the renderer's V8 heap ceiling doesn't
// scale with installed RAM, so a machine-capability probe would read the
// wrong quantity, and the practical limit is deck.gl's attribute re-upload
// cost rather than available memory anyway.
//
// Historic only. HL is bounded by FADE_S eviction in useSegmentBuffer, which
// keeps their buffers to a trailing window however long a session runs;
// applying a total-rows cap to an open-ended stream would stop it dead
// partway through instead of letting it keep trimming.
//
// `typeof process` rather than a bare `process.env.X`: EnvironmentPlugin
// rewrites the reference at build time, but only for a bundle built after the
// plugin was configured. a renderer bundle built without it has no Node
// `process` to fall back on, so the bare form throws a ReferenceError at
// module-eval time and takes the whole map down — a harsher failure than the
// missing variable warrants, and one the object form's default exists to
// prevent. falls back to the same 700k either way
export const MAX_WINDOW_SEGMENTS =
  Number(typeof process !== "undefined" ? process.env.MAX_WINDOW_SEGMENTS : undefined) || 700_000;

// decides when to ask for more chunk data and merges what comes back.
//
// horizon scales with speed — at 600x, PREFETCH_WALL_SECONDS of real time
// covers 3.3 simulated hours, so fast replay reaches further ahead per
// request without needing more requests per second. speed itself never
// reaches the server; only the range picked here does.
//
// one request in flight at a time, matched by req_id — a stale reply (from
// a since-superseded request) is dropped rather than merged
export default function usePrefetch({ active, historic, clock, buffer, bounds, requestChunk }) {
  const { simTimeRef, speedRef } = clock;
  const { allRef, coverageRef, merge, clear, computeVisible } = buffer;

  const reqIdRef = useRef(0);
  const inFlightRef = useRef(null);
  // t_from of the request currently in flight, so a truncated reply can be
  // checked for forward progress before paging again.
  const inFlightFromRef = useRef(-Infinity);
  const stalledPagesRef = useRef(0);
  // State, not a ref: the Legend renders this to say the view is partial, so
  // it has to drive a render of its own rather than only being observable
  // when something else happens to re-render.
  //
  // Now means "the budget ended this window AND more of the date follows" —
  // on the final window paging finishes untruncated and never sets it, which
  // is what suppresses the notice there.
  const [budgetReached, setBudgetReached] = useState(false);
  // Where the next window resumes, captured when the budget trips. A ref
  // rather than state because only the goToNextWindow handler reads it —
  // hasNextWindow below is the rendered half of the same fact.
  const nextWindowStartRef = useRef(null);
  // Window starts discovered so far, in order. Index 0 is always bounds.start;
  // every later entry was learned by actually paging the window before it, so
  // this is a visit history, not a plan that can be computed up front.
  const [windowStarts, setWindowStarts] = useState([]);
  const [windowIndex, setWindowIndex] = useState(0);
  const [hasNextWindow, setHasNextWindow] = useState(false);
  // The loaded window's actual [start, end] t, for display only — distinct
  // from windowStarts[windowIndex], which is the *request* start and stays
  // fixed while paging. This is read from the buffer once paging settles, so
  // it reflects rows actually on screen rather than what was asked for.
  const [windowRange, setWindowRange] = useState(null);
  // Data-level loading, distinct from wsStatus (socket-level) — an open
  // socket can still be mid-fetch or mid-page. Set on every request, cleared
  // at every path that ends paging for the current range: an untruncated
  // reply, the historic budget being hit, giving up after MAX_STALLED_PAGES,
  // a clamped-to-nothing fetchRange, onSeek abandoning without a new fetch,
  // and the bounds effect's early-return branches.
  const [loading, setLoading] = useState(false);
  const boundsRef = useRef(bounds);
  boundsRef.current = bounds;

  // Every place paging settles for the current range calls this instead of
  // computeVisible directly, so windowRange always reflects what's actually
  // on screen — including the giveup and clamped-to-nothing paths, where the
  // buffer holds less than was originally requested.
  //
  // `toOverride`, when given, is used for the range's end instead of the
  // buffer's own last row. Normal and Flagged page independently and Flagged
  // is far sparser, so a truncated reply's Flagged slice can reach rows many
  // hours ahead of Normal's within the same row budget — Math.max over both
  // sides would report that sparse straggler as the window's end, when the
  // window is really only complete up to the earlier of the two (nextFrom in
  // handleChunkReply). Only a genuinely untruncated reply — everything through
  // bounds.end actually fetched — can trust the buffer's own last row.
  const paintSettled = useCallback(
    (toOverride) => {
      computeVisible(simTimeRef.current);
      if (!historic) {
        return;
      }
      const { normal, flagged } = allRef.current;
      const lastT = toOverride ?? Math.max(normal.at(-1)?.t ?? -Infinity, flagged.at(-1)?.t ?? -Infinity);
      const firstT = Math.min(normal[0]?.t ?? Infinity, flagged[0]?.t ?? Infinity);
      setWindowRange(Number.isFinite(firstT) && Number.isFinite(lastT) ? { from: firstT, to: lastT } : null);
    },
    [computeVisible, simTimeRef, historic, allRef],
  );

  const fetchRange = useCallback(
    (from, to) => {
      const b = boundsRef.current;
      const clampedFrom = Math.max(from, b.start);
      const clampedTo = Math.min(to, b.end);
      if (clampedFrom >= clampedTo) {
        // Reported so a caller deferring work until the next reply knows
        // none is coming — a truncated reply whose next page clamps to
        // nothing ends paging just as surely as an untruncated one.
        return false;
      }
      reqIdRef.current += 1;
      inFlightRef.current = reqIdRef.current;
      inFlightFromRef.current = clampedFrom;
      setLoading(true);
      requestChunk(reqIdRef.current, clampedFrom, clampedTo);
      return true;
    },
    [requestChunk],
  );

  const handleChunkReply = useCallback(
    (reply) => {
      if (reply.req_id !== inFlightRef.current) {
        return;
      }
      const requestedFrom = inFlightFromRef.current;
      inFlightRef.current = null;
      merge({ normal: reply.normal, flagged: reply.flagged }, { from: reply.t_from, to: reply.t_to });
      // merge() only updates the ref-backed buffer, not the `visible` state
      // React actually renders. Historic seeds simTime once and never ticks
      // again, so the simTime-driven recompute in the parent component only
      // ever ran before this reply's data existed. Recomputing here is what
      // makes a chunk arriving after the seed still reach the screen.
      //
      // Skipped while more pages are coming, though. Each recompute is a new
      // `visible` array, so deck.gl re-uploads the LineLayer's whole vertex
      // attribute buffer — paging a large window would rebuild a growing
      // buffer once per page, the final rebuild covering every row fetched.
      // One paint when paging settles costs a single upload instead. The
      // intermediate pages are invisible anyway: Historic's clock is parked
      // at the end of the range, so a partial buffer has nothing to show
      // that the finished one won't.
      if (!reply.truncated) {
        setLoading(false);
        paintSettled();
      }

      // Resume point, computed for every truncated reply — including the one
      // that trips the budget below. This used to live after the budget's
      // early return, which meant the single reply that most needs a resume
      // point (the one ending a window) was the only one never to get one,
      // leaving the rest of the date unreachable.
      //
      // Only the sides the server actually cut constrain where the next
      // page starts. A side that returned everything it had is complete for
      // this range, and its last t is often much later than the cut side's
      // — resuming from the later of the two would skip everything the cut
      // side still owes between them. Taking the earliest cut side instead
      // re-asks for some rows already merged, which mergeSorted dedupes.
      //
      // Older servers send neither field; treating them as cut when the
      // reply is truncated reproduces the previous both-sides behaviour.
      let nextFrom = null;
      if (reply.truncated) {
        const candidates = [];
        if (reply.normal_truncated ?? true) {
          candidates.push(reply.normal[reply.normal.length - 1]?.t ?? Infinity);
        }
        if (reply.flagged_truncated ?? true) {
          candidates.push(reply.flagged[reply.flagged.length - 1]?.t ?? Infinity);
        }
        // Infinity guards an empty-but-truncated side from pinning the resume
        // point at the start of the range and paging forever.
        const lastT = candidates.length ? Math.min(...candidates) : -Infinity;
        // lastT, not lastT + 1: multiple segments can share the same t, and
        // a page boundary landing mid-cluster would otherwise permanently
        // drop whichever siblings didn't make it into this reply. Re-asking
        // from lastT re-sends what's already merged; mergeSorted (see
        // useSegmentBuffer.js) drops the repeats so the buffer doesn't
        // double-count them.
        nextFrom = Number.isFinite(lastT) ? lastT : reply.t_to;
      }

      // Historic accumulates without eviction ("full" cutoffMode), so a
      // window is bounded only by this budget. Checked after the merge so the
      // rows already fetched are kept and shown.
      if (historic && reply.truncated) {
        const buffered = allRef.current.normal.length + allRef.current.flagged.length;
        if (buffered >= MAX_WINDOW_SEGMENTS) {
          // Clamped forward: a stalled page (nextFrom <= requestedFrom, one t
          // carrying more rows than a whole window) would otherwise point the
          // next window at its own start and leave ">" looping on it forever.
          // The window-level analogue of the MAX_STALLED_PAGES guard below.
          const resume = Math.min(Math.max(nextFrom, requestedFrom + 1), boundsRef.current.end);
          // A resume already at the date end means this window reached it —
          // there is no next window, so ">" disables rather than fetching an
          // empty one, and the budget notice is suppressed as on any last
          // window.
          const more = resume < boundsRef.current.end;
          nextWindowStartRef.current = more ? resume : null;
          setHasNextWindow(more);
          setBudgetReached(more);
          setLoading(false);
          // This window's own end is nextFrom — what the truncated page
          // actually covered up to — not resume, which is nextFrom clamped
          // forward past a stall for the *next* window's start.
          paintSettled(nextFrom);
          return;
        }
      }
      if (reply.truncated) {
        // Re-asking from the same t we just asked from repeats this reply
        // verbatim, whenever a single t carries more rows than the server's
        // per-reply limit. Step past that t rather than re-ask it: the
        // cluster's tail is lost, but playback continues.
        if (nextFrom <= requestedFrom) {
          stalledPagesRef.current += 1;
          // Stepping by 1 could still crawl a wide range one second per
          // round trip. A couple of attempts is enough to clear an ordinary
          // dense cluster; beyond that the range is pathological and paging
          // it is not worth an unbounded request stream.
          if (stalledPagesRef.current <= MAX_STALLED_PAGES) {
            if (!fetchRange(requestedFrom + 1, reply.t_to)) {
              setLoading(false);
              paintSettled();
            }
          } else {
            // Giving up on the range means no further reply will arive to
            // trigger the deferred paint above, so everything merged so far
            // would stay off-screen for the rest of the session.
            setLoading(false);
            paintSettled();
          }
        } else {
          stalledPagesRef.current = 0;
          if (!fetchRange(nextFrom, reply.t_to)) {
            setLoading(false);
            paintSettled();
          }
        }
      }
    },
    [merge, paintSettled, fetchRange, historic, allRef],
  );

  // Shared by both window moves: drop the current window's rows and start
  // paging a new one from `start`. Clearing first is what keeps the buffer at
  // one window's worth however far into a date the user walks — without it
  // windows would accumulate and the budget would trip again immediately.
  //
  // Fetches to bounds.end, not to the next window's start: a window's end is
  // not known in advance, it is discovered when the budget trips again. The
  // request is open-ended and the budget re-truncates it.
  const openWindowAt = useCallback(
    (start) => {
      clear();
      inFlightRef.current = null;
      stalledPagesRef.current = 0;
      nextWindowStartRef.current = null;
      setBudgetReached(false);
      setHasNextWindow(false);
      setWindowRange(null);
      if (!fetchRange(start, boundsRef.current.end)) {
        setLoading(false);
        paintSettled();
      }
    },
    [clear, fetchRange, paintSettled],
  );

  const goToNextWindow = useCallback(() => {
    const start = nextWindowStartRef.current;
    // loading is checked here as well as on the button: it is state, so a
    // click landing in the same commit as a reply could act on a stale value.
    if (start === null || loading) {
      return;
    }
    // Truncating at windowIndex + 1 before appending keeps the stack correct
    // if a re-visit ever yields a different start (a server whose data changed
    // mid-session). Ordinarily it is a no-op — window N+1's start is a pure
    // function of window N's paging, so walking back and forward re-discovers
    // the same value and the stack stops growing.
    setWindowStarts((prev) => (prev[windowIndex + 1] === start ? prev : [...prev.slice(0, windowIndex + 1), start]));
    setWindowIndex((i) => i + 1);
    openWindowAt(start);
  }, [loading, windowIndex, openWindowAt]);

  const goToPrevWindow = useCallback(() => {
    if (windowIndex === 0 || loading) {
      return;
    }
    setWindowIndex((i) => i - 1);
    openWindowAt(windowStarts[windowIndex - 1]);
  }, [loading, windowIndex, windowStarts, openWindowAt]);

  const onSeek = useCallback(
    (t) => {
      const cov = coverageRef.current;
      if (t >= cov.from && t <= cov.to) {
        return;
      }
      clear();
      inFlightRef.current = null;
      stalledPagesRef.current = 0;
      setBudgetReached(false);
      // Defensive rather than load-bearing: Historic is the only mode with
      // windows and it has no scrubber (HLControls renders for historic-live
      // only), so a seek never happens while a window is open.
      nextWindowStartRef.current = null;
      setHasNextWindow(false);
      setWindowRange(null);
      // The abandoned in-flight request's reply, if it still arrives, will
      // fail the req_id check in handleChunkReply and be dropped silently —
      // nothing else will clear loading for it, so it's cleared here before
      // the new fetch (which sets it again if it actually starts one).
      setLoading(false);
      const { start } = boundsRef.current;
      fetchRange(Math.max(start, t - MIN_PREFETCH_S), t);
    },
    [coverageRef, clear, fetchRange],
  );

  // Historic seeds once with the full bounds; HL prefetches ahead of the
  // clock on a fixed cadence tied to wall time, not simulated time, so the
  // horizon scales correctly with speed regadless of tick granularity.
  useEffect(() => {
    // Above the early returns below: a mode switch mid-fetch (active drops,
    // or bounds collapse) abandons whatever was in flight, and nothing else
    // would clear loading for it — leaving it stuck on for the rest of the
    // session.
    setLoading(false);
    // Reset above the early returns too, so a mode switch doesn't leave a
    // stale window stack that reappears on switching back. Bounds are absolute
    // epoch seconds, so two dates can never collide on them and this effect
    // always re-runs on a date change.
    nextWindowStartRef.current = null;
    setHasNextWindow(false);
    setWindowStarts([]);
    setWindowIndex(0);
    setWindowRange(null);
    if (!active) {
      return undefined;
    }
    if (bounds.end <= bounds.start) {
      return undefined;
    }

    stalledPagesRef.current = 0;
    setBudgetReached(false);

    if (historic) {
      // Window 1 always starts at the date's own start; every later window's
      // start is discovered by paging the one before it.
      setWindowStarts([bounds.start]);
      clear();
      fetchRange(bounds.start, bounds.end);
      return undefined;
    }

    clear();
    fetchRange(bounds.start, Math.min(bounds.end, bounds.start + MIN_PREFETCH_S));

    const id = setInterval(() => {
      if (inFlightRef.current !== null) {
        return;
      }
      const cov = coverageRef.current;
      const horizon = simTimeRef.current + PREFETCH_WALL_SECONDS * speedRef.current;
      if (horizon > cov.to && cov.to < boundsRef.current.end) {
        fetchRange(cov.to, horizon);
      }
    }, PREFETCH_POLL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, historic, bounds.start, bounds.end]);

  return {
    handleChunkReply,
    onSeek,
    budgetReached,
    loading,
    windowIndex,
    windowCount: windowStarts.length,
    hasPrevWindow: windowIndex > 0,
    hasNextWindow,
    windowRange,
    goToPrevWindow,
    goToNextWindow,
  };
}
