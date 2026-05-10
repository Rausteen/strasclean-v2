import Link from "next/link";
import Reveal from "./Reveal";
import { CITIES, City, cityPath } from "@/lib/cities";
import { MapPinIcon, ArrowRightIcon } from "./Icon";

export default function OtherCities({ current }: { current?: City }) {
  const others = CITIES.filter((c) => c.slug !== current?.slug);
  return (
    <section className="relative py-14 sm:py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
            Autres villes desservies
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
            Nettoyage voiture à domicile dans toute l'eurométropole.
          </h2>
          <p className="mt-4 text-white/70">
            Trouvez votre commune ci-dessous — chaque page liste les codes
            postaux, les quartiers couverts et les créneaux disponibles.
          </p>
        </Reveal>

        <Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {others.map((c) => (
              <li key={c.slug}>
                <Link
                  href={cityPath(c)}
                  prefetch={false}
                  className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/85 transition hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-brand-500/10 hover:text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPinIcon size={14} className="text-brand-400" />
                    {c.name}
                  </span>
                  <ArrowRightIcon
                    size={14}
                    className="text-white/40 transition group-hover:translate-x-0.5 group-hover:text-brand-400"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
