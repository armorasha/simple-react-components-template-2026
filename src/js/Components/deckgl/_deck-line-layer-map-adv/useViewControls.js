import { useCallback, useMemo, useState } from "react";

// Floating-point slack for "is the view back at this axis's default". Small
// enough that any deliberate pan/zoom/rotate reads as a change, loose enough
// that a transition landing on its target doesn't miss by a rounding error.
const VIEW_MATCH_EPSILON = 1e-6;

const HOME_TRANSITION_MS = 600;
const AXIS_TRANSITION_MS = 350;

// Pitch the 2D toggle tilts *to*; toggling back always goes to a flat 0.
const TILTED_PITCH = 50;

// owns the deck.gl viewState plus the three view-control buttons that reset
// parts of it. each button's active state is judged on its own axis, not on
// "are we exactly back at the initial view" — North lights up whenever
// bearing is back to 0 even if pan/zoom/pitch drifted since
export default function useViewControls(initialViewState) {
  const [viewState, setViewState] = useState(initialViewState);

  const isHome = useMemo(
    () =>
      !!viewState &&
      !!initialViewState &&
      Math.abs((viewState.longitude ?? 0) - (initialViewState.longitude ?? 0)) < VIEW_MATCH_EPSILON &&
      Math.abs((viewState.latitude ?? 0) - (initialViewState.latitude ?? 0)) < VIEW_MATCH_EPSILON &&
      Math.abs((viewState.zoom ?? 0) - (initialViewState.zoom ?? 0)) < VIEW_MATCH_EPSILON &&
      Math.abs((viewState.pitch ?? 0) - (initialViewState.pitch ?? 0)) < VIEW_MATCH_EPSILON &&
      Math.abs((viewState.bearing ?? 0) - (initialViewState.bearing ?? 0)) < VIEW_MATCH_EPSILON,
    [viewState, initialViewState],
  );

  const is2D = Math.abs(viewState?.pitch ?? 0) < VIEW_MATCH_EPSILON;
  const isNorth = Math.abs(viewState?.bearing ?? 0) % 360 < VIEW_MATCH_EPSILON;

  const goHome = useCallback(
    () => setViewState({ ...initialViewState, transitionDuration: HOME_TRANSITION_MS }),
    [initialViewState],
  );

  const toggle2D = useCallback(
    () =>
      setViewState((vs) => ({
        ...vs,
        pitch: vs?.pitch ? 0 : TILTED_PITCH,
        transitionDuration: AXIS_TRANSITION_MS,
      })),
    [],
  );

  const faceNorth = useCallback(
    () =>
      setViewState((vs) => ({
        ...vs,
        bearing: 0,
        transitionDuration: AXIS_TRANSITION_MS,
      })),
    [],
  );

  return { viewState, setViewState, isHome, is2D, isNorth, goHome, toggle2D, faceNorth };
}
