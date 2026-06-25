"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HideIpButton({ ip }: { ip: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  if (!ip) return null;

  async function toggle() {
    setLoading(true);
    const label = prompt(
      `Cacher l'IP ${ip} ? Toutes ses visites seront retirées des statistiques.\n\nLabel optionnel (ex: "Mon iPhone", "Bureau") :`,
      "",
    );
    if (label === null) {
      setLoading(false);
      return;
    }
    await fetch("/api/admin/hide-ip", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ip, action: "hide", label }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
      title="Cacher cette IP des statistiques"
    >
      Cacher
    </button>
  );
}

/** Saisie libre pour masquer une IP exacte OU un préfixe (ex. "162.158",
 *  "162.158.*") sans avoir à attendre qu'une visite de cette plage apparaisse
 *  dans la liste. */
export function AddHiddenIpForm() {
  const router = useRouter();
  const [ip, setIp] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = ip.trim();
    if (!value) return;
    setLoading(true);
    await fetch("/api/admin/hide-ip", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ip: value, action: "hide", label: label.trim() || undefined }),
    });
    setIp("");
    setLabel("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mb-4 flex flex-wrap items-end gap-2">
      <label className="min-w-[160px] flex-1">
        <span className="mb-1 block text-[11px] font-medium text-slate-600">
          IP ou préfixe
        </span>
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="162.158 ou 162.158.*"
          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-800 outline-none focus:border-slate-500"
        />
      </label>
      <label className="min-w-[140px] flex-1">
        <span className="mb-1 block text-[11px] font-medium text-slate-600">
          Label (optionnel)
        </span>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Cloudflare, bots…"
          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-slate-500"
        />
      </label>
      <button
        type="submit"
        disabled={loading || !ip.trim()}
        className="rounded-lg border border-slate-300 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {loading ? "…" : "Masquer"}
      </button>
    </form>
  );
}

export function UnhideIpButton({ ip }: { ip: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch("/api/admin/hide-ip", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ip, action: "unhide" }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-brand-600 disabled:opacity-50"
    >
      Réafficher
    </button>
  );
}
