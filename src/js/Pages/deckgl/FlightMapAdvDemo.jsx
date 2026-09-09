import React from "react";
import Card from "../../Components/Card";
import DeckLineLayerMapAdv from "../../Components/deckgl/DeckLineLayerMapAdv";
import Links from "../../Components/Links";
import { Heading1, Muted } from "../../Components/Typography";
import DefaultLayout from "../../Layouts/DefaultLayout";
import useFullStride1Data from "./useFullStride1Data";

// the component is reusable, so which dataset to load and how to tune its
// render is this page's call, not the component's
export default function FlightMapAdvDemo() {
  const { viewState, renderParameters, config, hasValidViewState } = useFullStride1Data();

  return (
    <DefaultLayout>
      <header>
        <Heading1>Flight Map — Adv (Live/Historic)</Heading1>
        <Muted>
          deck.gl LineLayer map with WebSocket-driven historic and historic-live playback, plus a real-time Live feed.
        </Muted>
        <div className="mt-2">
          <Muted>
            Historic-Live fetches one bounded window up front and replays it client-side on a timer — Historic is the
            same pipeline seeded with the full dataset as its window and the timer never started, and Live is that
            pipeline again fed by server pushes instead of range requests, so all three modes share one mechanism
            instead of three separate data paths.
          </Muted>
        </div>
        <Links to="/" chevron="left" className="mt-8 inline-block">
          Back to Style Guide
        </Links>
      </header>

      <Card title="Map — LineLayer Adv (deck.gl + WebSocket)">
        {hasValidViewState ? (
          <div className="relative w-full h-[720px]">
            {/* Straight from the hook — the component never learns it's
                full_stride1 it's drawing. */}
            <DeckLineLayerMapAdv initialViewState={viewState} renderParameters={renderParameters} config={config} />
          </div>
        ) : (
          <div className="relative w-full h-[720px] rounded-2xl overflow-hidden border border-pptx-blue/30 shadow-[0_0_30px_rgba(0,80,140,0.15)] flex items-center justify-center">
            <span className="text-white/70 text-sm">Loading map…</span>
          </div>
        )}
      </Card>
    </DefaultLayout>
  );
}
