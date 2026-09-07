const FADE_S = 900;

// binary-search insertion point (first index whose key(arr[i]) >= val) —
// used by computeVisible() to slice a time-sorted array in O(log n) instead
// of filtering it fresh on every playback tick
export function bisectLeft(arr, val, key) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (key(arr[mid]) < val) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

// altitude -> color gradient for a flight segment, used in Historic mode.
// cyan at ground fading to pure blue at cruise altitude — R stays 0 so red
// is reserved entirely for flagged segments. alpha peaks at 51/255 (~20%)
// and fades to 0 at max altitude, which combined with the layer's own
// opacity: 0.8 (see LineLayer below) keeps a dense Historic snapshot from
// turning into a bright unreadable wash. Historic-Live uses hlNormalColor
// instead (below), fading by playback age rather than altitude alone
export function flightColor(d, maxAltitude = 10000) {
  const z = d.start[2] || 0;
  const r = Math.min(z / maxAltitude, 1);
  return [0, Math.round(220 * (1 - r)), 255, Math.round(51 * (1 - r))];
}

export function flaggedColor() {
  // Fixed red, distinct from the normal altitude gradient — no per-segment
  // score/reason data is used here, so there's nothing to vary the color by.
  // The alpha is high enough that this layer cannot be blended additively
  // like the Normal one; it carries its own source-over override
  // (FLAGGED_PARAMETERS in DeckLineLayerMapAdv.jsx) to stop dense overlaps
  // summing red → pink → white.
  return [255, 40, 40, 220];
}

// Historic-Live trail fade: unlike flightColor's flat altitude-based alpha
// above, this fades each segment individually by its age relative to the
// current playback time, so the oldest segments in computeVisible's
// trailing FADE_S-second window visibly fade out as hlSimTime advances,
// instead of the whole trail just sitting at one flat opacity.
//
// hlFlaggedColor below fades a fixed red the same way. It doesn't vary color
// along the trail (e.g. snapping blue→red at a sequence end), because the
// chunk payload carries no per-segment sequence detail to key that off.
export function hlNormalColor(d, hlSimTime, maxAltitude = 10000) {
  const age = Math.max(0, Math.min(1, (hlSimTime - d.t) / FADE_S));
  const alpha = Math.round(180 * (1 - age * 0.85));
  const r = Math.min(1, Math.max(0, (d.start[2] || 0) / maxAltitude));
  return [0, Math.round(220 * (1 - r)), 255, alpha];
}

export function hlFlaggedColor(d, hlSimTime) {
  const age = Math.max(0, Math.min(1, (hlSimTime - d.t) / FADE_S));
  const alpha = Math.round(220 * (1 - age * 0.8));
  return [255, 40, 40, alpha];
}
