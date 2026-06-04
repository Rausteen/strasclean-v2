"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, waLink } from "@/lib/site";
import { CITIES, cityPath } from "@/lib/cities";
import { QUARTIERS } from "@/lib/quartiers";
import { HOME_SERVICES, homeServicePath, homeServiceCityPath } from "@/lib/homeServices";
import { WhatsAppIcon, PhoneIcon, SparklesIcon, MapPinIcon } from "./Icon";
import { isMaisonPathname } from "@/lib/section";

export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname() || "/";
  const isMaison = isMaisonPathname(pathname);

  // Tons d'accent contextualisés à la section pour rester cohérent
  // avec le Header / Hero (brand vert pour Auto, ambre pour Maison).
  const accent = isMaison ? "text-amber-300" : "text-brand-300";
  const accentMuted = isMaison ? "text-amber-200/80" : "text-brand-200/80";
  const logoGradient = isMaison
    ? "from-amber-300 to-amber-500"
    : "from-brand-400 to-brand-600";

  const waHref = isMaison
    ? waLink(
        "Bonjour StrasClean 👋 Je voudrais un devis pour un nettoyage à domicile (canapé / tapis / matelas / fauteuils). Quels sont vos prochains créneaux ?",
      )
    : SITE.whatsappHref;

  return (
    <footer className="relative overflow-hidden bg-slate-900 pb-24 pt-14 text-slate-300 sm:pb-12 sm:pt-14">
      {/* Halo d'accent en haut pour lier visuellement au body light */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-32 left-1/2 h-64 w-[820px] -translate-x-1/2 rounded-full blur-3xl ${
          isMaison ? "bg-amber-400/15" : "bg-brand-500/15"
        }`}
      />

      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* COL 1 — Brand + CTAs */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${logoGradient} shadow-glow`}
              >
                <SparklesIcon size={18} className="text-slate-900" />
              </span>
              <span className="h-display text-lg font-bold text-white">
                Stras<span className={accent}>Clean</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-slate-400">
              Nettoyage professionnel à domicile à Strasbourg — voiture et
              textile maison. Équipe locale, matériel pro, 7j/7 de 8h à 22h.
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa"
              >
                <WhatsAppIcon size={16} /> WhatsApp
              </a>
              <a
                href={SITE.phoneHref}
                className="btn border border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                <PhoneIcon size={16} /> {SITE.phoneDisplay}
              </a>
            </div>

            <p className="mt-5 inline-flex items-center gap-1.5 text-xs text-slate-400">
              <MapPinIcon size={12} className={accent} />
              Strasbourg + 12 communes desservies
            </p>
          </div>

          {/* COL 2 — Auto */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/85">
              StrasClean Auto
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/formules" className="hover:text-white">
                  Formules (39 / 79 / 119 €)
                </Link>
              </li>
              <li>
                <Link href="/reserver-auto" className="hover:text-white">
                  Réserver en ligne
                </Link>
              </li>
              <li>
                <Link
                  href={cityPath(CITIES[0])}
                  prefetch={false}
                  className="hover:text-white"
                >
                  Nettoyage voiture Strasbourg
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 3 — Maison */}
          <div className="lg:col-span-4">
            <h3
              className={`text-xs font-semibold uppercase tracking-wider ${accentMuted}`}
            >
              StrasClean Maison
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
              <li>
                <Link
                  href="/strasclean-maison"
                  className="hover:text-white"
                >
                  Hub Maison
                </Link>
              </li>
              <li>
                <Link
                  href="/reserver-maison"
                  className="hover:text-white"
                >
                  Réserver en ligne
                </Link>
              </li>
              {HOME_SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={homeServicePath(s)}
                    prefetch={false}
                    className="hover:text-white"
                  >
                    {s.shortName}{" "}
                    <span className="text-slate-500">
                      · dès {s.pricing.priceFrom} €
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Liste compacte des villes (SEO + maillage) */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Communes desservies
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-400">
            {CITIES.map((c, i) => (
              <li key={c.slug}>
                <Link
                  href={
                    isMaison
                      ? homeServiceCityPath(HOME_SERVICES[0], c)
                      : cityPath(c)
                  }
                  prefetch={false}
                  className="hover:text-white"
                >
                  {c.name}
                </Link>
                {i < CITIES.length - 1 && (
                  <span className="ml-3 text-white/20">·</span>
                )}
              </li>
            ))}
          </ul>

          {/* Quartiers Strasbourg — sous-liste pour le SEO hyper-local
              et le maillage interne vers les 50+ pages quartier. */}
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Quartiers Strasbourg
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-400">
            {QUARTIERS.map((q, i) => (
              <li key={q.slug}>
                <Link
                  href={
                    isMaison
                      ? homeServiceCityPath(HOME_SERVICES[0], q)
                      : cityPath(q)
                  }
                  prefetch={false}
                  className="hover:text-white"
                >
                  {q.name}
                </Link>
                {i < QUARTIERS.length - 1 && (
                  <span className="ml-3 text-white/20">·</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom : copyright + légal */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {year} StrasClean. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/qui-sommes-nous" className="hover:text-white">
              Qui sommes-nous
            </Link>
            <Link href="/guide" className="hover:text-white">
              Guide pratique
            </Link>
            <Link href="/mentions-legales" className="hover:text-white">
              Mentions légales
            </Link>
            <Link
              href="/politique-de-confidentialite"
              className="hover:text-white"
            >
              Politique de confidentialité
            </Link>
            <a href={`mailto:${SITE.email}`} className="hover:text-white">
              {SITE.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
