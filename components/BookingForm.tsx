"use client";

import { useEffect, useRef, useState } from "react";
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
  /** Supplément en € au-dessus du prix de base (Auto : véhicule). Sert au
   *  récapitulatif de prix à l'étape coordonnées. */
  surcharge?: number;
};

/** Option facultative multi-sélection (Auto : suppléments selon l'état).
 *  Prix fixe selon l'id de variante (véhicule) sélectionnée. */
export type BookingFormOption = {
  id: string;
  label: string;
  priceByVariant: Record<string, number>;
};

/** Prix d'une option pour une variante donnée (fallback : le plus bas). */
function optionPrice(o: BookingFormOption, variantId: string): number {
  const prices = Object.values(o.priceByVariant);
  return o.priceByVariant[variantId] ?? (prices.length ? Math.min(...prices) : 0);
}

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
  /** Options facultatives multi-sélection (Auto : suppléments selon l'état). */
  options?: BookingFormOption[];
  /** Titres adaptés à la section. detailsQuestion utilise {name} comme
   *  placeholder pour l'item courant (sera remplacé côté client). */
  copy: {
    serviceQuestion: string;
    serviceHint: string;
    detailsQuestion: string; // ex: "Quelques détails sur votre {name}."
    successWaMessage: string;
  };
};

type StepId = "service" | "contact" | "success";

const STEPS: { id: StepId; label: string }[] = [
  { id: "service", label: "Prestation" },
  { id: "contact", label: "Coordonnées" },
];

