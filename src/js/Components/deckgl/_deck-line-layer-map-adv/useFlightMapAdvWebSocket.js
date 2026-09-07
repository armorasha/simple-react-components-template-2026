import { useCallback, useEffect, useRef, useState } from "react";

const RECONNECT_MS = 3000;
const MAX_RETRIES = 5;

// owns the WebSocket connection, the variant/date selection, and the
// bounds/chunk wire protocol. no window arithmetic here — bounds come
// straight off the server's "bounds" reply, a fetch range is just
// [t_from, t_to) on the "chunk" request
export default function useFlightMapAdvWebSocket(wsUrl, mode, { onBounds, onChunk }) {
  const [wsStatus, setWsStatus] = useState("connecting");
  const [variants, setVariants] = useState([]);
  const [variant, setVariant] = useState(null);
  const [dates, setDates] = useState([]);
  const [date, setDate] = useState(null);
  const [dataError, setDataError] = useState(null);

  // Retry count is state, not a ref: `gaveUp` is derived from it and has to
  // survive a pending retry. As a ref it only rendered because setWsStatus
  // happened to fire on the same event, so the "server is unreachable"
  // signal vanished the moment connect() set status back to "connecting".
  const [retryCount, setRetryCount] = useState(0);

  const wsRef = useRef(null);
  const variantRef = useRef(variant);
  const dateRef = useRef(date);
  const modeRef = useRef(mode);
  const onBoundsRef = useRef(onBounds);
  const onChunkRef = useRef(onChunk);

  useEffect(() => {
    variantRef.current = variant;
  }, [variant]);
  useEffect(() => {
    dateRef.current = date;
  }, [date]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    onBoundsRef.current = onBounds;
  }, [onBounds]);
  useEffect(() => {
    onChunkRef.current = onChunk;
  }, [onChunk]);

  // WebSocket lifecycle — connect once, reconnect on close.
  useEffect(() => {
    let cancelled = false;
    let reconnectTimer = null;
    function connect() {
      if (cancelled) {
        return;
      }
      setWsStatus("connecting");
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onopen = () => {
        if (cancelled) {
          return;
        }
        setWsStatus("open");
        setRetryCount(0);
        ws.send(JSON.stringify({ type: "variants" }));
      };
      ws.onmessage = (event) => {
        if (cancelled) {
          return;
        }
        let msg;
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }
        if (msg.type === "variants") {
          setVariants(msg.variants || []);
          if (!variantRef.current && msg.variants?.length) {
            setVariant(msg.variants[0]);
          }
        } else if (msg.type === "dates") {
          setDates(msg.dates || []);
          if (msg.dates?.length && msg.variant === variantRef.current) {
            setDate((prev) => prev ?? msg.dates[0]);
          }
        } else if (msg.type === "bounds") {
          setDataError(null);
          onBoundsRef.current?.({ start: msg.start_t, end: msg.end_t, count: msg.count });
        } else if (msg.type === "chunk") {
          setDataError(null);
          onChunkRef.current?.(msg);
        } else if (msg.type === "error") {
          setDataError(msg.message || "Unknown error");
        }
      };
      ws.onclose = () => {
        if (cancelled) {
          return;
        }
        setWsStatus("closed");
        setRetryCount((n) => n + 1);
        reconnectTimer = setTimeout(connect, RECONNECT_MS);
      };
      // onclose always follows onerror, so reconnection is handled there.
      // Logging here keeps a failed handshake from disappearing without a
      // trace.
      ws.onerror = () => {
        console.warn("[flightmap-adv] WebSocket error; reconnect handled by onclose");
      };
    }
    connect();
    return () => {
      cancelled = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      wsRef.current?.close();
    };
  }, [wsUrl]);

  // Drives the historic/HL file picker: a new variant invalidates the
  // current date, so the date list is re-requested before anything is
  // fetched against it.
  useEffect(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN && variant) {
      setDate(null);
      ws.send(JSON.stringify({ type: "dates", variant }));
    }
  }, [variant, mode]);

  // Bounds request, re-sent whenever variant/date/mode settle on a fetchable
  // selection. Historic and Historic-Live both need bounds — Historic to
  // know the dataset's full span, HL to know the scrubber's range.
  useEffect(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }
    if (variant && date) {
      ws.send(JSON.stringify({ type: "bounds", variant, date }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, date, mode, wsStatus]);

  const requestChunk = useCallback((reqId, tFrom, tTo) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || !variantRef.current) {
      return;
    }
    ws.send(
      JSON.stringify({
        type: "chunk",
        req_id: reqId,
        variant: variantRef.current,
        // sent so a range spanning midnight can't pull in the neighbouring
        // day's rows — server filters on both
        date: dateRef.current,
        t_from: tFrom,
        t_to: tTo,
      }),
    );
  }, []);

  const gaveUp = retryCount > MAX_RETRIES;

  return {
    wsStatus,
    variants,
    variant,
    setVariant,
    dates,
    date,
    setDate,
    dataError,
    gaveUp,
    requestChunk,
  };
}
