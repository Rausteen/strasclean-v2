"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";

type Day = { value: string; weekday: string; num: string; month: string };
function nextDays(n: number): Day[] {
  const out: Day[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    const d = new Date(base.getTime() + i * 86400000);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    out.push({
      value,
      weekday: d.toLocaleDateString("fr-FR", { weekday: "short" }),
      num: String(d.getDate()),
      month: d.toLocaleDateString("fr-FR", { month: "short" }),
    });
  }
  return out;
}

function prettyWhen(date: string, time: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${dt.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à ${time}`;
}

type Props = {
  id: number;
  token: string;
  formulaId: string;
  service: string;
  when: string;
  price: number;
  address: string | null;
  status: "a_faire" | "annule";
  canModify: boolean;
  cancelHours: number;
};

export default function ReservationManage(p: Props) {
  const [mode, setMode] = useState<"view" | "reschedule">("view");
  const [result, setResult] = useState<null | { kind: "cancelled" } | { kind: "moved"; when: string }>(
    p.status === "annule" ? { kind: "cancelled" } : null,
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const days = useMemo(() => nextDays(30), []);

  const fetchSlots = useCallback(async () => {
    if (!date || !p.formulaId) return;
    setLoadingSlots(true);
    setSlots([]);
    try {
      const res = await fetch(
        `/api/reservation/slots?date=${date}&formula=${p.formulaId}&exclude=${p.id}`,
      );
      const data = (await res.json()) as { slots?: string[] };
      setSlots(data.slots ?? []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [date, p.formulaId, p.id]);

  useEffect(() => {
    if (mode === "reschedule" && date) fetchSlots();
  }, [mode, date, fetchSlots]);

  async function cancel() {
    if (!confirm("Annuler définitivement cette réservation ?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/reservation/cancel", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: p.id, t: p.token }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (data.ok) setResult({ kind: "cancelled" });
      else setError(data.error || "Impossible d'annuler.");
    } catch {
      setError("Réseau indisponible, réessayez.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmMove() {
    if (!date || !time) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/reservation/reschedule", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: p.id, t: p.token, date, time }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (data.ok) setResult({ kind: "moved", when: prettyWhen(date, time) });
      else {
        setError(data.error || "Report impossible.");
        if (res.status === 409) fetchSlots();
      }
    } catch {
      setError("Réseau indisponible, réessayez.");
    } finally {
      setBusy(false);
    }
  }

  // ── Écrans finaux ──
  if (result?.kind === "cancelled") {
    return (
      <Card emoji="🗓️" title="Réservation annulée">
        <p className="text-sm text-slate-500">
          Votre créneau a bien été libéré. À bientôt chez StrasClean !
        </p>
        <HomeLink />
      </Card>
    );
  }
  if (result?.kind === "moved") {
    return (
      <Card emoji="✅" title="Rendez-vous reporté">
        <p className="text-sm text-slate-600">
          Votre nettoyage est maintenant prévu{" "}
          <b className="text-slate-900">{result.when}</b>. Un email de confirmation
          suit.
        </p>
        <HomeLink />
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-1 text-center">
        <p className="text-3xl">🚗</p>
        <h1 className="h-display mt-1 text-2xl font-bold text-slate-900">
          Votre réservation
        </h1>
      </div>

      {/* Récap */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <Row label="Prestation" value={p.service} />
        <Row label="Quand" value={p.when} />
        {p.address && <Row label="Adresse" value={p.address} />}
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="font-semibold text-slate-700">À régler sur place</span>
          <span className="h-display text-2xl font-bold text-slate-900">
            {p.price} €
          </span>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
          {error}
        </p>
      )}

      {mode === "view" && (
        <>
          {p.canModify ? (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setError("");
                  setMode("reschedule");
                }}
                className="rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white"
              >
                Reporter
              </button>
              <button
                disabled={busy}
                onClick={cancel}
                className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-bold text-rose-700 disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Toute modification à moins de {p.cancelHours} h du rendez-vous se fait
              par téléphone.{" "}
              <a href={SITE.phoneHref} className="font-bold underline">
                {SITE.phoneDisplay}
              </a>
            </div>
          )}
          <HomeLink />
        </>
      )}

      {mode === "reschedule" && (
        <div className="mt-6">
          <h2 className="h-display mb-3 text-lg font-bold text-slate-900">
            Choisissez un nouveau créneau
          </h2>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {days.map((d) => (
              <button
                key={d.value}
                onClick={() => {
                  setDate(d.value);
                  setTime("");
                }}
                className={`shrink-0 rounded-2xl border px-3.5 py-2.5 text-center transition ${
                  date === d.value
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <span className="block text-[11px] uppercase opacity-70">
                  {d.weekday}
                </span>
                <span className="block text-lg font-bold leading-none">{d.num}</span>
                <span className="block text-[11px] opacity-70">{d.month}</span>
              </button>
            ))}
          </div>

          <div className="mt-5">
            {!date ? (
              <p className="text-center text-sm text-slate-400">Sélectionnez un jour.</p>
            ) : loadingSlots ? (
              <p className="text-center text-sm text-slate-400">Chargement…</p>
            ) : slots.length === 0 ? (
              <p className="rounded-xl bg-slate-100 px-4 py-6 text-center text-sm text-slate-500">
                Aucun créneau ce jour-là. Choisissez un autre jour 🗓️
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setTime(s)}
                    className={`rounded-xl border py-2.5 text-sm font-bold transition ${
                      time === s
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-brand-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => {
                setMode("view");
                setError("");
              }}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600"
            >
              Retour
            </button>
            <button
              disabled={!date || !time || busy}
              onClick={confirmMove}
              className="ml-auto rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white transition disabled:opacity-40"
            >
              {busy ? "…" : "Confirmer le report"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-soft">
      <p className="text-3xl">{emoji}</p>
      <h1 className="h-display mt-2 text-xl font-bold text-slate-900">{title}</h1>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function HomeLink() {
  return (
    <div className="mt-6 text-center">
      <Link
        href="/"
        className="text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        ← Retour à l'accueil
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-800">{value}</span>
    </div>
  );
}
