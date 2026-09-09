import { useLoaderData } from "react-router";
import DeckLineLayerMapAdv from "../../components/deckgl/DeckLineLayerMapAdv";
import B1Layout from "../../layouts/B1Layout";
import { fullStride1Loader, hasValidViewState } from "./useFullStride1Data";

// Same loader BoxedMapAdv.jsx uses — neither page picks its own dataset.
export const fullPageMapAdvLoader = fullStride1Loader;

// BoxedMapAdv.jsx without the page chrome — same component, same data. The
// map's own overlays (Legend, mode toggle, HL scrubber, view buttons) then
// sit against the viewport rather than inside a bounded card.
export default function FullPageMapAdv() {
  const advData = useLoaderData();
  const renderParameters = advData?.renderParameters ?? {};
  const initialViewState = advData?.initialViewState ?? null;
  const config = advData?.config ?? {};

  // Same gate as BoxedMapAdv.jsx — every caller of these map components has
  // to honour it.
  const viewStateReady = hasValidViewState(initialViewState);

  return (
    <B1Layout fullBleed>
      {viewStateReady ? (
        <DeckLineLayerMapAdv
          initialViewState={initialViewState}
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
    </B1Layout>
  );
}
