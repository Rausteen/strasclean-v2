import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import MaisonServicesGrid from "@/components/MaisonServicesGrid";
import MaisonTrustSection from "@/components/MaisonTrustSection";
import Reveal from "@/components/Reveal";
import {
  WhatsAppIcon,
  PhoneIcon,
  HomeIcon,
  SparklesIcon,
  CheckIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "@/components/Icon";
import { SITE, waLink, openingHoursJsonLd } from "@/lib/site";
import { getGooglePlaceData } from "@/lib/reviews";

export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "Qui sommes-nous — StrasClean Maison · Nettoyage textile à domicile à Strasbourg",
  description:
    "Découvrez StrasClean Maison : équipe locale strasbourgeoise spécialisée en nettoyage textile à domicile (canapé, tapis, matelas, fauteuils). Notre histoire, nos valeurs, notre matériel, nos engagements.",
  alternates: { canonical: "/strasclean-maison/qui-sommes-nous" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/strasclean-maison/qui-sommes-nous`,
    siteName: SITE.name,
    title: "Qui sommes-nous — StrasClean Maison",
    description:
      "Notre histoire, notre équipe, nos engagements pour le nettoyage textile à domicile à Strasbourg.",
    locale: "fr_FR",
    images: [
      {
        url: "/og-maison.svg",
        width: 1200,
        height: 630,
        alt: "Qui sommes-nous — StrasClean Maison",
      },
    ],
  },
};

const MESSAGE =
  "Bonjour StrasClean 👋 J'ai une question sur votre équipe et vos services Maison. Pouvez-vous me rappeler ?";

export default async function QuiSommesNousPage() {
  const place = await getGooglePlaceData();

  const aboutJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE.url}/strasclean-maison/qui-sommes-nous`,
    name: "Qui sommes-nous — StrasClean Maison",
    description:
      "Histoire, équipe, valeurs et engagements de StrasClean Maison à Strasbourg.",
    mainEntity: {
      "@type": "LocalBusiness",
      name: `${SITE.name} Maison`,
      url: `${SITE.url}/strasclean-maison`,
      telephone: SITE.phoneDisplay,
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.city,
        addressRegion: SITE.region,
        addressCountry: SITE.country,
      },
      areaServed: { "@type": "City", name: SITE.city },
      openingHoursSpecification: openingHoursJsonLd(),
      ...(SITE.socials.length > 0 ? { sameAs: SITE.socials } : {}),
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
        name: "StrasClean Maison",
        item: `${SITE.url}/strasclean-maison`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Qui sommes-nous",
        item: `${SITE.url}/strasclean-maison/qui-sommes-nous`,
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
            <div className="absolute -top-32 left-1/2 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-amber-500/20 blur-2xl sm:blur-3xl" />
          </div>

          <div className="container-x pt-8 pb-12 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
            <div className="mx-auto max-w-3xl text-center">
              <nav aria-label="Fil d'ariane" className="mb-4 text-xs">
                <Link
                  href="/strasclean-maison"
                  className="font-medium text-white/65 hover:text-white/80"
                >
                  StrasClean Maison
                </Link>
                <span className="mx-1.5 text-white/30">/</span>
                <span className="text-white/75">Qui sommes-nous</span>
              </nav>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-200">
                <HomeIcon size={14} />
                StrasClean Maison
              </span>

              <h1 className="h-display mt-4 text-balance text-[32px] font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                Une équipe locale qui prend soin de votre intérieur{" "}
                <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  comme du sien.
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
                StrasClean Maison, c'est une équipe strasbourgeoise spécialisée
                dans le nettoyage textile professionnel à domicile. Même équipe
                que StrasClean Auto, mêmes outils, même rigueur — appliquée à
                votre canapé, tapis, matelas et fauteuils.
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
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Notre histoire
                </p>
                <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                  De l'auto au textile d'intérieur — une expertise transposée.
                </h2>
                <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-white/75">
                  <p>
                    StrasClean est née d'une idée simple : démocratiser le
                    nettoyage automobile à domicile à Strasbourg. Plus de
                    déplacement, plus d'attente en station de lavage — on vient
                    chez vous, avec un matériel pro, et on rend votre véhicule
                    comme neuf.
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
                    StrasClean Maison est née comme une extension naturelle de
                    StrasClean Auto, avec la conviction que les
                    Strasbourgeois méritent un service textile pro à domicile,
                    sans avoir à transporter leur canapé dans un pressing
                    inaccessible ou à se ruiner en location de machine.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* L'ÉQUIPE */}
        <section className="relative bg-white/[0.02] py-12 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Notre équipe
                </p>
                <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                  Une équipe de 2, formée pour le textile sensible.
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
                    Chaque membre de l'équipe est formé spécifiquement aux
                    différents textiles : tissu, alcantara, velours, cuir
                    pleine fleur, Nappa, semi-aniline. Chaque matière demande
                    un produit et une technique différente — on ne fait pas
                    l'erreur d'appliquer le mauvais sur le mauvais.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* L'ÉQUIPEMENT */}
        <section className="relative py-12 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Notre matériel
                </p>
                <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                  Du matériel pro, le même que pour le detailing automobile.
                </h2>
                <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-white/75">
                  <p>
                    L'<strong className="text-white">injecteur-extracteur</strong>{" "}
                    est notre outil principal. Il envoie de l'eau chaude
                    additionnée d'un produit doux dans la fibre textile, puis
                    aspire immédiatement la solution sale. Résultat : la
                    saleté profonde est extraite, sans laisser d'auréole ni
                    d'humidité résiduelle.
                  </p>
                  <p>
                    On utilise aussi : aspirateur professionnel avec filtre
                    HEPA (pour les matelas et les allergies), turbo-brosse
                    électrique (pour les poils d'animaux incrustés), détachants
                    spécifiques par type de tache (tanins, gras, organique),
                    et produits cuir pH-neutre + baume nourrissant.
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

        {/* NOS VALEURS */}
        <section className="relative bg-white/[0.02] py-12 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Nos engagements
                </p>
                <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                  5 principes que vous trouverez sur chaque intervention.
                </h2>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {VALUES.map((v) => (
                    <li
                      key={v.title}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-300"
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

        <MaisonTrustSection
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
        />

        <MaisonServicesGrid />

        {/* CTA final */}
        <section className="relative overflow-hidden py-12 sm:py-20">
          <div className="container-x">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-ink-800 to-ink-900 p-6 text-center sm:p-12">
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-amber-500/25 blur-2xl sm:blur-3xl" />
                <h2 className="h-display mx-auto max-w-2xl text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  Une question sur notre équipe ou nos méthodes ?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/75">
                  Posez-la directement par WhatsApp ou téléphone. On répond
                  rapidement.
                </p>
                <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                  <a
                    href={waLink(MESSAGE)}
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
                  <Link
                    href="/strasclean-maison"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white/80 hover:bg-white/10"
                  >
                    Voir l'offre Maison
                    <ArrowRightIcon size={14} />
                  </Link>
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
