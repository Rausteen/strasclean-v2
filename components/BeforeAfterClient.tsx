"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

// ─────────────────────────────────────────────────────────────────────────
//  BeforeAfter — onglets Sièges / Tapis / Tableau / Carrosserie
//
//  Comportement maquette : 4 onglets, un seul "avant + après" affiché à la
//  fois. Quand on clique un autre onglet, swap immédiat.
//
//  Les chemins d'image sont résolus côté serveur (au build) puis passés
//  en props. Le composant ne fait que la logique d'onglet côté client.
//
//  Workflow upload photos sur le VPS :
//    /public/avant-apres/siegeavant.webp + siegeapres.webp
//    /public/avant-apres/tapisavant.webp + tapisapres.webp
//    /public/avant-apres/tableauavant.webp + tableauapres.webp
//    /public/avant-apres/carrosserieavant.webp + carrosserieapres.webp
//
//  Si une photo manque, un placeholder gradient prend le relais.
// ─────────────────────────────────────────────────────────────────────────

export type BeforeAfterPair = {
  id: string;
  label: string; // affiché sur l'onglet
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
  const current = pairs.find((p) => p.id === active) ?? pairs[0];

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

        {/* Scène avant / après */}
        {current && (
          <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 sm:gap-4">
            <Tile
              label="Avant"
              tone="before"
              src={current.before.src}
              alt={current.before.alt}
            />
            <Tile
              label="Après"
              tone="after"
              src={current.after.src}
              alt={current.after.alt}
            />
          </div>
        )}

        {current?.description && (
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-slate-600">
            {current.description}
          </p>
        )}
      </div>
    </section>
  );
}

function Tile({
  label,
  tone,
  src,
  alt,
}: {
  label: string;
  tone: "before" | "after";
  src: string | null;
  alt: string;
}) {
  const isAfter = tone === "after";
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-soft">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
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

      {/* Overlay foncé en haut pour les labels lisibles sur n'importe quelle photo */}
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
