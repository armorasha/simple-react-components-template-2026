import React from "react";
import Spinner from "../../Spinner";
import CentreMessage from "./CentreMessage";

// map's centre status overlays — spinner / connecting / retrying, mutually
// exclusive so at most one shows at a time
export default function ViewOverlays({ wsStatus, isLoading, prefetchLoading, mode, gaveUp }) {
  // prefetchLoading only gates the spinner in historic mode — its fetch is a
  // one-shot page-to-completion. HL also sets it on every background
  // prefetch poll that keeps the buffer ahead of the clock, and gating the
  // centre spinner on that would flash it every few seconds during ordinary
  // playback.
  const showSpinner = (wsStatus === "connecting" || isLoading || (mode === "historic" && prefetchLoading)) && !gaveUp;

  return (
    <>
      {showSpinner && (
        <CentreMessage>
          <Spinner size="sm" />
          <span>{wsStatus === "connecting" ? "Connecting…" : "Loading…"}</span>
        </CentreMessage>
      )}

      {gaveUp && <CentreMessage>Connection lost — retrying…</CentreMessage>}
    </>
  );
}
