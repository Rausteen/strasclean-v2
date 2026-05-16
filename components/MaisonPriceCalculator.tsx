"use client";

import { useMemo, useState } from "react";
import { waLink } from "@/lib/site";
import {
  WhatsAppIcon,
  SparklesIcon,
  CheckIcon,
} from "./Icon";

// ─── Données — alignées avec lib/homeServices.ts ──────────────────────────

type ServiceId = "canape" | "tapis" | "matelas" | "chaise";

type Variant = {
  id: string;
  label: string;
  price: number;
};

type Option = {
  id: string;
  label: string;
  price: number;
  note?: string;
};

type ServiceDef = {
  id: ServiceId;
  emoji: string;
  name: string;
  variants: Variant[];
  options?: Option[];
};

const SERVICES: ServiceDef[] = [
  {
    id: "canape",
    emoji: "🛋️",
    name: "Canapé",
    variants: [
      { id: "2", label: "Canapé 2 places", price: 79 },
      { id: "3", label: "Canapé 3 places", price: 109 },
      { id: "angle", label: "Canapé d'angle", price: 149 },
    ],
    options: [
      { id: "cuir", label: "Cuir (nettoyage pH-neutre + nutrition)", price: 20 },
      { id: "poils", label: "Traitement anti-poils renforcé", price: 20 },
      { id: "tabac", label: "Désodorisation forte (tabac)", price: 30 },
    ],
  },
  {
    id: "tapis",
    emoji: "🧶",
    name: "Tapis",
    variants: [
      { id: "S", label: "Petit (jusqu'à 4 m²)", price: 49 },
      { id: "M", label: "Moyen (4 à 8 m²)", price: 69 },
      { id: "L", label: "Grand (8 à 15 m²)", price: 99 },
      { id: "XL", label: "Très grand (>15 m²) — au m²", price: 9 },
    ],
    options: [
      { id: "desinfection", label: "Désinfection renforcée (animaux, allergies)", price: 15 },
    ],
  },
  {
    id: "matelas",
    emoji: "🛏️",
    name: "Matelas",
    variants: [
      { id: "1p", label: "1 personne (90×190)", price: 49 },
      { id: "2p", label: "2 personnes (140-160)", price: 79 },
      { id: "king", label: "King size (180×200+)", price: 99 },
    ],
    options: [
      { id: "recto-verso", label: "Recto-verso (2 faces)", price: 20 },
      { id: "acariens", label: "Anti-acariens renforcé", price: 20 },
      { id: "desinf-forte", label: "Désinfection forte (post-incident)", price: 15 },
    ],
  },
  {
    id: "chaise",
    emoji: "🪑",
    name: "Fauteuils & chaises",
    variants: [
      { id: "chaise-1", label: "1 chaise unique", price: 14 },
      { id: "lot-4", label: "Lot de 4 chaises", price: 49 },
      { id: "lot-6", label: "Lot de 6 chaises", price: 69 },
      { id: "lot-8", label: "Lot de 8 chaises", price: 89 },
      { id: "fauteuil", label: "Fauteuil 1 place", price: 39 },
      { id: "tabouret", label: "Tabouret de bar", price: 12 },
    ],
    options: [
      { id: "cuir", label: "Cuir (toutes pièces)", price: 8 },
    ],
  },
];

