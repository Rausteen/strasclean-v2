"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Chargement lazy du calculateur Maison (~20 kB gzippé) — déclenché à
// l'approche du viewport via IntersectionObserver. Rend ~20 kB invisibles
// au First Load JS sur les 56 pages Maison qui utilisent le calculateur.
const MaisonPriceCalculator = dynamic(
  () => import("./MaisonPriceCalculator"),
  { ssr: false },
);

export default function MaisonPriceCalculatorLazy() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[600px]" aria-hidden={!visible}>
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
