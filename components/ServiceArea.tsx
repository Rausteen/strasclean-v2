import Link from "next/link";
import Reveal from "./Reveal";
import { waLink } from "@/lib/site";
import { CITIES, cityPath } from "@/lib/cities";
import { MapPinIcon, WhatsAppIcon, ArrowRightIcon } from "./Icon";
import MaisonCityServicePicker from "./MaisonCityServicePicker";

type Props = {
  variant?: "auto" | "maison";
};

export default function ServiceArea({ variant = "auto" }: Props = {}) {
  const isMaison = variant === "maison";
  const accent = isMaison ? "text-amber-600" : "text-brand-600";
  const pinColor = isMaison ? "text-amber-600" : "text-brand-600";
  const hoverBorder = isMaison
    ? "hover:border-amber-400/40 hover:bg-amber-500/10"
    : "hover:border-brand-400/40 hover:bg-brand-500/10";

  const message = isMaison
    ? "Bonjour StrasClean 👋 Est-ce que vous intervenez à [ville/quartier] pour un nettoyage canapé / tapis / matelas ?"
    : "Bonjour StrasClean 👋 Est-ce que vous intervenez à [ville/quartier] ?";

  const title = isMaison
    ? "Nettoyage à domicile à Strasbourg et alentours."
    : "Nettoyage auto à domicile à Strasbourg et alentours.";
  const intro = isMaison
    ? "StrasClean Maison intervient à Strasbourg et dans les communes voisines pour nettoyer vos canapés, tapis, matelas et fauteuils directement chez vous ou à votre local pro."
    : "StrasClean intervient à Strasbourg et dans les communes voisines pour nettoyer votre véhicule directement chez vous, sur votre lieu de travail ou à l'adresse de votre choix.";

  return (
    <section id="zone" className="relative bg-slate-50 py-14 sm:py-24 lg:py-28">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p
              className={`text-sm font-semibold uppercase tracking-[0.18em] ${accent}`}
            >
              Zone d'intervention
            </p>
            <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-slate-600">{intro}</p>

            <a
              href={waLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa mt-6"
            >
              <WhatsAppIcon size={18} />
              Demander si ma ville est couverte
            </a>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={120}>
            {isMaison ? (
              <MaisonCityServicePicker />
            ) : (
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 p-7 sm:p-9">
                <div className="absolute inset-0 -z-10 bg-grid-light bg-[size:36px_36px] opacity-[0.25]" />
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/15 blur-2xl sm:blur-3xl" />

                <h3 className="h-display text-xl font-semibold text-slate-900">
                  12 communes desservies
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Et bien d'autres autour — demandez-nous.
                </p>

                <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CITIES.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={cityPath(c)}
                        prefetch={false}
                        className={`group flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 transition ${hoverBorder} hover:text-slate-900`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <MapPinIcon size={14} className={pinColor} />
                          {c.name}
                        </span>
                        <ArrowRightIcon
                          size={12}
                          className={`text-slate-400 transition group-hover:translate-x-0.5 group-hover:${pinColor}`}
                        />
                      </Link>
                    </li>
                  ))}
                  <li className="flex items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                    + alentours
                  </li>
                </ul>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
