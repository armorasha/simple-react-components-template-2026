// `t` everywhere in this feature is epoch seconds in UTC — shown here as
// plain 24-hour UTC, not converted to local time
const SECONDS_PER_DAY = 86_400;

// epoch seconds -> "00:00"..."23:59" UTC, "24:00" for exact midnight rollover
export function formatUtcTime(epochSeconds) {
  const secondsOfDay = ((epochSeconds % SECONDS_PER_DAY) + SECONDS_PER_DAY) % SECONDS_PER_DAY;
  if (secondsOfDay === 0 && epochSeconds !== 0) {
    return "24:00";
  }
  const hours = Math.floor(secondsOfDay / 3600);
  const minutes = Math.floor((secondsOfDay % 3600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// a loaded window's [from, to] -> "00:00 – 07:47 UTC", null while still loading
export function formatWindowRange(range) {
  if (!range) {
    return null;
  }
  return `${formatUtcTime(range.from)} – ${formatUtcTime(range.to)} UTC`;
}
