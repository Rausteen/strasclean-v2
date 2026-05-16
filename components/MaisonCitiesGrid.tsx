import Link from "next/link";
import Reveal from "./Reveal";
import { CITIES } from "@/lib/cities";
import { HOME_SERVICES, homeServiceCityPath } from "@/lib/homeServices";
import { MapPinIcon, ArrowRightIcon } from "./Icon";

/**
 * Liste compacte des communes Maison desservies.
 *
 * Version 2 (post-feedback) : on est passé d'une grille de 12 cards avec
 * 4 services + tarifs par card (48 liens, très répétitif vu les autres
 * sections du site) à une grille de 12 cards minimales avec un seul lien
 * par commune vers le service le plus populaire (canapé). L'utilisateur
 * arrive sur la page service × ville et peut explorer les autres services
 * via la MaisonServicesGrid déjà présente sur cette page.
 */
export default function MaisonCitiesGrid() {
  // Service le plus populaire = canapé (1er HOME_SERVICES). Sert de point
  // d'atterrissage par défaut pour chaque commune.
  const featuredService = HOME_SERVICES[0];

  return (
    <section
      id="communes"
      className="relative overflow-hidden py-14 sm:py-20"
    >
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Dans votre commune
          </p>
          <h2 className="h-display mt-3 text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            12 communes desservies à domicile.
          </h2>
          <p className="mt-3 text-[15px] text-white/65">
            Cliquez sur votre ville pour voir nos prestations et tarifs sur
            place. Déplacement inclus dans chaque tarif annoncé.
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-5xl gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {CITIES.map((city, i) => (
            <Reveal key={city.slug} delay={i * 30}>
              <Link
                href={homeServiceCityPath(featuredService, city)}
                prefetch={false}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-amber-500/[0.06]"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <MapPinIcon
                    size={14}
                    className="shrink-0 text-amber-400"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white">
                      {city.name}
                    </span>
                    <span className="block truncate text-[11px] text-white/50">
                      {city.postalCodes[0]} · {city.distanceKm} km
                    </span>
                  </span>
                </span>
                <ArrowRightIcon
                  size={14}
                  className="shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-amber-300"
                />
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 text-center text-xs text-white/45">
            Votre commune n'est pas listée ? Contactez-nous, on s'adapte aux
            alentours.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
