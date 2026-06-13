import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import TestimonialsMaison from "@/components/TestimonialsMaison";
import FAQ from "@/components/FAQ";
import HomeBeforeAfter from "@/components/HomeBeforeAfter";
import ServiceArea from "@/components/ServiceArea";
import MaisonServicesGrid from "@/components/MaisonServicesGrid";
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

/** Résout /public/maison/hero/hub.{webp,jpg,jpeg,png} au build.
 *  Renvoie le chemin public si trouvé, null sinon. */
function findHubHeroPhoto(): string | null {
  const exts = ["webp", "jpg", "jpeg", "png"] as const;
  const dir = path.join(process.cwd(), "public", "maison", "hero");
  for (const ext of exts) {
    if (fs.existsSync(path.join(dir, `hub.${ext}`))) {
      return `/maison/hero/hub.${ext}`;
    }
  }
  return null;
}

export default async function HubMaisonPage() {
  const hubHeroSrc = findHubHeroPhoto();
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
            <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-white to-white" />
            <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          </div>

          <div className="container-x pt-6 pb-12 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-700">
                  <HomeIcon size={14} />
                  Nettoyage à domicile à Strasbourg
                </span>

                <h1 className="h-display mt-4 text-balance text-[34px] font-bold leading-[1.05] text-slate-900 sm:text-5xl lg:text-6xl">
                  Votre canapé, tapis et matelas{" "}
                  <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                    comme neufs.
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
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

                <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-600 sm:mt-7 sm:text-sm">
                  <li className="inline-flex items-center gap-1.5">
                    <CheckIcon size={14} className="text-amber-600" />À domicile
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <SparklesIcon size={14} className="text-amber-600" />
                    Injection-extraction pro
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <ClockIcon size={14} className="text-amber-600" />
                    Séchage rapide
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <MapPinIcon size={14} className="text-amber-600" />
                    Strasbourg & 12 communes
                  </li>
                </ul>
              </div>

              {/* Visual hero — affiché sur tous les écrans (vraie photo
                  /maison/hero/hub.webp si présente, sinon fallback grid
                  4 emojis). Avant c'était caché mobile, mais maintenant
                  qu'il y a une vraie photo c'est l'élément visuel principal. */}
              <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 p-6 shadow-card">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200/20 via-orange-300/15 to-amber-500/10">
                    {hubHeroSrc ? (
                      <>
                        <Image
                          src={hubHeroSrc}
                          alt="StrasClean Maison — nettoyage canapé, tapis, matelas à domicile à Strasbourg"
                          fill
                          priority
                          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 560px"
                          quality={82}
                          className="object-cover"
                        />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 grid grid-cols-2 grid-rows-2 place-items-center text-7xl opacity-60"
                        >
                          <span>🛋️</span>
                          <span>🧶</span>
                          <span>🛏️</span>
                          <span>🪑</span>
                        </div>
                      </>
                    )}
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-amber-200 backdrop-blur-md">
                      <HomeIcon size={12} />
                      Maison
                    </span>
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-amber-200 backdrop-blur-md">
                      dès 39 €
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 p-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-600">
                      <SparklesIcon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        4 prestations · 1 équipe
                      </p>
                      <p className="text-xs text-slate-500">
                        Canapé · Tapis · Matelas · Fauteuils
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MaisonServicesGrid />

        <MaisonPriceCalculator />

        <HomeBeforeAfter />

        {/* COMMENT ÇA SE PASSE */}
        <section id="process" className="relative overflow-hidden py-16 sm:py-24">
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 before:h-px before:w-6 before:bg-amber-500 before:opacity-70 before:content-['']">
                Comment ça se passe
              </p>
              <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl">
                Simple, transparent, rapide.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 80}>
                  <article className="card card-hover h-full">
                    <span className="h-display grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-600 font-bold">
                      {i + 1}
                    </span>
                    <h3 className="h-display mt-4 text-base font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {step.desc}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

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

        <FAQ variant="maison" mainFAQs={MAISON_GLOBAL_FAQS} />

        {/* CTA final */}
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="container-x">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-slate-100 to-slate-50 p-8 text-center sm:p-12">
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-amber-500/25 blur-2xl sm:blur-3xl" />
                <h2 className="h-display mx-auto max-w-2xl text-balance text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                  Une question ? Un devis ? On répond rapidement.
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-slate-700">
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
                  <Link
                    href="/reserver-maison"
                    className="btn h-12 px-6 border border-amber-400/50 bg-amber-500/10 text-amber-800 hover:bg-amber-500/20"
                  >
                    Réserver en ligne
                    <ArrowRightIcon size={16} />
                  </Link>
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
