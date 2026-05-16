import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import CityHero from "@/components/CityHero";
import ServiceCityHero from "@/components/ServiceCityHero";
import TrustBar from "@/components/TrustBar";
import LocalSection from "@/components/LocalSection";
import ServiceDetail from "@/components/ServiceDetail";
import PricingSection from "@/components/PricingSection";
import PriceCalculator from "@/components/PriceCalculatorLazy";
import BeforeAfter from "@/components/BeforeAfter";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import MidCTA from "@/components/MidCTA";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import OtherCities from "@/components/OtherCities";
import ServiceLinks from "@/components/ServiceLinks";
import UseCasePage from "@/components/UseCasePage";
import HomeServicePage from "@/components/HomeServicePage";
import { CITIES, City, CITY_URL_PREFIX, cityPath, inCity } from "@/lib/cities";
import { SERVICES, Service, matchSlug, servicePath } from "@/lib/services";
import { USE_CASES, UseCase, useCasePath } from "@/lib/usecases";
import {
  HOME_SERVICES,
  homeServiceCityPath,
  listHomeServiceCityCombos,
} from "@/lib/homeServices";
import { HOME_SEO_PAGES } from "@/lib/homeSeoPages";
import { SITE, openingHoursJsonLd } from "@/lib/site";
import { getGooglePlaceData, filterReviewsBySection } from "@/lib/reviews";
import { getReviewTagsMap } from "@/lib/db";

type Params = { slug: string };

export const dynamicParams = false;
// Régénération en arrière-plan toutes les 6h (les pages ville/service
// changent peu, on n'a pas besoin du même rythme que la home).
export const revalidate = 21600;

