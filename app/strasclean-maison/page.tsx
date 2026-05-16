import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import HomeBeforeAfter from "@/components/HomeBeforeAfter";
import ServiceArea from "@/components/ServiceArea";
import Reveal from "@/components/Reveal";
import {
  WhatsAppIcon,
  PhoneIcon,
  HomeIcon,
  SparklesIcon,
  CheckIcon,
  ClockIcon,
  ArrowRightIcon,
  MapPinIcon,
  StarIcon,
} from "@/components/Icon";
import { SITE, waLink } from "@/lib/site";
import { HOME_SERVICES, homeServicePath } from "@/lib/homeServices";
import { getGooglePlaceData } from "@/lib/reviews";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "StrasClean Maison — Nettoyage canapé, tapis, matelas à domicile à Strasbourg",
  description:
    "Nettoyage professionnel à domicile à Strasbourg : canapé tissu/cuir, tapis, matelas, fauteuils et chaises. Injection-extraction pro, séchage rapide, équipe de 2. Dès 39 €.",
  alternates: { canonical: "/strasclean-maison" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/strasclean-maison`,
    siteName: SITE.name,
    title:
      "StrasClean Maison — Nettoyage canapé, tapis, matelas à domicile à Strasbourg",
    description:
      "Nettoyage pro à domicile : canapé, tapis, matelas, fauteuils. Injection-extraction, séchage rapide, équipe de 2. Dès 39 €.",
    locale: "fr_FR",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "StrasClean Maison" }],
  },
};

const MESSAGE =
  "Bonjour StrasClean 👋 Je voudrais un devis pour un nettoyage à domicile (canapé / tapis / matelas / fauteuils). Quels sont vos prochains créneaux ?";

export default async function HubMaisonPage() {
  const place = await getGooglePlaceData();

  return (
    <>
      <Header />
      {/* Bandeau Maison */}
      <div className="border-b border-amber-500/15 bg-amber-500/[0.05]">
        <div className="container-x flex items-center justify-between gap-3 py-2 text-xs">
          <div className="inline-flex items-center gap-2 text-amber-200/90">
            <HomeIcon size={14} />
            <span className="font-semibold">StrasClean Maison</span>
            <span className="hidden text-amber-200/55 sm:inline">
              · Nettoyage canapé, tapis, matelas, fauteuils
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-medium text-amber-200/80 hover:text-amber-200"
          >
            Section Auto
            <ArrowRightIcon size={12} />
          </Link>
        </div>
      </div>

      <main>
        {/* HERO */}
        <section id="top" className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-radial-fade" />
            <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.30] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl" />
          </div>

          <div className="container-x pt-8 pb-14 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-200">
                  <HomeIcon size={14} />
                  Nettoyage à domicile à Strasbourg
                </span>

                <h1 className="h-display mt-4 text-balance text-[34px] font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                  Votre canapé, tapis et matelas{" "}
                  <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                    comme neufs.
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
                  StrasClean intervient chez vous pour redonner vie à vos
                  textiles d'intérieur. Injection-extraction professionnelle,
                  produits adaptés (tissu, cuir, alcantara), séchage rapide.
                  Particuliers et pros (Airbnb, hôtels, restaurants).
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row">
                  <a
                    href={waLink(MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa h-14 w-full px-6 text-base sm:h-12 sm:w-auto"
                  >
                    <WhatsAppIcon size={20} />
                    Demander un devis
                  </a>
                  <a
                    href={SITE.phoneHref}
                    className="btn-ghost h-14 w-full px-6 text-base sm:h-12 sm:w-auto"
                  >
                    <PhoneIcon size={18} />
                    {SITE.phoneDisplay}
                  </a>
                </div>

                <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-white/65 sm:mt-7 sm:text-sm">
                  <li className="inline-flex items-center gap-1.5">
                    <CheckIcon size={14} className="text-amber-300" />À domicile
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <SparklesIcon size={14} className="text-amber-300" />
                    Injection-extraction pro
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <ClockIcon size={14} className="text-amber-300" />
                    Séchage rapide
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <MapPinIcon size={14} className="text-amber-300" />
                    Strasbourg & 12 communes
                  </li>
                </ul>
              </div>

              {/* Visual placeholder */}
              <div className="relative mx-auto w-full max-w-md lg:ml-auto">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 p-5 shadow-card">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200/20 via-orange-300/15 to-amber-500/10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 place-items-center text-7xl opacity-60">
                      <span>🛋️</span>
                      <span>🧶</span>
                      <span>🛏️</span>
                      <span>🪑</span>
                    </div>
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-amber-200 backdrop-blur-md">
                      <HomeIcon size={12} />
                      Maison
                    </span>
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-amber-200 backdrop-blur-md">
                      dès 39 €
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-300">
                      <SparklesIcon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        4 prestations · 1 équipe
                      </p>
                      <p className="text-xs text-white/60">
                        Canapé · Tapis · Matelas · Fauteuils
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* GRILLE PRESTATIONS */}
        <section className="relative overflow-hidden py-14 sm:py-24 lg:py-28">
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                Nos prestations Maison
              </p>
              <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Tout votre intérieur, en une intervention.
              </h2>
              <p className="mt-4 text-white/65">
                Même matériel professionnel que pour l'auto (injecteur-extracteur),
                produits adaptés à chaque matière (tissu, cuir, alcantara), séchage
                rapide grâce à l'extraction haute puissance.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {HOME_SERVICES.map((s, i) => (
                <Reveal key={s.slug} delay={i * 60}>
                  <Link
                    href={homeServicePath(s)}
                    className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-amber-400/40 hover:bg-amber-500/[0.06]"
                  >
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-500/10 text-3xl">
                      {s.emoji}
                    </span>
                    <h3 className="h-display mt-4 text-lg font-semibold text-white">
                      {s.shortName}
                    </h3>
                    <p className="mt-1 text-sm leading-snug text-white/65">
                      {s.hero.chip === "StrasClean Maison" ? "" : s.hero.chip}
                      {tagline(s.shortName)}
                    </p>
                    <ul className="mt-3 space-y-1 text-xs text-white/55">
                      <li className="inline-flex items-center gap-1.5">
                        <ClockIcon size={12} />
                        {s.pricing.duration}
                      </li>
                    </ul>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="text-base font-bold text-amber-300">
                        dès {s.pricing.priceFrom} €
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-white/55 group-hover:text-amber-300">
                        Voir
                        <ArrowRightIcon
                          size={12}
                          className="transition group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* COMMENT ÇA SE PASSE */}
        <section className="relative overflow-hidden bg-white/[0.02] py-14 sm:py-24 lg:py-28">
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                Comment ça se passe
              </p>
              <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                Simple, transparent, rapide.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 80}>
                  <article className="card card-hover h-full">
                    <span className="h-display grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-300 font-bold">
                      {i + 1}
                    </span>
                    <h3 className="h-display mt-4 text-base font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {step.desc}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <HomeBeforeAfter />

        {/* POURQUOI STRASCLEAN MAISON */}
        <section className="relative overflow-hidden py-14 sm:py-24 lg:py-28">
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                Pourquoi nous choisir
              </p>
              <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                Le pro du textile à domicile.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {WHY.map((w, i) => (
                <Reveal key={w.title} delay={i * 60}>
                  <article className="card card-hover h-full">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-500/10 text-amber-300">
                      {w.icon}
                    </span>
                    <h3 className="h-display mt-4 text-base font-semibold text-white">
                      {w.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      {w.desc}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Testimonials
          googleReviews={place.reviews}
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
          googleProfileUrl={place.profileUrl}
        />

        <ServiceArea />

        <FAQ extraSchemaFAQs={FAQ_MAISON} />

        {/* FAQ visuelle Maison */}
        <section className="relative overflow-hidden pb-14 sm:pb-24">
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <div className="flex items-center gap-2 text-amber-300">
                  <SparklesIcon size={16} />
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]">
                    Questions Maison
                  </p>
                </div>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {FAQ_MAISON.map((q) => (
                    <li
                      key={q.q}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                    >
                      <p className="text-sm font-semibold text-white">{q.q}</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">
                        {q.a}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA final */}
        <section className="relative overflow-hidden py-14 sm:py-20">
          <div className="container-x">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-ink-800 to-ink-900 p-8 text-center sm:p-12">
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-amber-500/25 blur-3xl" />
                <h2 className="h-display mx-auto max-w-2xl text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  Une question ? Un devis ? On répond rapidement.
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-white/75">
                  Envoyez quelques photos sur WhatsApp, on revient avec un tarif
                  précis et un créneau adapté.
                </p>
                <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                  <a
                    href={waLink(MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa h-12 px-6"
                  >
                    <WhatsAppIcon size={18} />
                    WhatsApp
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
    </>
  );
}

function tagline(name: string): string {
  switch (name) {
    case "Nettoyage canapé":
      return " Tissu, cuir, alcantara — séchage rapide.";
    case "Nettoyage tapis":
      return " Sans déplacement, sans auréole.";
    case "Nettoyage matelas":
      return " Acariens, taches, transpiration.";
    case "Fauteuils & chaises":
      return " Lot complet en une intervention.";
    default:
      return "";
  }
}

const STEPS = [
  {
    title: "Envoyez-nous une photo",
    desc: "Quelques photos par WhatsApp suffisent. On évalue, on vous propose un tarif et un créneau.",
  },
  {
    title: "On vient chez vous",
    desc: "Intervention à domicile à Strasbourg ou en proche banlieue. Équipe de 2, matériel mobile.",
  },
  {
    title: "Nettoyage en profondeur",
    desc: "Injection-extraction professionnelle. La saleté est décrochée et aspirée, pas étalée.",
  },
  {
    title: "Séchage rapide",
    desc: "Le textile ressort presque sec grâce à l'extraction haute puissance. Utilisable le jour même.",
  },
];

const WHY = [
  {
    icon: <SparklesIcon size={18} />,
    title: "Matériel pro",
    desc: "Injecteur-extracteur professionnel, le même que pour le detailing auto. Bien au-delà d'un shampoing maison.",
  },
  {
    icon: <ClockIcon size={18} />,
    title: "Séchage rapide",
    desc: "Le textile ressort presque sec — utilisable le jour même grâce à l'extraction haute puissance.",
  },
  {
    icon: <CheckIcon size={18} />,
    title: "Produits adaptés",
    desc: "Tissu, alcantara, cuir : on adapte le produit à chaque matière pour ne rien abîmer.",
  },
  {
    icon: <HomeIcon size={18} />,
    title: "À domicile",
    desc: "Pas de transport, pas de pressing. On vient chez vous avec tout le matériel.",
  },
  {
    icon: <MapPinIcon size={18} />,
    title: "Strasbourg & alentours",
    desc: "12 communes desservies autour de Strasbourg. Déplacement inclus dans le tarif annoncé.",
  },
  {
    icon: <StarIcon size={18} />,
    title: "B2C + B2B léger",
    desc: "Particuliers, mais aussi Airbnb, hôtels, restaurants, bureaux. Facture pro avec TVA.",
  },
];

const FAQ_MAISON = [
  {
    q: "Vous intervenez à mon domicile à Strasbourg ?",
    a: "Oui — c'est l'essence du service. On vient avec tout le matériel mobile, on travaille directement chez vous (ou à votre local pro). Strasbourg + 12 communes alentours, déplacement inclus.",
  },
  {
    q: "Combien de temps avant de pouvoir utiliser mon canapé / matelas / tapis ?",
    a: "Grâce à l'extraction haute puissance, le textile ressort presque sec. Comptez 2 à 4 heures pour un séchage complet à température ambiante. Vous récupérez l'usage de votre intérieur le jour même.",
  },
  {
    q: "Vous traitez tous types de tissus ?",
    a: "Oui — coton, polyester, lin, microfibre, alcantara, velours, cuir, simili. Le produit est adapté à chaque matière. Pour les tissus très précieux (vieux tapis persan, cuir Nappa), protocole spécifique sur demande.",
  },
  {
    q: "Vous avez une offre pour les pros (Airbnb, hôtels, restaurants) ?",
    a: "Oui, on développe une offre B2B : nettoyage entre locataires Airbnb (intervention dans la journée), entretien régulier d'hôtels, restaurants, bureaux, cabinets. Tarif dégressif selon volume, facture pro avec TVA, contrat d'entretien possible.",
  },
  {
    q: "Quels moyens de paiement ?",
    a: "Espèces, carte bancaire, virement, facture pro avec TVA. Paiement sur place après validation du résultat.",
  },
  {
    q: "Combien de temps avant d'avoir un créneau ?",
    a: "Généralement 2-5 jours selon notre planning. Pour les cas urgents (Airbnb avec arrivée, tache fraîche), on essaie de caler dans la journée ou le lendemain. Envoyez-nous un message WhatsApp avec une photo, on vous répond rapidement.",
  },
];
