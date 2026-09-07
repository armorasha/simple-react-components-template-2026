import { LineLayer, ScatterplotLayer, TextLayer } from "@deck.gl/layers";

// one tier of airports (major/secondary) -> stem/pin/label layer set. pin
// height is zoom-scaled so nearby airports don't overlap at low zoom but
// stay compact once zoomed in
export default function buildAirportLayers(idPrefix, airports, { pinColor, zoom }) {
  const pinHeight = zoom >= 7 ? 2000 : 8000;
  return [
    new LineLayer({
      id: `${idPrefix}-stems`,
      data: airports,
      getSourcePosition: (d) => [d.lon, d.lat, 0],
      getTargetPosition: (d) => [d.lon, d.lat, pinHeight],
      getColor: [...pinColor, 140],
      getWidth: 1,
    }),
    new ScatterplotLayer({
      id: `${idPrefix}-pins`,
      data: airports,
      getPosition: (d) => [d.lon, d.lat, pinHeight],
      getFillColor: pinColor,
      getRadius: 40,
      radiusMinPixels: 3,
      pickable: true,
    }),
    new TextLayer({
      id: `${idPrefix}-labels`,
      data: airports,
      getPosition: (d) => [d.lon, d.lat, pinHeight],
      getText: (d) => d.iata || d.icao,
      getColor: [255, 255, 255, 220],
      getSize: 11,
      getPixelOffset: [0, -14],
    }),
  ];
}
