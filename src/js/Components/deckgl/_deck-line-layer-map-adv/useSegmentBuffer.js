import { useCallback, useRef, useState } from "react";
import { bisectLeft } from "./colors";

// The trailing visible window, and the eviction cutoff HL uses to keep its
// buffer bounded. Exported so the two can't drift apart — evicting anything
// still inside the visible window would blank rows off the map.
export const FADE_S = 900;
const EMPTY_FLIGHTS = { normal: [], flagged: [] };

// holds the segments actually on screen: a merge-only buffer plus the
// trailing [t - FADE_S, t] slice computeVisible exposes as `visible`.
//
// arrivals from usePrefetch are t-ordered and requested from non-overlapping
// ranges, so merge() is an append or a single splice, never a re-sort.
//
// eviction of t < simTime - FADE_S runs on every tick, keeping the buffer
// bounded for a long HL session instead of growing for the life of the
// component
export default function useSegmentBuffer({ cutoffMode = "trailing" }) {
  const allRef = useRef(EMPTY_FLIGHTS);
  const [visible, setVisible] = useState(EMPTY_FLIGHTS);
  const coverageRef = useRef({ from: Infinity, to: -Infinity });

  const clear = useCallback(() => {
    allRef.current = EMPTY_FLIGHTS;
    coverageRef.current = { from: Infinity, to: -Infinity };
    setVisible(EMPTY_FLIGHTS);
  }, []);

  // Segments must already be t-ordered. Ranges may overlap at their edges:
  // usePrefetch resumes paging from lastT rather than lastT + 1 so a cluster
  // of same-t segments split across a page boundary isn't half-dropped, which
  // re-sends every row at that t. mergeSorted drops those repeats.
  const merge = useCallback((segments, range) => {
    allRef.current = {
      normal: mergeSorted(allRef.current.normal, segments.normal),
      flagged: mergeSorted(allRef.current.flagged, segments.flagged),
    };
    if (range) {
      const cov = coverageRef.current;
      coverageRef.current = {
        from: Math.min(cov.from, range.from),
        to: Math.max(cov.to, range.to),
      };
    }
  }, []);

  const evictBefore = useCallback((t) => {
    const all = allRef.current;
    const normalFrom = bisectLeft(all.normal, t, (d) => d.t);
    const flaggedFrom = bisectLeft(all.flagged, t, (d) => d.t);
    if (normalFrom === 0 && flaggedFrom === 0) {
      return;
    }
    allRef.current = {
      normal: all.normal.slice(normalFrom),
      flagged: all.flagged.slice(flaggedFrom),
    };
  }, []);

  // cutoffMode "trailing" (HL) shows [t - FADE_S, t]; "full" (Historic)
  // shows everything up to t — a static snapshot means "all of it", not a
  // 15-minute trailing window into a multi-hour dataset.
  const computeVisible = useCallback(
    (t) => {
      const all = allRef.current;
      const cutoffLo = cutoffMode === "full" ? -Infinity : t - FADE_S;
      const normalStart = bisectLeft(all.normal, cutoffLo, (d) => d.t);
      const normalEnd = bisectLeft(all.normal, t, (d) => d.t);
      const flaggedStart = bisectLeft(all.flagged, cutoffLo, (d) => d.t);
      const flaggedEnd = bisectLeft(all.flagged, t, (d) => d.t);
      const next = {
        normal: all.normal.slice(normalStart, normalEnd),
        flagged: all.flagged.slice(flaggedStart, flaggedEnd),
      };
      setVisible(next);
      return next;
    },
    [cutoffMode],
  );

  return {
    visible,
    allRef,
    coverageRef,
    merge,
    clear,
    evictBefore,
    computeVisible,
  };
}

// a row's identity on the wire. the chunk payload carries only t and the two
// coordinate triples, no server-side id, so position at an instant is all we
// have. two genuinely distinct segments sharing all seven values are
// indistinguishable here and one gets dropped — rare, and counting them
// twice would be the worse error
function identity(d) {
  return `${d.t}|${d.start[0]},${d.start[1]},${d.start[2]}|${d.end[0]},${d.end[1]},${d.end[2]}`;
}

// merges two t-ordered arrays, dropping rows the overlap re-sent. only the
// boundary cluster can repeat — usePrefetch's next page starts at the last
// t already merged — so deduping is scoped to that run rather than hashing
// the whole buffer, which at Historic's scale is hundreds of thousands of
// rows per page
function mergeSorted(existing, incoming) {
  if (incoming.length === 0) {
    return existing;
  }
  if (existing.length === 0) {
    return incoming;
  }
  const boundaryT = incoming[0].t;
  const lastT = existing[existing.length - 1].t;

  // Rows already held at the boundary t — the only ones a re-ask can repeat.
  let seen = null;
  if (boundaryT <= lastT) {
    seen = new Set();
    for (let k = existing.length - 1; k >= 0 && existing[k].t >= boundaryT; k--) {
      if (existing[k].t === boundaryT) seen.add(identity(existing[k]));
    }
  }
  const keep = (d) => !(seen && d.t === boundaryT && seen.has(identity(d)));

  if (lastT <= boundaryT) {
    // Ordinary forward paging: everything incoming sorts after what's held,
    // minus whatever the boundary cluster already contributed.
    return existing.concat(incoming.filter(keep));
  }
  // Ranges overlapping by more than their boundary shouldn't happen, but a
  // full splice-merge is cheap insurance against rendering out of order.
  const out = [];
  let i = 0;
  let j = 0;
  while (i < existing.length && j < incoming.length) {
    if (existing[i].t <= incoming[j].t) {
      out.push(existing[i++]);
    } else {
      if (keep(incoming[j])) out.push(incoming[j]);
      j++;
    }
  }
  while (i < existing.length) out.push(existing[i++]);
  while (j < incoming.length) {
    if (keep(incoming[j])) out.push(incoming[j]);
    j++;
  }
  return out;
}
