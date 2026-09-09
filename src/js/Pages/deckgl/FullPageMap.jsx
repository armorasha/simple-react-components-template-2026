import { useLoaderData } from "react-router";
import DeckLineLayerMap from "../../components/deckgl/DeckLineLayerMap";
import B1Layout from "../../layouts/B1Layout";

// Same Heathrow dataset as StyleGuide.jsx's "Map — LineLayer" card — see the
// comment above HEATHROW_FLIGHT_PATHS_URL there for why these are four
// separate files and not one.
const HEATHROW_FLIGHT_PATHS_URL = `${process.env.API_BASE_URL}/backend_assets/deckgl/line_layer/data/heathrow_flights/flight_paths.json`;
const HEATHROW_PARAMETERS_URL = `${process.env.API_BASE_URL}/backend_assets/deckgl/line_layer/data/heathrow_flights/parameters.json`;
const HEATHROW_VIEW_STATE_URL = `${process.env.API_BASE_URL}/backend_assets/deckgl/line_layer/data/heathrow_flights/view_state.json`;
const HEATHROW_CONFIG_URL = `${process.env.API_BASE_URL}/backend_assets/deckgl/line_layer/data/heathrow_flights/config.json`;

// Mirrors styleGuideLoader in StyleGuide.jsx — its comments cover why a
// failed fetch throws a plain Error here.
export async function fullPageMapLoader() {
  const [parametersRes, viewStateRes, configRes] = await Promise.all([
    fetch(HEATHROW_PARAMETERS_URL),
    fetch(HEATHROW_VIEW_STATE_URL),
    fetch(HEATHROW_CONFIG_URL),
  ]);

  for (const res of [parametersRes, viewStateRes, configRes]) {
    if (!res.ok) {
      throw new Error(`Failed to load Heathrow flight data (${res.status})`);
    }
  }

  const [renderParameters, initialViewState, config] = await Promise.all([
    parametersRes.json(),
    viewStateRes.json(),
    configRes.json(),
  ]);

  return { renderParameters, initialViewState, config };
}

export default function FullPageMap() {
  const heathrowData = useLoaderData();
  const renderParameters = heathrowData?.renderParameters ?? {};
  const initialViewState = heathrowData?.initialViewState ?? null;
  const config = heathrowData?.config ?? {};

  // DeckLineLayerMap.jsx asserts on undefined longitude/latitude/zoom, and
  // that's every render before the loader's fetch lands. Same reasoning as
  // the matching gate in StyleGuide.jsx.
  const hasValidViewState =
    Number.isFinite(initialViewState?.longitude) &&
    Number.isFinite(initialViewState?.latitude) &&
    Number.isFinite(initialViewState?.zoom);

  return (
    <B1Layout fullBleed>
      {hasValidViewState ? (
        <DeckLineLayerMap
          flightPathsUrl={HEATHROW_FLIGHT_PATHS_URL}
          initialViewState={initialViewState}
          renderParameters={renderParameters}
          config={config}
          heightClassName="h-full"
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
