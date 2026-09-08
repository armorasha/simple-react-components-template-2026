import { useCallback, useEffect, useState } from "react";
import { SENSOR_SIM_START_URL, SENSOR_SIM_STATUS_URL, SENSOR_SIM_STOP_URL } from "./endpoints";

// Live-only control over the backend's test sensor, behind Legend's
// start/stop button. running comes off the status endpoint rather than a flag
// flipped on click, so the button stays right when the sensor exits on its
// own between clicks
export default function useSimControl({ mode, onStop }) {
  const [simRunning, setSimRunning] = useState(false);

  useEffect(() => {
    if (mode !== "live") {
      return;
    }
    fetch(SENSOR_SIM_STATUS_URL)
      .then((res) => res.json())
      .then((body) => setSimRunning(!!body.running))
      .catch(() => {});
  }, [mode]);

  const toggleSim = useCallback(() => {
    const stopping = simRunning;
    const url = stopping ? SENSOR_SIM_STOP_URL : SENSOR_SIM_START_URL;
    // Cleared before the request, not after: nothing else re-renders on a
    // stop, so the last frame would sit there looking live. The backend drops
    // its store too, so the next start doesn't replay this run's backlog.
    if (stopping) {
      onStop();
    }
    fetch(url, { method: "POST" })
      .then((res) => res.json())
      .then((body) => setSimRunning(!!body.running))
      .catch(() => {});
  }, [simRunning, onStop]);

  return { simRunning, toggleSim };
}
