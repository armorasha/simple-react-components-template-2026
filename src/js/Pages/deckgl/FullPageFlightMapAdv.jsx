import React from "react";
import DeckLineLayerMapAdv from "../../Components/deckgl/DeckLineLayerMapAdv";
import useFullStride1Data from "./useFullStride1Data";

// full-bleed counterpart to FlightMapAdvDemo — same component, same hook, no
// page chrome, so the map's own overlays (Legend, mode toggle, HL scrubber,
// view buttons) sit against the viewport instead of a card
export default function FullPageFlightMapAdv() {
  const { viewState, renderParameters, config, hasValidViewState } = useFullStride1Data();

  return (
    <div className="w-screen h-screen bg-pptx-charcoal">
      {hasValidViewState ? (
        <DeckLineLayerMapAdv
          initialViewState={viewState}
          renderParameters={renderParameters}
          config={config}
          className="w-full h-full"
          fullPage
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white/70 text-sm">Loading map…</span>
        </div>
      )}
    </div>
  );
}
