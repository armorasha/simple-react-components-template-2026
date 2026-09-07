// every URL the Adv map talks to. WS is derived off one API_BASE_URL so a
// deployment only has to set that; basemap comes from our own ACTIVE_BASEMAP
// switch instead since tiles are served off public/tiles/, not the backend
const API_BASE_URL = process.env.API_BASE_URL;

// mirrors DeckLineLayerMap.jsx's own BASEMAP_SOURCES — duplicated not shared
// so each component owns its basemap config independently
// 'natural_earth' is self-hosted, served straight from public/tiles/
const BASEMAP_SOURCES = {
  natural_earth: { url: "/tiles/{z}/{x}/{y}.png", maxZoom: 10 },
  carto_dark_online: {
    url: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    maxZoom: 19,
  },
};

export const BASEMAP = BASEMAP_SOURCES[process.env.ACTIVE_BASEMAP];

export const DEFAULT_WS_URL = `${API_BASE_URL?.replace(/^http/, "ws")}/ws/deckgl/flightmap-adv/`;

// dataset-specific view state / render tuning, served as static JSON by
// whatever backend app owns the full_stride1 dataset — same three files
// DeckLineLayerMap.jsx's own backend counterpart already serves this shape
// under, just for the Adv map's own dataset folder
const FULL_STRIDE1_BASE = `${API_BASE_URL}/backend_assets/deckgl/line-layer-adv/data/full_stride1`;
export const FULL_STRIDE1_VIEW_STATE_URL = `${FULL_STRIDE1_BASE}/view-state.json`;
export const FULL_STRIDE1_PARAMETERS_URL = `${FULL_STRIDE1_BASE}/parameters.json`;
export const FULL_STRIDE1_CONFIG_URL = `${FULL_STRIDE1_BASE}/config.json`;