export default function BookingForm({
  section,
  items,
  variantPicker,
  freeTextVariantPlaceholderByItem,
  options,
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
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  // Options facultatives cochées (ids). Vide si la section n'en propose pas.
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  function toggleOption(id: string) {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }
  // Validation inline (au blur) : corrige avant le submit → moins d'abandon.
  const [fieldErrors, setFieldErrors] = useState<{ phone?: string; email?: string }>(
    {},
  );

  const phoneIsValid = (v: string) => v.replace(/[^0-9]/g, "").length >= 8;
  const emailIsValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const item = items.find((s) => s.id === itemId);
  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  // Auto : la variante (véhicule) devient obligatoire pour capter le
  // supplément. Maison (texte libre, pas de variantPicker) : facultative.
  const canContinue = !!itemId && (!variantPicker || !!variant);

  // Remonter le formulaire en haut de l'écran à chaque changement d'étape :
  // sur mobile, sans ça, le 1er champ de l'étape suivante peut rester
  // hors-écran et l'utilisateur croit qu'il ne s'est rien passé.
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function goToStep(target: StepId) {
    setError(null);
    setStep(target);
  }

  async function handleSubmit() {
    setError(null);

    if (!firstName.trim()) return setError("Indiquez votre prénom.");
    if (!phone.trim() || phone.replace(/[^0-9]/g, "").length < 8) {
      return setError("Numéro de téléphone invalide.");
    }
    // Email facultatif : on ne le valide que s'il est renseigné.
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError("Email invalide.");
    }

    // Les options cochées sont préfixées aux notes : visibles dans la
    // notification de lead + l'admin, sans nouvelle colonne en base.
    const optionLabels = (options ?? [])
      .filter((o) => selectedOptions.includes(o.id))
      .map((o) => `${o.label} (${optionPrice(o, variant)} €)`);
    const notesPayload =
      [
        optionLabels.length ? `Options : ${optionLabels.join(", ")}` : null,
        notes.trim() || null,
      ]
        .filter(Boolean)
        .join("\n") || null;

    setSubmitting(true);
    try {
      const res = await fetch("/api/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          itemId,
          variant: variant.trim() || null,
          firstName: firstName.trim(),
          email: email.trim() || null,
          phone: phone.trim(),
          notes: notesPayload,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Erreur lors de l'envoi.");
      }

      // Tracking de la soumission du formulaire via le Google Tag, centralisé
      // dans window.scConvert (cf. Analytics.tsx) :
      //  - GA4 : event 'generate_lead' (avec param section)
      //  - Google Ads : action de conversion "Formulaire" si configurée,
      //    sinon repli sur le label WhatsApp (la soumission compte quand même)
      //  - Meta : Lead
      if (
        typeof window !== "undefined" &&
        typeof window.scConvert === "function"
      ) {
        window.scConvert("form", section);
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
    <div
      ref={containerRef}
      className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
    >
      {/* Progress — labels + ligne de liaison visibles dès le mobile (avant,
          il ne restait que deux pastilles orphelines sur petit écran). */}
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
                className={`text-xs ${active ? "font-semibold text-slate-900" : ""}`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={`h-px flex-1 ${done ? accent.bgActive : "bg-slate-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Étape 1 — Prestation */}
      {step === "service" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canContinue) goToStep("contact");
          }}
        >
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

          {/* Variante (Auto : type de véhicule en taps / Maison : champ
              libre facultatif) — intégrée ici pour rester en 2 étapes. */}
          {item &&
            (variantPicker ? (
              <div className="mt-5">
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
              </div>
            ) : (
              <div className="mt-5">
                <Field label="Type / taille (facultatif)">
                  <input
                    type="text"
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    placeholder={freeTextVariantPlaceholderByItem?.[item.id] ?? ""}
                    className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition ${accent.ring} focus:ring-2`}
                  />
                </Field>
              </div>
            ))}

          {/* Options facultatives (Auto : suppléments selon l'état) */}
          {item && options && options.length > 0 && (
            <div className="mt-5">
              <Field label="Options selon l'état (facultatif)">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {options.map((o) => {
                    const active = selectedOptions.includes(o.id);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => toggleOption(o.id)}
                        aria-pressed={active}
                        className={`relative rounded-xl border px-3 py-3 text-left transition ${
                          active
                            ? `${accent.borderActive} ${accent.bgSoft}`
                            : `border-slate-200 bg-slate-50 ${accent.borderHover}`
                        }`}
                      >
                        <span className="block text-xs font-semibold text-slate-900">
                          {o.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-slate-500">
                          {variant
                            ? `${optionPrice(o, variant)} €`
                            : `dès ${optionPrice(o, "")} €`}
                        </span>
                        {active && (
                          <span
                            className={`absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full text-white ${accent.bgActive}`}
                          >
                            <CheckIcon size={10} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          )}

          <FooterRow
            isSubmit
            primaryDisabled={!canContinue}
            primaryLabel="Continuer"
          />
        </form>
      )}

      {/* Étape 2 — Coordonnées */}
      {step === "contact" && item && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
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
                  autoComplete="given-name"
                  autoCapitalize="words"
                  className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition ${accent.ring} focus:ring-2`}
                />
              </Field>
              <Field label="Téléphone" required>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (fieldErrors.phone)
                      setFieldErrors((f) => ({ ...f, phone: undefined }));
                  }}
                  onBlur={(e) =>
                    setFieldErrors((f) => ({
                      ...f,
                      phone:
                        e.target.value.trim() && !phoneIsValid(e.target.value)
                          ? "Numéro de téléphone invalide."
                          : undefined,
                    }))
                  }
                  placeholder="06 12 34 56 78"
                  required
                  aria-invalid={!!fieldErrors.phone}
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                    fieldErrors.phone
                      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-400/20"
                      : `border-slate-200 ${accent.ring}`
                  }`}
                />
                {fieldErrors.phone && (
                  <span className="mt-1 block text-xs text-rose-600">
                    {fieldErrors.phone}
                  </span>
                )}
              </Field>
            </div>

            <Field label="Email (facultatif)">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email)
                    setFieldErrors((f) => ({ ...f, email: undefined }));
                }}
                onBlur={(e) =>
                  setFieldErrors((f) => ({
                    ...f,
                    email:
                      e.target.value.trim() && !emailIsValid(e.target.value)
                        ? "Email invalide."
                        : undefined,
                  }))
                }
                placeholder="marie@exemple.fr"
                aria-invalid={!!fieldErrors.email}
                className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                  fieldErrors.email
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-400/20"
                    : `border-slate-200 ${accent.ring}`
                }`}
              />
              {fieldErrors.email && (
                <span className="mt-1 block text-xs text-rose-600">
                  {fieldErrors.email}
                </span>
              )}
            </Field>

            <Field label="Précisions, créneau souhaité… (facultatif)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={
                  isMaison
                    ? "Quand ? Étage, accès, taches, animaux…"
                    : "Quand ? Modèle, accès, options souhaitées…"
                }
                className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition ${accent.ring} focus:ring-2`}
              />
            </Field>

            {/* Récapitulatif de prix avant envoi */}
            <PriceRecap
              item={item}
              variant={variant}
              variantPicker={variantPicker}
              options={options}
              selectedOptions={selectedOptions}
              accent={accent}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700"
            >
              {error}
            </p>
          )}

          {/* Réassurance AVANT l'envoi (et pas seulement sur l'écran de
              succès) : délai de réponse + absence d'engagement → lève la
              dernière hésitation au moment du clic. */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon size={13} className={accent.text} />
              Réponse sous 1 h ouvrée (≈ 17 min en moyenne)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon size={13} className={accent.text} />
              Devis gratuit · sans engagement
            </span>
          </div>

          <FooterRow
            isSubmit
            onBack={() => goToStep("service")}
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
        </form>
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
  isSubmit,
  primaryLabel,
  primaryDisabled,
}: {
  onBack?: () => void;
  /** Action au clic (boutons hors form). Ignoré si isSubmit (le <form> gère). */
  onPrimary?: () => void;
  /** Bouton de type submit : déclenche le onSubmit du <form> parent
   *  → soumission au clavier (Entrée / touche "OK" mobile). */
  isSubmit?: boolean;
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
        type={isSubmit ? "submit" : "button"}
        onClick={isSubmit ? undefined : onPrimary}
        disabled={primaryDisabled}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {primaryLabel}
        <ArrowRightIcon size={14} />
      </button>
    </div>
  );
}

