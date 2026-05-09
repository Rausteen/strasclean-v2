import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import CityHero from "@/components/CityHero";
import TrustBar from "@/components/TrustBar";
import LocalSection from "@/components/LocalSection";
import PricingSection from "@/components/PricingSection";
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
import { CITIES, CITY_URL_PREFIX, findCityBySlug, inCity, cityPath } from "@/lib/cities";
import { SITE } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return CITIES.map((c) => ({ slug: `${CITY_URL_PREFIX}-${c.slug}` }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = findCityBySlug(slug);
  if (!city) return {};

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

export default async function CityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const city = findCityBySlug(slug);
  if (!city) return notFound();

  // JSON-LD scopé à la ville
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDetailing",
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
    areaServed: {
      "@type": "City",
      name: city.name,
    },
  };

  // Témoignage personnalisé pour la ville (placé en tête)
  const cityReview = {
    name: city.review.name,
    city: city.name,
    text: city.review.text,
  };

  return (
    <>
      <Header />
      <main>
        <CityHero city={city} />
        <TrustBar />
        <LocalSection city={city} />
        <PricingSection />
        <BeforeAfter />
        <HowItWorks />
        <Benefits />
        <Testimonials cityReview={cityReview} />
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
    </>
  );
}
