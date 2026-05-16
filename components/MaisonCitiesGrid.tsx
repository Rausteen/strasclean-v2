import Link from "next/link";
import Reveal from "./Reveal";
import { CITIES } from "@/lib/cities";
import { HOME_SERVICES, homeServiceCityPath } from "@/lib/homeServices";
import { MapPinIcon, ArrowRightIcon } from "./Icon";

/**
 * Grille des prestations Maison déclinées par commune.
 * Pour chaque ville desservie, on liste les 4 services Maison avec leur
 * prix d'appel. Améliore le maillage interne (~44 liens internes vers
 * les pages service × ville Maison) et permet au visiteur d'arriver
 * directement sur la page de sa commune.
 */
export default function MaisonCitiesGrid() {
  return (
    <section
      id="communes"
      className="relative overflow-hidden py-14 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 h-[380px] w-[680px] rounded-full bg-amber-500/8 blur-2xl sm:blur-3xl" />
      </div>

      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Dans votre commune
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Nos prestations dans les 12 communes desservies.
          </h2>
          <p className="mt-4 text-white/65">
            StrasClean Maison intervient à domicile à Strasbourg et dans 11
            communes alentours. Cliquez sur votre ville pour voir les
            prestations et tarifs adaptés.
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.map((city, i) => (
            <Reveal key={city.slug} delay={i * 40}>
              <article className="group h-full rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-amber-400/30 hover:bg-amber-500/[0.04]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="h-display text-lg font-semibold text-white">
                      {city.name}
                    </h3>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] text-white/55">
                      <MapPinIcon size={11} className="text-amber-400" />
                      {city.postalCodes[0]} · {city.distanceKm} km
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-1.5 text-sm">
                  {HOME_SERVICES.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={homeServiceCityPath(s, city)}
                        prefetch={false}
                        className="group/link flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition hover:bg-amber-500/[0.06]"
                      >
                        <span className="inline-flex items-center gap-2 truncate text-white/80 group-hover/link:text-white">
                          <span
                            aria-hidden="true"
                            className="text-base leading-none"
                          >
                            {s.emoji}
                          </span>
                          <span className="truncate">{s.shortName}</span>
                        </span>
                        <span className="shrink-0 text-xs font-bold text-amber-300">
                          dès {s.pricing.priceFrom} €
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Lien optionnel vers la page ville Auto (si pertinent) */}
                {city.slug === "strasbourg" && (
                  <p className="mt-3 border-t border-white/5 pt-3 text-[11px] text-white/45">
                    Centre, Robertsau, Krutenau, Neudorf… tous quartiers
                    desservis.
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm text-white/55">
            <ArrowRightIcon size={14} className="text-amber-400" />
            Votre commune n'est pas listée ? Contactez-nous, on s'adapte aux
            communes voisines.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
