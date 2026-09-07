import Select from "../../Select";
import StatusLight from "../../StatusLight";
import { formatWindowRange } from "./formatWindowTime";
import { MAX_WINDOW_SEGMENTS } from "./usePrefetch";

export default function Legend({
  variants,
  variant,
  onVariantChange,
  dates,
  date,
  onDateChange,
  flightCounts,
  budgetReached,
  windowIndex,
  windowRange,
  canPrevWindow,
  canNextWindow,
  onPrevWindow,
  onNextWindow,
  wsStatus,
  loading,
  dataError,
}) {
  // loading is data-level (an in-flight or still-paging chunk fetch),
  // separate from wsStatus's socket-level state — an open socket can still
  // be mid-fetch. Only overrides "open": "connecting" and "closed" already
  // say more than "loading" would.
  const wsIndicator =
    wsStatus === "open" && loading
      ? { status: "warning", label: "WS: loading" }
      : ({
          connecting: { status: "warning", label: "WS: connecting" },
          open: { status: "success", label: "WS: open" },
          closed: { status: "critical", label: "WS: closed" },
        }[wsStatus] ?? { status: "neutral", label: `WS: ${wsStatus}` });

  // Legend is never told the mode; it just checks whether it was actually
  // handed something to act on. When the caller omits the change handlers,
  // there's nothing here to wire up, so the whole file-picker block is
  // skipped.
  const showFileSelectors = !!onVariantChange;

  // Same convention: only Historic hands over window handlers, so their
  // presence is what decides whether the nav row exists at all. It then
  // renders unconditionally within Historic — disabled on a date that fits
  // in one window rather than hidden, so the panel keeps its height as the
  // date changes.
  const showWindowNav = !!onNextWindow;

  return (
    <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur rounded-xl p-4 w-64 text-white space-y-3 pointer-events-auto">
      <StatusLight status={wsIndicator.status}>{wsIndicator.label}</StatusLight>
      {showFileSelectors && (
        <>
          <Select
            label="Variant"
            value={variant ?? ""}
            onChange={(e) => onVariantChange(e.target.value)}
            options={variants.map((v) => ({ value: v, label: v }))}
          />
          <Select
            label="Date"
            value={date ?? ""}
            onChange={(e) => onDateChange(e.target.value)}
            options={dates.map((d) => ({ value: d, label: d }))}
          />
        </>
      )}
      {showWindowNav && (
        <div className="space-y-1">
          {/* Window count is deliberately absent: windows are discovered as
              paging trips the budget, so the total isn't known until the last
              one has been walked to. Showing "2 of ?" would be worse than
              showing the position alone. */}
          <div className="flex items-center justify-between text-xs">
            <button type="button" className="page-nav-btn" onClick={onPrevWindow} disabled={!canPrevWindow}>
              &lsaquo;
            </button>
            <span className="text-white/70">Window {windowIndex + 1}</span>
            <button type="button" className="page-nav-btn" onClick={onNextWindow} disabled={!canNextWindow}>
              &rsaquo;
            </button>
          </div>
          {/* The requested start (windowStarts) is known the instant a window
              opens, but its end isn't decided until paging settles — so this
              reads windowRange, the buffer's actual loaded extent, and simply
              shows nothing until that lands rather than guess or show a
              misleading end. Shown in UTC, matching the `t` values on the
              wire. */}
          {windowRange && <div className="text-center text-white/50">{formatWindowRange(windowRange)}</div>}
          {/* Only surfaced while a further window exists — on the last one the
              disabled ">" is the whole message. Deliberately no loaded/total
              figures: the buffered count is inflated by duplicate rows the
              paging overlap re-sends, so it reads higher than the window's
              true total and the pair made no sense together. */}
          {budgetReached && (
            <div className="text-xs text-amber-400">{MAX_WINDOW_SEGMENTS.toLocaleString()} display budget reached</div>
          )}
        </div>
      )}
      <div className="border-t border-white/10 pt-2 space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "rgb(80,140,255)" }} />
          Normal ({flightCounts.normal})
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "rgb(255,40,40)" }} />
          Flagged ({flightCounts.flagged})
        </div>
      </div>
      {dataError && <div className="text-xs text-red-400">{dataError}</div>}
    </div>
  );
}
