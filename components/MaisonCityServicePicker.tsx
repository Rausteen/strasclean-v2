"use client";

import { useState } from "react";
import Link from "next/link";
import { CITIES } from "@/lib/cities";
import { HOME_SERVICES, homeServiceCityPath } from "@/lib/homeServices";
import { MapPinIcon } from "./Icon";

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
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="h-display text-[19px] font-bold text-slate-900 sm:text-xl">
            12 communes desservies
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Choisissez votre prestation puis tapez sur votre commune.
          </p>
        </div>
      </div>

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
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-bold transition ${
                active
                  ? "border-[#E0A100] bg-[#E0A100] text-[#2a1f00] shadow-sm"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:border-amber-400/30 hover:text-slate-900"
              }`}
            >
              {s.shortName}
            </button>
          );
        })}
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {CITIES.map((c) => (
          <li key={c.slug}>
            <Link
              href={homeServiceCityPath(service, c)}
              prefetch={false}
              className="group flex h-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[14px] font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-amber-50 hover:text-slate-900"
            >
              <span className="inline-flex items-center gap-2">
                <MapPinIcon size={14} className="text-amber-600" />
                {c.name}
              </span>
              <span className="text-slate-400 transition group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </li>
        ))}
        <li className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-[14px] font-medium text-slate-500">
          + alentours
        </li>
      </ul>
    </div>
  );
}
