"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, waLink } from "@/lib/site";
import { CITIES, cityPath } from "@/lib/cities";
import { QUARTIERS } from "@/lib/quartiers";
import { USE_CASES, useCasePath } from "@/lib/usecases";
import { HOME_SERVICES, homeServicePath, homeServiceCityPath } from "@/lib/homeServices";
import {
  WhatsAppIcon,
  PhoneIcon,
  MapPinIcon,
  CarIcon,
  HomeIcon,
  ArrowRightIcon,
} from "./Icon";
import LogoMark from "./LogoMark";
import { isMaisonPathname } from "@/lib/section";

export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname() || "/";
  const isMaison = isMaisonPathname(pathname);

  // Tons d'accent contextualisés à la section pour rester cohérent
  // avec le Header / Hero (brand vert pour Auto, ambre pour Maison).
  const accent = isMaison ? "text-amber-300" : "text-brand-300";

  const waHref = isMaison
    ? waLink(
        "Bonjour StrasClean 👋 Je voudrais un devis pour un nettoyage à domicile (canapé / tapis / matelas / fauteuils). Quels sont vos prochains créneaux ?",
      )
    : SITE.whatsappHref;

  return (
    <footer className="surface-forest relative overflow-hidden pb-24 pt-14 sm:pb-12 sm:pt-14">
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
              <LogoMark
                size={36}
                variant={isMaison ? "amber" : "brand"}
                className={isMaison ? "rounded-xl shadow-glow-amber" : "rounded-xl shadow-glow"}
              />
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

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-300">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition hover:text-white"
              >
                📸 Instagram
              </a>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition hover:text-white"
              >
                👍 Facebook
              </a>
              <a
                href="https://www.tiktok.com/@strasclean67000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition hover:text-white"
              >
                🎵 TikTok
              </a>
            </div>
          </div>

          {/* COL 2 — Deux univers distincts (seul pont Auto ↔ Maison) */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {/* Auto (vert) */}
            <div className="rounded-2xl border border-brand-500/25 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                  <CarIcon size={18} />
                </span>
                <h3 className="h-display text-base font-bold text-white">
                  StrasClean <span className="text-brand-300">Auto</span>
                </h3>
              </div>
              <p className="mt-2.5 text-sm text-slate-400">
                Nettoyage voiture à domicile — intérieur & extérieur.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
                <li>
                  <Link href="/formules" className="hover:text-white">
                    Formules (59 / 89 / 139 €)
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
              <Link
                href="/reserver"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-sm font-bold text-[#062b1e] transition hover:bg-brand-400"
              >
                Réserver en ligne <ArrowRightIcon size={14} />
              </Link>
            </div>

            {/* Maison (ambre) */}
            <div className="rounded-2xl border border-amber-400/25 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
                  <HomeIcon size={18} />
                </span>
                <h3 className="h-display text-base font-bold text-white">
                  StrasClean <span className="text-amber-300">Maison</span>
                </h3>
              </div>
              <p className="mt-2.5 text-sm text-slate-400">
                Canapés, tapis, matelas & fauteuils nettoyés à domicile.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
                <li>
                  <Link href="/strasclean-maison" className="hover:text-white">
                    Hub Maison
                  </Link>
                </li>
                {HOME_SERVICES.slice(0, 3).map((s) => (
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
              <Link
                href="/reserver-maison"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-[#2a1f00] transition hover:bg-amber-300"
              >
                Réserver en ligne <ArrowRightIcon size={14} />
              </Link>
            </div>
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

          {/* Cas fréquents (auto) — délie les pages "pain point" qui étaient
              orphelines (uniquement dans le sitemap) → découverte + maillage. */}
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Problèmes & cas fréquents
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-400">
            {USE_CASES.map((uc, i) => (
              <li key={uc.slug}>
                <Link
                  href={useCasePath(uc)}
                  prefetch={false}
                  className="hover:text-white"
                >
                  {uc.shortName}
                </Link>
                {i < USE_CASES.length - 1 && (
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
            <a
              href="https://naviel.fr"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 transition hover:text-slate-300"
            >
              <span
                aria-hidden
                className="inline-block h-[7px] w-[7px] rotate-45 rounded-[1px] bg-[#c8f24e]"
              />
              Réalisé par Naviel
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
