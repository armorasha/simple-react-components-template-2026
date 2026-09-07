// small centered overlay, used for loading/error/status text over the map
export default function CentreMessage({ children }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <div className="bg-black/60 rounded-xl px-6 py-4 text-white/80 text-sm flex items-center gap-3">{children}</div>
    </div>
  );
}
