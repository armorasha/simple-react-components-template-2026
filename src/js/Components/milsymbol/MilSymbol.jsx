import ms from "milsymbol";
import { useMemo } from "react";

// knots per one symbol size of visible speed leader — and how far the leader runs inside the frame before it shows
const KNOTS_PER_SYMBOL_SIZE = 300;
const FRAME_RADIUS_IN_SIZES = 0.75;

/**
 * Method to work out the speed leader length in px, smoothly proportional to speed. MIL-STD-2525D only says length is
 * based on speed and object type (PDF p.46) — its 1/4, 1/2, 3/4 inch steps are just an example. The leader starts at
 * the frame center, so frame radius goes in first, otherwise slow tracks would be hidden inside the frame. 300 kt shows
 * one symbol size outside it.
 */
function speedLeaderLength(speedKnots, size) {
  return size * (FRAME_RADIUS_IN_SIZES + speedKnots / KNOTS_PER_SYMBOL_SIZE);
}

// label gap + rough Arial char width (em) — same numbers milsymbol uses for its own text fields, so ours line up
const LABEL_GAP = 20;
const CHAR_WIDTH_EM = 0.7;

// our own left-side labels, not part of MIL-STD-2525D. row = baseline offset in font sizes from frame center, mirrored
// off milsymbol's right-side rows: top-left sits level with top-right, bottom-left level with the speed label

const LEFT_LABEL_ROWS = [
  { option: "behaviourLabel", row: -1.5 },
  { option: "engineTypeLabel", row: 1.5 },
];

/**
 * Method to draw the LEFT_LABEL_ROWS labels as a custom milsymbol symbol part, in the same font, size and color as
 * milsymbol's own text so they don't look bolted on. Draws nothing unless one of those options is set, so registring
 * it for every symbol is harmless. Not an arrow function on purpose — milsymbol passes the symbol in as `this`.
 */
function leftLabelsPart(milsymbol) {
  const bbox = new milsymbol.BBox();
  const post = [];
  if (!this.style.infoFields) return { pre: [], post, bbox };

  const frame = this.metadata.baseGeometry.bbox;
  const fontSize = this.style.infoSize;
  const x = frame.x1 - LABEL_GAP;
  const color =
    this.colors.iconColor[this.metadata.affiliation] ||
    this.colors.iconColor.Friend;

  for (const { option, row } of LEFT_LABEL_ROWS) {
    const label = this.options[option];
    if (!label) continue;
    const y = 100 + row * fontSize;
    post.push({
      type: "text",
      text: label,
      x,
      y,
      textanchor: "end",
      fontsize: fontSize,
      fontfamily: this.style.fontfamily,
      fill: color,
      stroke: false,
    });
    bbox.merge(
      new milsymbol.BBox({
        x1: x - label.length * fontSize * CHAR_WIDTH_EM,
        x2: frame.x1,
        y1: y - fontSize,
        y2: y,
      }),
    );
  }
  return { pre: [], post, bbox };
}

ms.addSymbolPart(leftLabelsPart);

/**
 * MilSymbol.jsx — renders one named MIL-STD-2525D symbol from milSymbols.js, e.g. <MilSymbol symbol={airFriend} />.
 * innerHTML is safe here, the markup only ever comes from our own symbol constants, never user input.
 * Outline-only — monoColor paints frame, icon, speed leader and labels alike.
 *
 * `course` is direction of movement (track over ground, degrees clockwise from north), not heading — that's what the
 * standard asks for. Speed above 0 draws a speed leader (field AJ, PDF pp.46-47); no speed draws the fixed-length
 * direction of movement arrow instead (field Q, PDF p.42). The frame itself never rotates.
 *
 * Labels: `showSpeedLabel` puts speed bottom-right (field Z, PDF p.37). `showEngineTypeLabel` puts `engineType`
 * bottom-left and `showBehaviourLabel` puts `behaviour` top-left — those two are our own additions, not in the
 * standard. Keep them to 3-5 char codes (e.g. SEP, HOLD) or they get unreadable on the map. All get upper-cased,
 * the standard requires that for symbol text (PDF p.35).
 * @param {{
 *   symbol: { sidc: string, monoColor: string },
 *   size?: number,
 *   course?: number,
 *   speedKnots?: number,
 *   showSpeedLabel?: boolean,
 *   engineType?: string,
 *   showEngineTypeLabel?: boolean,
 *   behaviour?: string,
 *   showBehaviourLabel?: boolean,
 *   className?: string,
 * }} props
 */
export default function MilSymbol({
  symbol,
  size = 48,
  course,
  speedKnots,
  showSpeedLabel = false,
  engineType,
  showEngineTypeLabel = false,
  behaviour,
  showBehaviourLabel = false,
  className = "",
}) {
  const { sidc, monoColor } = symbol;

  const svg = useMemo(() => {
    const options = { size, monoColor, fill: false };
    const moving = speedKnots === undefined || speedKnots > 0;
    if (course !== undefined && moving) {
      options.direction = course;
      if (speedKnots !== undefined)
        options.speedLeader = speedLeaderLength(speedKnots, size);
    }
    if (showSpeedLabel && speedKnots !== undefined)
      options.speed = `${Math.round(speedKnots)} KT`;
    if (showEngineTypeLabel && engineType)
      options.engineTypeLabel = engineType.toUpperCase();
    if (showBehaviourLabel && behaviour)
      options.behaviourLabel = behaviour.toUpperCase();
    return new ms.Symbol(sidc, options).asSVG();
  }, [
    sidc,
    size,
    monoColor,
    course,
    speedKnots,
    showSpeedLabel,
    engineType,
    showEngineTypeLabel,
    behaviour,
    showBehaviourLabel,
  ]);

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
