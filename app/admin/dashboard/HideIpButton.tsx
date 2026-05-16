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
      className="rounded border border-white/15 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/60 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
      title="Cacher cette IP des statistiques"
    >
      Cacher
    </button>
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
      className="rounded border border-white/15 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/60 hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-brand-300 disabled:opacity-50"
    >
      Réafficher
    </button>
  );
}
