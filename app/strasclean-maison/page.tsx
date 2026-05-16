import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import TestimonialsMaison from "@/components/TestimonialsMaison";
import FAQ from "@/components/FAQ";
import HomeBeforeAfter from "@/components/HomeBeforeAfter";
import ServiceArea from "@/components/ServiceArea";
import MaisonServicesGrid from "@/components/MaisonServicesGrid";
import MaisonCitiesGrid from "@/components/MaisonCitiesGrid";
import MaisonTrustSection from "@/components/MaisonTrustSection";
import MaisonPriceCalculator from "@/components/MaisonPriceCalculatorLazy";
import Reveal from "@/components/Reveal";
import {
  WhatsAppIcon,
  PhoneIcon,
  HomeIcon,
  SparklesIcon,
  CheckIcon,
  ClockIcon,
  ArrowRightIcon,
  MapPinIcon,
  StarIcon,
} from "@/components/Icon";
import { SITE, waLink, openingHoursJsonLd } from "@/lib/site";
import { HOME_SERVICES, MAISON_GLOBAL_FAQS } from "@/lib/homeServices";
import { getGooglePlaceData, filterReviewsBySection } from "@/lib/reviews";
import { getReviewTagsMap } from "@/lib/db";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "StrasClean Maison — Nettoyage canapé, tapis, matelas à domicile à Strasbourg",
  description:
    "Nettoyage professionnel à domicile à Strasbourg : canapé tissu/cuir, tapis, matelas, fauteuils et chaises. Injection-extraction pro, séchage rapide, équipe de 2. Dès 39 €.",
  alternates: { canonical: "/strasclean-maison" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/strasclean-maison`,
    siteName: SITE.name,
    title:
      "StrasClean Maison — Nettoyage canapé, tapis, matelas à domicile à Strasbourg",
    description:
      "Nettoyage pro à domicile : canapé, tapis, matelas, fauteuils. Injection-extraction, séchage rapide, équipe de 2. Dès 39 €.",
    locale: "fr_FR",
    images: [{ url: "/og-maison.svg", width: 1200, height: 630, alt: "StrasClean Maison — nettoyage canapé, tapis, matelas à domicile à Strasbourg" }],
  },
};

const MESSAGE =
  "Bonjour StrasClean 👋 Je voudrais un devis pour un nettoyage à domicile (canapé / tapis / matelas / fauteuils). Quels sont vos prochains créneaux ?";

export default async function HubMaisonPage() {
  const place = await getGooglePlaceData();
  const tags = getReviewTagsMap();
  const maisonReviews = filterReviewsBySection(place.reviews, tags, "maison");

  const hubUrl = `${SITE.url}/strasclean-maison`;

  // ─── JSON-LD : LocalBusiness pour le hub Maison ─────────────────────
  const localBusinessJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": hubUrl,
    name: `${SITE.name} Maison`,
    description:
      "Nettoyage professionnel à domicile à Strasbourg : canapé, tapis, matelas, fauteuils. Injection-extraction pro, séchage rapide, équipe de 2.",
    url: hubUrl,
    telephone: SITE.phoneDisplay,
    priceRange: "€€",
    image: `${SITE.url}/og-maison.svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    areaServed: { "@type": "City", name: SITE.city },
    openingHoursSpecification: openingHoursJsonLd(),
    ...(SITE.socials.length > 0 ? { sameAs: SITE.socials } : {}),
    ...(place.rating && place.totalCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: place.rating.toFixed(1),
            reviewCount: String(place.totalCount),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    // OfferCatalog des 4 prestations principales
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Prestations StrasClean Maison",
      itemListElement: HOME_SERVICES.map((s) => ({
        "@type": "Offer",
        name: s.shortName,
        priceCurrency: "EUR",
        price: s.pricing.priceFrom,
        url: `${SITE.url}/${s.slug}`,
        availability: "https://schema.org/InStock",
        itemOffered: {
          "@type": "Service",
          name: s.shortName,
          description: s.metaDescription,
        },
      })),
    },
    // Reviews schema — propage les avis Maison tagués (vide tant qu'aucun
    // n'a été tagué Maison/both dans l'admin, ce qui est OK : Google
    // ignorera juste le champ et continuera d'afficher aggregateRating).
    ...(maisonReviews.length > 0
      ? {
          review: maisonReviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author_name },
            reviewRating: {
              "@type": "Rating",
              ratingValue: String(r.rating),
              bestRating: "5",
              worstRating: "1",
            },
            reviewBody: r.text,
            ...(r.time
              ? {
                  datePublished: new Date(r.time * 1000)
                    .toISOString()
                    .slice(0, 10),
                }
              : {}),
          })),
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "StrasClean Maison",
        item: hubUrl,
      },
    ],
  };

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        {/* HERO */}
        <section id="top" className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-radial-fade" />
            <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.30] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-amber-500/20 blur-2xl sm:blur-3xl" />
          </div>

          <div className="container-x pt-6 pb-12 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-200">
                  <HomeIcon size={14} />
                  Nettoyage à domicile à Strasbourg
                </span>

                <h1 className="h-display mt-4 text-balance text-[34px] font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                  Votre canapé, tapis et matelas{" "}
                  <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                    comme neufs.
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
                  StrasClean intervient chez vous pour redonner vie à vos
                  textiles d'intérieur. Injection-extraction professionnelle,
                  produits adaptés (tissu, cuir, alcantara), séchage rapide.
                  Particuliers et pros (Airbnb, hôtels, restaurants).
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row">
                  <a
                    href={waLink(MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa h-14 w-full px-6 text-base sm:h-12 sm:w-auto"
                  >
                    <WhatsAppIcon size={20} />
                    Demander un devis
                  </a>
                  <a
                    href={SITE.phoneHref}
                    className="btn-ghost h-14 w-full px-6 text-base sm:h-12 sm:w-auto"
                  >
                    <PhoneIcon size={18} />
                    {SITE.phoneDisplay}
                  </a>
                </div>

                <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-white/65 sm:mt-7 sm:text-sm">
                  <li className="inline-flex items-center gap-1.5">
                    <CheckIcon size={14} className="text-amber-300" />À domicile
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <SparklesIcon size={14} className="text-amber-300" />
                    Injection-extraction pro
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <ClockIcon size={14} className="text-amber-300" />
                    Séchage rapide
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <MapPinIcon size={14} className="text-amber-300" />
                    Strasbourg & 12 communes
                  </li>
                </ul>
              </div>

              {/* Visual placeholder — caché sur mobile pour gagner de l'espace */}
              <div className="relative mx-auto hidden w-full max-w-md lg:ml-auto lg:block">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 p-5 shadow-card">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200/20 via-orange-300/15 to-amber-500/10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 place-items-center text-7xl opacity-60">
                      <span>🛋️</span>
                      <span>🧶</span>
                      <span>🛏️</span>
                      <span>🪑</span>
                    </div>
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-amber-200 backdrop-blur-md">
                      <HomeIcon size={12} />
                      Maison
                    </span>
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-amber-200 backdrop-blur-md">
                      dès 39 €
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-300">
                      <SparklesIcon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        4 prestations · 1 équipe
                      </p>
                      <p className="text-xs text-white/60">
                        Canapé · Tapis · Matelas · Fauteuils
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        <MaisonServicesGrid />

        <MaisonPriceCalculator />

        {/* COMMENT ÇA SE PASSE */}
        <section id="process" className="relative overflow-hidden bg-white/[0.02] py-14 sm:py-24 lg:py-28">
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                Comment ça se passe
              </p>
              <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                Simple, transparent, rapide.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 80}>
                  <article className="card card-hover h-full">
                    <span className="h-display grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-300 font-bold">
                      {i + 1}
                    </span>
                    <h3 className="h-display mt-4 text-base font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {step.desc}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <HomeBeforeAfter />

        <MaisonTrustSection
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
        />

        <TestimonialsMaison
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
          googleProfileUrl={place.profileUrl}
          googleReviews={maisonReviews}
        />

        <ServiceArea variant="maison" />

        <MaisonCitiesGrid />

        <FAQ variant="maison" mainFAQs={MAISON_GLOBAL_FAQS} />

        {/* CTA final */}
        <section className="relative overflow-hidden py-14 sm:py-20">
          <div className="container-x">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-ink-800 to-ink-900 p-8 text-center sm:p-12">
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-amber-500/25 blur-2xl sm:blur-3xl" />
                <h2 className="h-display mx-auto max-w-2xl text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  Une question ? Un devis ? On répond rapidement.
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-white/75">
                  Envoyez quelques photos sur WhatsApp, on revient avec un tarif
                  précis et un créneau adapté.
                </p>
                <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                  <a
                    href={waLink(MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa h-12 px-6"
                  >
                    <WhatsAppIcon size={18} />
                    WhatsApp
                  </a>
                  <a href={SITE.phoneHref} className="btn-ghost h-12 px-6">
                    <PhoneIcon size={16} />
                    {SITE.phoneDisplay}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

const STEPS = [
  {
    title: "Envoyez-nous une photo",
    desc: "Quelques photos par WhatsApp suffisent. On évalue, on vous propose un tarif et un créneau.",
  },
  {
    title: "On vient chez vous",
    desc: "Intervention à domicile à Strasbourg ou en proche banlieue. Équipe de 2, matériel mobile.",
  },
  {
    title: "Nettoyage en profondeur",
    desc: "Injection-extraction professionnelle. La saleté est décrochée et aspirée, pas étalée.",
  },
  {
    title: "Séchage rapide",
    desc: "Le textile ressort presque sec grâce à l'extraction haute puissance. Utilisable le jour même.",
  },
];
