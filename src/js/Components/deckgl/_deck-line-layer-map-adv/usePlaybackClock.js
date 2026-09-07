import { useCallback, useEffect, useRef, useState } from "react";

const TICK_MS = 150;

// the single simulated clock, and the only one in the system. knows nothing
// about segments, WebSockets or modes beyond whether it should be ticking —
// Historic passes ticking: false and never advances, Historic-Live ticks.
//
// values are mirrored into refs because the interval callback is long-lived
// and would otherwise close over stale state from whichever render created it
//
// atEnd: "clamp" is unused right now — it's for an open-ended stream whose
// window keeps growing with nothing to loop back to
export default function usePlaybackClock({ ticking, atEnd = "loop" }) {
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [bounds, setBounds] = useState({ start: 0, end: 0 });

  const simTimeRef = useRef(0);
  const isPlayingRef = useRef(false);
  const speedRef = useRef(300);
  const boundsRef = useRef({ start: 0, end: 0 });
  const lastTickRef = useRef(0);

  useEffect(() => {
    if (!ticking) {
      return undefined;
    }
    lastTickRef.current = performance.now();
    const id = setInterval(() => {
      if (!isPlayingRef.current) {
        // Keep the timestamp current while paused, so resuming doesn't
        // advance by however long the pause lasted.
        lastTickRef.current = performance.now();
        return;
      }
      const now = performance.now();
      const elapsed = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      let next = simTimeRef.current + elapsed * speedRef.current;
      const { start, end } = boundsRef.current;
      if (end > start && next > end) {
        next = atEnd === "clamp" ? end : start;
      }
      simTimeRef.current = next;
      setSimTime(next);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [ticking, atEnd]);

  const togglePlay = useCallback(() => {
    isPlayingRef.current = !isPlayingRef.current;
    setIsPlaying(isPlayingRef.current);
    lastTickRef.current = performance.now();
  }, []);

  const setPlaying = useCallback((playing) => {
    isPlayingRef.current = playing;
    setIsPlaying(playing);
    lastTickRef.current = performance.now();
  }, []);

  // a seek is just this assignment, nothing else — no server round-trip
  const seek = useCallback((t) => {
    simTimeRef.current = t;
    setSimTime(t);
    lastTickRef.current = performance.now();
  }, []);

  // Likewise a speed change: local, and never sent anywhere. It only affects
  // how far ahead usePrefetch decides to ask.
  const setSpeedValue = useCallback((s) => {
    speedRef.current = s;
    setSpeed(s);
  }, []);

  const setBoundsValue = useCallback((next) => {
    boundsRef.current = next;
    setBounds(next);
  }, []);

  return {
    simTime,
    simTimeRef,
    isPlaying,
    speed,
    speedRef,
    bounds,
    boundsRef,
    togglePlay,
    setPlaying,
    seek,
    setSpeed: setSpeedValue,
    setBounds: setBoundsValue,
  };
}
