import Link from "next/link";
import Reveal from "./Reveal";
import { waLink } from "@/lib/site";
import { CITIES, cityPath } from "@/lib/cities";
import { MapPinIcon, WhatsAppIcon } from "./Icon";
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

  if (isMaison) {
    // Maison utilise son composant dédié avec picker prestation × ville.
    return (
      <section id="zone" className="relative bg-slate-50 py-16 sm:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p
                className={`inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.18em] ${accent} before:h-px before:w-6 before:bg-amber-500 before:opacity-80 before:content-['']`}
              >
                Zone d'intervention
              </p>
              <h2 className="h-display mt-3.5 text-balance text-[clamp(26px,6vw,40px)] font-bold leading-[1.05] tracking-[-0.02em] text-slate-900">
                {title}
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-600 sm:text-[17px]">
                {intro}
              </p>
            </Reveal>
          </div>

          <Reveal className="mx-auto mt-10 max-w-4xl" delay={120}>
            <MaisonCityServicePicker />
          </Reveal>
        </div>
      </section>
    );
  }

  // ─── Auto : layout simplifié pleine largeur ───────────────────────────
  return (
    <section id="zone" className="relative bg-slate-50 py-16 sm:py-24">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p
            className={`inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.18em] ${accent} before:h-px before:w-6 before:bg-brand-500 before:opacity-80 before:content-['']`}
          >
            Zone d'intervention
          </p>
          <h2 className="h-display mt-3.5 text-balance text-[clamp(28px,7vw,46px)] font-bold leading-[1.05] tracking-[-0.02em] text-slate-900">
            {title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-slate-600 sm:text-[18px]">
            {intro}
          </p>
        </Reveal>

        {/* Grille de villes cliquables — pleine largeur, plus aérée,
            3 colonnes desktop pour donner de la respiration. */}
        <Reveal className="mt-12">
          <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {CITIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={cityPath(c)}
                  prefetch={false}
                  className={`group flex h-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[14.5px] font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 ${hoverBorder} hover:text-slate-900 hover:shadow-soft`}
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPinIcon size={14} className={pinColor} />
                    {c.name}
                  </span>
                  <span className="text-slate-400 transition group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </li>
            ))}
            <li className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-3 text-[14px] font-medium text-slate-500">
              + alentours
            </li>
          </ul>
        </Reveal>

        <Reveal className="mt-10 text-center">
          <a
            href={waLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa inline-flex h-12 px-6 text-base"
          >
            <WhatsAppIcon size={18} />
            Demander si ma ville est couverte
          </a>
        </Reveal>
      </div>
    </section>
  );
}
