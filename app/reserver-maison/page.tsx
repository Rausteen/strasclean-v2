import type { Metadata } from "next";
import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import BookingForm from "@/components/BookingForm";
import { SITE } from "@/lib/site";
import { HOME_SERVICES } from "@/lib/homeServices";

export const metadata: Metadata = {
  title: "Réserver un nettoyage à domicile à Strasbourg — StrasClean Maison",
  description:
    "Réservez en ligne un nettoyage canapé, tapis, matelas ou fauteuils à domicile à Strasbourg. Formulaire en 1 minute, confirmation par téléphone ou WhatsApp sous 1 h.",
  alternates: { canonical: "/reserver-maison" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/reserver-maison`,
    siteName: SITE.name,
    title: "Réserver un nettoyage à domicile — StrasClean Maison",
    description:
      "Formulaire de réservation en ligne. Confirmation sous 1 h.",
    locale: "fr_FR",
    images: [
      {
        url: "/og-maison.svg",
        width: 1200,
        height: 630,
        alt: "Réserver un nettoyage à domicile — StrasClean Maison",
      },
    ],
  },
};

export default function ReserverMaisonPage() {
  // Préparation des données serveur passées au composant client.
  // Évite à BookingForm d'importer toute la lib HOME_SERVICES côté client.
  const services = HOME_SERVICES.map((s) => ({
    slug: s.slug,
    shortName: s.shortName,
    emoji: s.emoji,
    priceFrom: s.pricing.priceFrom,
    duration: s.pricing.duration,
  }));

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-white to-white py-12 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 before:h-px before:w-6 before:bg-amber-500 before:opacity-70 before:content-['']">
                Réservation en ligne
              </p>
              <h1 className="h-display mt-3 text-balance text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Réservez votre nettoyage à domicile en 1 minute.
              </h1>
              <p className="mt-4 text-balance text-base text-slate-600 sm:text-lg">
                Choisissez votre prestation, indiquez votre créneau préféré et
                vos coordonnées. On vous confirme par téléphone ou WhatsApp
                sous 1 h ouvrée.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-2xl">
              <BookingForm services={services} />
            </div>

            <div className="mx-auto mt-8 max-w-2xl text-center text-xs text-slate-500">
              <p>
                Vos données ne servent qu'à traiter votre demande. Aucune
                inscription, aucune newsletter automatique. Voir{" "}
                <a
                  href="/politique-de-confidentialite"
                  className="underline hover:text-slate-700"
                >
                  notre politique de confidentialité
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
