import Link from "next/link";
import { SITE } from "@/lib/site";
import { CITIES, cityPath } from "@/lib/cities";
import { PLANS } from "@/lib/plans";
import { HOME_SERVICES, homeServicePath } from "@/lib/homeServices";
import { WhatsAppIcon, PhoneIcon, SparklesIcon } from "./Icon";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-ink-950 pb-24 pt-16 sm:pb-16">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <a href="#top" className="inline-flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600">
                <SparklesIcon size={18} className="text-ink-950" />
              </span>
              <span className="h-display text-lg font-bold text-white">
                Stras<span className="text-brand-400">Clean</span>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm text-white/60">
              Nettoyage auto à domicile à Strasbourg et alentours. Intérieur,
              shampouinage, désinfection, lavage extérieur et detailing premium.
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <a
                href={SITE.whatsappHref}
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">
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
                  className="font-semibold text-brand-300 hover:text-brand-200"
                >
                  → Voir toutes les formules
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-300/90">
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
                    <span className="text-white/45">· dès {s.pricing.priceFrom} €</span>
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
                    className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 transition hover:border-brand-400/40 hover:bg-brand-500/10 hover:text-white"
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
              Mots-clés&nbsp;: nettoyage voiture domicile Strasbourg, lavage auto
              domicile Strasbourg, nettoyage intérieur voiture Strasbourg,
              detailing auto Strasbourg, shampouinage siège voiture Strasbourg.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-xs text-white/45 sm:flex-row sm:items-center">
          <p>© {year} StrasClean. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/mentions-legales" className="hover:text-white/80">Mentions légales</Link>
            <Link href="/politique-de-confidentialite" className="hover:text-white/80">
              Politique de confidentialité
            </Link>
            <a href={`mailto:${SITE.email}`} className="hover:text-white/80">{SITE.email}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
