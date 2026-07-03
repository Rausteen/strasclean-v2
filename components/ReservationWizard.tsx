"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BOOKING_FORMULAS, computePrice, isServedPostal } from "@/lib/booking";
import { VEHICLE_TYPES, AUTO_OPTIONS, autoOptionPrice } from "@/lib/plans";
import BookingCalendar, { firstOpenDay } from "@/components/BookingCalendar";

const STEP_LABELS = ["Formule", "Véhicule", "Créneau", "Vous", "Récap"];

function prettyWhen(date: string, time: string): string {
  return `${prettyDay(date)} à ${time}`;
}

function prettyDay(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-900 outline-none focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/20";

export default function ReservationWizard({
  initialFormula = "",
}: {
  initialFormula?: string;
}) {
  const [step, setStep] = useState(initialFormula ? 1 : 0);
  const [formula, setFormula] = useState(initialFormula);
  const [vehicle, setVehicle] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    postalCode: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ when: string; price: number } | null>(null);

  const f = BOOKING_FORMULAS.find((x) => x.id === formula);
  const price = useMemo(
    () => (formula && vehicle ? computePrice(formula, vehicle, options) : 0),
    [formula, vehicle, options],
  );

  const fetchSlots = useCallback(async () => {
    if (!date || !formula) return;
    setLoadingSlots(true);
    setSlots([]);
    try {
      const res = await fetch(
        `/api/reservation/slots?date=${date}&formula=${formula}`,
      );
      const data = (await res.json()) as { slots?: string[] };
      setSlots(data.slots ?? []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [date, formula]);

  // À l'arrivée sur l'étape créneau, présélectionne le 1er jour ouvré.
  useEffect(() => {
    if (step === 2 && !date) setDate(firstOpenDay());
  }, [step, date]);

  useEffect(() => {
    if (step === 2 && date) fetchSlots();
  }, [step, date, fetchSlots]);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }
  function toggleOption(id: string) {
    setOptions((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  const canNext =
    (step === 0 && !!formula) ||
    (step === 1 && !!vehicle) ||
    (step === 2 && !!date && !!time) ||
    (step === 3 &&
      !!form.firstName &&
      !!form.phone &&
      /.+@.+\..+/.test(form.email) &&
      !!form.address &&
      !!form.postalCode) ||
    step === 4;

  const zoneWarn =
    !!form.postalCode && form.postalCode.length >= 5 && !isServedPostal(form.postalCode);

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ formula, vehicle, options, date, time, ...form }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; price?: number };
      if (data.ok) {
        setDone({ when: prettyWhen(date, time), price: data.price ?? price });
      } else {
        setError(data.error || "Une erreur est survenue.");
        if (res.status === 409) {
          setTime("");
          setStep(2);
          fetchSlots();
        }
      }
    } catch {
      setError("Réseau indisponible, réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Écran de confirmation finale ──
  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-100 text-3xl">
          ✅
        </div>
        <h1 className="h-display mt-5 text-2xl font-bold text-slate-900">
          Réservation confirmée !
        </h1>
        <p className="mt-2 text-slate-600">
          On vient s'occuper de votre voiture{" "}
          <b className="text-slate-900">{done.when}</b>.
        </p>
        <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-soft">
          <Row label="Prestation" value={`${f?.name} · ${VEHICLE_TYPES.find((v) => v.id === vehicle)?.label}`} />
          <Row label="Quand" value={done.when} />
          <Row label="À payer sur place" value={`${done.price} €`} strong />
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Un email de confirmation vous a été envoyé (si vous l'avez renseigné).
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          ← Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-32 pt-6">
      {/* Progression */}
      <div className="mb-6 flex items-center gap-1.5">
        {STEP_LABELS.map((l, i) => (
          <div key={l} className="flex-1">
            <div
              className={`h-1.5 rounded-full ${i <= step ? "bg-brand-500" : "bg-slate-200"}`}
            />
            <p
              className={`mt-1.5 text-[11px] font-semibold ${i === step ? "text-slate-900" : "text-slate-400"}`}
            >
              {l}
            </p>
          </div>
        ))}
      </div>

      {/* ÉTAPE 0 — Formule */}
      {step === 0 && (
        <Section title="Choisissez votre formule">
          <div className="space-y-2.5">
            {BOOKING_FORMULAS.map((fo) => (
              <button
                key={fo.id}
                onClick={() => setFormula(fo.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  formula === fo.id
                    ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-2xl">
                  {fo.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-slate-900">{fo.name}</span>
                  <span className="block truncate text-sm text-slate-500">
                    {fo.tagline}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-xs text-slate-400">dès</span>
                  <span className="font-bold text-slate-900">{fo.priceFrom} €</span>
                </span>
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* ÉTAPE 1 — Véhicule + options */}
      {step === 1 && (
        <Section title="Votre véhicule">
          <div className="grid grid-cols-2 gap-2.5">
            {VEHICLE_TYPES.map((v) => (
              <button
                key={v.id}
                onClick={() => setVehicle(v.id)}
                className={`rounded-2xl border p-4 text-center transition ${
                  vehicle === v.id
                    ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="text-2xl">{v.emoji}</span>
                <span className="mt-1 block text-sm font-bold text-slate-900">
                  {v.label}
                </span>
                {v.surcharge > 0 && (
                  <span className="text-xs text-slate-400">+{v.surcharge} €</span>
                )}
              </button>
            ))}
          </div>

          {!!formula && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Options (facultatif)
              </p>
              <div className="space-y-2">
                {AUTO_OPTIONS.map((o) => {
                  const active = options.includes(o.id);
                  const p = vehicle ? autoOptionPrice(o, vehicle) : o.priceByVehicle.citadine;
                  return (
                    <button
                      key={o.id}
                      onClick={() => toggleOption(o.id)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                        active
                          ? "border-brand-500 bg-brand-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-800">
                        {o.label}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-brand-700">
                          +{p} €
                        </span>
                        <span
                          className={`grid h-5 w-5 place-items-center rounded-md border text-xs ${
                            active
                              ? "border-brand-500 bg-brand-500 text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {active ? "✓" : ""}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* ÉTAPE 2 — Date & créneau (style cal.com) */}
      {step === 2 && (
        <Section title="Choisissez un créneau">
          <div className="grid gap-5 sm:grid-cols-[1fr_15rem]">
            <BookingCalendar
              value={date}
              onSelect={(d) => {
                setDate(d);
                setTime("");
              }}
            />

            <div className="min-w-0">
              <p className="mb-2 text-sm font-semibold capitalize text-slate-700">
                {date ? prettyDay(date) : "Sélectionnez une date"}
              </p>
              {!date ? (
                <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                  Choisissez un jour dans le calendrier.
                </p>
              ) : loadingSlots ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-11 animate-pulse rounded-xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <p className="rounded-xl bg-amber-50 px-4 py-8 text-center text-sm text-amber-700">
                  Complet ce jour-là. Choisissez une autre date 🗓️
                </p>
              ) : (
                <div className="grid max-h-[19rem] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-1">
                  {slots.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTime(s)}
                      className={`rounded-xl border py-3 text-sm font-bold transition ${
                        time === s
                          ? "border-brand-600 bg-brand-600 text-white shadow"
                          : "border-slate-200 bg-white text-slate-800 hover:border-brand-400 hover:bg-brand-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            Interventions le <b className="text-slate-500">mercredi, vendredi et
            samedi</b> · 8h – 19h
          </p>
        </Section>
      )}

      {/* ÉTAPE 3 — Coordonnées */}
      {step === 3 && (
        <Section title="Vos coordonnées">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                className={inputCls}
                placeholder="Prénom *"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
              />
              <input
                className={inputCls}
                placeholder="Nom"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
              />
            </div>
            <input
              className={inputCls}
              type="tel"
              inputMode="tel"
              placeholder="Téléphone *"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
            <input
              className={inputCls}
              type="email"
              inputMode="email"
              placeholder="Email * (confirmation + gestion du RDV)"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            <input
              className={inputCls}
              placeholder="Adresse (où on intervient) *"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
            <input
              className={inputCls}
              inputMode="numeric"
              placeholder="Code postal *"
              value={form.postalCode}
              onChange={(e) => set("postalCode", e.target.value)}
            />
            {zoneWarn && (
              <p className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800">
                On n'est pas sûrs de desservir cette zone — on vous confirme la
                dispo après réservation.
              </p>
            )}
            <textarea
              className={inputCls}
              rows={2}
              placeholder="Précisions (accès, état du véhicule…)"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </Section>
      )}

      {/* ÉTAPE 4 — Récap */}
      {step === 4 && (
        <Section title="Vérifiez et confirmez">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <Row label="Formule" value={f?.name ?? "—"} />
            <Row
              label="Véhicule"
              value={VEHICLE_TYPES.find((v) => v.id === vehicle)?.label ?? "—"}
            />
            {options.length > 0 && (
              <Row
                label="Options"
                value={options
                  .map((o) => AUTO_OPTIONS.find((x) => x.id === o)?.label)
                  .join(", ")}
              />
            )}
            <Row label="Quand" value={prettyWhen(date, time)} />
            <Row label="Adresse" value={`${form.address}, ${form.postalCode}`} />
            <Row label="Contact" value={`${form.firstName} · ${form.phone}`} />
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="font-semibold text-slate-700">
                Total (sur place)
              </span>
              <span className="h-display text-2xl font-bold text-slate-900">
                {price} €
              </span>
            </div>
          </div>
          {error && (
            <p className="mt-3 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              {error}
            </p>
          )}
          <p className="mt-3 text-center text-xs text-slate-400">
            Paiement sur place après la prestation · sans engagement
          </p>
        </Section>
      )}

      {/* Barre de navigation fixe en bas */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          {step > 0 && (
            <button
              onClick={() => {
                setError("");
                setStep((s) => s - 1);
              }}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600"
            >
              Retour
            </button>
          )}
          {price > 0 && (
            <span className="ml-auto text-sm font-semibold text-slate-500">
              {price} €
            </span>
          )}
          {step < 4 ? (
            <button
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
              className={`${price > 0 ? "" : "ml-auto"} rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white transition disabled:opacity-40`}
            >
              Continuer
            </button>
          ) : (
            <button
              disabled={submitting}
              onClick={submit}
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {submitting ? "…" : "Confirmer la réservation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="h-display mb-4 text-xl font-bold text-slate-900 sm:text-2xl">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span
        className={`text-right ${strong ? "text-lg font-bold text-slate-900" : "font-semibold text-slate-800"}`}
      >
        {value}
      </span>
    </div>
  );
}
