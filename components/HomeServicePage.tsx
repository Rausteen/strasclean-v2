import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import MobileOfferStrip from "./MobileOfferStrip";
import TrustBar from "./TrustBar";
import TestimonialsMaison from "./TestimonialsMaison";
import FAQ from "./FAQ";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";
import Reveal from "./Reveal";
import HomeBeforeAfter from "./HomeBeforeAfter";
import MaisonServicesGrid from "./MaisonServicesGrid";
import MaisonTrustSection from "./MaisonTrustSection";
import MaisonPriceCalculator from "./MaisonPriceCalculatorLazy";
import {
  WhatsAppIcon,
  PhoneIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
} from "./Icon";
import { SITE, waLink, openingHoursJsonLd } from "@/lib/site";
import { UseCase } from "@/lib/usecases";
import { MAISON_GLOBAL_FAQS, homeServiceCityPath } from "@/lib/homeServices";
import type { PlaceData } from "@/lib/reviews";
import type { City } from "@/lib/cities";

type Props = {
  service: UseCase;
  place: PlaceData;
  /** Si fourni : variant "service × ville" — adapte H1, intro, breadcrumb,
   *  URL canonique. Si absent : rendu Strasbourg (slug natif). */
  city?: City;
};

export default function HomeServicePage({ service, place, city }: Props) {
  const isCity = !!city && city.slug !== "strasbourg";
  const cityName = city?.name ?? "Strasbourg";
  const cityPreposition = city?.preposition ?? "à";

  // En variant ville, on construit un message WA qui mentionne la ville
  // (au lieu du Strasbourg implicite dans le ctaMessage natif).
  const message = isCity
    ? service.ctaMessage.replace(/à Strasbourg/g, `${cityPreposition} ${cityName}`)
    : service.ctaMessage;

  const h1Plain = service.hero.h1.replace(service.hero.h1Highlight, "").trim();
  // Pour les pages ville, on remplace "à Strasbourg" du H1Highlight par la ville
  const h1Highlight = isCity
    ? service.hero.h1Highlight.replace(
        /à Strasbourg/g,
        `${cityPreposition} ${cityName}`,
      )
    : service.hero.h1Highlight;
  const h1FullPlain = isCity
    ? service.hero.h1
        .replace(/à Strasbourg/g, `${cityPreposition} ${cityName}`)
        .replace(h1Highlight, "")
        .trim()
    : h1Plain;
  const subtitle = isCity
    ? service.hero.subtitle.replace(/à Strasbourg/g, `${cityPreposition} ${cityName}`)
    : service.hero.subtitle;

  // URL canonique : Strasbourg native, sinon variant
  const pageUrl = isCity
    ? `${SITE.url}${homeServiceCityPath(service, city)}`
    : `${SITE.url}/${service.slug}`;

  // ─── JSON-LD : Service + LocalBusiness + Breadcrumb + FAQ ───────────
  const serviceJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: isCity ? `${service.shortName} ${cityPreposition} ${cityName}` : service.shortName,
    description: service.metaDescription,
    serviceType: service.shortName,
    url: pageUrl,
    provider: {
      "@type": "LocalBusiness",
      name: `${SITE.name} Maison`,
      url: `${SITE.url}/strasclean-maison`,
      telephone: SITE.phoneDisplay,
      priceRange: "€€",
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
    },
    areaServed: { "@type": "City", name: cityName },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: service.pricing.priceFrom,
      url: pageUrl,
      availability: "https://schema.org/InStock",
    },
    // OfferCatalog détaillé si tarifs structurés disponibles
    ...(service.tariffs && service.tariffs.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `Tarifs ${service.shortName}`,
            itemListElement: service.tariffs.map((t) => ({
              "@type": "Offer",
              name: t.label,
              priceCurrency: "EUR",
              // On extrait juste le nombre du label "79 €" / "+ 20 €" / "9 €/m²"
              price: extractNumericPrice(t.price),
              priceSpecification: {
                "@type": "PriceSpecification",
                price: t.price,
                priceCurrency: "EUR",
              },
              ...(t.note ? { description: t.note } : {}),
            })),
          },
        }
      : {}),
    // Reviews schema — propage les avis filtrés Maison (place.reviews est
    // déjà filtré à la section). Les rich snippets ⭐ apparaîtront dans
    // Google dès qu'un avis Maison sera tagué dans l'admin.
    ...(place.reviews && place.reviews.length > 0
      ? {
          review: place.reviews.map((r) => ({
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

  const breadcrumbJsonLd = isCity
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "StrasClean Maison",
            item: `${SITE.url}/strasclean-maison`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.shortName,
            item: `${SITE.url}/${service.slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: cityName,
            item: pageUrl,
          },
        ],
      }
    : {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "StrasClean Maison",
            item: `${SITE.url}/strasclean-maison`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.shortName,
            item: pageUrl,
          },
        ],
      };

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        {/* HERO — responsive, visuel caché sur mobile (gain d'espace) */}
        <section id="top" className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-radial-fade" />
            <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.30] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-amber-500/20 blur-2xl sm:blur-3xl" />
          </div>

          <div className="container-x pt-6 pb-12 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <nav aria-label="Fil d'ariane" className="mb-4 text-xs">
                  <Link
                    href="/strasclean-maison"
                    className="font-medium text-slate-600 hover:text-slate-700"
                  >
                    StrasClean Maison
                  </Link>
                  {isCity && (
                    <>
                      <span className="mx-1.5 text-slate-300">/</span>
                      <Link
                        href={`/${service.slug}`}
                        className="font-medium text-slate-600 hover:text-slate-700"
                      >
                        {service.shortName}
                      </Link>
                    </>
                  )}
                  <span className="mx-1.5 text-slate-300">/</span>
                  <span className="text-slate-700">
                    {isCity ? cityName : service.shortName}
                  </span>
                </nav>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-700">
                  <span className="text-base leading-none">{service.emoji}</span>
                  {service.hero.chip}
                </span>

                <h1 className="h-display mt-4 text-balance text-[30px] font-bold leading-[1.05] text-slate-900 sm:text-5xl lg:text-6xl">
                  {h1FullPlain}{" "}
                  <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {h1Highlight}
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
                  {subtitle}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={waLink(message)}
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
                    Appeler
                  </a>
                </div>

                <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-600 sm:text-sm">
                  <li className="inline-flex items-center gap-1.5">
                    <ClockIcon size={14} className="text-amber-600" />
                    {service.pricing.duration}
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <CheckIcon size={14} className="text-amber-600" />
                    Dès {service.pricing.priceFrom} €
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <MapPinIcon size={14} className="text-amber-600" />
                    {isCity ? `${cityName} (${city!.postalCodes[0]})` : "Strasbourg & alentours"}
                  </li>
                </ul>
              </div>

              {/* Visual hero — affiché sur tous les écrans depuis qu'on a
                  de vraies photos (avant c'était caché mobile car simple
                  emoji placeholder). Le HeroVisual gère son propre fallback
                  emoji si la photo /maison/hero/{key}.webp n'existe pas. */}
              <div>
                <HeroVisual service={service} />
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Section ville-spécifique pour les pages service × ville (anti-
            cannibalisation SEO : chaque page a un paragraphe unique). */}
        {isCity && (
          <section className="py-6 sm:py-10">
            <div className="container-x">
              <Reveal className="mx-auto max-w-3xl">
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <MapPinIcon size={16} className="text-amber-600" />
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
                      {service.shortName} {cityPreposition} {cityName}
                    </p>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
                    StrasClean intervient {cityPreposition} {cityName} (
                    {city!.postalCodes.join(", ")}) — environ {city!.distanceKm}{" "}
                    km du centre de Strasbourg. Déplacement inclus dans le tarif
                    annoncé. {city!.maisonIntro ?? city!.intro}
                  </p>
                  {city!.neighborhoods && city!.neighborhoods.length > 0 && (
                    <p className="mt-3 text-sm text-slate-500">
                      Quartiers desservis : {city!.neighborhoods.join(" · ")}.
                    </p>
                  )}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* Grille premium des 4 prestations Maison — la card courante est
            marquée "Vous êtes ici", les autres en cross-sell. Affiche les
            tarifs complets de chaque prestation. */}
        <MaisonServicesGrid
          currentSlug={service.slug}
          eyebrow="Nos prestations Maison"
          title="Toutes nos prestations textile à domicile."
          description="Tarifs détaillés ci-dessous. La prestation actuelle est mise en évidence — les 3 autres sont disponibles dans la même intervention si vous voulez tout faire d'un coup."
        />

        <MaisonPriceCalculator />

        {/* PROBLÈME — version compacte (bullets only) */}
        <section className="relative py-12 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-4xl">
              <Reveal className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
                  Le constat
                </p>
                <h2 className="h-display mt-2 text-balance text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                  {service.problem.title}
                </h2>
                {service.problem.paragraphs[0] && (
                  <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
                    {service.problem.paragraphs[0]}
                  </p>
                )}
              </Reveal>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {service.problem.bullets.map((b, i) => (
                  <Reveal key={b} delay={i * 40}>
                    <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-rose-300">
                        ✕
                      </span>
                      <span>{b}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SOLUTION + PROCESS — étapes en cards (allégé) */}
        <section className="relative overflow-hidden py-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-2xl sm:blur-3xl" />
          </div>
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
                Comment ça se passe
              </p>
              <h2 className="h-display mt-2 text-balance text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                {service.solution.title}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
                {service.solution.intro}
              </p>
            </Reveal>

            <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
              {service.solution.steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 50}>
                  <article className="card card-hover h-full">
                    <div className="flex items-center gap-3">
                      <span className="h-display grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-600 font-bold">
                        {i + 1}
                      </span>
                      <h3 className="h-display text-base font-semibold text-slate-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {step.desc}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* POURQUOI PRO — bandeau compact (remplace la longue section "Pourquoi le DIY échoue") */}
        {service.whyDiy.paragraphs[0] && (
          <section className="relative py-12 sm:py-20">
            <div className="container-x">
              <Reveal className="mx-auto max-w-3xl">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
                    Pourquoi pro vs. DIY
                  </p>
                  <h3 className="h-display mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                    {service.whyDiy.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
                    {service.whyDiy.paragraphs[0]}
                  </p>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        <HomeBeforeAfter />

        <MaisonTrustSection
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
        />

        <TestimonialsMaison
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
          googleProfileUrl={place.profileUrl}
          googleReviews={place.reviews}
        />

        <FAQ
          variant="maison"
          mainFAQs={service.faq}
          extraSchemaFAQs={MAISON_GLOBAL_FAQS}
        />

        {/* CTA final */}
        <section className="relative overflow-hidden py-12 sm:py-20">
          <div className="container-x">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-slate-100 to-slate-50 p-6 text-center sm:p-12">
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-amber-500/25 blur-2xl sm:blur-3xl" />
                <h2 className="h-display mx-auto max-w-2xl text-balance text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                  Prêt à redonner vie à votre intérieur ?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-[15px] text-slate-700">
                  Envoyez quelques photos sur WhatsApp, on confirme un devis et
                  un créneau.
                </p>
                <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                  <a
                    href={waLink(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa h-12 px-6"
                  >
                    <WhatsAppIcon size={18} />
                    Réserver sur WhatsApp
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

/** Extrait la 1re valeur numérique d'un libellé tarif (ex. "79 €", "+ 20 €",
 *  "9 €/m²" → "79", "20", "9"). Sert au champ price de Schema.org Offer. */
function extractNumericPrice(label: string): string {
  const match = label.match(/(\d+(?:[.,]\d+)?)/);
  return match ? match[1].replace(",", ".") : "0";
}

/** Visuel placeholder du hero, propre en attendant les vraies photos.
 *  N'est rendu QUE sur desktop (lg+) — sur mobile on gagne de l'espace. */
/** Dérive la clé du fichier hero à partir du slug d'un service ou d'une
 *  page SEO. Ex: 'nettoyage-canape-strasbourg' → 'canape',
 *  'prix-nettoyage-matelas-strasbourg' → 'matelas'. Sinon null. */
function heroKeyForSlug(slug: string): string | null {
  // Ordre important : on teste les patterns les plus spécifiques d'abord
  if (slug.includes("fauteuil-chaise") || slug.includes("airbnb"))
    return "fauteuil-chaise";
  if (slug.includes("canape")) return "canape";
  if (slug.includes("tapis")) return "tapis";
  if (slug.includes("matelas")) return "matelas";
  return null;
}

const HERO_EXT_ORDER = ["webp", "jpg", "jpeg", "png"] as const;
const HERO_PHOTO_DIR = path.join(process.cwd(), "public", "maison", "hero");

/** Cherche /public/maison/hero/{key}.{ext}. Renvoie le chemin public si
 *  trouvé, null sinon. */
function findHeroPhoto(slug: string): string | null {
  const key = heroKeyForSlug(slug);
  if (!key) return null;
  for (const ext of HERO_EXT_ORDER) {
    const filename = `${key}.${ext}`;
    const full = path.join(HERO_PHOTO_DIR, filename);
    if (fs.existsSync(full)) {
      return `/maison/hero/${filename}`;
    }
  }
  return null;
}

function HeroVisual({ service }: { service: UseCase }) {
  const heroSrc = findHeroPhoto(service.slug);

  return (
    <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 p-6 shadow-card">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200/20 via-orange-300/15 to-amber-500/10">
          {heroSrc ? (
            <>
              <Image
                src={heroSrc}
                alt={`${service.shortName} — StrasClean Maison`}
                fill
                priority
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 560px"
                quality={82}
                className="object-cover"
              />
              {/* léger fondu sombre pour la lisibilité des chips */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
              <div className="absolute inset-0 grid place-items-center">
                <span
                  aria-hidden="true"
                  className="text-[160px] opacity-60"
                >
                  {service.emoji}
                </span>
              </div>
            </>
          )}
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-amber-200 backdrop-blur-md">
            <SparklesIcon size={12} />
            À domicile
          </span>
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-amber-200 backdrop-blur-md">
            dès {service.pricing.priceFrom} €
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 p-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-600">
            <ClockIcon size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">
              {service.pricing.duration}
            </p>
            <p className="text-xs text-slate-500">
              Équipe de 2 · matériel professionnel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
