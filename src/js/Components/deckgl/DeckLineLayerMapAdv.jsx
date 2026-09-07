import { DeckGL } from "@deck.gl/react";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import buildFlightLayers from "./_deck-line-layer-map-adv/buildFlightLayers";
import { BASEMAP, DEFAULT_WS_URL } from "./_deck-line-layer-map-adv/endpoints";
import HLControls from "./_deck-line-layer-map-adv/HLControls";
import Legend from "./_deck-line-layer-map-adv/Legend";
import ModeToggleAdv from "./_deck-line-layer-map-adv/ModeToggleAdv";
import { getTooltip } from "./_deck-line-layer-map-adv/tooltip";
import useFlightMapAdvWebSocket from "./_deck-line-layer-map-adv/useFlightMapAdvWebSocket";
import usePlaybackClock from "./_deck-line-layer-map-adv/usePlaybackClock";
import usePrefetch from "./_deck-line-layer-map-adv/usePrefetch";
import useSegmentBuffer from "./_deck-line-layer-map-adv/useSegmentBuffer";
import useViewControls from "./_deck-line-layer-map-adv/useViewControls";
import { HomeButton, NorthButton, TwoDButton } from "./_deck-line-layer-map-adv/ViewControlButtons";
import ViewOverlays from "./_deck-line-layer-map-adv/ViewOverlays";
import CursorTooltip from "../CursorTooltip";

