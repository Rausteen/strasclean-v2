"use client";

import { useState } from "react";

export default function LoginForm() {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/equipe/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    if (res.ok) {
      window.location.reload();
      return;
    }
    const d = (await res.json().catch(() => ({}))) as { error?: string };
    setError(d.error ?? "Erreur");
    setLoading(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <p className="h-display text-center text-xl font-bold text-slate-900">
          Stras<span className="text-brand-600">Clean</span>{" "}
          <span className="text-base font-semibold text-slate-400">Équipe</span>
        </p>
        <p className="mt-1 text-center text-sm text-slate-500">
          Accès réservé aux nettoyeurs
        </p>

        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Mot de passe d'équipe"
          autoFocus
          className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/20"
        />

        {error && (
          <p className="mt-2 text-center text-sm text-rose-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !pwd}
          className="mt-4 w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {loading ? "…" : "Entrer"}
        </button>
      </form>
    </main>
  );
}
