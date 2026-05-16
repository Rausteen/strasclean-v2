import Reveal from "./Reveal";
import { City, inCity } from "@/lib/cities";
import { MapPinIcon, CheckIcon } from "./Icon";

export default function LocalSection({ city }: { city: City }) {
  return (
    <section className="relative py-14 sm:py-24 lg:py-28">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
              {city.name}
            </p>
            <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
              Nettoyage auto à domicile {inCity(city)}.
            </h2>
            <p className="mt-4 text-white/75">{city.intro}</p>

            <ul className="mt-6 space-y-2.5">
              {[
                `Intervention sur ${city.postalCodes.join(", ")}`,
                "Domicile, lieu de travail ou parking de votre choix",
                "Matériel professionnel autonome (aspirateur, injecteur, produits)",
                "Devis clair envoyé avant intervention",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-white/85">
                  <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-ink-950">
                    <CheckIcon size={12} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-6" delay={120}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 p-7 sm:p-9">
              <div className="absolute inset-0 -z-10 bg-grid-light bg-[size:36px_36px] opacity-[0.25]" />
              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl" />

              <h3 className="h-display text-xl font-semibold text-white">
                Quartiers desservis {inCity(city)}
              </h3>
              <p className="mt-1 text-sm text-white/60">
                Et tous les autres secteurs de la commune — demandez-nous.
              </p>

              <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {city.neighborhoods.map((q) => (
                  <li
                    key={q}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white/85"
                  >
                    <MapPinIcon size={14} className="text-brand-400" />
                    {q}
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-white/65">
                    Codes postaux
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {city.postalCodes.join(" · ")}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-white/65">
                    Distance
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {city.distanceKm === 0
                      ? "Strasbourg centre"
                      : `${city.distanceKm} km · Strasbourg`}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
