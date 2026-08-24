import { useEffect, useState } from "react";
import StatusLight from "./StatusLight";
import { Muted } from "./Typography";

// Baked in at build time by webpack.renderer.config.js — Ref .env.example.
const API_BASE_URL = process.env.API_BASE_URL;
const HEALTH_URL = `${API_BASE_URL}/api/health/`;

export default function BackendStatus() {
  const [state, setState] = useState({
    status: "neutral",
    label: "Checking…",
    detail: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(HEALTH_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        if (cancelled) return;
        setState({
          status: payload.database === "ok" ? "success" : "warning",
          label:
            payload.database === "ok"
              ? "Django + Postgres reachable"
              : "Django up, database unreachable",
          detail: `django ${payload.django_version} · db ${payload.database}`,
        });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({
          status: "critical",
          label: "Backend unreachable",
          detail: `${error.message} — is \`docker compose up\` running?`,
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <StatusLight status={state.status}>{state.label}</StatusLight>
      <Muted>
        <span className="text-xs">
          {state.detail ? `${HEALTH_URL} — ${state.detail}` : HEALTH_URL}
        </span>
      </Muted>
    </div>
  );
}
