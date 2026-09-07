import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer, LineLayer } from "@deck.gl/layers";
import { MAJOR_AIRPORTS, SECONDARY_AIRPORTS } from "../data/airportsAus";
import buildAirportLayers from "./buildAirportLayers";
import { flaggedColor, flightColor, hlFlaggedColor, hlNormalColor } from "./colors";
import { BASEMAP } from "./endpoints";

// source-over blend for the Flagged layer only, overriding the additive
// deck-level blend renderParameters sets for everything else. flightColor's
// alpha is low and additive suits it fine, but Flagged sits at a flat
// 220/255 alpha, so summing overlaps clips red at 255 while green/blue keep
// climbing — red turns to pink then white without this override
const FLAGGED_PARAMETERS = {
  blendColorOperation: "add",
  blendColorSrcFactor: "src-alpha",
  blendColorDstFactor: "one-minus-src-alpha",
  blendAlphaOperation: "add",
  blendAlphaSrcFactor: "one",
  blendAlphaDstFactor: "one-minus-src-alpha",
};

// full deck.gl layer stack: basemap, the two flight layers, airports on top
export default function buildFlightLayers({ flights, mode, simTime, zoom, maxAltitude }) {
  const majorLayers = buildAirportLayers("major-airport", MAJOR_AIRPORTS, {
    pinColor: [255, 200, 0],
    zoom,
  });
  const secondaryLayers = buildAirportLayers("secondary-airport", SECONDARY_AIRPORTS, {
    pinColor: [120, 180, 255],
    zoom,
  });
  // Color/opacity still branch on historic vs. non-historic — Historic keeps
  // its flat altitude-gradient look even though its data now comes from the
  // same pipeline as HL (a deliberate choice: unifying the data path doesn't
  // have to unify the visual style too).
  const isPlaybackMode = mode !== "historic";

  return [
    new TileLayer({
      id: "basemap",
      data: BASEMAP.url,
      minZoom: 0,
      maxZoom: BASEMAP.maxZoom,
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
    new LineLayer({
      id: "flight-segment-hit-normal",
      data: flights.normal,
      opacity: isPlaybackMode ? 1.0 : 0.8,
      getSourcePosition: (d) => d.start,
      getTargetPosition: (d) => d.end,
      getColor: isPlaybackMode ? (d) => hlNormalColor(d, simTime, maxAltitude) : (d) => flightColor(d, maxAltitude),
      getWidth: 2,
      pickable: true,
      updateTriggers: {
        getColor: [flights.normal, maxAltitude, mode, simTime],
      },
    }),
    new LineLayer({
      id: "flight-segment-hit-flagged",
      data: flights.flagged,
      opacity: isPlaybackMode ? 1.0 : 0.95,
      getSourcePosition: (d) => d.start,
      getTargetPosition: (d) => d.end,
      getColor: isPlaybackMode ? (d) => hlFlaggedColor(d, simTime) : flaggedColor,
      getWidth: 3,
      pickable: true,
      // Applied in every mode, not just Historic: HL runs this layer at
      // opacity 1.0 with alpha up to 220, so its overlaps sum just as hard.
      // Historic simply shows far more geometry at once (cutoffMode "full"
      // against HL's 900-second trailing slice), which is why it whitened
      // first and most visibly.
      parameters: FLAGGED_PARAMETERS,
      updateTriggers: {
        getColor: [flights.flagged, mode, simTime],
      },
    }),
    ...majorLayers,
    ...secondaryLayers,
  ];
}
