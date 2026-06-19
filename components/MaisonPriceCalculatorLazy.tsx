"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Chargement lazy du calculateur Maison (~20 kB gzippé) — chunk séparé
// (dynamic import), n'alourdit pas le First Load JS.
const MaisonPriceCalculator = dynamic(
  () => import("./MaisonPriceCalculator"),
  { ssr: false },
);

export default function MaisonPriceCalculatorLazy() {
  const [visible, setVisible] = useState(false);

  // Monté dès que le navigateur est idle (après le 1er paint), pas à
  // l'approche du viewport : sa vraie hauteur est ainsi figée avant tout
  // clic du menu, ce qui évite que les ancres du bas (avis, faq) tombent à
  // côté à cause du déploiement du calculateur pendant le scroll. Voir
  // PriceCalculatorLazy pour le détail.
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
      {visible ? <MaisonPriceCalculator /> : <MaisonCalculatorSkeleton />}
    </div>
  );
}

function MaisonCalculatorSkeleton() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 before:h-px before:w-6 before:bg-amber-500 before:opacity-70 before:content-['']">
            Calculateur de prix Maison
          </p>
          <div className="mx-auto mt-3 h-10 w-3/4 animate-pulse rounded-lg bg-slate-100 sm:h-12 lg:h-14" />
          <div className="mx-auto mt-4 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-slate-200 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 sm:p-8">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
          <div className="mt-6 h-5 w-32 animate-pulse rounded bg-slate-100" />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
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
