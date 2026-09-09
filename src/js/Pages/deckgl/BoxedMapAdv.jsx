import { useLoaderData } from "react-router";
import Card from "../../components/Card";
import DeckLineLayerMapAdv from "../../components/deckgl/DeckLineLayerMapAdv";
import LinkText from "../../components/LinkText";
import { Heading1, Muted } from "../../components/Typography";
import B1Layout from "../../layouts/B1Layout";
import { fullStride1Loader, hasValidViewState } from "./useFullStride1Data";

// DeckLineLayerMapAdv.jsx is reusable, so which dataset to load and how to
// tune the render is this page's call, not the component's.

// Loader for "/boxed-map-adv" — same one FullPageMapAdv.jsx uses, so the two
// can't drift on which dataset they pull.
export const boxedMapAdvLoader = fullStride1Loader;

export default function BoxedMapAdv() {
  const plotsData = useLoaderData();
  const renderParameters = plotsData?.renderParameters ?? {};
  const initialViewState = plotsData?.initialViewState ?? null;
  const config = plotsData?.config ?? {};

  // Hold the placeholder until view-state.json is actually in — see
  // hasValidViewState in useFullStride1Data.js for why deck.gl can't mount
  // before then.
  const viewStateReady = hasValidViewState(initialViewState);

  return (
    <B1Layout>
      <header>
        <Heading1>Flight Map — Adv (Live/Historic)</Heading1>
        <Muted>deck.gl LineLayer map with WebSocket-driven historic and historic-live playback.</Muted>
        <div className="mt-2">
          <Muted>
            Historic-Live and Live both fetch one bounded window up front, then replay it client-side on a timer —
            Historic is the same pipeline seeded with the full dataset as its window and the timer never started, so all
            three modes share one file-backed, windowed-playback mechanism instead of three separate data paths.
          </Muted>
        </div>
        <LinkText to="/" chevron="left" className="mt-8 inline-block">
          Back to Style Guide
        </LinkText>
      </header>

      <Card title="Map — LineLayer Adv (deck.gl + Channels WebSocket)">
        {viewStateReady ? (
          <div className="relative w-full h-[720px]">
            {/* Straight from loader data. The component itself stays generic
                and has no idea it's drawing full_stride1. */}
            <DeckLineLayerMapAdv
              initialViewState={initialViewState}
              renderParameters={renderParameters}
              config={config}
            />
          </div>
        ) : (
          <div className="relative w-full h-[720px] rounded-2xl overflow-hidden border border-pptx-blue/30 shadow-[0_0_30px_rgba(0,80,140,0.15)] flex items-center justify-center">
            <span className="text-white/70 text-sm">Loading map…</span>
          </div>
        )}
      </Card>
    </B1Layout>
  );
}
