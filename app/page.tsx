import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import PricingSection from "@/components/PricingSection";
import PriceCalculator from "@/components/PriceCalculatorLazy";
import BeforeAfter from "@/components/BeforeAfter";
import HowItWorks from "@/components/HowItWorks";
import ServiceArea from "@/components/ServiceArea";
import HomeServicesPromo from "@/components/HomeServicesPromo";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getGooglePlaceData, filterReviewsBySection } from "@/lib/reviews";
import { getReviewTagsMap } from "@/lib/db";

// Régénération en arrière-plan toutes les heures pour refléter les
// nouveaux avis Google sans avoir à rebuild.
export const revalidate = 3600;

export default async function Page() {
  const place = await getGooglePlaceData();
  const tags = getReviewTagsMap();
  const autoReviews = filterReviewsBySection(place.reviews, tags, "auto");

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        <Hero
          rating={place.rating}
          reviewCount={place.totalCount}
          reviewsUrl={place.profileUrl}
        />
        <TrustBar rating={place.rating} reviewCount={place.totalCount} />
        {/* compact : pas de tableau "tarif véhicule" ni bloc "Options" —
            le calculateur juste en dessous porte déjà ces infos. */}
        <PricingSection compact />
        <PriceCalculator />
        <BeforeAfter />
        <HowItWorks />
        <ServiceArea />
        <Testimonials
          googleReviews={autoReviews}
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
          googleProfileUrl={place.profileUrl}
        />
        <FAQ />
        {/* Cross-sell Maison descendu après la FAQ : ne plus détourner le
            prospect Auto vers un autre produit en plein tunnel de conversion. */}
        <HomeServicesPromo />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
