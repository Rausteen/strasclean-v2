"use client";

import { useState } from "react";

/**
 * Bouton "Rafraîchir le site" — force la régénération du HTML statique
 * des home pages côté Next.js. À utiliser après avoir taggé des avis
 * dans le bloc "Avis Google" pour qu'ils apparaissent immédiatement sur
 * le site public (au lieu d'attendre la revalidate ISR de 1h).
 */
export default function RefreshButton() {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function go() {
    setState("loading");
    try {
      const res = await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      setState(res.ok ? "ok" : "err");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("err");
      setTimeout(() => setState("idle"), 2500);
    }
  }

  return (
    <button
      type="button"
      onClick={go}
      disabled={state === "loading"}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-900 disabled:opacity-50"
    >
      {state === "loading" && "⏳ Régénération…"}
      {state === "ok" && "✅ Rafraîchi"}
      {state === "err" && "❌ Erreur"}
      {state === "idle" && "↻ Rafraîchir le site"}
    </button>
  );
}
