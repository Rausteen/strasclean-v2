"use client";

import { useState } from "react";
import { CheckIcon, ArrowRightIcon, ClockIcon, WhatsAppIcon } from "./Icon";
import { SITE, waLink } from "@/lib/site";

type ServiceItem = {
  slug: string;
  shortName: string;
  emoji: string;
  priceFrom: string;
  duration: string;
};

type Props = {
  services: ServiceItem[];
};

type StepId = "service" | "details" | "contact" | "success";

const DAY_OPTIONS = [
  "Cette semaine",
  "Semaine prochaine",
  "Le plus vite possible",
  "Je suis flexible",
];

const SLOT_OPTIONS = [
  { id: "matin", label: "Matin", hint: "8h–12h" },
  { id: "aprem", label: "Après-midi", hint: "12h–17h" },
  { id: "soir", label: "Soir", hint: "17h–22h" },
  { id: "flexible", label: "Peu importe", hint: "Vous proposez" },
];

const STEPS: { id: StepId; label: string }[] = [
  { id: "service", label: "Prestation" },
  { id: "details", label: "Détails" },
  { id: "contact", label: "Coordonnées" },
];

export default function BookingForm({ services }: Props) {
  const [step, setStep] = useState<StepId>("service");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données du formulaire
  const [serviceSlug, setServiceSlug] = useState<string | null>(null);
  const [variant, setVariant] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressNote, setAddressNote] = useState("");
  const [preferredDay, setPreferredDay] = useState(DAY_OPTIONS[0]);
  const [preferredSlot, setPreferredSlot] = useState<string>("flexible");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const service = services.find((s) => s.slug === serviceSlug);
  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  function goToStep(target: StepId) {
    setError(null);
    setStep(target);
  }

  async function handleSubmit() {
    setError(null);

    if (!firstName.trim()) return setError("Indiquez votre prénom.");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError("Email invalide.");
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, "").length < 8) {
      return setError("Numéro de téléphone invalide.");
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug,
          variant: variant.trim() || null,
          postalCode: postalCode.trim() || null,
          addressNote: addressNote.trim() || null,
          preferredDay,
          preferredSlot,
          firstName: firstName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          notes: notes.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Erreur lors de l'envoi.");
      }

      // Conversion tracking (Google Ads, GA4, Meta) — même handler que les
      // clics WhatsApp pour rester centralisé via Analytics.tsx.
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "booking_request_maison", {
          event_category: "lead",
          value: 15,
        });
      }

      setStep("success");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Erreur réseau, réessayez ou contactez-nous par WhatsApp.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "success") {
    return <SuccessPanel firstName={firstName} />;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500">
        {STEPS.map((s, i) => {
          const done = i < currentStepIndex;
          const active = i === currentStepIndex;
          return (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition ${
                  done
                    ? "bg-amber-500 text-white"
                    : active
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <CheckIcon size={12} /> : i + 1}
              </span>
              <span
                className={`hidden text-xs sm:inline ${
                  active ? "font-semibold text-slate-900" : ""
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={`hidden h-px flex-1 sm:block ${
                    done ? "bg-amber-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Étape 1 — Prestation */}
      {step === "service" && (
        <div>
          <h2 className="h-display text-xl font-bold text-slate-900 sm:text-2xl">
            Quelle prestation souhaitez-vous ?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Choisissez le textile principal. On affinera ensuite.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {services.map((s) => {
              const active = s.slug === serviceSlug;
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setServiceSlug(s.slug)}
                  className={`group flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-amber-400/70 bg-amber-50 shadow-glow-amber"
                      : "border-slate-200 bg-slate-50 hover:border-amber-400/40 hover:bg-amber-50/50"
                  }`}
                >
                  <span
                    aria-hidden
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-2xl shadow-sm"
                  >
                    {s.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900">
                      {s.shortName}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Dès {s.priceFrom} € · {s.duration}
                    </span>
                  </span>
                  {active && (
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-500 text-white">
                      <CheckIcon size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <FooterRow
            onPrimary={() => goToStep("details")}
            primaryDisabled={!serviceSlug}
            primaryLabel="Continuer"
          />
        </div>
      )}

      {/* Étape 2 — Détails */}
      {step === "details" && service && (
        <div>
          <h2 className="h-display text-xl font-bold text-slate-900 sm:text-2xl">
            Quelques détails sur votre {service.shortName.toLowerCase()}.
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Plus c'est précis, plus le devis est juste du premier coup.
          </p>

          <div className="mt-5 space-y-4">
            <Field label="Type / taille (facultatif)">
              <input
                type="text"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder={placeholderForService(service.slug)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Code postal">
                <input
                  type="text"
                  inputMode="numeric"
                  value={postalCode}
                  onChange={(e) =>
                    setPostalCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))
                  }
                  placeholder="67000"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
                />
              </Field>
              <Field label="Quartier / commune (facultatif)">
                <input
                  type="text"
                  value={addressNote}
                  onChange={(e) => setAddressNote(e.target.value)}
                  placeholder="Krutenau, Schiltigheim…"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
                />
              </Field>
            </div>

            <Field label="Quand préférez-vous l'intervention ?">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DAY_OPTIONS.map((d) => {
                  const active = preferredDay === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setPreferredDay(d)}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        active
                          ? "border-amber-400/70 bg-amber-50 text-slate-900"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-400/40"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Créneau préféré">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SLOT_OPTIONS.map((s) => {
                  const active = preferredSlot === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setPreferredSlot(s.id)}
                      className={`rounded-xl border px-3 py-2 text-left transition ${
                        active
                          ? "border-amber-400/70 bg-amber-50"
                          : "border-slate-200 bg-slate-50 hover:border-amber-400/40"
                      }`}
                    >
                      <span className="block text-xs font-semibold text-slate-900">
                        {s.label}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        {s.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          <FooterRow
            onBack={() => goToStep("service")}
            onPrimary={() => goToStep("contact")}
            primaryLabel="Continuer"
          />
        </div>
      )}

      {/* Étape 3 — Coordonnées */}
      {step === "contact" && service && (
        <div>
          <h2 className="h-display text-xl font-bold text-slate-900 sm:text-2xl">
            Comment on vous recontacte ?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Pour vous confirmer le créneau et envoyer le devis.
          </p>

          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Prénom" required>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Marie"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
                />
              </Field>
              <Field label="Téléphone" required>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
                />
              </Field>
            </div>

            <Field label="Email" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marie@exemple.fr"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
              />
            </Field>

            <Field label="Précisions (facultatif)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Étage, accès, taches particulières, animaux…"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
              />
            </Field>

            {/* Récap discret avant envoi */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
              <p>
                Récap : <strong className="text-slate-900">{service.shortName}</strong>
                {variant ? ` (${variant})` : ""}
                {postalCode ? ` — ${postalCode}` : ""}
                {" "}· {preferredDay}, créneau{" "}
                {SLOT_OPTIONS.find((s) => s.id === preferredSlot)?.label.toLowerCase()}
                .
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
              {error}
            </p>
          )}

          <FooterRow
            onBack={() => goToStep("details")}
            onPrimary={handleSubmit}
            primaryLabel={submitting ? "Envoi…" : "Envoyer ma demande"}
            primaryDisabled={submitting}
          />

          <p className="mt-5 text-center text-xs text-slate-500">
            Vous préférez WhatsApp ?{" "}
            <a
              href={SITE.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-600 hover:text-amber-700"
            >
              Cliquez ici
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-amber-600">*</span>}
      </span>
      {children}
    </label>
  );
}

function FooterRow({
  onBack,
  onPrimary,
  primaryLabel,
  primaryDisabled,
}: {
  onBack?: () => void;
  onPrimary: () => void;
  primaryLabel: string;
  primaryDisabled?: boolean;
}) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Retour
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onPrimary}
        disabled={primaryDisabled}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {primaryLabel}
        <ArrowRightIcon size={14} />
      </button>
    </div>
  );
}

function SuccessPanel({ firstName }: { firstName: string }) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 text-center shadow-sm sm:p-10">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-500 text-white">
        <CheckIcon size={24} />
      </div>
      <h2 className="h-display mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">
        Merci {firstName} — c'est noté !
      </h2>
      <p className="mt-3 text-balance text-slate-600">
        On vous rappelle (ou WhatsApp) sous <strong>1 h ouvrée</strong> pour
        confirmer votre créneau et envoyer le devis détaillé.
      </p>
      <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500">
        <ClockIcon size={12} />
        Délai moyen de réponse : 17 minutes
      </div>

      <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <a
          href={waLink(
            "Bonjour StrasClean 👋 Je viens de remplir le formulaire de réservation Maison sur le site.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa h-12 px-6 text-base"
        >
          <WhatsAppIcon size={18} /> Suivre sur WhatsApp
        </a>
        <a
          href="/strasclean-maison"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Retour au hub Maison
        </a>
      </div>
    </div>
  );
}

function placeholderForService(slug: string): string {
  if (slug.includes("canape")) return "Canapé 2 places tissu";
  if (slug.includes("tapis")) return "Tapis 2×3 m laine";
  if (slug.includes("matelas")) return "Matelas 140×190 cm";
  if (slug.includes("fauteuil")) return "2 fauteuils tissu";
  return "";
}

// Type augmentation pour gtag (déjà chargé via Analytics.tsx)
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
