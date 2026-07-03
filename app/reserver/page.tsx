import type { Metadata } from "next";
import Header from "@/components/Header";
import ReservationWizard from "@/components/ReservationWizard";
import { SITE } from "@/lib/site";
import { BOOKING_FORMULAS } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Réserver un nettoyage auto à domicile à Strasbourg — StrasClean",
  description:
    "Réservez en ligne votre nettoyage auto à domicile à Strasbourg : formule, créneau à l'heure précise, adresse. Confirmation immédiate, paiement sur place, sans engagement.",
  alternates: { canonical: "/reserver" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/reserver`,
    siteName: SITE.name,
    title: "Réserver un nettoyage auto à domicile — StrasClean",
    description:
      "Choisissez votre formule, votre créneau et confirmez. Paiement sur place, sans engagement.",
    locale: "fr_FR",
  },
};

export default async function ReserverPage({
  searchParams,
}: {
  searchParams: Promise<{ formule?: string }>;
}) {
  const { formule } = await searchParams;
  const initialFormula = BOOKING_FORMULAS.some((f) => f.id === formule)
    ? formule!
    : "";
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-slate-50">
        <div className="container-x pt-8 text-center sm:pt-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-soft ring-1 ring-brand-100">
            ⭐ 5,0/5 · à domicile · sans engagement
          </p>
          <h1 className="h-display mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Réservez votre{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
              nettoyage
            </span>
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            En 1 minute · créneau garanti · paiement sur place
          </p>
        </div>
        <ReservationWizard initialFormula={initialFormula} />
      </main>
    </>
  );
}
