import React from 'react';
import { DeckGL } from '@deck.gl/react';
import { LineLayer, ScatterplotLayer, BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';

///////////////////////
// Basemap tile sources — switch ACTIVE_BASEMAP to change which one the map uses.
//
// 'natural_earth': offline, self-rendered from public-domain Natural Earth data
//   (see scripts/prepare_offline_tiles_for_deckgl.py and public/tiles/LICENSE.txt). No internet required,
//   safe for commercial use. Capped at zoom 10 to match the bundled tiles.
//
// 'carto_dark_online': live tiles fetched from CARTO's free basemap service.
//   Requires internet. Per CARTO's ToS this free/keyless tier is NOT licensed for
//   commercial use — demo/non-commercial use only.
//
// Set via ACTIVE_BASEMAP in .env (see .env.example) — webpack.config.js bakes
// it into the bundle at build time, so a change requires a rebuild/restart,
// not just a browser refresh.
///////////////////////
const ACTIVE_BASEMAP = process.env.ACTIVE_BASEMAP;

const BASEMAP_SOURCES = {
  natural_earth: { url: '/tiles/{z}/{x}/{y}.png', maxZoom: 10 },
  carto_dark_online: { url: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', maxZoom: 19 },
};

const basemap = BASEMAP_SOURCES[ACTIVE_BASEMAP];

// Sample data — not hosted by this project, pulled straight from deck.gl's own examples repo
const DATA_URL = {
  AIRPORTS: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/line/airports.json',
  FLIGHT_PATHS: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/line/heathrow-flights.json',
};

// Centered on Heathrow (LHR) since that's what the flight-paths dataset covers.
// maxZoom follows whichever basemap is active, not a fixed number, so it never
// asks a basemap source to serve tiles past what it actually has.
const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: -0.4543,
  zoom: 8,
  maxZoom: basemap.maxZoom,
  pitch: 50,
  bearing: 0,
};

// Hover tooltip for airport dots — falls back from country to abbrev, and
// blanks out placeholder names that come through as raw hex ids (e.g. "0x1a2b")
function getTooltip({ object }) {
  return (
    object &&
    `\
  ${object.country || object.abbrev || ''}
  ${object.name.indexOf('0x') >= 0 ? '' : object.name}`
  );
}

export default function DeckLineLayerMap() {
  // Three stacked layers: basemap tiles on the bottom, airport dots, then flight-path lines on top
  const layers = [
    new TileLayer({
      id: 'basemap',
      data: basemap.url,
      minZoom: 0,
      maxZoom: basemap.maxZoom,
      tileSize: 256,
      // Each tile arrives as an image; wrap it in a BitmapLayer positioned at
      // the tile's own geo bounds so deck.gl can place it on the map
      renderSubLayers: (props) => {
        const { west, south, east, north } = props.tile.bbox;
        return new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north],
        });
      },
    }),
    new ScatterplotLayer({
      id: 'airports',
      data: DATA_URL.AIRPORTS,
      radiusScale: 20,
      getPosition: (d) => d.coordinates,
      getFillColor: [255, 140, 0],
      // Major airports get the biggest dot, small ones the smallest, everything else in between
      getRadius: (d) => {
        if (d.type.search('major') >= 0) {
          return 100;
        }
        if (d.type.search('small') >= 0) {
          return 30;
        }
        return 60;
      },
      pickable: true,
    }),
    new LineLayer({
      id: 'flight-paths',
      data: DATA_URL.FLIGHT_PATHS,
      opacity: 0.8,
      getSourcePosition: (d) => d.start,
      getTargetPosition: (d) => d.end,
      // z is the departure altitude in meters; r drives a red (low) to blue
      // (high) gradient and fades the line out as altitude increases
      getColor: (d) => {
        const z = d.start[2];
        const r = z / 10000;
        return [255 * (1 - r * 2), 128 * r, 255 * r, 255 * (1 - r)];
      },
      getWidth: 3,
      pickable: true,
    }),
  ];

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden border border-pptx-blue/30 shadow-[0_0_30px_rgba(0,80,140,0.15)]">
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        pickingRadius={5}
        // Additive blending — overlapping flight paths glow brighter where they
        // cross instead of just stacking as flat opaque lines
        parameters={{
          blendColorOperation: 'add',
          blendColorSrcFactor: 'src-alpha',
          blendColorDstFactor: 'one',
          blendAlphaOperation: 'add',
          blendAlphaSrcFactor: 'one-minus-dst-alpha',
          blendAlphaDstFactor: 'one',
        }}
        getTooltip={getTooltip}
      />
    </div>
  );
}
