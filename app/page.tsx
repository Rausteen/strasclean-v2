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
        {/* Avant/Après remonté ici : on montre le RÉSULTAT (le « waouh », le
            désir) juste après la preuve de confiance — mais AVANT le prix. */}
        <BeforeAfter />
        {/* Prix tôt malgré tout (compromis) : un visiteur prêt à acheter
            trouve les tarifs sans scroller longtemps. Le calculateur juste en
            dessous porte le tarif véhicule + options. */}
        <PricingSection compact />
        <PriceCalculator />
        {/* Avis juste après le prix : la preuve sociale justifie le tarif. */}
        <Testimonials
          googleReviews={autoReviews}
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
          googleProfileUrl={place.profileUrl}
        />
        <HowItWorks />
        <ServiceArea />
        <FAQ />
        <FinalCTA />
        {/* Cross-sell Maison APRÈS le CTA final : on ne coupe pas la
            conversion Auto au moment de conclure ; on capte ceux qui n'ont
            pas réservé pour leur présenter l'autre service. */}
        <HomeServicesPromo />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