export default function MaisonPriceCalculator() {
  const [serviceId, setServiceId] = useState<ServiceId | null>(null);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [activeOptions, setActiveOptions] = useState<Set<string>>(new Set());

  const service = useMemo(
    () => SERVICES.find((s) => s.id === serviceId) ?? null,
    [serviceId],
  );
  const variant = useMemo(
    () => service?.variants.find((v) => v.id === variantId) ?? null,
    [service, variantId],
  );

  const isPerM2 = variant?.id === "XL"; // tapis très grand
  const result = useMemo(() => {
    if (!service || !variant) return null;
    const optionsTotal = service.options
      ? service.options
          .filter((o) => activeOptions.has(o.id))
          .reduce((sum, o) => sum + o.price, 0)
      : 0;
    return {
      service,
      variant,
      base: variant.price,
      optionsTotal,
      total: variant.price + optionsTotal,
      selectedOptions:
        service.options?.filter((o) => activeOptions.has(o.id)) ?? [],
    };
  }, [service, variant, activeOptions]);

  function selectService(id: ServiceId) {
    setServiceId(id);
    setVariantId(null);
    setActiveOptions(new Set());
  }

  function toggleOption(id: string) {
    setActiveOptions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const waHref = result
    ? waLink(
        buildWhatsappMessage(
          result.service.name,
          result.variant.label,
          result.selectedOptions.map((o) => o.label),
          result.total,
          isPerM2,
        ),
      )
    : null;

  return (
    <section
      id="calculateur"
      className="relative overflow-hidden py-14 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-amber-500/15 blur-2xl sm:blur-3xl" />
      </div>

      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Calculateur de prix Maison
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Combien ça va coûter pour votre intérieur ?
          </h2>
          <p className="mt-4 text-white/70">
            Choisissez votre prestation, votre taille et les options. Le devis
            s'affiche en 2 secondes — sans inscription. Aucun frais caché.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 sm:p-8">
          {/* Étape 1 — Prestation */}
          <div>
            <Step number={1} title="Quelle prestation ?" active />
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SERVICES.map((s) => {
                const active = serviceId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => selectService(s.id)}
                    className={`group relative flex h-full flex-col items-start gap-1 rounded-2xl border px-3 py-3 text-left transition ${
                      active
                        ? "border-amber-400/60 bg-amber-500/15 shadow-glow-amber"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <span
                      className={`text-sm font-semibold ${
                        active ? "text-white" : "text-white/85"
                      }`}
                    >
                      {s.name}
                    </span>
                    {active && (
                      <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-amber-400 text-[9px] text-ink-950">
                        <CheckIcon size={10} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Étape 2 — Variante (taille / nombre) */}
          <div className="mt-6">
            <Step number={2} title="Taille / quantité" active={!!service} />
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(service?.variants ?? []).map((v) => {
                const active = variantId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    disabled={!service}
                    className={`relative flex items-start gap-3 rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      active
                        ? "border-amber-400/60 bg-amber-500/15 shadow-glow-amber"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            active ? "text-white" : "text-white/90"
                          }`}
                        >
                          {v.label}
                        </span>
                        <span className="shrink-0 text-sm font-bold text-amber-300">
                          {v.id === "XL" ? `${v.price} €/m²` : `${v.price} €`}
                        </span>
                      </span>
                    </span>
                    {active && (
                      <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-amber-400 text-[9px] text-ink-950">
                        <CheckIcon size={10} />
                      </span>
                    )}
                  </button>
                );
              })}
              {!service && (
                <p className="col-span-full rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-3 py-3 text-center text-xs text-white/45">
                  Choisissez d'abord une prestation
                </p>
              )}
            </div>
          </div>

          {/* Étape 3 — Options */}
          {service && service.options && service.options.length > 0 && (
            <div className="mt-6">
              <Step number={3} title="Options (facultatif)" active={!!variant} />
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {service.options.map((o) => {
                  const active = activeOptions.has(o.id);
                  return (
                    <button
                      key={o.id}
                      onClick={() => toggleOption(o.id)}
                      disabled={!variant}
                      className={`relative flex items-start gap-3 rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        active
                          ? "border-amber-400/60 bg-amber-500/15"
                          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                          active
                            ? "border-amber-400 bg-amber-400 text-ink-950"
                            : "border-white/20 bg-white/5"
                        }`}
                      >
                        {active ? <CheckIcon size={11} /> : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-white/90">
                          {o.label}
                        </span>
                        <span className="ml-1 text-xs font-bold text-amber-300">
                          + {o.price} €
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Résultat */}
          <div className="mt-6">
            {result ? (
              <div className="overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/15 via-ink-800 to-ink-900 p-5 sm:p-7">
                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                      Votre devis
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      {result.service.emoji} {result.service.name} ·{" "}
                      {result.variant.label}
                    </p>
                    <p className="mt-2 flex items-baseline gap-2">
                      <span className="h-display text-4xl font-extrabold text-white sm:text-5xl">
                        {result.total} €{isPerM2 ? "/m²" : ""}
                      </span>
                    </p>
                    <p className="mt-2 text-xs text-white/55">
                      {result.base} €{isPerM2 ? "/m²" : ""}
                      {result.optionsTotal > 0
                        ? ` + ${result.optionsTotal} € d'options`
                        : ""}
                      {" · paiement sur place"}
                    </p>
                    {result.selectedOptions.length > 0 && (
                      <ul className="mt-3 space-y-0.5 text-[11px] text-white/55">
                        {result.selectedOptions.map((o) => (
                          <li key={o.id}>+ {o.label}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <a
                    href={waHref!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa h-14 w-full px-6 text-base sm:h-12 sm:w-auto"
                  >
                    <WhatsAppIcon size={18} />
                    Réserver à {result.total} €{isPerM2 ? "/m²" : ""}
                  </a>
                </div>
                <p className="mt-4 border-t border-white/10 pt-3 text-[11px] text-white/45">
                  Prix indicatif sur textile en état standard. Pour un état très
                  sale ou des taches importantes, on confirme le tarif final
                  avant intervention (jamais de surcoût surprise sur place).
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-sm text-white/55">
                {!service
                  ? "Choisissez d'abord votre prestation"
                  : "Choisissez maintenant la taille / quantité"}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  number,
  title,
  active,
}: {
  number: number;
  title: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${
          active ? "bg-amber-400 text-ink-950" : "bg-white/10 text-white/55"
        }`}
      >
        {number}
      </span>
      <h3 className="h-display text-base font-semibold text-white">{title}</h3>
    </div>
  );
}

function buildWhatsappMessage(
  serviceName: string,
  variantLabel: string,
  options: string[],
  total: number,
  isPerM2: boolean,
): string {
  const optionsText =
    options.length > 0 ? ` Options : ${options.join(", ")}.` : "";
  const totalText = isPerM2 ? `${total} €/m²` : `${total} €`;
  return `Bonjour StrasClean 👋 Je voudrais réserver ${serviceName.toLowerCase()} — ${variantLabel.toLowerCase()} (devis ${totalText}).${optionsText} Je suis à [ville/quartier]. Quels sont vos prochains créneaux ?`;
}

/** Bouton intermédiaire éventuel — utilisé par le hero du hub pour mener
 *  au calculateur via une ancre. */
export { SparklesIcon };