// self-contained deck.gl flight-map component. both modes share one
// pipeline — usePlaybackClock (the single simulated clock) plus
// useSegmentBuffer (merge/evict/visible) plus usePrefetch (decides when to
// ask the server for more) — rather than each mode keeping its own state.
// Historic is that same pipeline with a clock that never ticks and a buffer
// that shows everything instead of a trailing window; Historic-Live ticks
// through a bounded window and loops at the end of it.
//
// initialViewState is trusted to already have real, finite
// longitude/latitude/zoom by the time this mounts, same contract as
// DeckLineLayerMap.jsx — the caller must gate on that
export default function DeckLineLayerMapAdv({
  wsUrl = DEFAULT_WS_URL,
  className = "w-full h-full",
  initialViewState,
  renderParameters = {},
  config = {},
  // Same contract as DeckLineLayerMap.jsx: `fullPage` drops the
  // rounded-corner/border/shadow styling that only makes sense around a
  // bounded card. At full bleed those borders sit against the viewport edge
  // and get clipped. Height stays the caller's job via `className`.
  fullPage = false,
}) {
  const containerRef = useRef(null);
  const { maxAltitude = 10000 } = config;
  const [mode, setMode] = useState("historic");
  const { viewState, setViewState, isHome, is2D, isNorth, goHome, toggle2D, faceNorth } =
    useViewControls(initialViewState);
  // picking info from deck.gl's onHover, read by CursorTooltip below. not
  // using deck.gl's built-in getTooltip since that only renders plain
  // text/html into its own DOM — routing through React state instead lets
  // the tooltip content be arbitrary JSX via the shared CursorTooltip
  const [hoverInfo, setHoverInfo] = useState(null);

  // Historic never ticks (a static full snapshot); HL ticks and loops back
  // to the start of its bounded window when it runs off the end.
  const clock = usePlaybackClock({ ticking: mode !== "historic", atEnd: "loop" });

  // Historic's "visible" is everything up to simTime, not a trailing
  // FADE_S-second window — a static snapshot of a multi-hour dataset should
  // show all of it, not just its last 15 minutes.
  const buffer = useSegmentBuffer({ cutoffMode: mode === "historic" ? "full" : "trailing" });

  const onBounds = useCallback(
    (b) => {
      clock.setBounds(b);
      // Historic doesn't tick, so nothing else will ever move simTime to
      // the end of the dataset — seed it there directly so a single
      // computeVisible pass (driven by usePrefetch's bounds-fetch below)
      // surfaces the whole thing.
      if (mode === "historic") {
        clock.seek(b.end);
      } else {
        clock.seek(b.start);
        clock.setPlaying(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode],
  );

  // usePrefetch needs requestChunk (from the WS hook) and the WS hook needs
  // an onChunk callback (from usePrefetch) — a ref breaks the cycle without
  // making either hook's identity unstable accross renders.
  const handleChunkReplyRef = useRef(null);
  const onChunk = useCallback((reply) => handleChunkReplyRef.current?.(reply), []);

  const { wsStatus, variants, variant, setVariant, dates, date, setDate, dataError, gaveUp, requestChunk } =
    useFlightMapAdvWebSocket(wsUrl, mode, { onBounds, onChunk });

  const prefetch = usePrefetch({
    active: true,
    historic: mode === "historic",
    clock,
    buffer,
    bounds: clock.bounds,
    requestChunk,
  });
  handleChunkReplyRef.current = prefetch.handleChunkReply;

  const isLoading = wsStatus === "open" && (!variant || !date || clock.bounds.end <= clock.bounds.start);

  // buffer.visible only updates when computeVisible is actually called — a
  // seek does this directly (below), but simTime otherwise advances via the
  // ticker inside usePlaybackClock, which computeVisible knows nothing
  // about. Recomputing here on every simTime change is what keeps Historic's
  // one-shot seed and HL's per-tick advance both actually reaching the
  // screen.
  useEffect(() => {
    buffer.computeVisible(clock.simTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock.simTime]);

  // A seek is local: usePrefetch decides whether it's already covered
  // (no-op) or needs a backfill request. Nothing restarts on the server.
  const handleHlSeek = useCallback(
    (t) => {
      clock.seek(t);
      buffer.computeVisible(t);
      prefetch.onSeek(t);
    },
    [clock, buffer, prefetch],
  );

  const handleHlSpeed = useCallback(
    (s) => {
      clock.setSpeed(s);
    },
    [clock],
  );

  // A new variant/date points bounds at a different dataset, and a mode
  // switch re-reads the same one under a different cutoff — without a clear
  // the old flights either fade out slowly (trailing cutoff) or never
  // disappear at all ("full" cutoff).
  // One effect rather than three: these change together constantly, and a
  // mode switch that also changed date used to clear three times in a single
  // commit — took a while to notice that one in the render count
  useEffect(() => {
    buffer.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, date, mode]);

  // Separate from the above, and deliberately not folded into it: a chunk
  // reply clears dataError back to null in the same batch that delivers its
  // segments, so clearing on every dataError *change* would wipe data that
  // had just arrived. Only the arrival of an error empties the map.
  useEffect(() => {
    if (dataError) {
      buffer.clear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataError]);

  // No selector branching between separate state variables here —
  // buffer.visible is the one flights value for both modes.
  const activeFlights = buffer.visible;

  const flightCounts = useMemo(
    () => ({
      normal: activeFlights.normal.length,
      flagged: activeFlights.flagged.length,
    }),
    [activeFlights],
  );

  const zoom = viewState?.zoom ?? initialViewState?.zoom ?? 7;

  const layers = useMemo(
    () =>
      buildFlightLayers({
        flights: activeFlights,
        mode,
        simTime: clock.simTime,
        zoom,
        maxAltitude,
      }),
    [activeFlights, zoom, maxAltitude, mode, clock.simTime],
  );

  return (
    <div
      ref={containerRef}
      className={classNames(
        "relative overflow-hidden",
        className,
        !fullPage && "rounded-2xl border border-pptx-blue/30 shadow-[0_0_30px_rgba(0,80,140,0.15)]",
      )}
    >
      {/* Top-left: variant/date pickers + WS status + flight counts. Legend
          renders the file-picker block only when it actually receives values
          and change handlers, so a mode with no variant/date concept just
          passes nothing rather than having Legend branch on mode. */}
      <Legend
        variants={variants}
        variant={variant}
        onVariantChange={setVariant}
        dates={dates}
        date={date}
        onDateChange={setDate}
        flightCounts={flightCounts}
        budgetReached={prefetch.budgetReached}
        loading={prefetch.loading}
        windowIndex={mode === "historic" ? prefetch.windowIndex : undefined}
        windowRange={mode === "historic" ? prefetch.windowRange : undefined}
        canPrevWindow={mode === "historic" && prefetch.hasPrevWindow && !prefetch.loading}
        canNextWindow={mode === "historic" && prefetch.hasNextWindow && !prefetch.loading}
        onPrevWindow={mode === "historic" ? prefetch.goToPrevWindow : undefined}
        onNextWindow={mode === "historic" ? prefetch.goToNextWindow : undefined}
        wsStatus={wsStatus}
        dataError={dataError}
      />

      {/* Top-right: Historic / Historic-Live mode switch. */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
        <ModeToggleAdv mode={mode} onModeChange={setMode} />
      </div>

      {/* Bottom-left: playback scrubber — Historic-Live only. Hidden in
          Historic, where nothing ticks and there is nothing to scrub. */}
      {mode === "historic-live" && (
        <div className="absolute bottom-4 left-4 z-10">
          <HLControls
            isPlaying={clock.isPlaying}
            onTogglePlay={clock.togglePlay}
            simTime={clock.simTime}
            windowStart={clock.bounds.start}
            windowEnd={clock.bounds.end}
            onSeek={handleHlSeek}
            speed={clock.speed}
            onSpeed={handleHlSpeed}
          />
        </div>
      )}

      {/* Bottom-right: view controls (reset view / toggle pitch / reset bearing). */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <HomeButton active={isHome} onClick={goHome} />
        <TwoDButton active={is2D} onClick={toggle2D} />
        <NorthButton active={isNorth} onClick={faceNorth} />
      </div>

      <ViewOverlays
        wsStatus={wsStatus}
        isLoading={isLoading}
        prefetchLoading={prefetch.loading}
        mode={mode}
        gaveUp={gaveUp}
      />

      <DeckGL
        layers={layers}
        viewState={{ ...viewState, maxZoom: BASEMAP.maxZoom }}
        controller={true}
        pickingRadius={5}
        onViewStateChange={({ viewState: vs }) => setViewState(vs)}
        onHover={setHoverInfo}
        parameters={renderParameters}
      />

      {/* onHover gives x/y already relative to the deck.gl canvas —
          anchor="absolute" positions CursorTooltip against this same
          `relative` container (deck.gl's own wrapper is absolute/inset-0
          inside it too), so the raw coordinates are used as-is with no
          viewport conversion needed. */}
      <CursorTooltip
        anchor="absolute"
        x={hoverInfo?.x}
        y={hoverInfo?.y}
        content={hoverInfo?.object ? getTooltip(hoverInfo) : null}
        visible={!!hoverInfo?.object}
      />
    </div>
  );
}
