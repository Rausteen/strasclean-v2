"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, waLink } from "@/lib/site";
import { CITIES, cityPath } from "@/lib/cities";
import { PLANS } from "@/lib/plans";
import { HOME_SERVICES, homeServicePath } from "@/lib/homeServices";
import { HOME_SEO_PAGES, homeSeoPath } from "@/lib/homeSeoPages";
import { WhatsAppIcon, PhoneIcon, SparklesIcon } from "./Icon";
import { isMaisonPathname } from "@/lib/section";

export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname() || "/";
  const isMaison = isMaisonPathname(pathname);

  // Couleurs selon section
  const accent = isMaison ? "text-amber-400" : "text-brand-400";
  const logoGradient = isMaison
    ? "from-amber-300 to-amber-500"
    : "from-brand-400 to-brand-600";
  const hoverPill = isMaison
    ? "hover:border-amber-400/40 hover:bg-amber-500/10"
    : "hover:border-brand-400/40 hover:bg-brand-500/10";

  // CTA WA contextualisé selon la section
  const waHref = isMaison
    ? waLink(
        "Bonjour StrasClean 👋 Je voudrais un devis pour un nettoyage à domicile (canapé / tapis / matelas / fauteuils). Quels sont vos prochains créneaux ?",
      )
    : SITE.whatsappHref;

  return (
    <footer className="border-t border-white/5 bg-ink-950 pb-24 pt-16 sm:pb-16">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${logoGradient}`}
              >
                <SparklesIcon size={18} className="text-ink-950" />
              </span>
              <span className="h-display text-lg font-bold text-white">
                Stras<span className={accent}>Clean</span>
                {isMaison && (
                  <span className="ml-1 text-xs font-medium uppercase tracking-wider text-amber-300/80">
                    Maison
                  </span>
                )}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-white/60">
              {isMaison
                ? "Nettoyage de canapés, tapis, matelas et fauteuils à domicile à Strasbourg. Injection-extraction pro, séchage rapide, équipe de 2."
                : "Nettoyage auto à domicile à Strasbourg et alentours. Intérieur, shampouinage, désinfection, lavage extérieur et detailing premium."}
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
          </div>

          <div className="lg:col-span-2">
            <h3
              className={`text-sm font-semibold uppercase tracking-wider ${
                isMaison ? "text-white/55" : "text-white/80"
              }`}
            >
              Formules auto
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/65">
              {PLANS.map((p) => (
                <li key={p.id}>
                  <Link href={`/formules#${p.id}`} className="hover:text-white">
                    {p.name}{" "}
                    <span className="text-white/45">· {p.priceFrom} €</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/formules"
                  className={`font-semibold ${
                    isMaison
                      ? "text-white/55 hover:text-white"
                      : "text-brand-300 hover:text-brand-200"
                  }`}
                >
                  → Voir toutes les formules
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3
              className={`text-sm font-semibold uppercase tracking-wider ${
                isMaison ? "text-amber-300/90" : "text-white/55"
              }`}
            >
              StrasClean Maison
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/65">
              {HOME_SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={homeServicePath(s)}
                    prefetch={false}
                    className="hover:text-white"
                  >
                    {s.shortName}{" "}
                    <span className="text-white/45">
                      · dès {s.pricing.priceFrom} €
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/strasclean-maison"
                  className={`font-semibold ${
                    isMaison
                      ? "text-amber-300 hover:text-amber-200"
                      : "text-white/55 hover:text-white"
                  }`}
                >
                  → Toute l'offre Maison
                </Link>
              </li>
            </ul>

            {/* Pages SEO Maison (tarifs détaillés, Airbnb, cuir) — discret
                mais essentiel pour le maillage interne. */}
            <h4 className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-white/40">
              Tarifs & spécialités
            </h4>
            <ul className="mt-3 space-y-1.5 text-xs text-white/55">
              {HOME_SEO_PAGES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={homeSeoPath(s)}
                    prefetch={false}
                    className="hover:text-white/85"
                  >
                    {s.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Zones desservies
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2 text-xs text-white/65">
              {CITIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={cityPath(c)}
                    prefetch={false}
                    className={`inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 transition ${hoverPill} hover:text-white`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li className="rounded-full border border-dashed border-white/15 bg-white/[0.02] px-3 py-1">
                + alentours
              </li>
            </ul>
            <p className="mt-4 text-xs text-white/50">
              {isMaison
                ? "Mots-clés : nettoyage canapé Strasbourg, nettoyage tapis domicile Strasbourg, nettoyage matelas Strasbourg, shampouinage canapé Strasbourg, nettoyage fauteuils Strasbourg."
                : "Mots-clés : nettoyage voiture domicile Strasbourg, lavage auto domicile Strasbourg, nettoyage intérieur voiture Strasbourg, detailing auto Strasbourg, shampouinage siège voiture Strasbourg."}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-xs text-white/45 sm:flex-row sm:items-center">
          <p>© {year} StrasClean. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link
              href="/mentions-legales"
              className="hover:text-white/80"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-de-confidentialite"
              className="hover:text-white/80"
            >
              Politique de confidentialité
            </Link>
            <a
              href={`mailto:${SITE.email}`}
              className="hover:text-white/80"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
