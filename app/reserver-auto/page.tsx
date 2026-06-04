import type { Metadata } from "next";
import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import BookingForm from "@/components/BookingForm";
import { SITE } from "@/lib/site";
import { PLANS, VEHICLE_TYPES } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Réserver un nettoyage voiture à domicile à Strasbourg — StrasClean",
  description:
    "Réservez en ligne votre nettoyage auto à domicile à Strasbourg : Confort 39 €, Premium 79 €, Luxury 119 €. Formulaire en 1 minute, confirmation par téléphone ou WhatsApp sous 1 h.",
  alternates: { canonical: "/reserver-auto" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/reserver-auto`,
    siteName: SITE.name,
    title: "Réserver un nettoyage voiture à domicile — StrasClean",
    description:
      "Formulaire de réservation en ligne. Confirmation sous 1 h.",
    locale: "fr_FR",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Réserver un nettoyage voiture à domicile — StrasClean",
      },
    ],
  },
};

export default function ReserverAutoPage() {
  const items = PLANS.map((p) => ({
    id: p.id,
    shortName: p.name.replace(/^Formule /, ""),
    emoji: p.emoji,
    priceFrom: p.priceFrom,
    duration:
      p.id === "confort"
        ? "1h–1h30"
        : p.id === "premium"
          ? "2h–3h"
          : "3h–4h",
  }));

  // Picker véhicule à l'étape 2 (vs texte libre côté Maison)
  const variantPicker = {
    label: "Type de véhicule",
    options: VEHICLE_TYPES.map((v) => ({
      id: v.id,
      label: v.label,
      emoji: v.emoji,
      hint: v.surcharge === 0 ? "Inclus" : `+${v.surcharge} €`,
    })),
  };

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white py-12 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 before:h-px before:w-6 before:bg-brand-500 before:opacity-70 before:content-['']">
                Réservation en ligne
              </p>
              <h1 className="h-display mt-3 text-balance text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Réservez votre nettoyage voiture en 1 minute.
              </h1>
              <p className="mt-4 text-balance text-base text-slate-600 sm:text-lg">
                Choisissez votre formule et votre véhicule, indiquez votre
                créneau préféré et vos coordonnées. On vous confirme par
                téléphone ou WhatsApp sous 1 h ouvrée.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-2xl">
              <BookingForm
                section="auto"
                items={items}
                variantPicker={variantPicker}
                copy={{
                  serviceQuestion: "Quelle formule souhaitez-vous ?",
                  serviceHint:
                    "Choisissez le niveau de service. Le supplément véhicule s'ajoute ensuite.",
                  detailsQuestion: "Quelques détails pour la formule {name}.",
                  successWaMessage:
                    "Bonjour StrasClean 👋 Je viens de remplir le formulaire de réservation Auto sur le site.",
                }}
              />
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
