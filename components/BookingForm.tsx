"use client";

import { useState } from "react";
import { CheckIcon, ArrowRightIcon, ClockIcon, WhatsAppIcon } from "./Icon";
import { SITE, waLink } from "@/lib/site";

export type BookingFormItem = {
  /** Identifiant stable (service slug pour Maison, plan id pour Auto) */
  id: string;
  shortName: string;
  emoji: string;
  /** Affiché en sous-titre de card */
  priceFrom: string;
  duration: string;
};

/** Variante optionnelle (Auto = type de véhicule, Maison = vide ou texte libre) */
export type BookingFormVariant = {
  id: string;
  label: string;
  emoji?: string;
  hint?: string;
};

export type BookingFormSection = "auto" | "maison";

type Props = {
  section: BookingFormSection;
  /** Items principaux à choisir à l'étape 1 (formules Auto ou services Maison) */
  items: BookingFormItem[];
  /** Optionnel : 2e étape avec picker prédéfini (Auto : véhicules) */
  variantPicker?: {
    label: string;
    options: BookingFormVariant[];
  };
  /** Texte du picker (Maison : texte libre, Auto : remplacé par variantPicker) */
  freeTextVariantPlaceholderByItem?: Record<string, string>;
  /** Titres adaptés à la section. detailsQuestion utilise {name} comme
   *  placeholder pour l'item courant (sera remplacé côté client). */
  copy: {
    serviceQuestion: string;
    serviceHint: string;
    detailsQuestion: string; // ex: "Quelques détails sur votre {name}."
    successWaMessage: string;
  };
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

export default function BookingForm({
  section,
  items,
  variantPicker,
  freeTextVariantPlaceholderByItem,
  copy,
}: Props) {
  const isMaison = section === "maison";
  const accent = isMaison
    ? {
        text: "text-amber-600",
        textHover: "hover:text-amber-700",
        bgActive: "bg-amber-500",
        borderActive: "border-amber-400/70",
        bgSoft: "bg-amber-50",
        ring: "focus:ring-amber-400/20 focus:border-amber-400/60",
        glow: "shadow-glow-amber",
        bgSoftHover: "hover:bg-amber-50/50",
        borderHover: "hover:border-amber-400/40",
        bgHero: "from-amber-50",
      }
    : {
        text: "text-brand-600",
        textHover: "hover:text-brand-700",
        bgActive: "bg-brand-500",
        borderActive: "border-brand-400/70",
        bgSoft: "bg-brand-50",
        ring: "focus:ring-brand-400/20 focus:border-brand-400/60",
        glow: "shadow-glow",
        bgSoftHover: "hover:bg-brand-50/50",
        borderHover: "hover:border-brand-400/40",
        bgHero: "from-brand-50",
      };

  const [step, setStep] = useState<StepId>("service");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données du formulaire
  const [itemId, setItemId] = useState<string | null>(null);
  const [variant, setVariant] = useState(""); // texte libre OU id du variantPicker
  const [postalCode, setPostalCode] = useState("");
  const [addressNote, setAddressNote] = useState("");
  const [preferredDay, setPreferredDay] = useState(DAY_OPTIONS[0]);
  const [preferredSlot, setPreferredSlot] = useState<string>("flexible");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const item = items.find((s) => s.id === itemId);
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
          section,
          itemId,
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

      // Conversion tracking — un event différent par section pour pouvoir
      // les importer comme conversions distinctes dans les comptes Ads.
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", `booking_request_${section}`, {
          event_category: "lead",
          value: section === "maison" ? 15 : 12,
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
    return (
      <SuccessPanel
        firstName={firstName}
        section={section}
        successMessage={copy.successWaMessage}
        accent={accent}
      />
    );
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
                    ? `${accent.bgActive} text-white`
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
                    done ? accent.bgActive : "bg-slate-200"
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
            {copy.serviceQuestion}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{copy.serviceHint}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {items.map((s) => {
              const active = s.id === itemId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setItemId(s.id)}
                  className={`group flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                    active
                      ? `${accent.borderActive} ${accent.bgSoft} ${accent.glow}`
                      : `border-slate-200 bg-slate-50 ${accent.borderHover} ${accent.bgSoftHover}`
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
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-white ${accent.bgActive}`}
                    >
                      <CheckIcon size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <FooterRow
            onPrimary={() => goToStep("details")}
            primaryDisabled={!itemId}
            primaryLabel="Continuer"
          />
        </div>
      )}

      {/* Étape 2 — Détails */}
      {step === "details" && item && (
        <div>
          <h2 className="h-display text-xl font-bold text-slate-900 sm:text-2xl">
            {copy.detailsQuestion.replace("{name}", item.shortName.toLowerCase())}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Plus c'est précis, plus le devis est juste du premier coup.
          </p>

          <div className="mt-5 space-y-4">
            {variantPicker ? (
              <Field label={variantPicker.label}>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {variantPicker.options.map((v) => {
                    const active = variant === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVariant(v.id)}
                        className={`rounded-xl border px-3 py-3 text-center transition ${
                          active
                            ? `${accent.borderActive} ${accent.bgSoft}`
                            : `border-slate-200 bg-slate-50 ${accent.borderHover}`
                        }`}
                      >
                        {v.emoji && (
                          <span aria-hidden className="block text-2xl">
                            {v.emoji}
                          </span>
                        )}
                        <span className="mt-1 block text-xs font-semibold text-slate-900">
                          {v.label}
                        </span>
                        {v.hint && (
                          <span className="block text-[11px] text-slate-500">
                            {v.hint}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Field>
            ) : (
              <Field label="Type / taille (facultatif)">
                <input
                  type="text"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  placeholder={
                    freeTextVariantPlaceholderByItem?.[item.id] ?? ""
                  }
                  className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition ${accent.ring} focus:ring-2`}
                />
              </Field>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Code postal">
                <input
                  type="text"
                  inputMode="numeric"
                  value={postalCode}
                  onChange={(e) =>
                    setPostalCode(
                      e.target.value.replace(/[^0-9]/g, "").slice(0, 5),
                    )
                  }
                  placeholder="67000"
                  className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition ${accent.ring} focus:ring-2`}
                />
              </Field>
              <Field label="Quartier / commune (facultatif)">
                <input
                  type="text"
                  value={addressNote}
                  onChange={(e) => setAddressNote(e.target.value)}
                  placeholder="Krutenau, Schiltigheim…"
                  className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition ${accent.ring} focus:ring-2`}
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
                          ? `${accent.borderActive} ${accent.bgSoft} text-slate-900`
                          : `border-slate-200 bg-slate-50 text-slate-600 ${accent.borderHover}`
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
                          ? `${accent.borderActive} ${accent.bgSoft}`
                          : `border-slate-200 bg-slate-50 ${accent.borderHover}`
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
      {step === "contact" && item && (
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
                  className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition ${accent.ring} focus:ring-2`}
                />
              </Field>
              <Field label="Téléphone" required>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  required
                  className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition ${accent.ring} focus:ring-2`}
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
                className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition ${accent.ring} focus:ring-2`}
              />
            </Field>

            <Field label="Précisions (facultatif)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={
                  isMaison
                    ? "Étage, accès, taches particulières, animaux…"
                    : "Modèle / marque, accès, options souhaitées…"
                }
                className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition ${accent.ring} focus:ring-2`}
              />
            </Field>

            {/* Récap discret avant envoi */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
              <p>
                Récap :{" "}
                <strong className="text-slate-900">{item.shortName}</strong>
                {variant && variantPicker
                  ? ` (${variantPicker.options.find((v) => v.id === variant)?.label ?? variant})`
                  : variant
                    ? ` (${variant})`
                    : ""}
                {postalCode ? ` — ${postalCode}` : ""}
                {" "}· {preferredDay}, créneau{" "}
                {SLOT_OPTIONS.find(
                  (s) => s.id === preferredSlot,
                )?.label.toLowerCase()}
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
              className={`font-medium ${accent.text} ${accent.textHover}`}
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
        {required && <span className="ml-0.5 text-rose-500">*</span>}
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

function SuccessPanel({
  firstName,
  section,
  successMessage,
  accent,
}: {
  firstName: string;
  section: BookingFormSection;
  successMessage: string;
  accent: { bgActive: string };
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 text-center shadow-sm sm:p-10">
      <div
        className={`mx-auto grid h-14 w-14 place-items-center rounded-full text-white ${accent.bgActive}`}
      >
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
          href={waLink(successMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa h-12 px-6 text-base"
        >
          <WhatsAppIcon size={18} /> Suivre sur WhatsApp
        </a>
        <a
          href={section === "maison" ? "/strasclean-maison" : "/"}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          {section === "maison" ? "Retour au hub Maison" : "Retour à l'accueil"}
        </a>
      </div>
    </div>
  );
}

// Type augmentation pour gtag (déjà chargé via Analytics.tsx)
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
