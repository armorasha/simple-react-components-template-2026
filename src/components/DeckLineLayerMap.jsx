import React from 'react';
import { DeckGL } from '@deck.gl/react';
import { LineLayer, ScatterplotLayer, BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';

const DATA_URL = {
  AIRPORTS: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/line/airports.json',
  FLIGHT_PATHS: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/line/heathrow-flights.json',
  BASEMAP_TILES: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
};

const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: -0.4543,
  zoom: 8,
  maxZoom: 16,
  pitch: 50,
  bearing: 0,
};

function getTooltip({ object }) {
  return (
    object &&
    `\
  ${object.country || object.abbrev || ''}
  ${object.name.indexOf('0x') >= 0 ? '' : object.name}`
  );
}

export default function DeckLineLayerMap() {
  const layers = [
    new TileLayer({
      id: 'basemap',
      data: DATA_URL.BASEMAP_TILES,
      minZoom: 0,
      maxZoom: 19,
      tileSize: 256,
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
