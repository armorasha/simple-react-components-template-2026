import classNames from "classnames";

// top-right mode switch on DeckLineLayerMapAdv.jsx
export default function ModeToggleAdv({ mode, onModeChange }) {
  const modes = [
    { key: "historic", label: "Historic" },
    { key: "historic-live", label: "Historic Live" },
  ];
  return (
    <div className="flex gap-1 bg-black/40 rounded-lg p-1">
      {modes.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => onModeChange(m.key)}
          className={classNames("px-3 py-1 text-xs rounded-md transition-colors", {
            "bg-pptx-blue text-white": mode === m.key,
            "text-white/60 hover:text-white/90": mode !== m.key,
          })}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
