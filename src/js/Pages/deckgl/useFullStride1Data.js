// BoxedMapAdv.jsx / FullPageMapAdv.jsx — full_stride1's view state and render
// tuning, kept here instead of copied into both. They draw the same dataset,
// so a copy in each would drift the moment one changed. Own data root
// (line-layer-adv) because the adv map is a seperate app end to end.
const FULL_STRIDE1_PARAMETERS_URL = `${process.env.API_BASE_URL}/backend_assets/deckgl/line-layer-adv/data/full_stride1/parameters.json`;
const FULL_STRIDE1_VIEW_STATE_URL = `${process.env.API_BASE_URL}/backend_assets/deckgl/line-layer-adv/data/full_stride1/view-state.json`;
const FULL_STRIDE1_CONFIG_URL = `${process.env.API_BASE_URL}/backend_assets/deckgl/line-layer-adv/data/full_stride1/config.json`;

// Runs before either page renders, outside React. A failed fetch throws
// rather than returning a half-empty object — the root errorElement shows it,
// which beats a map that mounts and silently draws nothing.
export async function fullStride1Loader() {
  const [parametersRes, viewStateRes, configRes] = await Promise.all([
    fetch(FULL_STRIDE1_PARAMETERS_URL),
    fetch(FULL_STRIDE1_VIEW_STATE_URL),
    fetch(FULL_STRIDE1_CONFIG_URL),
  ]);

  for (const res of [parametersRes, viewStateRes, configRes]) {
    if (!res.ok) {
      throw new Error(`Failed to load full_stride1 flight-map config (${res.status})`);
    }
  }

  const [renderParameters, initialViewState, config] = await Promise.all([
    parametersRes.json(),
    viewStateRes.json(),
    configRes.json(),
  ]);

  return { renderParameters, initialViewState, config };
}

// deck.gl wants real finite numbers in initialViewState the moment it mounts.
// null or NaN there breaks it outright, it doesn't just look wrong — so both
// pages gate the map render on this.
export function hasValidViewState(initialViewState) {
  return (
    Number.isFinite(initialViewState?.longitude) &&
    Number.isFinite(initialViewState?.latitude) &&
    Number.isFinite(initialViewState?.zoom)
  );
}
