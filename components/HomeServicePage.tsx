import Link from "next/link";
import Header from "./Header";
import MobileOfferStrip from "./MobileOfferStrip";
import TrustBar from "./TrustBar";
import TestimonialsMaison from "./TestimonialsMaison";
import FAQ from "./FAQ";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";
import Reveal from "./Reveal";
import HomeBeforeAfter from "./HomeBeforeAfter";
import MaisonServicesGrid from "./MaisonServicesGrid";
import {
  WhatsAppIcon,
  PhoneIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
} from "./Icon";
import { SITE, waLink } from "@/lib/site";
import { UseCase } from "@/lib/usecases";
import { MAISON_GLOBAL_FAQS } from "@/lib/homeServices";
import type { PlaceData } from "@/lib/reviews";

type Props = {
  service: UseCase;
  place: PlaceData;
};

export default function HomeServicePage({ service, place }: Props) {
  const message = service.ctaMessage;
  const h1Plain = service.hero.h1.replace(service.hero.h1Highlight, "").trim();

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        {/* HERO — responsive, visuel caché sur mobile (gain d'espace) */}
        <section id="top" className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-radial-fade" />
            <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.30] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl" />
          </div>

          <div className="container-x pt-6 pb-12 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <nav aria-label="Fil d'ariane" className="mb-4 text-xs">
                  <Link
                    href="/strasclean-maison"
                    className="font-medium text-white/55 hover:text-white/80"
                  >
                    StrasClean Maison
                  </Link>
                  <span className="mx-1.5 text-white/30">/</span>
                  <span className="text-white/75">{service.shortName}</span>
                </nav>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-200">
                  <span className="text-base leading-none">{service.emoji}</span>
                  {service.hero.chip}
                </span>

                <h1 className="h-display mt-4 text-balance text-[30px] font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                  {h1Plain}{" "}
                  <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                    {service.hero.h1Highlight}
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
                  {service.hero.subtitle}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={waLink(message)}
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
                    Appeler
                  </a>
                </div>

                <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-white/65 sm:text-sm">
                  <li className="inline-flex items-center gap-1.5">
                    <ClockIcon size={14} className="text-amber-300" />
                    {service.pricing.duration}
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <CheckIcon size={14} className="text-amber-300" />
                    Dès {service.pricing.priceFrom} €
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <MapPinIcon size={14} className="text-amber-300" />
                    Strasbourg & alentours
                  </li>
                </ul>
              </div>

              {/* Visual placeholder — caché sur mobile pour gagner de l'espace */}
              <div className="hidden lg:block">
                <HeroVisual service={service} />
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Grille premium des 4 prestations Maison — la card courante est
            marquée "Vous êtes ici", les autres en cross-sell. Affiche les
            tarifs complets de chaque prestation. */}
        <MaisonServicesGrid
          currentSlug={service.slug}
          eyebrow="Nos prestations Maison"
          title="Toutes nos prestations textile à domicile."
          description="Tarifs détaillés ci-dessous. La prestation actuelle est mise en évidence — les 3 autres sont disponibles dans la même intervention si vous voulez tout faire d'un coup."
        />

        {/* PROBLÈME — version compacte (bullets only) */}
        <section className="relative py-12 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-4xl">
              <Reveal className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Le constat
                </p>
                <h2 className="h-display mt-2 text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  {service.problem.title}
                </h2>
                {service.problem.paragraphs[0] && (
                  <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-white/70">
                    {service.problem.paragraphs[0]}
                  </p>
                )}
              </Reveal>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {service.problem.bullets.map((b, i) => (
                  <Reveal key={b} delay={i * 40}>
                    <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-rose-300">
                        ✕
                      </span>
                      <span>{b}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SOLUTION + PROCESS — étapes en cards (allégé) */}
        <section className="relative overflow-hidden py-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
          </div>
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                Comment ça se passe
              </p>
              <h2 className="h-display mt-2 text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {service.solution.title}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-white/70">
                {service.solution.intro}
              </p>
            </Reveal>

            <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
              {service.solution.steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 50}>
                  <article className="card card-hover h-full">
                    <div className="flex items-center gap-3">
                      <span className="h-display grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-300 font-bold">
                        {i + 1}
                      </span>
                      <h3 className="h-display text-base font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {step.desc}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* POURQUOI PRO — bandeau compact (remplace la longue section "Pourquoi le DIY échoue") */}
        {service.whyDiy.paragraphs[0] && (
          <section className="relative py-12 sm:py-20">
            <div className="container-x">
              <Reveal className="mx-auto max-w-3xl">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                    Pourquoi pro vs. DIY
                  </p>
                  <h3 className="h-display mt-2 text-xl font-bold text-white sm:text-2xl">
                    {service.whyDiy.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/75">
                    {service.whyDiy.paragraphs[0]}
                  </p>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        <HomeBeforeAfter />

        <TestimonialsMaison
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
          googleProfileUrl={place.profileUrl}
          googleReviews={place.reviews}
        />

        <FAQ
          variant="maison"
          mainFAQs={service.faq}
          extraSchemaFAQs={MAISON_GLOBAL_FAQS}
        />

        {/* CTA final */}
        <section className="relative overflow-hidden py-12 sm:py-20">
          <div className="container-x">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-ink-800 to-ink-900 p-6 text-center sm:p-12">
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-amber-500/25 blur-3xl" />
                <h2 className="h-display mx-auto max-w-2xl text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  Prêt à redonner vie à votre intérieur ?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/75">
                  Envoyez quelques photos sur WhatsApp, on confirme un devis et
                  un créneau.
                </p>
                <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                  <a
                    href={waLink(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa h-12 px-6"
                  >
                    <WhatsAppIcon size={18} />
                    Réserver sur WhatsApp
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

/** Visuel placeholder du hero, propre en attendant les vraies photos.
 *  N'est rendu QUE sur desktop (lg+) — sur mobile on gagne de l'espace. */
function HeroVisual({ service }: { service: UseCase }) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:ml-auto">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 p-5 shadow-card">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200/20 via-orange-300/15 to-amber-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-[160px] opacity-60">{service.emoji}</span>
          </div>
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-amber-200 backdrop-blur-md">
            <SparklesIcon size={12} />
            À domicile
          </span>
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-amber-200 backdrop-blur-md">
            dès {service.pricing.priceFrom} €
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-300">
            <ClockIcon size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              {service.pricing.duration}
            </p>
            <p className="text-xs text-white/60">
              Équipe de 2 · matériel professionnel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
