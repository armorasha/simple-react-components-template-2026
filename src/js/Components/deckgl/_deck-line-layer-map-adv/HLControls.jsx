import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

function fmtSpeed(speed) {
  return `${speed}x`;
}

export default function HLControls({
  isPlaying,
  onTogglePlay,
  simTime,
  windowStart,
  windowEnd,
  onSeek,
  speed,
  onSpeed,
}) {
  const pct =
    windowEnd > windowStart
      ? Math.min(100, Math.max(0, ((simTime - windowStart) / (windowEnd - windowStart)) * 100))
      : 0;
  return (
    <div className="flex items-center gap-3 bg-black/40 rounded-lg px-3 py-2">
      <button
        type="button"
        onClick={onTogglePlay}
        title={isPlaying ? "Pause" : "Play"}
        className="text-white/90 hover:text-white text-sm w-8 h-8 flex items-center justify-center rounded bg-white/10"
      >
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
      </button>
      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => {
          const frac = Number(e.target.value) / 100;
          onSeek(windowStart + frac * (windowEnd - windowStart));
        }}
        className="w-40 accent-pptx-blue"
      />
      <div className="flex gap-1">
        {[1, 10, 60, 120, 300, 600].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSpeed(s)}
            className={`text-xs px-2 py-0.5 rounded ${
              speed === s ? "bg-pptx-blue text-white" : "text-white/60 hover:text-white/90 bg-white/5"
            }`}
          >
            {fmtSpeed(s)}
          </button>
        ))}
      </div>
    </div>
  );
}
