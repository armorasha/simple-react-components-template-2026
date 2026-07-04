import React from 'react';
import { DeckGL } from '@deck.gl/react';
import { LineLayer, ScatterplotLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const DATA_URL = {
  AIRPORTS: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/line/airports.json',
  FLIGHT_PATHS: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/line/heathrow-flights.json',
};

const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: -0.4543,
  zoom: 8,
  maxZoom: 16,
  pitch: 50,
  bearing: 0,
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

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
      >
        <Map reuseMaps mapStyle={MAP_STYLE} attributionControl={false} />
      </DeckGL>
    </div>
  );
}
