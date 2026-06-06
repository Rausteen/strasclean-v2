"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Chargement lazy du calculateur Auto : le code (~15 kB gzippé) reste dans un
// chunk séparé (dynamic import), il n'alourdit pas le First Load JS.
const PriceCalculator = dynamic(() => import("./PriceCalculator"), {
  ssr: false,
});

export default function PriceCalculatorLazy() {
  const [visible, setVisible] = useState(false);

  // On monte le calculateur dès que le navigateur est disponible (idle),
  // juste après le 1er paint — et NON à l'approche du viewport en scrollant.
  // Raison : monté pendant le scroll, il passait du skeleton à sa vraie
  // hauteur en plein défilement et poussait les sections du bas (avis, faq)
  // → les ancres du menu tombaient à côté. En le montant tôt, sa hauteur est
  // figée avant tout clic du menu. Le réajustement de hauteur a lieu hors
  // écran (le calculateur est loin sous la ligne de flottaison), donc
  // invisible pour l'utilisateur.
  useEffect(() => {
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setVisible(true));
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setVisible(true), 200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[600px]" aria-hidden={!visible}>
      {visible ? <PriceCalculator /> : <CalculatorSkeleton variant="brand" />}
    </div>
  );
}

/** Skeleton minimal et leger reprenant la silhouette du calculateur. */
function CalculatorSkeleton({ variant }: { variant: "brand" | "amber" }) {
  const accentText =
    variant === "amber" ? "text-amber-600" : "text-brand-600";
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className={`text-sm font-semibold uppercase tracking-[0.18em] ${accentText}`}
          >
            Calculateur de prix
          </p>
          <div className="mx-auto mt-3 h-10 w-3/4 animate-pulse rounded-lg bg-slate-100 sm:h-12 lg:h-14" />
          <div className="mx-auto mt-4 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-8">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
          <div className="mt-6 h-5 w-40 animate-pulse rounded bg-slate-100" />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
