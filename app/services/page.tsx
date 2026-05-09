import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import TrustBar from "@/components/TrustBar";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Reveal from "@/components/Reveal";
import {
  WhatsAppIcon,
  PhoneIcon,
  ArrowRightIcon,
  MapPinIcon,
  ClockIcon,
  CheckIcon,
} from "@/components/Icon";
import { SITE, waLink } from "@/lib/site";
import { CITIES } from "@/lib/cities";
import { SERVICES, servicePath } from "@/lib/services";

const TITLE = "Nos prestations — Nettoyage auto à domicile à Strasbourg";
const DESCRIPTION =
  "Toutes les prestations StrasClean : detailing auto, shampouinage sièges, nettoyage poils d'animaux, nettoyage intérieur, lavage à domicile. Réservation rapide par WhatsApp.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/services`,
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    locale: "fr_FR",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "StrasClean — nos prestations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.svg"],
  },
  keywords: [
    "detailing auto Strasbourg",
    "shampouinage sièges voiture Strasbourg",
    "nettoyage intérieur voiture Strasbourg",
    "lavage auto domicile Strasbourg",
    "nettoyage poils d'animaux voiture Strasbourg",
  ],
};

export default function ServicesHubPage() {
  // ItemList JSON-LD pour signaler explicitement la liste des prestations
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Prestations StrasClean",
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${SITE.url}${servicePath(s, CITIES[0])}`,
    })),
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero hub */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-radial-fade" />
            <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
          </div>

          <div className="container-x pt-8 pb-14 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
            <div className="mx-auto max-w-3xl text-center">
              <nav aria-label="Fil d'ariane" className="mb-5 text-xs">
                <Link href="/" className="font-medium text-white/55 hover:text-white/80">
                  StrasClean
                </Link>
                <span className="mx-1.5 text-white/30">/</span>
                <span className="text-white/75">Prestations</span>
              </nav>

              <span className="chip mx-auto">
                <span className="text-base leading-none">✨</span>
                Toutes nos prestations
              </span>

              <h1 className="h-display mt-4 text-balance text-[34px] font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                Nos prestations de{" "}
                <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 bg-clip-text text-transparent">
                  nettoyage auto à domicile.
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
                Choisissez la prestation qui correspond à votre véhicule, puis
                la commune d'intervention. StrasClean se déplace dans toute
                l'eurométropole de Strasbourg.
              </p>

              <div className="mx-auto mt-6 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-7 sm:max-w-none sm:flex-row sm:justify-center">
                <a
                  href={SITE.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa h-14 w-full px-6 text-base sm:h-12 sm:w-auto"
                >
                  <WhatsAppIcon size={20} />
                  Réserver sur WhatsApp
                </a>
                <a
                  href={SITE.phoneHref}
                  className="btn-ghost h-14 w-full px-6 text-base sm:h-12 sm:w-auto"
                >
                  <PhoneIcon size={18} />
                  Appeler maintenant
                </a>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Liste des services avec villes */}
        <section className="relative py-14 sm:py-24 lg:py-28">
          <div className="container-x">
            <div className="space-y-10 sm:space-y-14">
              {SERVICES.map((s, i) => (
                <Reveal key={s.slug} delay={i * 60}>
                  <article
                    id={s.slug}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-9"
                  >
                    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                      {/* Description */}
                      <div className="lg:col-span-5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-2xl">
                            {s.emoji}
                          </span>
                          <div>
                            <h2 className="h-display text-xl font-bold text-white sm:text-2xl">
                              {s.name}
                            </h2>
                            <p className="mt-0.5 inline-flex items-center gap-2 text-xs text-white/55">
                              <ClockIcon size={12} />
                              {s.duration}
                              <span className="text-white/30">·</span>
                              <span>À partir de {s.priceFrom} €</span>
                            </p>
                          </div>
                        </div>

                        <p className="mt-4 text-sm text-white/75 sm:text-base">
                          {s.shortDesc}
                        </p>

                        <ul className="mt-5 space-y-2.5">
                          {s.whatsIncluded.slice(0, 4).map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-3 text-sm text-white/85"
                            >
                              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500 text-ink-950">
                                <CheckIcon size={12} />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>

                        <a
                          href={waLink(s.ctaMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-wa mt-6"
                        >
                          <WhatsAppIcon size={16} /> Réserver cette prestation
                        </a>
                      </div>

                      {/* Choix de la ville */}
                      <div className="lg:col-span-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
                          Choisissez votre ville
                        </p>
                        <p className="mt-2 text-sm text-white/65">
                          Page dédiée à <strong className="text-white">{s.shortName.toLowerCase()}</strong> dans chaque commune desservie :
                        </p>

                        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {CITIES.map((c) => (
                            <li key={c.slug}>
                              <Link
                                href={servicePath(s, c)}
                                className="group flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white/85 transition hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-brand-500/10 hover:text-white"
                              >
                                <span className="inline-flex items-center gap-2 truncate">
                                  <MapPinIcon size={14} className="shrink-0 text-brand-400" />
                                  <span className="truncate">{c.name}</span>
                                </span>
                                <ArrowRightIcon
                                  size={12}
                                  className="shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-brand-400"
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </>
  );
}
