import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProblemsSolution from "@/components/ProblemsSolution";
import PricingSection from "@/components/PricingSection";
import PriceCalculator from "@/components/PriceCalculatorLazy";
import BeforeAfter from "@/components/BeforeAfter";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import ServiceArea from "@/components/ServiceArea";
import HomeServicesPromo from "@/components/HomeServicesPromo";
import Testimonials from "@/components/Testimonials";
import MidCTA from "@/components/MidCTA";
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
        <Hero />
        <TrustBar />
        <PricingSection />
        <PriceCalculator />
        <ProblemsSolution />
        <BeforeAfter />
        <HowItWorks />
        <Benefits />
        <ServiceArea />
        <HomeServicesPromo />
        <Testimonials
          googleReviews={autoReviews}
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
          googleProfileUrl={place.profileUrl}
        />
        <MidCTA />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
