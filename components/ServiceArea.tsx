import Link from "next/link";
import Reveal from "./Reveal";
import { waLink } from "@/lib/site";
import { CITIES, cityPath } from "@/lib/cities";
import { MapPinIcon, WhatsAppIcon, ArrowRightIcon } from "./Icon";

export default function ServiceArea() {
  return (
    <section id="zone" className="relative py-14 sm:py-24 lg:py-28">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
              Zone d'intervention
            </p>
            <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
              Nettoyage auto à domicile à Strasbourg et alentours.
            </h2>
            <p className="mt-4 text-white/70">
              StrasClean intervient à Strasbourg et dans les communes voisines
              pour nettoyer votre véhicule directement chez vous, sur votre
              lieu de travail ou à l'adresse de votre choix.
            </p>

            <a
              href={waLink(
                "Bonjour StrasClean 👋 Est-ce que vous intervenez dans ma ville ?"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa mt-6"
            >
              <WhatsAppIcon size={18} />
              Demander si ma ville est couverte
            </a>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={120}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 p-7 sm:p-9">
              <div className="absolute inset-0 -z-10 bg-grid-light bg-[size:36px_36px] opacity-[0.25]" />
              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl" />

              <h3 className="h-display text-xl font-semibold text-white">
                12 communes desservies
              </h3>
              <p className="mt-1 text-sm text-white/60">
                Et bien d'autres autour — demandez-nous.
              </p>

              <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CITIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={cityPath(c)}
                      prefetch={false}
                      className="group flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white/85 transition hover:border-brand-400/40 hover:bg-brand-500/10 hover:text-white"
                    >
                      <span className="inline-flex items-center gap-2">
                        <MapPinIcon size={14} className="text-brand-400" />
                        {c.name}
                      </span>
                      <ArrowRightIcon
                        size={12}
                        className="text-white/40 transition group-hover:translate-x-0.5 group-hover:text-brand-400"
                      />
                    </Link>
                  </li>
                ))}
                <li className="flex items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-3 py-2.5 text-sm text-white/65">
                  + alentours
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
