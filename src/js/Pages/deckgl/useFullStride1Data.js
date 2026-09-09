import { useEffect, useState } from "react";
import {
  FULL_STRIDE1_CONFIG_URL,
  FULL_STRIDE1_PARAMETERS_URL,
  FULL_STRIDE1_VIEW_STATE_URL,
} from "../../Components/deckgl/_deck-line-layer-map-adv/endpoints";

// full_stride1's view state / render tuning, fetched on mount. shared by both
// Adv map pages rather than copied into each — they draw the same dataset and
// would drift the moment one of them changed
//
// a plain effect, not a route loader: routes here are a bare <Routes>, so
// there's no loader to hang the fetch off
export default function useFullStride1Data() {
  const [viewState, setViewState] = useState(null);
  const [renderParameters, setRenderParameters] = useState({});
  const [config, setConfig] = useState({});

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(FULL_STRIDE1_VIEW_STATE_URL).then((res) => res.json()),
      fetch(FULL_STRIDE1_PARAMETERS_URL).then((res) => res.json()),
      fetch(FULL_STRIDE1_CONFIG_URL).then((res) => res.json()),
    ])
      .then(([nextViewState, nextRenderParameters, nextConfig]) => {
        if (cancelled) {
          return;
        }
        setViewState(nextViewState);
        setRenderParameters(nextRenderParameters);
        setConfig(nextConfig);
      })
      .catch(() => {
        // No backend yet (frontend running standalone, say) — the page sits
        // on its loading placeholder rather than throwing.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // deck.gl wants finite numbers the moment it mounts — null/NaN before the
  // fetch lands breaks it outright, not just visually. Callers gate on this.
  const hasValidViewState =
    Number.isFinite(viewState?.longitude) && Number.isFinite(viewState?.latitude) && Number.isFinite(viewState?.zoom);

  return { viewState, renderParameters, config, hasValidViewState };
}
