"use client";

import { useMemo, useState } from "react";
import { waLink } from "@/lib/site";
import { WhatsAppIcon, CarIcon, SparklesIcon, CheckIcon } from "./Icon";

// ─── Données — sync avec lib/plans.ts et lib/services.ts ──────────────────

type VehicleId = "citadine" | "berline" | "suv" | "utilitaire";
type FormulaId = "confort" | "premium" | "luxury" | "exterieur";

const VEHICLES: {
  id: VehicleId;
  name: string;
  examples: string;
  surcharge: number;
}[] = [
  { id: "citadine", name: "Citadine", examples: "Clio, 208, Polo, Yaris…", surcharge: 0 },
  { id: "berline", name: "Berline", examples: "Mégane, 308, A3, Série 1…", surcharge: 10 },
  { id: "suv", name: "SUV", examples: "3008, Tucson, Q3, X1…", surcharge: 20 },
  { id: "utilitaire", name: "Utilitaire", examples: "Kangoo, Trafic, Master…", surcharge: 30 },
];

const FORMULAS: {
  id: FormulaId;
  name: string;
  desc: string;
  basePrice: number;
  duration: string;
  popular?: boolean;
}[] = [
  {
    id: "confort",
    name: "Confort",
    desc: "Entretien rapide — aspiration profonde + intérieur",
    basePrice: 39,
    duration: "30-50 min",
  },
  {
    id: "premium",
    name: "Premium",
    desc: "Nettoyage complet + shampouinage sièges (le plus populaire)",
    basePrice: 79,
    duration: "45 min - 1h30",
    popular: true,
  },
  {
    id: "luxury",
    name: "Luxury Detailing",
    desc: "Intérieur + extérieur main + finition showroom",
    basePrice: 119,
    duration: "2h - 2h30",
  },
  {
    id: "exterieur",
    name: "Lavage extérieur seul",
    desc: "Lavage main carrosserie + vitres + jantes",
    basePrice: 29,
    duration: "20-30 min",
  },
];

export default function PriceCalculator() {
  const [vehicle, setVehicle] = useState<VehicleId | null>(null);
  const [formula, setFormula] = useState<FormulaId | null>(null);

  const result = useMemo(() => {
    if (!vehicle || !formula) return null;
    const v = VEHICLES.find((x) => x.id === vehicle)!;
    const f = FORMULAS.find((x) => x.id === formula)!;
    const total = f.basePrice + v.surcharge;
    return { v, f, total };
  }, [vehicle, formula]);

  const waHref = result
    ? waLink(
        `Bonjour StrasClean 👋 Je voudrais réserver la formule ${result.f.name} pour ma ${result.v.name.toLowerCase()} — devis ${result.total} €. Quels sont vos prochains créneaux ?`,
      )
    : null;

  return (
    <section
      id="calculateur"
      className="relative overflow-hidden py-16 sm:py-24"
    >
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 before:h-px before:w-6 before:bg-brand-500 before:opacity-70 before:content-['']">
            Calculateur de prix
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Combien ça va coûter pour votre voiture ?
          </h2>
          <p className="mt-4 text-slate-600">
            Choisissez votre véhicule et votre formule. Votre devis s'affiche en
            2 secondes, sans inscription. Aucun frais caché — le prix annoncé
            est le prix payé.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-slate-200 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 sm:p-8">
          {/* Étape 1 — Véhicule */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-500 text-[11px] font-bold text-slate-900">
                1
              </span>
              <h3 className="h-display text-base font-semibold text-slate-900">
                Votre type de véhicule
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {VEHICLES.map((v) => {
                const active = vehicle === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setVehicle(v.id)}
                    className={`group relative flex h-full flex-col items-start gap-1 rounded-2xl border px-3 py-3 text-left transition ${
                      active
                        ? "border-brand-400/60 bg-brand-500/15 shadow-glow"
                        : "border-slate-200 bg-slate-50 hover:border-white/25 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <CarIcon
                        size={14}
                        className={active ? "text-brand-600" : "text-slate-500"}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          active ? "text-slate-900" : "text-slate-800"
                        }`}
                      >
                        {v.name}
                      </span>
                    </span>
                    <span className="text-[11px] leading-snug text-slate-600">
                      {v.examples}
                    </span>
                    {v.surcharge > 0 && (
                      <span className="mt-1 inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        +{v.surcharge} €
                      </span>
                    )}
                    {active && (
                      <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-brand-500 text-[9px] text-slate-900">
                        <CheckIcon size={10} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Étape 2 — Formule */}
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${
                  vehicle
                    ? "bg-brand-500 text-slate-900"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                2
              </span>
              <h3 className="h-display text-base font-semibold text-slate-900">
                Votre formule
              </h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {FORMULAS.map((f) => {
                const active = formula === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFormula(f.id)}
                    disabled={!vehicle}
                    className={`group relative flex h-full items-start gap-3 rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      active
                        ? "border-brand-400/60 bg-brand-500/15 shadow-glow"
                        : "border-slate-200 bg-slate-50 hover:border-white/25 hover:bg-slate-100"
                    }`}
                  >
                    {f.popular && (
                      <span className="absolute -top-2 left-3 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-900">
                        Le + populaire
                      </span>
                    )}
                    <span
                      className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                        active
                          ? "bg-brand-500/30 text-brand-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <SparklesIcon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            active ? "text-slate-900" : "text-slate-800"
                          }`}
                        >
                          {f.name}
                        </span>
                        <span className="shrink-0 text-sm font-bold text-brand-600">
                          dès {f.basePrice} €
                        </span>
                      </span>
                      <span className="mt-1 block text-xs leading-snug text-slate-600">
                        {f.desc}
                      </span>
                      <span className="mt-1.5 inline-block text-[11px] text-slate-400">
                        Durée : {f.duration}
                      </span>
                    </span>
                    {active && (
                      <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-brand-500 text-[9px] text-slate-900">
                        <CheckIcon size={10} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Résultat */}
          <div className="mt-6">
            {result ? (
              <div className="overflow-hidden rounded-2xl border border-brand-400/40 bg-gradient-to-br from-brand-500/15 via-slate-100 to-slate-50 p-5 sm:p-7">
                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                      Votre devis
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Formule {result.f.name} · {result.v.name}
                    </p>
                    <p className="mt-2 flex items-baseline gap-2">
                      <span className="h-display text-4xl font-extrabold text-slate-900 sm:text-5xl">
                        {result.total} €
                      </span>
                      <span className="text-xs text-slate-600">
                        ({result.f.basePrice} €
                        {result.v.surcharge > 0 ? ` + ${result.v.surcharge} € ${result.v.name.toLowerCase()}` : ""})
                      </span>
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      Durée estimée : {result.f.duration} · Paiement sur place
                    </p>
                  </div>
                  <a
                    href={waHref!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa h-14 w-full px-6 text-base sm:h-12 sm:w-auto"
                  >
                    <WhatsAppIcon size={18} />
                    Réserver à {result.total} €
                  </a>
                </div>
                <p className="mt-4 border-t border-slate-200 pt-3 text-[11px] text-slate-400">
                  Prix indicatif sur véhicule en état standard. Pour un état très
                  sale, taches importantes ou odeurs persistantes, on confirme le
                  tarif final avant intervention (jamais de surcoût surprise sur
                  place).
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
                {!vehicle
                  ? "Choisissez d'abord votre type de véhicule"
                  : "Choisissez maintenant votre formule"}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