export function generateStaticParams(): Params[] {
  const cityParams = CITIES.map((c) => ({ slug: `${CITY_URL_PREFIX}-${c.slug}` }));
  const serviceCityParams = SERVICES.flatMap((s) =>
    CITIES.map((c) => ({ slug: `${s.slug}-${c.slug}` })),
  );
  const useCaseParams = USE_CASES.map((uc) => ({ slug: uc.slug }));
  const homeServiceParams = HOME_SERVICES.map((s) => ({ slug: s.slug }));
  const homeSeoParams = HOME_SEO_PAGES.map((s) => ({ slug: s.slug }));
  const homeServiceCityParams = listHomeServiceCityCombos().map((c) => ({
    slug: c.slug,
  }));
  return [
    ...cityParams,
    ...serviceCityParams,
    ...useCaseParams,
    ...homeServiceParams,
    ...homeSeoParams,
    ...homeServiceCityParams,
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = matchSlug(slug);
  if (!m) return {};

  if (m.type === "city") {
    const city = m.city;
    const title = `Nettoyage voiture à domicile ${inCity(city)} — StrasClean`;
    const description = `Nettoyage auto à domicile ${inCity(city)} (${city.postalCodes.join(", ")}). Intérieur, shampouinage, désinfection, lavage extérieur et detailing premium. Réservation rapide par WhatsApp.`;
    return {
      title,
      description,
      alternates: { canonical: cityPath(city) },
      openGraph: {
        type: "website",
        url: `${SITE.url}${cityPath(city)}`,
        siteName: SITE.name,
        title,
        description,
        locale: "fr_FR",
        images: [
          {
            url: "/og.svg",
            width: 1200,
            height: 630,
            alt: `StrasClean — nettoyage voiture à domicile ${inCity(city)}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/og.svg"],
      },
      keywords: [
        `nettoyage voiture domicile ${city.name}`,
        `lavage auto domicile ${city.name}`,
        `nettoyage intérieur voiture ${city.name}`,
        `detailing auto ${city.name}`,
        `nettoyage siège voiture ${city.name}`,
        `shampouinage siège voiture ${city.name}`,
        `nettoyage voiture à domicile ${city.name}`,
      ],
    };
  }

  if (
    m.type === "usecase" ||
    m.type === "home-service" ||
    m.type === "home-service-city"
  ) {
    const uc =
      m.type === "usecase"
        ? m.useCase
        : m.homeService;
    const city = m.type === "home-service-city" ? m.city : null;

    // Les pages Maison utilisent l'OG image dédiée (palette ambre, emojis
    // canapé/tapis/matelas/fauteuil) ; les pages Auto gardent /og.svg.
    const ogImage =
      m.type === "home-service" || m.type === "home-service-city"
        ? "/og-maison.svg"
        : "/og.svg";

    // Pour les pages service × ville, on construit dynamiquement titre,
    // description et URL canonique (le data natif est Strasbourg).
    const cityName = city?.name ?? "Strasbourg";
    const title = city
      ? `${uc.shortName} ${city.preposition} ${cityName} — StrasClean Maison`
      : uc.metaTitle;
    const description = city
      ? `${uc.shortName} à domicile ${city.preposition} ${cityName} (${city.postalCodes.join(", ")}). Tarifs détaillés, injection-extraction professionnelle, séchage rapide. À partir de ${uc.pricing.priceFrom} €.`
      : uc.metaDescription;
    const canonical = city ? homeServiceCityPath(uc, city) : useCasePath(uc);

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: `${SITE.url}${canonical}`,
        siteName: SITE.name,
        title,
        description,
        locale: "fr_FR",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `StrasClean — ${uc.shortName}${city ? " " + city.preposition + " " + cityName : ""}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  }

  // service × city
  const { service, city } = m;
  const title = `${service.name} ${inCity(city)} — StrasClean`;
  const description = `${service.shortDesc} StrasClean intervient ${inCity(city)} (${city.postalCodes.join(", ")}) à domicile. À partir de ${service.priceFrom} €. Réservation rapide par WhatsApp.`;
  return {
    title,
    description,
    alternates: { canonical: servicePath(service, city) },
    openGraph: {
      type: "website",
      url: `${SITE.url}${servicePath(service, city)}`,
      siteName: SITE.name,
      title,
      description,
      locale: "fr_FR",
      images: [
        {
          url: "/og.svg",
          width: 1200,
          height: 630,
          alt: `StrasClean — ${service.name} ${inCity(city)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.svg"],
    },
    keywords: [
      `${service.name} ${city.name}`,
      `${service.shortName.toLowerCase()} ${city.name.toLowerCase()}`,
      `${service.name.toLowerCase()} ${city.name.toLowerCase()}`,
      `${service.name} domicile ${city.name}`,
      `${service.shortName} à domicile ${city.name}`,
    ],
  };
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const m = matchSlug(slug);
  if (!m) return notFound();

  // Fetché une fois par render (et mis en cache 1h par Next via lib/reviews)
  const place = await getGooglePlaceData();
  const tags = getReviewTagsMap();
  // On découpe les avis par section ici. Le résultat (place) passé à chaque
  // composant ne contient QUE les avis pertinents pour la section affichée.
  const autoPlace = {
    ...place,
    reviews: filterReviewsBySection(place.reviews, tags, "auto"),
  };
  const maisonPlace = {
    ...place,
    reviews: filterReviewsBySection(place.reviews, tags, "maison"),
  };

  if (m.type === "city") return <CityPage city={m.city} place={autoPlace} />;
  if (m.type === "service-city")
    return <ServiceCityPage service={m.service} city={m.city} place={autoPlace} />;
  if (m.type === "home-service")
    return <HomeServicePage service={m.homeService} place={maisonPlace} />;
  if (m.type === "home-service-city")
    return (
      <HomeServicePage
        service={m.homeService}
        place={maisonPlace}
        city={m.city}
      />
    );
  return <UseCasePage useCase={m.useCase} place={autoPlace} />;
}

// ─── City page ───────────────────────────────────────────────────────────
function CityPage({
  city,
  place,
}: {
  city: City;
  place: Awaited<ReturnType<typeof getGooglePlaceData>>;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${SITE.name} — ${city.name}`,
    description: `Nettoyage auto à domicile ${inCity(city)}.`,
    url: `${SITE.url}${cityPath(city)}`,
    telephone: SITE.phoneDisplay,
    image: `${SITE.url}/og.svg`,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      postalCode: city.postalCodes[0],
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    areaServed: { "@type": "City", name: city.name },
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
    ...(place.reviews.length > 0
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
              ? { datePublished: new Date(r.time * 1000).toISOString().slice(0, 10) }
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
        name: `Nettoyage voiture à domicile ${inCity(city)}`,
        item: `${SITE.url}${cityPath(city)}`,
      },
    ],
  };

  const cityReview = {
    name: city.review.name,
    city: city.name,
    text: city.review.text,
  };

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        <CityHero city={city} />
        <TrustBar />
        <LocalSection city={city} />
        <PricingSection />
        <PriceCalculator />
        <BeforeAfter />
        <HowItWorks />
        <Benefits />
        <Testimonials
          cityReview={cityReview}
          googleReviews={place.reviews}
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
          googleProfileUrl={place.profileUrl}
        />
        <MidCTA />
        <FAQ />
        <OtherCities current={city} />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

// ─── Service × City page ─────────────────────────────────────────────────
function ServiceCityPage({
  service,
  city,
  place,
}: {
  service: Service;
  city: City;
  place: Awaited<ReturnType<typeof getGooglePlaceData>>;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.name} — ${city.name}`,
    description: service.shortDesc,
    serviceType: service.name,
    provider: {
      "@type": "AutoDetailing",
      name: SITE.name,
      telephone: SITE.phoneDisplay,
      address: {
        "@type": "PostalAddress",
        addressLocality: city.name,
        postalCode: city.postalCodes[0],
        addressRegion: SITE.region,
        addressCountry: SITE.country,
      },
    },
    areaServed: { "@type": "City", name: city.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: service.priceFrom,
      url: `${SITE.url}${servicePath(service, city)}`,
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: city.name,
        item: `${SITE.url}${cityPath(city)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${service.name} ${inCity(city)}`,
        item: `${SITE.url}${servicePath(service, city)}`,
      },
    ],
  };

  const cityReview = {
    name: city.review.name,
    city: city.name,
    text: city.review.text,
  };

  // "Autres prestations à {Ville}" — pour le maillage interne
  const otherServiceItems = SERVICES.filter((s) => s.slug !== service.slug).map(
    (s) => ({
      label: s.name,
      sublabel: `À partir de ${s.priceFrom} € · ${s.duration}`,
      href: servicePath(s, city),
      emoji: s.emoji,
    }),
  );

  // "{Service} dans d'autres villes" — pour le maillage interne
  const otherCityItems = CITIES.filter((c) => c.slug !== city.slug).map((c) => ({
    label: `${service.shortName} ${c.name}`,
    href: servicePath(service, c),
  }));

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        <ServiceCityHero service={service} city={city} />
        <TrustBar />
        <ServiceDetail service={service} city={city} />
        <LocalSection city={city} />
        <PricingSection />
        <PriceCalculator />
        <BeforeAfter />
        <Benefits />
        <Testimonials
          cityReview={cityReview}
          googleReviews={place.reviews}
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
          googleProfileUrl={place.profileUrl}
        />
        <ServiceLinks
          eyebrow={`Autres prestations ${inCity(city)}`}
          title={`Tous nos services ${inCity(city)}.`}
          description={`Découvrez l'ensemble des prestations StrasClean disponibles ${inCity(city)}.`}
          items={otherServiceItems}
          variant="service"
        />
        <ServiceLinks
          eyebrow={service.shortName}
          title={`${service.name} dans d'autres villes.`}
          description="StrasClean propose cette prestation dans toute l'eurométropole de Strasbourg."
          items={otherCityItems}
          variant="city"
        />
        <MidCTA />
        <FAQ extraSchemaFAQs={service.faq} />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
