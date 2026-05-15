import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProblemsSolution from "@/components/ProblemsSolution";
import PricingSection from "@/components/PricingSection";
import BeforeAfter from "@/components/BeforeAfter";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import ServiceArea from "@/components/ServiceArea";
import Testimonials from "@/components/Testimonials";
import MidCTA from "@/components/MidCTA";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getGoogleReviews } from "@/lib/reviews";

// Régénération en arrière-plan toutes les heures pour refléter les
// nouveaux avis Google sans avoir à rebuild.
export const revalidate = 3600;

export default async function Page() {
  const googleReviews = await getGoogleReviews();

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        <Hero />
        <TrustBar />
        <ProblemsSolution />
        <PricingSection />
        <BeforeAfter />
        <HowItWorks />
        <Benefits />
        <ServiceArea />
        <Testimonials googleReviews={googleReviews} />
        <MidCTA />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
