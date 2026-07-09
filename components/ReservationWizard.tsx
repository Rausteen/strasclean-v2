"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BOOKING_FORMULAS,
  computePrice,
  isServedPostal,
  promoDiscount,
} from "@/lib/booking";
import { VEHICLE_TYPES } from "@/lib/plans";
import BookingCalendar from "@/components/BookingCalendar";
import { ClockIcon, CheckIcon, ArrowRightIcon } from "@/components/Icon";

const STEP_LABELS = ["Véhicule", "Formule", "Créneau", "Vous", "Récap"];

// Durée lisible : 60 → "≈ 1h", 90 → "≈ 1h30", 150 → "≈ 2h30".
function durLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `≈ ${h}h${String(m).padStart(2, "0")}`;
  if (h) return `≈ ${h}h`;
  return `≈ ${m} min`;
}

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
  // On commence TOUJOURS par le véhicule (étape 0). Une formule pré-choisie
  // (via ?formule=) est mémorisée pour l'étape 1, mais le véhicule passe avant.
  const [step, setStep] = useState(0);
  const [formula, setFormula] = useState(initialFormula);
  const [vehicle, setVehicle] = useState("");
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
  const [promo, setPromo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ when: string; price: number } | null>(null);

  const f = BOOKING_FORMULAS.find((x) => x.id === formula);
  const vehObj = VEHICLE_TYPES.find((v) => v.id === vehicle);
  const price = useMemo(
    () => (formula && vehicle ? computePrice(formula, vehicle) : 0),
    [formula, vehicle],
  );
  const discount = promoDiscount(promo);
  const total = Math.max(0, price - discount);
  // Code saisi mais non reconnu (pour un retour visuel discret).
  const promoInvalid = promo.trim().length > 0 && discount === 0;

  // Event Meta 'InitiateCheckout' — une seule fois, dès le choix du véhicule
  // (1ʳᵉ action ferme du tunnel).
  const checkoutFired = useRef(false);
  useEffect(() => {
    if (vehicle && !checkoutFired.current) {
      checkoutFired.current = true;
      window.scInitiateCheckout?.({ service: vehObj?.label });
    }
  }, [vehicle, vehObj]);

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

  // À l'arrivée sur l'étape créneau, présélectionne le 1er jour qui a ENCORE
  // des créneaux libres (pas juste le 1er jour ouvré, qui peut être complet
  // ou déjà passé le délai mini).
  useEffect(() => {
    if (step !== 2 || date || !formula) return;
    let cancelled = false;
    fetch(`/api/reservation/first-available?formula=${formula}`)
      .then((r) => r.json())
      .then((d: { date?: string }) => {
        if (!cancelled && d?.date) setDate(d.date);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [step, date, formula]);

  useEffect(() => {
    if (step === 2 && date) fetchSlots();
  }, [step, date, fetchSlots]);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  const canNext =
    (step === 0 && !!vehicle) ||
    (step === 1 && !!formula) ||
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
      // sid analytics (posé par Tracker) → permet d'attribuer la réservation
      // à sa source d'acquisition (Google Ads, SEO, Meta, direct…).
      let sid: string | null = null;
      try {
        sid = localStorage.getItem("strasclean_sid");
      } catch {
        /* localStorage bloqué — attribution absente, pas bloquant */
      }
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ formula, vehicle, date, time, promo, sid, ...form }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; price?: number };
      if (data.ok) {
        // Event Meta 'Schedule' (+ GA/Ads) avec la valeur réelle du RDV et
        // l'advanced matching (email/tél/nom/CP → Meta les hash).
        if (typeof window !== "undefined" && typeof window.scReserve === "function") {
          window.scReserve({
            value: data.price ?? total,
            service: f ? `${f.name} · ${vehObj?.label ?? ""}` : "reservation-auto",
            email: form.email.trim(),
            phone: form.phone.trim(),
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            postalCode: form.postalCode.trim(),
          });
        }
        setDone({ when: prettyWhen(date, time), price: data.price ?? total });
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
          Un email de confirmation vient de vous être envoyé, avec le lien pour
          gérer votre rendez-vous.
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
      <div className="mb-7">
        <div className="flex items-center gap-1.5">
          {STEP_LABELS.map((l, i) => (
            <div
              key={l}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < step
                  ? "bg-brand-500"
                  : i === step
                    ? "bg-brand-500"
                    : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs font-medium text-slate-400">
          Étape {step + 1} sur {STEP_LABELS.length}
          <span className="mx-1.5 text-slate-300">·</span>
          <span className="font-semibold text-slate-600">{STEP_LABELS[step]}</span>
        </p>
      </div>

      {/* ÉTAPE 0 — Véhicule (sans prix) */}
      {step === 0 && (
        <Section title="Votre véhicule">
          <div className="space-y-2.5">
            {VEHICLE_TYPES.map((v) => {
              const active = vehicle === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setVehicle(v.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition ${
                    active
                      ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/40"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <span className="grid h-14 w-20 shrink-0 place-items-center rounded-xl bg-slate-50 p-1 sm:h-16 sm:w-24">
                    {v.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.image}
                        alt={v.label}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-3xl">{v.emoji}</span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">{v.label}</span>
                    <span className="block text-[13px] leading-snug text-slate-500">
                      {v.desc}
                    </span>
                  </span>
                  <Radio active={active} className="mr-0.5 shrink-0" />
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {/* ÉTAPE 1 — Formule (prix déjà calculé pour le véhicule) */}
      {step === 1 && (
        <Section title="Choisissez votre formule">
          <div className="space-y-3">
            {BOOKING_FORMULAS.map((fo) => {
              const active = formula === fo.id;
              const popular = fo.id === "premium";
              const fprice = computePrice(fo.id, vehicle, []);
              return (
                <button
                  key={fo.id}
                  onClick={() => setFormula(fo.id)}
                  className={`flex w-full flex-col rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/40"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <span className="flex w-full items-start gap-3.5">
                    <Radio active={active} className="mt-0.5" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{fo.name}</span>
                        {popular && (
                          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
                            Populaire
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-slate-500">
                        {fo.tagline}
                      </span>
                      <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[12px] font-medium text-slate-500">
                        <ClockIcon size={12} />
                        {durLabel(fo.durationMin)}
                      </span>
                    </span>
                    <span className="shrink-0 text-lg font-bold text-slate-900">
                      {fprice}&nbsp;€
                    </span>
                  </span>

                  {active && fo.features.length > 0 && (
                    <ul className="mt-3.5 w-full space-y-1.5 border-t border-brand-500/20 pt-3.5">
                      {fo.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2 text-[13.5px] leading-snug text-slate-600"
                        >
                          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                            <CheckIcon size={10} />
                          </span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              );
            })}
          </div>

        </Section>
      )}

      {/* ÉTAPE 2 — Date & créneau (style cal.com) */}
      {step === 2 && (
        <Section title="Choisissez un créneau">
          <div className="grid gap-5 sm:grid-cols-[1fr_15rem]">
            <BookingCalendar
              value={date}
              durationMin={f?.durationMin}
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
            <b className="text-slate-500">Mer · ven · sam</b> : 8h – 19h.{" "}
            <b className="text-slate-500">Lun · mar · jeu · dim</b> : créneau de 8h
            (sauf Intégrale).
          </p>
        </Section>
      )}

      {/* ÉTAPE 3 — Coordonnées */}
      {step === 3 && (
        <Section title="Vos coordonnées">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Prénom *">
                <input
                  className={inputCls}
                  placeholder="Jean"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                />
              </Field>
              <Field label="Nom">
                <input
                  className={inputCls}
                  placeholder="Dupont"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Téléphone *">
              <input
                className={inputCls}
                type="tel"
                inputMode="tel"
                placeholder="06 12 34 56 78"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
            <Field label="Email *" hint="confirmation + gestion du RDV">
              <input
                className={inputCls}
                type="email"
                inputMode="email"
                placeholder="jean.dupont@email.fr"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
            <Field label="Adresse d'intervention *">
              <input
                className={inputCls}
                placeholder="12 rue des Fleurs, Strasbourg"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </Field>
            <Field label="Code postal *">
              <input
                className={inputCls}
                inputMode="numeric"
                placeholder="67000"
                autoComplete="postal-code"
                value={form.postalCode}
                onChange={(e) => set("postalCode", e.target.value)}
              />
            </Field>
            {zoneWarn && (
              <p className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800">
                On n'est pas sûrs de desservir cette zone — on vous confirme la
                dispo après réservation.
              </p>
            )}
            <Field label="Précisions" hint="facultatif">
              <textarea
                className={inputCls}
                rows={2}
                placeholder="Accès, étage, état du véhicule…"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </Field>
          </div>
        </Section>
      )}

      {/* ÉTAPE 4 — Récap */}
      {step === 4 && (
        <Section title="Vérifiez et confirmez">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
            {/* Prestation + détail du prix */}
            <div className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Prestation
              </p>
              <div className="mt-2.5 space-y-1.5">
                <PriceLine label={`Formule ${f?.name ?? ""}`} value={`${f?.priceFrom ?? 0} €`} />
                {vehObj && vehObj.surcharge > 0 && (
                  <PriceLine label={vehObj.label} value={`+${vehObj.surcharge} €`} muted />
                )}
                {discount > 0 && (
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium text-brand-700">
                      Code promo {promo.trim().toUpperCase()}
                    </span>
                    <span className="font-semibold text-brand-700">
                      −{discount}&nbsp;€
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                <span className="font-semibold text-slate-700">
                  Total à régler sur place
                </span>
                <span className="h-display text-2xl font-bold text-slate-900">
                  {total}&nbsp;€
                </span>
              </div>
            </div>
            {/* Rendez-vous */}
            <div className="border-t border-slate-100 bg-slate-50/70 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Rendez-vous
              </p>
              <div className="mt-2.5 space-y-1.5">
                <Row label="Quand" value={prettyWhen(date, time)} />
                <Row label="Adresse" value={`${form.address}, ${form.postalCode}`} />
                <Row
                  label="Contact"
                  value={`${[form.firstName, form.lastName].filter(Boolean).join(" ")} · ${form.phone}`}
                />
              </div>
            </div>
          </div>

          {/* Code promo */}
          <div className="mt-3.5">
            <Field label="Code promo" hint="facultatif">
              <input
                className={inputCls}
                placeholder="Votre code"
                autoCapitalize="characters"
                autoComplete="off"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
            </Field>
            {discount > 0 ? (
              <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                <CheckIcon size={12} /> Remise de {discount} € appliquée
              </p>
            ) : promoInvalid ? (
              <p className="mt-1.5 text-xs text-slate-400">
                Code non reconnu.
              </p>
            ) : null}
          </div>

          {error && (
            <p className="mt-3 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              {error}
            </p>
          )}
          <p className="mt-3.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <CheckIcon size={12} className="text-brand-500" /> Paiement sur place
            </span>
            <span className="text-slate-300">·</span>
            <span>sans engagement</span>
            <span className="text-slate-300">·</span>
            <span>annulable jusqu'à 3h avant</span>
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
            <div className="ml-auto text-right leading-tight">
              <span className="block text-[10px] uppercase tracking-wide text-slate-400">
                Total
              </span>
              <span className="block text-sm font-bold text-slate-900">
                {discount > 0 && (
                  <span className="mr-1 font-medium text-slate-400 line-through">
                    {price}&nbsp;€
                  </span>
                )}
                {total}&nbsp;€
              </span>
            </div>
          )}
          {step < 4 ? (
            <button
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
              className={`${price > 0 ? "" : "ml-auto"} inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-40`}
            >
              Continuer
              <ArrowRightIcon size={16} />
            </button>
          ) : (
            <button
              disabled={submitting}
              onClick={submit}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              {submitting ? "…" : "Confirmer la réservation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Radio({ active, className = "" }: { active: boolean; className?: string }) {
  return (
    <span
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition ${
        active ? "border-brand-500 bg-brand-500" : "border-slate-300 bg-white"
      } ${className}`}
    >
      {active && <span className="h-2 w-2 rounded-full bg-white" />}
    </span>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline gap-1.5 text-xs font-semibold text-slate-600">
        {label}
        {hint && <span className="font-normal text-slate-400">· {hint}</span>}
      </span>
      {children}
    </label>
  );
}

function PriceLine({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className={muted ? "text-slate-500" : "font-medium text-slate-700"}>
        {label}
      </span>
      <span className={`font-semibold ${muted ? "text-slate-500" : "text-slate-900"}`}>
        {value}
      </span>
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
