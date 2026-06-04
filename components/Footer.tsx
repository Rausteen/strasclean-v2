"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, waLink } from "@/lib/site";
import { CITIES, cityPath } from "@/lib/cities";
import { HOME_SERVICES, homeServicePath, homeServiceCityPath } from "@/lib/homeServices";
import { WhatsAppIcon, PhoneIcon, SparklesIcon, MapPinIcon } from "./Icon";
import { isMaisonPathname } from "@/lib/section";

export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname() || "/";
  const isMaison = isMaisonPathname(pathname);

  const accent = isMaison ? "text-amber-600" : "text-brand-600";
  const logoGradient = isMaison
    ? "from-amber-300 to-amber-500"
    : "from-brand-400 to-brand-600";

  // CTA WA contextualisé selon la section
  const waHref = isMaison
    ? waLink(
        "Bonjour StrasClean 👋 Je voudrais un devis pour un nettoyage à domicile (canapé / tapis / matelas / fauteuils). Quels sont vos prochains créneaux ?",
      )
    : SITE.whatsappHref;

  return (
    <footer className="border-t border-slate-100 bg-white pb-24 pt-14 sm:pb-12 sm:pt-12">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* COL 1 — Brand + CTAs */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${logoGradient}`}
              >
                <SparklesIcon size={18} className="text-slate-900" />
              </span>
              <span className="h-display text-lg font-bold text-slate-900">
                Stras<span className={accent}>Clean</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-slate-600">
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
              <a href={SITE.phoneHref} className="btn-ghost">
                <PhoneIcon size={16} /> {SITE.phoneDisplay}
              </a>
            </div>

            <p className="mt-5 inline-flex items-center gap-1.5 text-xs text-slate-500">
              <MapPinIcon size={12} className={accent} />
              Strasbourg + 12 communes desservies
            </p>
          </div>

          {/* COL 2 — Auto */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              StrasClean Auto
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:text-slate-900">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/formules" className="hover:text-slate-900">
                  Formules (39 / 79 / 119 €)
                </Link>
              </li>
              <li>
                <Link
                  href={cityPath(CITIES[0])}
                  prefetch={false}
                  className="hover:text-slate-900"
                >
                  Nettoyage voiture Strasbourg
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 3 — Maison */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-600/90">
              StrasClean Maison
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              <li>
                <Link
                  href="/strasclean-maison"
                  className="hover:text-slate-900"
                >
                  Hub Maison
                </Link>
              </li>
              {HOME_SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={homeServicePath(s)}
                    prefetch={false}
                    className="hover:text-slate-900"
                  >
                    {s.shortName}{" "}
                    <span className="text-slate-400">
                      · dès {s.pricing.priceFrom} €
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Liste compacte des villes (pour le SEO local + maillage).
            Sur Maison, chaque lien pointe vers la page Maison de la commune
            (canapé = service le plus populaire), pas vers la page Auto. */}
        <div className="mt-10 border-t border-slate-100 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Communes desservies
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-500">
            {CITIES.map((c, i) => (
              <li key={c.slug}>
                <Link
                  href={
                    isMaison
                      ? homeServiceCityPath(HOME_SERVICES[0], c)
                      : cityPath(c)
                  }
                  prefetch={false}
                  className="hover:text-slate-900"
                >
                  {c.name}
                </Link>
                {i < CITIES.length - 1 && (
                  <span className="ml-3 text-slate-200">·</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom : copyright + légal + qui-sommes-nous */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>© {year} StrasClean. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/qui-sommes-nous" className="hover:text-slate-700">
              Qui sommes-nous
            </Link>
            <Link href="/mentions-legales" className="hover:text-slate-700">
              Mentions légales
            </Link>
            <Link
              href="/politique-de-confidentialite"
              className="hover:text-slate-700"
            >
              Politique de confidentialité
            </Link>
            <a href={`mailto:${SITE.email}`} className="hover:text-slate-700">
              {SITE.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
