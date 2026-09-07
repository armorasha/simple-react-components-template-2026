function airportTooltipText(d) {
  if (!d) {
    return null;
  }
  return [d.name, d.icao].filter(Boolean).join(" — ");
}

// plain string content for CursorTooltip, not deck.gl's own {text}/{html}
// tooltip — we route this through onHover + CursorTooltip instead
export function getTooltip({ object, layer }) {
  if (!object) {
    return null;
  }
  if (layer?.id?.startsWith("flight-segment-hit")) {
    const alt = Math.round(object.start?.[2] ?? 0);
    return `Altitude: ${alt} m`;
  }
  return airportTooltipText(object);
}
