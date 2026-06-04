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
  /** Prix par défaut (utilisé si pas de priceByVariant correspondant) */
  price: number;
  /** Tarification spécifique au variant choisi.
   *  Ex pour le cuir sur chaises : varie selon lot (4/6/8) car le coût
   *  produit + temps scale avec le nombre de pièces. */
  priceByVariant?: Record<string, number>;
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
      { id: "fauteuil", label: "Fauteuil 1 place", price: 39 },
      { id: "lot-4", label: "Lot de 4 chaises", price: 49 },
      { id: "lot-6", label: "Lot de 6 chaises", price: 69 },
      { id: "lot-8", label: "Lot de 8 chaises", price: 89 },
    ],
    options: [
      {
        id: "cuir",
        label: "Cuir (pH-neutre + nutrition)",
        price: 10, // fallback (fauteuil)
        priceByVariant: {
          "fauteuil": 10,
          "lot-4": 15,
          "lot-6": 20,
          "lot-8": 25,
        },
        note: "Tarif selon taille du lot",
      },
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

  /** Retourne le prix d'une option pour le variant sélectionné. Si l'option
   *  définit un priceByVariant pour le variant courant, on l'utilise ;
   *  sinon, fallback sur le prix par défaut. */
  function resolveOptionPrice(o: Option, v: Variant): number {
    return o.priceByVariant?.[v.id] ?? o.price;
  }

  const result = useMemo(() => {
    if (!service || !variant) return null;
    const selectedOptions =
      service.options?.filter((o) => activeOptions.has(o.id)) ?? [];
    const optionsTotal = selectedOptions.reduce(
      (sum, o) => sum + resolveOptionPrice(o, variant),
      0,
    );
    // On enrichit chaque option sélectionnée avec son prix résolu pour
    // l'affichage du détail dans le devis WhatsApp.
    const selectedOptionsWithPrice = selectedOptions.map((o) => ({
      ...o,
      resolvedPrice: resolveOptionPrice(o, variant),
    }));
    return {
      service,
      variant,
      base: variant.price,
      optionsTotal,
      total: variant.price + optionsTotal,
      selectedOptions: selectedOptionsWithPrice,
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
          result.selectedOptions.map(
            (o) => `${o.label} (+${o.resolvedPrice} €)`,
          ),
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
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
            Calculateur de prix Maison
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Combien ça va coûter pour votre intérieur ?
          </h2>
          <p className="mt-4 text-slate-600">
            Choisissez votre prestation, votre taille et les options. Le devis
            s'affiche en 2 secondes — sans inscription. Aucun frais caché.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-slate-200 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 sm:p-8">
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
                        : "border-slate-200 bg-slate-50 hover:border-white/25 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <span
                      className={`text-sm font-semibold ${
                        active ? "text-slate-900" : "text-slate-800"
                      }`}
                    >
                      {s.name}
                    </span>
                    {active && (
                      <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-amber-400 text-[9px] text-slate-900">
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
                        : "border-slate-200 bg-slate-50 hover:border-white/25 hover:bg-slate-100"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            active ? "text-slate-900" : "text-slate-800"
                          }`}
                        >
                          {v.label}
                        </span>
                        <span className="shrink-0 text-sm font-bold text-amber-600">
                          {v.id === "XL" ? `${v.price} €/m²` : `${v.price} €`}
                        </span>
                      </span>
                    </span>
                    {active && (
                      <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-amber-400 text-[9px] text-slate-900">
                        <CheckIcon size={10} />
                      </span>
                    )}
                  </button>
                );
              })}
              {!service && (
                <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-center text-xs text-slate-400">
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
                  // Prix affiché : résolu pour le variant sélectionné si dispo,
                  // sinon prix par défaut (utile avant que l'utilisateur ait
                  // choisi son variant).
                  const displayedPrice = variant
                    ? resolveOptionPrice(o, variant)
                    : o.price;
                  return (
                    <button
                      key={o.id}
                      onClick={() => toggleOption(o.id)}
                      disabled={!variant}
                      className={`relative flex items-start gap-3 rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        active
                          ? "border-amber-400/60 bg-amber-500/15"
                          : "border-slate-200 bg-slate-50 hover:border-white/25 hover:bg-slate-100"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                          active
                            ? "border-amber-400 bg-amber-400 text-slate-900"
                            : "border-slate-300 bg-slate-50"
                        }`}
                      >
                        {active ? <CheckIcon size={11} /> : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-slate-800">
                          {o.label}
                        </span>
                        <span className="ml-1 text-xs font-bold text-amber-600">
                          + {displayedPrice} €
                        </span>
                        {o.note && (
                          <span className="mt-0.5 block text-[11px] text-slate-400">
                            {o.note}
                          </span>
                        )}
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
              <div className="overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/15 via-slate-100 to-slate-50 p-5 sm:p-7">
                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
                      Votre devis
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {result.service.emoji} {result.service.name} ·{" "}
                      {result.variant.label}
                    </p>
                    <p className="mt-2 flex items-baseline gap-2">
                      <span className="h-display text-4xl font-extrabold text-slate-900 sm:text-5xl">
                        {result.total} €{isPerM2 ? "/m²" : ""}
                      </span>
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      {result.base} €{isPerM2 ? "/m²" : ""}
                      {result.optionsTotal > 0
                        ? ` + ${result.optionsTotal} € d'options`
                        : ""}
                      {" · paiement sur place"}
                    </p>
                    {result.selectedOptions.length > 0 && (
                      <ul className="mt-3 space-y-0.5 text-[11px] text-slate-600">
                        {result.selectedOptions.map((o) => (
                          <li key={o.id}>
                            + {o.label}{" "}
                            <span className="text-amber-600">
                              ({o.resolvedPrice} €)
                            </span>
                          </li>
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
                <p className="mt-4 border-t border-slate-200 pt-3 text-[11px] text-slate-400">
                  Prix indicatif sur textile en état standard. Pour un état très
                  sale ou des taches importantes, on confirme le tarif final
                  avant intervention (jamais de surcoût surprise sur place).
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
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
          active ? "bg-amber-400 text-slate-900" : "bg-slate-100 text-slate-600"
        }`}
      >
        {number}
      </span>
      <h3 className="h-display text-base font-semibold text-slate-900">{title}</h3>
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
  // Message court (< 140 chars idéalement) — sur mobile WA, les longues
  // phrases passent à la ligne et paraissent spammy.
  const totalText = isPerM2 ? `${total} €/m²` : `${total} €`;
  // On garde juste le nom court de chaque option (ex: "Cuir", "Anti-acariens")
  // pour que l'admin sache quoi préparer sans surcharger le message.
  const optionsText =
    options.length > 0 ? ` + ${shortenOptions(options).join(", ")}` : "";
  return `Bonjour StrasClean 👋 Devis ${variantLabel.toLowerCase()} — ${totalText}${optionsText}. Je suis à [ville/quartier]. Vos prochains créneaux ?`;
}

/** Raccourcit les labels d'options pour le message WA :
 *  "Cuir (pH-neutre + nutrition) (+15 €)" → "Cuir"
 *  "Anti-acariens renforcé" → "Anti-acariens" */
function shortenOptions(labels: string[]): string[] {
  return labels.map((l) => {
    // Retire la parenthèse explicative + le prix entre parenthèses
    const withoutParen = l.replace(/\s*\([^)]*\)/g, "").trim();
    // Garde max 2 mots clés (ex: "Anti-acariens renforcé" → "Anti-acariens")
    const words = withoutParen.split(/\s+/);
    return words.slice(0, 2).join(" ");
  });
}

/** Bouton intermédiaire éventuel — utilisé par le hero du hub pour mener
 *  au calculateur via une ancre. */
export { SparklesIcon };
