"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

// ─────────────────────────────────────────────────────────────────────────
//  BeforeAfter — onglets Sièges / Tapis / Tableau / Carrosserie
//
//  Perf : toutes les paires sont rendues dans le DOM (4 stages empilés
//  en absolute), seul l'actif est visible (opacity-100 vs opacity-0).
//  → toutes les images se téléchargent au mount, le swap d'onglet est
//  instantané (pas de re-fetch).
// ─────────────────────────────────────────────────────────────────────────

export type BeforeAfterPair = {
  id: string;
  label: string;
  description: string;
  before: { src: string | null; alt: string; tone: "before" };
  after: { src: string | null; alt: string; tone: "after" };
};

export default function BeforeAfterClient({
  pairs,
}: {
  pairs: BeforeAfterPair[];
}) {
  const [active, setActive] = useState(pairs[0]?.id);

  return (
    <section
      id="avant-apres"
      className="relative bg-slate-100 py-16 sm:py-24"
    >
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.18em] text-brand-700 before:h-px before:w-6 before:bg-brand-500 before:opacity-80 before:content-['']">
            Avant / Après
          </p>
          <h2 className="h-display mt-3.5 text-balance text-[clamp(28px,7vw,46px)] font-bold leading-[1.05] tracking-[-0.02em] text-slate-900">
            La différence se voit. Et se sent.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-slate-600 sm:text-[18px]">
            Quelques transformations réalisées à domicile à Strasbourg. Choisissez
            la zone pour voir le rendu.
          </p>
        </Reveal>

        {/* Onglets */}
        <div
          role="tablist"
          aria-label="Catégories avant / après"
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {pairs.map((p) => {
            const isActive = p.id === active;
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(p.id)}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Stage : toutes les paires empilées, seule l'active est visible.
            Les images sont chargées toutes en eager au mount → swap d'onglet
            instantané (pas de download au clic). */}
        <div className="relative mx-auto mt-8 max-w-5xl">
          {/* Spacer qui définit la hauteur (la 1re paire en aspect-[4/3]
              maintient la dimension ; les autres absolute sont superposées) */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="aspect-[4/3]" aria-hidden />
            <div className="aspect-[4/3]" aria-hidden />
          </div>

          {pairs.map((p, i) => {
            const isActive = p.id === active;
            return (
              <div
                key={p.id}
                role="tabpanel"
                aria-hidden={!isActive}
                className={`absolute inset-0 grid gap-4 transition-opacity duration-300 sm:grid-cols-2 ${
                  isActive
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <Tile
                  label="Avant"
                  tone="before"
                  src={p.before.src}
                  alt={p.before.alt}
                  priority={i === 0}
                />
                <Tile
                  label="Après"
                  tone="after"
                  src={p.after.src}
                  alt={p.after.alt}
                  priority={i === 0}
                />
              </div>
            );
          })}
        </div>

        {/* Description : suit l'onglet actif */}
        <div className="relative mx-auto mt-6 min-h-[3rem] max-w-2xl text-center">
          {pairs.map((p) => (
            <p
              key={p.id}
              aria-hidden={p.id !== active}
              className={`absolute inset-x-0 text-sm text-slate-600 transition-opacity duration-300 ${
                p.id === active ? "opacity-100" : "opacity-0"
              }`}
            >
              {p.description}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({
  label,
  tone,
  src,
  alt,
  priority,
}: {
  label: string;
  tone: "before" | "after";
  src: string | null;
  alt: string;
  /** True pour la 1re paire — préchargée immédiatement.
   *  Les autres sont chargées en eager (pas lazy) pour éviter le délai
   *  au tab switch, sans bloquer le LCP. */
  priority?: boolean;
}) {
  const isAfter = tone === "after";
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-soft">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          // eager sur toutes (sauf priority dédié à la 1re) pour que le
          // navigateur cache les 8 images dès le mount → swap onglet instant
          loading={priority ? undefined : "eager"}
          priority={priority}
          sizes="(max-width: 768px) 92vw, 480px"
          quality={82}
          className="object-cover"
        />
      ) : isAfter ? (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-slate-50 to-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.18),transparent_55%)]" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.35),transparent_55%)]" />
        </div>
      )}

      {src && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />
      )}

      <span
        className={`absolute left-3.5 top-3.5 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] ${
          isAfter ? "bg-brand-500 text-[#062b1e]" : "bg-[rgba(21,25,15,0.8)] text-white"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