/** Récapitulatif de prix affiché à l'étape coordonnées, juste avant l'envoi.
 *  Auto : prix de base de la formule + supplément véhicule. Maison : prix
 *  « à partir de » du service (la taille reste en texte libre). Toujours
 *  présenté comme une estimation, le prix final étant confirmé au rappel. */
function PriceRecap({
  item,
  variant,
  variantPicker,
  options,
  selectedOptions,
  accent,
}: {
  item: BookingFormItem;
  variant: string;
  variantPicker?: Props["variantPicker"];
  options?: BookingFormOption[];
  selectedOptions: string[];
  accent: { text: string; bgSoft: string; borderActive: string };
}) {
  const base = parseInt(item.priceFrom, 10);
  const selected = variantPicker?.options.find((v) => v.id === variant);
  const surcharge = selected?.surcharge ?? 0;
  const selectedOpts = (options ?? []).filter((o) =>
    selectedOptions.includes(o.id),
  );
  const optionsTotal = selectedOpts.reduce(
    (s, o) => s + optionPrice(o, variant),
    0,
  );
  const hasBase = !Number.isNaN(base);
  const total = hasBase ? base + surcharge + optionsTotal : null;
  const variantLabel = selected?.label ?? (variant.trim() || null);

  return (
    <div
      className={`rounded-2xl border ${accent.borderActive} ${accent.bgSoft} px-4 py-3.5`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Votre demande
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
            {item.shortName}
            {variantLabel ? ` · ${variantLabel}` : ""}
          </p>
          {selectedOpts.length > 0 && (
            <p className="mt-0.5 text-[11px] text-slate-500">
              Options : {selectedOpts.map((o) => o.label).join(", ")}
            </p>
          )}
        </div>
        {total != null && (
          <div className="shrink-0 text-right">
            <p className="text-[11px] text-slate-500">À partir de</p>
            <p className={`h-display text-xl font-bold ${accent.text}`}>
              {total} €
            </p>
          </div>
        )}
      </div>

      {(surcharge > 0 || optionsTotal > 0) && (
        <p className="mt-2.5 border-t border-slate-200/70 pt-2.5 text-[11px] text-slate-500">
          Base {base} €
          {surcharge > 0 && selected ? ` + ${selected.label} (+${surcharge} €)` : ""}
          {optionsTotal > 0 ? ` + options (+${optionsTotal} €)` : ""}
        </p>
      )}

      <p className="mt-2 text-[11px] leading-snug text-slate-500">
        Estimation indicative — prix final confirmé après échange. On vous
        rappelle pour valider le créneau, sans engagement.
      </p>
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

// Type augmentation : gtag + helper de conversion exposé par Analytics.tsx
type ScMatch = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  postalCode?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    scConvert?: (
      kind: "whatsapp" | "phone" | "form",
      section: "auto" | "maison",
      data?: ScMatch,
    ) => void;
    scReserve?: (opts: ScMatch & { value?: number; service?: string }) => void;
  }
}
