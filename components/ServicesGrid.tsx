import Link from "next/link";
import Reveal from "./Reveal";
import { City } from "@/lib/cities";
import { SERVICES, servicePath } from "@/lib/services";
import { ArrowRightIcon, ClockIcon } from "./Icon";

/**
 * Grille des prestations — affichée sur la home et les pages ville.
 * Chaque card pointe vers la page service × ville correspondante.
 */
export default function ServicesGrid({ city }: { city: City }) {
  return (
    <section id="services" className="relative py-14 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/3 top-0 h-[400px] w-[700px] rounded-full bg-brand-500/10 blur-3xl" />
      </div>

      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
            Besoins spécifiques
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Vous savez déjà ce qu'il vous faut ?
          </h2>
          <p className="mt-4 text-white/70">
            Au-delà de nos formules complètes, voici nos prestations dédiées
            aux besoins ciblés — un shampouinage seul, un traitement poils
            d'animaux, un detailing complet — avec une page par ville.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={i * 60}>
              <Link
                href={servicePath(s, city)}
                className="group relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-brand-400/40 hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-2xl">
                    {s.emoji}
                  </span>
                  <div className="min-w-0">
                    <h3 className="h-display truncate text-base font-semibold text-white">
                      {s.name}
                    </h3>
                    <p className="mt-0.5 inline-flex items-center gap-2 text-xs text-white/55">
                      <ClockIcon size={12} />
                      {s.duration}
                      <span className="text-white/30">·</span>
                      <span>À partir de {s.priceFrom} €</span>
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-white/70">{s.shortDesc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 group-hover:text-brand-200">
                  Voir cette prestation à {city.name}
                  <ArrowRightIcon size={14} className="transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
