import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { SITE, waLink } from "@/lib/site";
import { findPlan } from "@/lib/plans";
import { getGooglePlaceData } from "@/lib/reviews";
import { CheckIcon, WhatsAppIcon, PhoneIcon, ArrowRightIcon } from "@/components/Icon";

// Note Google rafraîchie en arrière-plan toutes les heures.
export const revalidate = 3600;

// Prix de la remise à neuf prérequise (étape 1), tiré de lib/plans → synchro.
const INTEGRALE_PRICE = findPlan("luxury")?.priceFrom ?? "139";
const PRICE = 99; // abonnement entretien : prix unique mensuel

export const metadata: Metadata = {
  title: "Abonnement entretien voiture à domicile à Strasbourg — StrasClean",
  description: `Réservé aux clients Intégrale : gardez votre voiture comme neuve toute l'année avec un entretien mensuel intérieur + extérieur à domicile, ${PRICE} €/mois. Prix unique, sans supplément, sans engagement.`,
  alternates: { canonical: "/abonnement" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE.url}/abonnement`,
    siteName: SITE.name,
    title: "Abonnement entretien voiture à domicile — StrasClean",
    description: `Après votre remise à neuf Intégrale, votre voiture reste comme neuve pour ${PRICE} €/mois. Prix unique, sans supplément.`,
    locale: "fr_FR",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Abonnement entretien voiture à domicile — StrasClean",
      },
    ],
  },
};

const HERO_POINTS = [
  "Intérieur + extérieur entretenus chaque mois",
  "Toujours propre, toujours frais — sans y penser",
  "Prix unique, sans supplément, sans engagement",
  "À domicile, créneau prioritaire",
];

const INCLUDED = [
  "Entretien intérieur : aspiration, plastiques, vitres",
  "Désodorisation & parfum de finition",
  "Lavage extérieur à la main + jantes + vitres",
  "Créneau mensuel prioritaire, à domicile",
  "Prix unique, quel que soit le véhicule",
];

const STEPS = [
  {
    n: "1",
    title: "On remet votre voiture à neuf",
    desc: `Tout démarre par une formule Intégrale (${INTEGRALE_PRICE} €) : une vraie remise à neuf, dedans comme dehors. La base parfaite.`,
  },
  {
    n: "2",
    title: "On l'entretient chaque mois",
    desc: "Puis chaque mois, un passage d'entretien intérieur + extérieur à domicile. Léger et rapide — au juste rythme pour rester impeccable.",
  },
  {
    n: "3",
    title: "Vous ne pensez plus à rien",
    desc: "Votre voiture reste comme neuve et sent toujours bon, toute l'année. On s'occupe de tout.",
  },
];

const BENEFITS = [
  {
    emoji: "🌿",
    title: "Toujours propre, toujours frais",
    desc: "Fini la voiture qui se re-salit entre deux gros nettoyages : elle reste nickel toute l'année.",
  },
  {
    emoji: "💎",
    title: "La qualité d'un grand nettoyage, en continu",
    desc: "On maintient le niveau de l'Intégrale mois après mois, intérieur comme extérieur.",
  },
  {
    emoji: "💰",
    title: "Moins cher que tout refaire",
    desc: `${PRICE} €/mois pour garder le niveau, au lieu de repayer une Intégrale complète à chaque fois.`,
  },
  {
    emoji: "🪙",
    title: "Un seul prix, aucune surprise",
    desc: "Le même tarif pour tous, sans supplément ni option — citadine, berline, SUV ou utilitaire.",
  },
  {
    emoji: "⭐",
    title: "Créneau prioritaire",
    desc: "Abonné, vous passez avant les demandes ponctuelles.",
  },
  {
    emoji: "⏸️",
    title: "Liberté totale",
    desc: "Sans engagement : pause (vacances, hiver) ou résiliation quand vous voulez.",
  },
];

const FAQ = [
  {
    q: "L'abonnement est-il ouvert à tout le monde ?",
    a: "Il est réservé aux clients ayant fait une remise à neuf Intégrale. C'est ce qui garantit une base parfaite : l'entretien mensuel sert à MAINTENIR ce niveau, pas à rattraper une voiture jamais nettoyée en profondeur.",
  },
  {
    q: "Pourquoi un seul passage par mois ?",
    a: "D'expérience, en un mois une voiture se re-salit juste assez pour justifier un entretien — ni trop tôt, ni trop tard. C'est le rythme idéal pour rester impeccable sans payer pour rien.",
  },
  {
    q: "Y a-t-il des suppléments selon le véhicule ?",
    a: `Non. Prix unique de ${PRICE} €/mois pour tous, sans supplément ni option, que vous ayez une citadine, une berline, un SUV ou un utilitaire.`,
  },
  {
    q: "Y a-t-il un engagement ?",
    a: "Non. Vous pouvez mettre en pause ou résilier à tout moment. Tant que vous êtes abonné, votre prix est bloqué.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Paiement sécurisé par carte ou prélèvement, automatique chaque mois, avec reçu. Rien à refaire entre les passages.",
  },
  {
    q: "Le déplacement est-il inclus ?",
    a: "Oui — Strasbourg + 12 communes desservies, déplacement compris dans le prix de l'abonnement.",
  },
];

export default async function AbonnementPage() {
  const place = await getGooglePlaceData();
  const rating = place.rating;
  const reviewCount = place.totalCount;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Abonnement entretien voiture à domicile StrasClean",
    serviceType: "Abonnement entretien automobile à domicile",
    areaServed: { "@type": "City", name: SITE.city },
    provider: {
      "@type": "LocalBusiness",
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phoneDisplay,
      priceRange: "€€",
    },
    offers: {
      "@type": "Offer",
      name: "Abonnement entretien mensuel (intérieur + extérieur)",
      priceCurrency: "EUR",
      price: PRICE,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: PRICE,
        priceCurrency: "EUR",
        unitText: "MONTH",
      },
    },
  };

  const waSubscribe = waLink(
    `Bonjour StrasClean 👋 Je veux l'abonnement entretien à ${PRICE} €/mois (avec la remise à neuf Intégrale de départ). Comment je démarre ?`,
  );

  return (
    <>
      <Header />
      <main>
        {/* ── Hero + offre (tout visible d'emblée) ───────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white py-12 sm:py-16 lg:py-20">
          <div className="container-x">
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Valeur */}
              <div className="text-center lg:text-left">
                <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 before:h-px before:w-6 before:bg-brand-500 before:opacity-70 before:content-['']">
                  Abonnement entretien
                </p>
                <h1 className="h-display mt-3 text-balance text-4xl font-bold leading-[1.05] text-slate-900 sm:text-5xl">
                  Votre voiture comme neuve,{" "}
                  <span className="bg-gradient-to-r from-brand-600 to-brand-900 bg-clip-text text-transparent">
                    toute l'année.
                  </span>
                </h1>
                <p className="mt-4 text-balance text-base text-slate-600 sm:text-lg">
                  On remet votre voiture à neuf, puis on l'entretient chaque mois
                  à domicile. Vous ne pensez plus à rien : elle reste propre et
                  sent toujours bon.
                </p>

                <ul className="mx-auto mt-6 grid max-w-md gap-2.5 text-left sm:grid-cols-2 lg:mx-0">
                  {HERO_POINTS.map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500 text-[#062b1e]">
                        <CheckIcon size={12} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>

                {rating ? (
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm shadow-soft">
                    <span className="text-amber-400">★★★★★</span>
                    <span className="font-semibold text-slate-900">
                      {rating.toFixed(1)}/5
                    </span>
                    {reviewCount ? (
                      <span className="text-slate-500">
                        · {reviewCount} avis Google
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Carte offre */}
              <div className="mx-auto w-full max-w-md">
                <div className="relative rounded-[28px] border border-brand-500/40 bg-white p-6 shadow-glow sm:p-7">
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-brand-500 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.04em] text-[#062b1e] shadow-card">
                    Réservé aux clients Intégrale
                  </span>

                  <div className="pt-2 text-center">
                    <h2 className="h-display text-xl font-bold text-slate-900">
                      Abonnement Entretien
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Intérieur + extérieur · 1 passage / mois
                    </p>
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="h-display text-[56px] font-bold leading-none tracking-[-0.03em] text-slate-900">
                        {PRICE}
                      </span>
                      <span className="text-2xl font-semibold text-slate-500">
                        €
                      </span>
                      <span className="ml-1 text-base font-medium text-slate-500">
                        /mois
                      </span>
                    </div>
                    <p className="mt-2 inline-block rounded-full bg-brand-500/15 px-3 py-1 text-xs font-bold text-brand-700">
                      Prix unique · sans supplément · tout véhicule
                    </p>
                  </div>

                  <ul className="mt-6 space-y-2.5">
                    {INCLUDED.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-slate-700"
                      >
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
                          <CheckIcon size={12} />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={waSubscribe}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa mt-7 h-12 w-full text-base"
                  >
                    <WhatsAppIcon size={18} /> Je m'abonne
                  </a>
                  <p className="mt-3 text-center text-xs text-slate-500">
                    Sans engagement · Paiement sécurisé · Résiliable à tout
                    moment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Comment ça marche ──────────────────────────────────────── */}
        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="h-display text-3xl font-bold text-slate-900 sm:text-4xl">
                Comment ça marche
              </h2>
              <p className="mt-3 text-slate-600">
                On part d'une base parfaite, puis on la maintient. C'est tout.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500 text-lg font-extrabold text-[#062b1e]">
                    {s.n}
                  </span>
                  <h3 className="h-display mt-4 text-lg font-bold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-500">
              La remise à neuf de départ se fait avec la formule Intégrale.{" "}
              <Link
                href="/formules#luxury"
                className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800"
              >
                Voir l'Intégrale <ArrowRightIcon size={13} />
              </Link>
            </p>
          </div>
        </section>

        {/* ── Pourquoi l'abonnement ──────────────────────────────────── */}
        <section className="py-16 sm:py-24">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="h-display text-3xl font-bold text-slate-900 sm:text-4xl">
                Pourquoi s'abonner
              </h2>
              <p className="mt-3 text-slate-600">
                Tous les avantages d'une voiture toujours nickel, sans la
                corvée.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl">
                    {b.emoji}
                  </span>
                  <h3 className="h-display mt-4 text-base font-bold text-slate-900">
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <h2 className="h-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
                Questions fréquentes
              </h2>
              <ul className="mt-10 space-y-3">
                {FAQ.map((f) => (
                  <li
                    key={f.q}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"
                  >
                    <p className="font-semibold text-slate-900">{f.q}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {f.a}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA final ──────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24">
          <div className="container-x">
            <div className="surface-forest relative mx-auto max-w-3xl overflow-hidden rounded-[28px] p-8 text-center sm:rounded-[32px] sm:p-12">
              <h2 className="h-display text-2xl font-bold text-white sm:text-3xl">
                Une voiture toujours nickel, sans y penser ?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-balance text-white/80">
                Dites-nous votre véhicule et votre quartier : on planifie la
                remise à neuf Intégrale, puis l'entretien démarre.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={waSubscribe}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa h-12 w-full px-6 text-base sm:w-auto"
                >
                  <WhatsAppIcon size={18} /> Démarrer sur WhatsApp
                </a>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white hover:bg-white/15 sm:w-auto"
                >
                  <PhoneIcon size={16} /> Appeler
                </a>
              </div>
              <p className="mt-4 text-xs text-white/60">
                Sans engagement · Prix bloqué · Déplacement inclus
              </p>
            </div>
          </div>
        </section>
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
