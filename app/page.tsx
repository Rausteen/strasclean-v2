import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProblemsSolution from "@/components/ProblemsSolution";
import PricingSection from "@/components/PricingSection";
import ServicesGrid from "@/components/ServicesGrid";
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
import { DEFAULT_CITY } from "@/lib/services";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <ProblemsSolution />
        <PricingSection />
        <ServicesGrid city={DEFAULT_CITY} />
        <BeforeAfter />
        <HowItWorks />
        <Benefits />
        <ServiceArea />
        <Testimonials />
        <MidCTA />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
