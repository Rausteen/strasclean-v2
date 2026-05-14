"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErr(data.error || "Erreur");
        setLoading(false);
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setErr("Erreur réseau");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-white/55">
          Mot de passe
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
          className="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none focus:border-brand-400/60 focus:bg-white/[0.07]"
        />
      </div>
      {err && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200">
          {err}
        </div>
      )}
      <button
        type="submit"
        disabled={loading || !password}
        className="btn-primary h-12 w-full"
      >
        {loading ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
