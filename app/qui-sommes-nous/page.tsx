import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Reveal from "@/components/Reveal";
import {
  WhatsAppIcon,
  PhoneIcon,
  CarIcon,
  HomeIcon,
  SparklesIcon,
  CheckIcon,
  MapPinIcon,
  ArrowRightIcon,
  ClockIcon,
} from "@/components/Icon";
import { SITE, openingHoursJsonLd } from "@/lib/site";
import { getGooglePlaceData } from "@/lib/reviews";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Qui sommes-nous — StrasClean · Auto et Maison",
  description:
    "StrasClean est une équipe locale strasbourgeoise spécialisée dans le nettoyage à domicile : voiture (intérieur, shampouinage, detailing) et textile maison (canapé, tapis, matelas, fauteuils). Notre histoire, notre équipe, notre matériel.",
  alternates: { canonical: "/qui-sommes-nous" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/qui-sommes-nous`,
    siteName: SITE.name,
    title: "Qui sommes-nous — StrasClean",
    description:
      "Équipe locale, matériel pro, nettoyage à domicile à Strasbourg — Auto et Maison.",
    locale: "fr_FR",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "StrasClean — qui sommes-nous",
      },
    ],
  },
};

export default async function QuiSommesNousPage() {
  const place = await getGooglePlaceData();

  const aboutJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE.url}/qui-sommes-nous`,
    name: "Qui sommes-nous — StrasClean",
    description:
      "Histoire, équipe, valeurs et engagements de StrasClean à Strasbourg.",
    mainEntity: {
      "@type": "LocalBusiness",
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phoneDisplay,
      priceRange: "€€",
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.city,
        addressRegion: SITE.region,
        addressCountry: SITE.country,
      },
      areaServed: { "@type": "City", name: SITE.city },
      openingHoursSpecification: openingHoursJsonLd(),
      ...(SITE.socials.length > 0 ? { sameAs: SITE.socials } : {}),
      ...(place.rating && place.totalCount
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: place.rating.toFixed(1),
              reviewCount: String(place.totalCount),
              bestRating: "5",
              worstRating: "1",
            },
          }
        : {}),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Qui sommes-nous",
        item: `${SITE.url}/qui-sommes-nous`,
      },
    ],
  };

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        {/* HERO */}
        <section id="top" className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-radial-fade" />
            <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.30] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <div className="absolute -top-32 left-1/2 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-2xl sm:blur-3xl" />
          </div>

          <div className="container-x pt-8 pb-12 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
            <div className="mx-auto max-w-3xl text-center">
              <nav aria-label="Fil d'ariane" className="mb-4 text-xs">
                <Link href="/" className="font-medium text-white/65 hover:text-white/80">
                  Accueil
                </Link>
                <span className="mx-1.5 text-white/30">/</span>
                <span className="text-white/75">Qui sommes-nous</span>
              </nav>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-200">
                <SparklesIcon size={14} />
                StrasClean
              </span>

              <h1 className="h-display mt-4 text-balance text-[32px] font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                Une équipe locale qui prend soin de votre voiture{" "}
                <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 bg-clip-text text-transparent">
                  et de votre intérieur.
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
                StrasClean est une équipe strasbourgeoise spécialisée dans le
                nettoyage professionnel à domicile. Deux activités, une même
                équipe, un même matériel pro, une même exigence — pour votre
                voiture comme pour votre canapé.
              </p>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* L'HISTOIRE */}
        <section className="relative py-12 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
                  Notre histoire
                </p>
                <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                  De l'auto au textile d'intérieur — une expertise transposée.
                </h2>
                <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-white/75">
                  <p>
                    StrasClean est née d'une idée simple : démocratiser le
                    nettoyage automobile à domicile à Strasbourg. Plus de
                    déplacement, plus d'attente en station, plus de
                    compromis sur la qualité. On vient chez vous, avec un
                    matériel pro, et on rend votre véhicule comme neuf.
                  </p>
                  <p>
                    Très vite, nos clients nous ont demandé{" "}
                    <strong className="text-white">
                      « Vous pourriez aussi nettoyer mon canapé ? »
                    </strong>{" "}
                    La réponse était évidente : notre matériel
                    d'injection-extraction professionnel — celui qu'on utilise
                    sur les sièges auto — fonctionne aussi bien sur les
                    canapés, tapis, matelas et fauteuils. Même protocole, même
                    rigueur, même exigence.
                  </p>
                  <p>
                    Aujourd'hui, StrasClean a deux verticales complémentaires :
                    <strong className="text-white"> StrasClean Auto</strong> (notre
                    activité historique, plus de 100 véhicules nettoyés) et
                    <strong className="text-white"> StrasClean Maison</strong> (canapés,
                    tapis, matelas, fauteuils). C'est la même équipe, le même
                    matériel, et la même qualité partout.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* DEUX VERTICALES */}
        <section className="relative bg-white/[0.02] py-12 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-5xl">
              <Reveal className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
                  Deux activités
                </p>
                <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                  Auto et Maison — sous une même marque.
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-white/70">
                  Choisissez la section qui correspond à votre besoin. Vous
                  pouvez aussi nous demander les deux dans la même intervention.
                </p>
              </Reveal>

              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                <Link
                  href="/"
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-brand-400/40 hover:bg-brand-500/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-300"
                    >
                      <CarIcon size={22} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
                        StrasClean Auto
                      </p>
                      <h3 className="h-display text-lg font-semibold text-white">
                        Nettoyage voiture à domicile
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/65">
                    Intérieur, shampouinage, désinfection, lavage extérieur,
                    detailing complet. 3 formules (Confort, Premium, Luxury)
                    de 39 à 119 €. À Strasbourg + 12 communes.
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-white/65">
                    <li className="inline-flex items-center gap-1.5">
                      <CheckIcon size={12} className="text-brand-400" />
                      100+ véhicules nettoyés
                    </li>
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-300">
                    Découvrir l'offre Auto
                    <ArrowRightIcon size={14} />
                  </span>
                </Link>

                <Link
                  href="/strasclean-maison"
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-amber-400/40 hover:bg-amber-500/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-300"
                    >
                      <HomeIcon size={22} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                        StrasClean Maison
                      </p>
                      <h3 className="h-display text-lg font-semibold text-white">
                        Nettoyage canapé, tapis, matelas
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/65">
                    Tissu, cuir, alcantara — injection-extraction
                    professionnelle à votre domicile. Canapés (dès 79 €),
                    tapis, matelas, fauteuils & chaises.
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-white/65">
                    <li className="inline-flex items-center gap-1.5">
                      <CheckIcon size={12} className="text-amber-400" />
                      Particuliers + B2B (Airbnb, hôtels, restaurants)
                    </li>
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-amber-300">
                    Découvrir l'offre Maison
                    <ArrowRightIcon size={14} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* L'ÉQUIPE */}
        <section className="relative py-12 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
                  Notre équipe
                </p>
                <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                  Une équipe de 2, formée sur tous les textiles.
                </h2>
                <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-white/75">
                  <p>
                    Sur chaque intervention, on est{" "}
                    <strong className="text-white">2 sur place</strong>. Cette
                    organisation a deux conséquences directes :
                  </p>
                  <ul className="space-y-2 pl-5">
                    <li className="list-disc">
                      <strong className="text-white">2× plus rapide</strong> :
                      ce qu'un detailer solo fait en 3 h, on le fait en 1h30.
                    </li>
                    <li className="list-disc">
                      <strong className="text-white">2 paires d'yeux</strong> :
                      on repère les taches que l'autre n'aurait pas vues,
                      double contrôle qualité à la fin.
                    </li>
                  </ul>
                  <p>
                    Chaque membre de l'équipe est formé sur les protocoles
                    spécifiques : sièges auto (tissu, alcantara, cuir),
                    moquette, tableau de bord, canapés (tissu, Nappa,
                    semi-aniline), tapis (synthétique, laine, persan), matelas
                    (acariens, taches biologiques). Chaque matière demande un
                    produit et une technique différents — pas d'approche
                    universelle qui abîme la matière.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* MATÉRIEL */}
        <section className="relative bg-white/[0.02] py-12 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
                  Notre matériel
                </p>
                <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                  Le même équipement pro, en auto comme en maison.
                </h2>
                <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-white/75">
                  <p>
                    L'<strong className="text-white">injecteur-extracteur</strong>{" "}
                    est notre outil principal. Il envoie de l'eau chaude
                    additionnée d'un produit doux dans la fibre textile, puis
                    aspire immédiatement la solution sale. Résultat : la
                    saleté profonde est extraite, sans laisser d'auréole ni
                    d'humidité résiduelle. Ça marche sur les sièges auto, les
                    canapés, les tapis, les matelas.
                  </p>
                  <p>
                    On utilise aussi : aspirateur professionnel avec filtre
                    HEPA (pour les matelas et les allergies), turbo-brosse
                    électrique (pour les poils d'animaux incrustés),
                    détachants spécifiques par type de tache (tanins, gras,
                    organique), et produits cuir pH-neutre + baume nourrissant.
                  </p>
                  <p>
                    Tous nos produits viennent de marques pro reconnues du
                    detailing :{" "}
                    <strong className="text-white">
                      Koch Chemie, Sonax, Colourlock, Gyeon
                    </strong>
                    . On n'utilise jamais de mousse en bombe ou de produits
                    grande surface — ils dégradent les fibres et laissent des
                    résidus.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ENGAGEMENTS */}
        <section className="relative py-12 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
                  Nos engagements
                </p>
                <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                  6 principes que vous trouverez sur chaque intervention.
                </h2>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {VALUES.map((v) => (
                    <li
                      key={v.title}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300"
                      >
                        {v.icon}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {v.title}
                        </p>
                        <p className="mt-1 text-xs text-white/65">
                          {v.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* HORAIRES + ZONES */}
        <section className="relative bg-white/[0.02] py-12 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-center gap-2 text-brand-300">
                      <ClockIcon size={16} />
                      <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                        Horaires
                      </p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-white">
                      7j/7 — 8h à 22h
                    </p>
                    <p className="mt-1 text-sm text-white/65">
                      Y compris les week-ends. Réservation par WhatsApp ou
                      téléphone, on revient vers vous rapidement.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-center gap-2 text-brand-300">
                      <MapPinIcon size={16} />
                      <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                        Zones desservies
                      </p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-white">
                      Strasbourg + 12 communes
                    </p>
                    <p className="mt-1 text-sm text-white/65">
                      Schiltigheim, Illkirch, Ostwald, Lingolsheim,
                      Bischheim, Hœnheim, Eckbolsheim, Oberhausbergen,
                      Mundolsheim, Vendenheim, La Wantzenau. Déplacement
                      inclus.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="relative overflow-hidden py-12 sm:py-20">
          <div className="container-x">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-brand-400/30 bg-gradient-to-br from-brand-500/15 via-ink-800 to-ink-900 p-6 text-center sm:p-12">
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/25 blur-2xl sm:blur-3xl" />
                <h2 className="h-display mx-auto max-w-2xl text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  Une question sur notre équipe ou nos méthodes ?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/75">
                  Posez-la directement par WhatsApp ou téléphone. On répond
                  rapidement, 7 jours sur 7.
                </p>
                <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                  <a
                    href={SITE.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa h-12 px-6"
                  >
                    <WhatsAppIcon size={18} />
                    Nous écrire
                  </a>
                  <a href={SITE.phoneHref} className="btn-ghost h-12 px-6">
                    <PhoneIcon size={16} />
                    {SITE.phoneDisplay}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

const VALUES = [
  {
    icon: <CheckIcon size={16} />,
    title: "Devis ferme avant intervention",
    desc: "Le prix annoncé est le prix payé. Jamais de surcoût surprise sur place.",
  },
  {
    icon: <SparklesIcon size={16} />,
    title: "Matériel pro adapté",
    desc: "Injecteur-extracteur, aspirateur HEPA, produits Koch Chemie / Sonax.",
  },
  {
    icon: <HomeIcon size={16} />,
    title: "À domicile, équipe de 2",
    desc: "On vient chez vous. Zéro déplacement, zéro transport, zéro pressing.",
  },
  {
    icon: <MapPinIcon size={16} />,
    title: "Local strasbourgeois",
    desc: "Strasbourg + 12 communes alentours. Déplacement inclus dans le tarif.",
  },
  {
    icon: <SparklesIcon size={16} />,
    title: "Garantie résultat",
    desc: "Si une tache traitable ne part pas, on revient gratuitement.",
  },
  {
    icon: <CheckIcon size={16} />,
    title: "Facture pro pour les pros",
    desc: "TVA récupérable pour les artisans, Airbnb, hôtels, restaurants.",
  },
];
