import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Reveal from "@/components/Reveal";
import VehiclePricing from "@/components/VehiclePricing";
import {
  WhatsAppIcon,
  PhoneIcon,
  ArrowRightIcon,
  MapPinIcon,
  CheckIcon,
} from "@/components/Icon";
import { SITE, waLink } from "@/lib/site";
import { CITIES, cityPath } from "@/lib/cities";
import { PLANS } from "@/lib/plans";

const TITLE = "Formules — Nettoyage auto à domicile à Strasbourg | StrasClean";
const DESCRIPTION =
  "Nos 3 formules de nettoyage auto à domicile à Strasbourg : Essentiel (39 €), Premium Intérieur (79 €) et Intégrale StrasClean (119 €). Disponibles dans toute l'eurométropole. Réservation rapide par WhatsApp.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/formules" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/formules`,
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    locale: "fr_FR",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "StrasClean — nos formules" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.svg"],
  },
  keywords: [
    "formules nettoyage voiture domicile Strasbourg",
    "tarif lavage auto Strasbourg",
    "formule detailing auto Strasbourg",
    "nettoyage intérieur voiture Strasbourg",
  ],
};

export default function FormulesPage() {
  // Liste structurée des 3 offres pour Google
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Formules StrasClean",
    itemListElement: PLANS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Offer",
        name: p.name,
        priceCurrency: "EUR",
        price: p.priceFrom,
        url: `${SITE.url}/formules#${p.id}`,
        description: p.tagline,
      },
    })),
  };

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-radial-fade" />
            <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-2xl sm:blur-3xl" />
          </div>

          <div className="container-x pt-8 pb-14 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
            <div className="mx-auto max-w-3xl text-center">
              <nav aria-label="Fil d'ariane" className="mb-5 text-xs">
                <Link href="/" className="font-medium text-slate-600 hover:text-slate-700">
                  StrasClean
                </Link>
                <span className="mx-1.5 text-slate-300">/</span>
                <span className="text-slate-700">Formules</span>
              </nav>

              <span className="chip mx-auto">
                <span className="text-base leading-none">✨</span>
                3 formules · 12 villes desservies
              </span>

              <h1 className="h-display mt-4 text-balance text-[34px] font-bold leading-[1.05] text-slate-900 sm:text-5xl lg:text-6xl">
                Nos formules de{" "}
                <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-emerald-700 bg-clip-text text-transparent">
                  nettoyage auto à domicile.
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
                Trois formules claires, du simple entretien au detailing
                complet. Choisissez la vôtre, puis la commune
                d'intervention — StrasClean se déplace dans toute
                l'eurométropole de Strasbourg.
              </p>

              {/* Quick links to plans */}
              <div className="mx-auto mt-7 flex flex-wrap items-center justify-center gap-2">
                {PLANS.map((p) => (
                  <a
                    key={p.id}
                    href={`#${p.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-brand-400/40 hover:bg-brand-500/10 hover:text-slate-900"
                  >
                    <span>{p.emoji}</span>
                    {p.name.replace("Formule ", "")}
                    <span className="text-slate-600">· {p.priceFrom} €</span>
                  </a>
                ))}
              </div>

              <div className="mx-auto mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center">
                <a
                  href={SITE.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa h-14 w-full px-6 text-base sm:h-12 sm:w-auto"
                >
                  <WhatsAppIcon size={20} />
                  Réserver sur WhatsApp
                </a>
                <a
                  href={SITE.phoneHref}
                  className="btn-ghost h-14 w-full px-6 text-base sm:h-12 sm:w-auto"
                >
                  <PhoneIcon size={18} />
                  Appeler maintenant
                </a>
              </div>
            </div>
          </div>
        </section>


        {/* Formules détaillées */}
        <section className="relative py-16 sm:py-24">
          <div className="container-x">
            <div className="space-y-12 sm:space-y-20">
              {PLANS.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <article id={p.id} className="relative scroll-mt-24">
                    {p.badge && (
                      <span className="absolute left-8 top-0 z-10 -translate-y-1/2 whitespace-nowrap rounded-full bg-brand-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-900 shadow-lg">
                        {p.badge}
                      </span>
                    )}
                    <div
                      className={`relative overflow-hidden rounded-3xl border p-6 sm:p-9 ${
                        p.highlight
                          ? "border-brand-400/40 bg-gradient-to-br from-brand-500/10 to-slate-50 shadow-glow"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >

                    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                      {/* Description */}
                      <div className="lg:col-span-5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-50 text-2xl">
                            {p.emoji}
                          </span>
                          <h2 className="h-display text-2xl font-bold text-slate-900">
                            {p.name}
                          </h2>
                        </div>

                        <div className="mt-5 flex items-baseline gap-2">
                          <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
                            à partir de
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="h-display text-5xl font-extrabold text-slate-900">
                            {p.priceFrom}
                          </span>
                          <span className="text-2xl font-semibold text-slate-600">€</span>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                          {p.tagline}
                        </p>

                        <ul className="mt-6 space-y-3">
                          {p.features.map((f) => (
                            <li
                              key={f}
                              className="flex items-start gap-3 text-sm text-slate-800"
                            >
                              <span
                                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                                  p.highlight
                                    ? "bg-brand-500 text-slate-900"
                                    : "bg-slate-100 text-brand-600"
                                }`}
                              >
                                <CheckIcon size={12} />
                              </span>
                              {f}
                            </li>
                          ))}
                        </ul>

                        <a
                          href={waLink(p.ctaMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-7 ${p.highlight ? "btn-wa" : "btn-primary"} h-12 w-full sm:w-auto`}
                        >
                          {p.highlight ? <WhatsAppIcon size={18} /> : null}
                          Réserver la formule {p.name.replace("Formule ", "")}
                        </a>
                      </div>

                      {/* City selector */}
                      <div className="lg:col-span-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                          Disponible dans 12 villes
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          Cette formule est proposée dans toutes les communes
                          desservies par StrasClean. Choisissez la vôtre :
                        </p>

                        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {CITIES.map((c) => (
                            <li key={c.slug}>
                              <Link
                                href={cityPath(c)}
                                prefetch={false}
                                className="group flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 transition hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-brand-500/10 hover:text-slate-900"
                              >
                                <span className="inline-flex items-center gap-2 truncate">
                                  <MapPinIcon size={14} className="shrink-0 text-brand-600" />
                                  <span className="truncate">{c.name}</span>
                                </span>
                                <ArrowRightIcon
                                  size={12}
                                  className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>

                        <p className="mt-4 text-xs text-slate-500">
                          Votre commune n'est pas listée ?{" "}
                          <a
                            href={waLink(
                              `Bonjour StrasClean 👋 Est-ce que vous intervenez à [ville/quartier] pour la ${p.name} ?`,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-600 hover:text-brand-700"
                          >
                            Demandez-nous sur WhatsApp.
                          </a>
                        </p>
                      </div>
                    </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="mt-12">
                <VehiclePricing />
              </div>
            </Reveal>

            <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-slate-600">
              Le tarif final peut varier selon l'état intérieur du véhicule et
              les options demandées. On confirme toujours le prix avant
              intervention.
            </p>
          </div>
        </section>

        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </>
  );
}
