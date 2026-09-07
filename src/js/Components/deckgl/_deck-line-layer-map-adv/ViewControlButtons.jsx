import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUpLong } from "@fortawesome/free-solid-svg-icons";

const BASE_BUTTON_CLASS = "w-9 h-9 rounded-lg flex items-center justify-center transition-colors";
const INACTIVE_CLASS = "bg-black/50 text-white/80 hover:text-white";
const ACTIVE_CLASS = "bg-pptx-amber/10 text-pptx-amber-dark";

function buttonClass(active) {
  return `${BASE_BUTTON_CLASS} ${active ? ACTIVE_CLASS : INACTIVE_CLASS}`;
}

export function HomeButton({ onClick, active = false }) {
  return (
    <button type="button" onClick={onClick} title="Reset view" className={buttonClass(active)}>
      <FontAwesomeIcon icon={faHouse} />
    </button>
  );
}

export function TwoDButton({ onClick, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Toggle 2D/3D"
      className={`${buttonClass(active)} text-xs font-semibold`}
    >
      2D
    </button>
  );
}

export function NorthButton({ onClick, active = false }) {
  return (
    <button type="button" onClick={onClick} title="Reset bearing" className={buttonClass(active)}>
      <FontAwesomeIcon icon={faUpLong} />
    </button>
  );
}
