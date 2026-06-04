"use client";

import { useState } from "react";
import Link from "next/link";
import { CITIES } from "@/lib/cities";
import { HOME_SERVICES, homeServiceCityPath } from "@/lib/homeServices";
import { MapPinIcon, ArrowRightIcon } from "./Icon";

/**
 * Carte "Zone d'intervention" Maison.
 *
 * Ergonomie : l'utilisateur choisit d'abord son service (canapé / tapis /
 * matelas / fauteuils) via le picker en haut, puis tape sa commune. Les
 * 12 tuiles villes pointent dynamiquement vers la page service × ville
 * correspondante. Évite de multiplier 48 liens dans la grille (très
 * répétitif) tout en gardant chaque commune cliquable.
 */
export default function MaisonCityServicePicker() {
  const [serviceSlug, setServiceSlug] = useState(HOME_SERVICES[0].slug);
  const service =
    HOME_SERVICES.find((s) => s.slug === serviceSlug) ?? HOME_SERVICES[0];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 p-7 sm:p-9">
      <div className="absolute inset-0 -z-10 bg-grid-light bg-[size:36px_36px] opacity-[0.25]" />
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-amber-500/15 blur-2xl sm:blur-3xl" />

      <h3 className="h-display text-xl font-semibold text-slate-900">
        12 communes desservies
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Choisissez votre prestation puis tapez sur votre commune.
      </p>

      {/* Service picker — 4 pills, default = canapé */}
      <div
        role="tablist"
        aria-label="Type de prestation"
        className="mt-5 flex flex-wrap gap-1.5"
      >
        {HOME_SERVICES.map((s) => {
          const active = s.slug === serviceSlug;
          return (
            <button
              key={s.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setServiceSlug(s.slug)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "border-amber-400/60 bg-amber-400 text-slate-900 shadow"
                  : "border-slate-200 bg-slate-100 text-slate-600 hover:border-amber-400/30 hover:text-slate-900"
              }`}
            >
              {s.shortName}
            </button>
          );
        })}
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {CITIES.map((c) => (
          <li key={c.slug}>
            <Link
              href={homeServiceCityPath(service, c)}
              prefetch={false}
              className="group flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 transition hover:border-amber-400/40 hover:bg-amber-500/10 hover:text-slate-900"
            >
              <span className="inline-flex items-center gap-2">
                <MapPinIcon size={14} className="text-amber-600" />
                {c.name}
              </span>
              <ArrowRightIcon
                size={12}
                className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-amber-600"
              />
            </Link>
          </li>
        ))}
        <li className="flex items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
          + alentours
        </li>
      </ul>
    </div>
  );
}
