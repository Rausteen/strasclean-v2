"use client";

import {
  Children,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  children: ReactNode;
  /** Couleur du dot actif — défaut "brand" (vert auto), "amber" pour Maison */
  accent?: "brand" | "amber";
  /** Nombre de colonnes en desktop (lg+) — défaut 3 (auto formules) */
  desktopCols?: 3 | 4;
};

/**
 * Carrousel mobile (md-) → grille desktop (md+).
 *
 * Sur mobile :
 *  - scroll horizontal snap (CSS natif, momentum iOS/Android)
 *  - peek volontaire de la card suivante (80vw)
 *  - padding vertical large dans le conteneur pour que badges + ombres
 *    ne soient jamais rognés (overflow x clippe aussi y en CSS)
 *  - pagination dots cliquables qui suivent la position
 *  - wiggle d'invitation au premier affichage (scroll 60px puis retour)
 *    pour signaler immédiatement qu'on peut swiper.
 *
 * Sur md+ : grille standard 2 → 3 colonnes.
 */
export default function PlansCarousel({
  children,
  accent = "brand",
  desktopCols = 3,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const slides = Children.toArray(children);
  const count = slides.length;
  const activeDotColor =
    accent === "amber" ? "bg-amber-400" : "bg-brand-400";
  const desktopColsClass =
    desktopCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  // Suivi de la position pour mettre à jour les dots
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const items = el.querySelectorAll<HTMLElement>("[data-snap-item]");
      if (items.length === 0) return;
      const scrollCenter = el.scrollLeft + el.clientWidth / 2;
      let nearest = 0;
      let minDist = Infinity;
      items.forEach((item, i) => {
        const center = item.offsetLeft + item.clientWidth / 2;
        const dist = Math.abs(center - scrollCenter);
        if (dist < minDist) {
          minDist = dist;
          nearest = i;
        }
      });
      setActiveIdx(nearest);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Wiggle d'invitation au premier affichage
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Desktop : pas de wiggle, c'est déjà une grille
    if (window.innerWidth >= 768) return;
    // Respecter prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = scrollRef.current;
    if (!el) return;

    let fired = false;
    let userInteracted = false;
    const markInteraction = () => {
      userInteracted = true;
    };
    el.addEventListener("touchstart", markInteraction, { once: true, passive: true });
    el.addEventListener("scroll", markInteraction, { once: true, passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        if (fired || userInteracted) return;
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          fired = true;
          observer.disconnect();
          // Petit délai pour laisser la page se poser
          setTimeout(() => {
            if (userInteracted) return;
            el.scrollTo({ left: 80, behavior: "smooth" });
            setTimeout(() => {
              if (userInteracted) return;
              el.scrollTo({ left: 0, behavior: "smooth" });
            }, 600);
          }, 700);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      el.removeEventListener("touchstart", markInteraction);
      el.removeEventListener("scroll", markInteraction);
    };
  }, []);

  function goTo(idx: number) {
    const el = scrollRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-snap-item]");
    const target = items[idx];
    if (!target) return;
    // -16 px pour compenser le padding-left du conteneur de scroll
    el.scrollTo({ left: target.offsetLeft - 16, behavior: "smooth" });
  }

  return (
    <div>
      {/* Conteneur scroll (mobile) / grid (desktop)
          NB : pt-6 + pb-12 absorbent le débordement vertical des badges
          et des ombres (le navigateur clippe l'axe Y dès que X est en auto). */}
      <div
        ref={scrollRef}
        className={`
          -mx-4 flex gap-4 overflow-x-auto px-4 pt-6 pb-12
          snap-x snap-mandatory scroll-px-4 scroll-smooth scrollbar-hide
          md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible
          md:px-0 md:pt-0 md:pb-0 md:snap-none
          ${desktopColsClass}
        `}
        aria-roledescription="carousel"
      >
        {slides.map((child, i) => (
          <div
            key={i}
            data-snap-item
            className="
              w-[80vw] max-w-sm shrink-0 snap-start
              md:w-auto md:max-w-none md:shrink
            "
            aria-roledescription="slide"
            aria-label={`Formule ${i + 1} sur ${count}`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Pagination dots — mobile uniquement */}
      <div
        className="mt-1 flex items-center justify-center gap-2 md:hidden"
        role="tablist"
        aria-label="Sélection de formule"
      >
        {slides.map((_, i) => {
          const isActive = activeIdx === i;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Voir la formule ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 active:scale-95 ${
                isActive
                  ? `w-7 ${activeDotColor}`
                  : "w-2 bg-white/25 hover:bg-white/40"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
