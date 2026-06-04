import Link from "next/link";
import Reveal from "./Reveal";
import PlansCarousel from "./PlansCarousel";
import { HOME_SERVICES, homeServicePath } from "@/lib/homeServices";
import { waLink } from "@/lib/site";
import {
  WhatsAppIcon,
  CheckIcon,
  ClockIcon,
  ArrowRightIcon,
  MapPinIcon,
} from "./Icon";
import type { UseCase } from "@/lib/usecases";

type Props = {
  /** Slug à mettre en évidence comme "Vous êtes sur cette page". Si fourni,
   *  la card du service courant n'a pas de lien "Voir le détail" (mais garde
   *  le CTA WA). */
  currentSlug?: string;
  /** Eyebrow personnalisé — défaut : "Nos prestations Maison" */
  eyebrow?: string;
  /** Titre personnalisé */
  title?: string;
  /** Sous-titre */
  description?: string;
};

// Le service mis en avant — par défaut le canapé (plus gros volume Maison
// à Strasbourg, ticket moyen ~100 €).
const POPULAR_SLUG = "nettoyage-canape-strasbourg";

export default function MaisonServicesGrid({
  currentSlug,
  eyebrow = "Nos prestations Maison",
  title = "Tout votre intérieur, en une intervention.",
  description = "Même matériel professionnel que pour l'auto (injecteur-extracteur), produits adaptés à chaque matière, séchage rapide. À domicile à Strasbourg et alentours.",
}: Props = {}) {
  return (
    <section
      id="prestations"
      className="relative overflow-hidden bg-slate-50 py-16 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-amber-500/12 blur-2xl sm:blur-3xl" />
      </div>

      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 before:h-px before:w-6 before:bg-amber-500 before:opacity-70 before:content-['']">
            {eyebrow}
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-slate-600">{description}</p>
        </Reveal>

        {/* Carrousel swipeable mobile / grille 4 colonnes desktop —
            même UX que la section Formules auto. */}
        <div className="mt-10 sm:mt-12">
          <PlansCarousel accent="amber" desktopCols={4}>
            {HOME_SERVICES.map((s) => (
              <MaisonServiceCard
                key={s.slug}
                service={s}
                popular={s.slug === POPULAR_SLUG}
                current={currentSlug === s.slug}
              />
            ))}
          </PlansCarousel>
        </div>

        {/* Bandeau zone */}
        <Reveal>
          <p className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm text-slate-600">
            <MapPinIcon size={14} className="text-amber-600" />
            Strasbourg + 12 communes alentours desservies — déplacement inclus
            dans le tarif annoncé.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function MaisonServiceCard({
  service: s,
  popular,
  current,
}: {
  service: UseCase;
  popular: boolean;
  current: boolean;
}) {
  return (
    <div
      id={s.slug}
      className="group relative h-full scroll-mt-24"
    >
      {/* Badge */}
      {popular && !current && (
        <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-900 shadow-lg">
          Le + populaire ⭐
        </span>
      )}
      {current && (
        <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-slate-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-900 shadow-lg backdrop-blur">
          Vous êtes ici
        </span>
      )}

      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-5 transition-all duration-300 sm:p-6 ${
          current
            ? "border-slate-300 bg-slate-100"
            : popular
              ? "border-amber-400/40 bg-gradient-to-b from-amber-500/15 to-slate-50 shadow-glow-amber"
              : "border-slate-200 bg-slate-50 group-hover:-translate-y-1 group-hover:border-amber-400/30"
        }`}
      >
        {/* Glow */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-b blur-2xl ${
            popular
              ? "from-amber-400/30 to-amber-500/0"
              : "from-amber-300/10 to-amber-500/0"
          }`}
        />

        {/* Header : emoji + nom */}
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-2xl"
          >
            {s.emoji}
          </span>
          <h3 className="h-display text-lg font-semibold text-slate-900 sm:text-xl">
            {s.shortName}
          </h3>
        </div>

        {/* Prix d'appel + durée */}
        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
            à partir de
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="h-display text-4xl font-extrabold text-slate-900 sm:text-5xl">
            {s.pricing.priceFrom}
          </span>
          <span className="text-xl font-semibold text-slate-600 sm:text-2xl">
            €
          </span>
        </div>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-600">
          <ClockIcon size={12} className="text-amber-600" />
          {s.pricing.duration}
        </p>

        {/* Tagline */}
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {tagline(s.shortName)}
        </p>

        {/* Grille tarifs détaillée */}
        {s.tariffs && s.tariffs.length > 0 && (
          <ul className="mt-5 space-y-2 border-t border-slate-200 pt-4">
            {s.tariffs.map((t) => (
              <li
                key={t.label}
                className="flex items-start justify-between gap-2 text-sm"
              >
                <span className="flex min-w-0 items-start gap-2 text-slate-700">
                  <span
                    className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                      popular ? "bg-amber-400 text-slate-900" : "bg-slate-100 text-amber-600"
                    }`}
                  >
                    <CheckIcon size={10} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate">{t.label}</span>
                    {t.note && (
                      <span className="block text-[11px] text-slate-400">
                        {t.note}
                      </span>
                    )}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-bold text-amber-600">
                  {t.price}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-2">
          <a
            href={waLink(s.ctaMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa h-12 w-full text-base"
          >
            <WhatsAppIcon size={18} />
            Réserver
          </a>
          {!current && (
            <Link
              href={homeServicePath(s)}
              prefetch={false}
              aria-label={`Voir le détail de ${s.shortName.toLowerCase()}`}
              className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Voir le détail
              <ArrowRightIcon size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function tagline(name: string): string {
  switch (name) {
    case "Nettoyage canapé":
      return "Tissu, cuir, alcantara — séchage rapide, aucune auréole.";
    case "Nettoyage tapis":
      return "À domicile, sans transport vers un pressing.";
    case "Nettoyage matelas":
      return "Acariens, taches anciennes, transpiration — neutralisés.";
    case "Fauteuils & chaises":
      return "Lot complet de chaises ou fauteuil en une intervention.";
    default:
      return "À domicile, en équipe de 2.";
  }
}
