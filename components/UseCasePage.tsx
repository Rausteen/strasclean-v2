import Link from "next/link";
import Header from "./Header";
import MobileOfferStrip from "./MobileOfferStrip";
import PricingSection from "./PricingSection";
import BeforeAfter from "./BeforeAfter";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";
import Reveal from "./Reveal";
import {
  WhatsAppIcon,
  PhoneIcon,
  CheckIcon,
  ClockIcon,
  ArrowRightIcon,
  MapPinIcon,
  SparklesIcon,
} from "./Icon";
import { SITE, waLink } from "@/lib/site";
import { CITIES } from "@/lib/cities";
import { SERVICES, servicePath } from "@/lib/services";
import { UseCase } from "@/lib/usecases";
import type { PlaceData } from "@/lib/reviews";

type Props = {
  useCase: UseCase;
  place: PlaceData;
};

export default function UseCasePage({ useCase: uc, place }: Props) {
  const message = uc.ctaMessage;

  // H1 avec la partie "highlight" en gradient
  const h1Plain = uc.hero.h1.replace(uc.hero.h1Highlight, "").trim();
  const strasbourg = CITIES.find((c) => c.slug === "strasbourg");
  const recommendedService = SERVICES.find(
    (s) => s.slug === uc.recommendedServiceSlug,
  );

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        {/* HERO */}
        <section id="top" className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-radial-fade" />
            <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-2xl sm:blur-3xl" />
          </div>

          <div className="container-x pt-8 pb-14 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
            <div className="mx-auto max-w-3xl text-center">
              <nav aria-label="Fil d'ariane" className="mb-5 text-xs">
                <Link href="/" className="font-medium text-slate-600 hover:text-slate-700">
                  StrasClean
                </Link>
                <span className="mx-1.5 text-slate-300">/</span>
                <span className="text-slate-700">{uc.shortName}</span>
              </nav>

              <span className="chip mx-auto">
                <span className="text-base leading-none">{uc.emoji}</span>
                {uc.hero.chip}
              </span>

              <h1 className="h-display mt-4 text-balance text-[32px] font-bold leading-[1.05] text-slate-900 sm:text-5xl lg:text-6xl">
                {h1Plain}{" "}
                <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-emerald-700 bg-clip-text text-transparent">
                  {uc.hero.h1Highlight}
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
                {uc.hero.subtitle}
              </p>

              <div className="mx-auto mt-6 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-7 sm:max-w-none sm:flex-row sm:justify-center">
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
                  Appeler maintenant
                </a>
              </div>

              <ul className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-slate-600 sm:mt-7 sm:text-sm">
                <li className="inline-flex items-center gap-1.5">
                  <ClockIcon size={14} className="text-brand-600" />
                  Durée : {uc.pricing.duration}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <CheckIcon size={14} className="text-brand-600" />
                  À partir de {uc.pricing.priceFrom} €
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <MapPinIcon size={14} className="text-brand-600" />
                  Strasbourg & alentours
                </li>
              </ul>
            </div>
          </div>
        </section>


        {/* PROBLÈME */}
        <section className="relative overflow-hidden py-14 sm:py-24 lg:py-28">
          <div className="container-x">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
                  Le problème
                </p>
                <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl">
                  {uc.problem.title}
                </h2>
                <ul className="mt-8 grid gap-3">
                  {uc.problem.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800"
                    >
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-rose-300">
                        ✕
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="lg:col-span-7" delay={120}>
                <div className="relative h-full rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
                  <div className="space-y-4 text-[15px] leading-relaxed text-slate-700">
                    {uc.problem.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* POURQUOI LE DIY ÉCHOUE */}
        <section className="relative overflow-hidden py-14 sm:py-24 lg:py-28">
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
                Pourquoi le DIY échoue
              </p>
              <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                {uc.whyDiy.title}
              </h2>
              <div className="mx-auto mt-6 max-w-2xl space-y-4 text-left text-[15px] leading-relaxed text-slate-700 sm:text-center">
                {uc.whyDiy.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* SOLUTION + PROCESS */}
        <section className="relative overflow-hidden py-14 sm:py-24 lg:py-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-2xl sm:blur-3xl" />
          </div>
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
                Notre solution
              </p>
              <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                {uc.solution.title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-relaxed text-slate-700 sm:text-base">
                {uc.solution.intro}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
              {uc.solution.steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 60}>
                  <article className="card card-hover h-full">
                    <div className="flex items-center gap-3">
                      <span className="h-display grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-600 font-bold">
                        {i + 1}
                      </span>
                      <h3 className="h-display text-base font-semibold text-slate-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {step.desc}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>

            {/* Bandeau tarif + CTA WhatsApp */}
            <Reveal>
              <div className="mt-12 grid items-center gap-5 rounded-3xl border border-brand-400/30 bg-gradient-to-br from-brand-500/15 via-slate-100 to-slate-50 p-6 sm:p-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
                    Intervention complète
                  </p>
                  <p className="mt-2 text-[15px] text-slate-800">
                    Une seule intervention à domicile à Strasbourg —{" "}
                    <strong className="text-slate-900">
                      à partir de {uc.pricing.priceFrom} €
                    </strong>{" "}
                    · durée {uc.pricing.duration}. On vient avec tout le
                    matériel, on confirme le tarif final avant de commencer.
                  </p>
                </div>
                <div className="lg:col-span-5">
                  <a
                    href={waLink(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa h-12 w-full"
                  >
                    <WhatsAppIcon size={18} />
                    Réserver sur WhatsApp
                  </a>
                  {recommendedService && strasbourg && (
                    <Link
                      href={servicePath(recommendedService, strasbourg)}
                      className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                      Voir la prestation détaillée
                      <ArrowRightIcon size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <PricingSection />
        <BeforeAfter />
        <Testimonials
          googleReviews={place.reviews}
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
          googleProfileUrl={place.profileUrl}
        />

        {/* FAQ spécifique au use case + globale */}
        <FAQ extraSchemaFAQs={uc.faq} />

        {/* Section FAQ visuelle spécifique (en plus du JSON-LD merged) */}
        <section className="relative overflow-hidden pb-14 sm:pb-24">
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                <div className="flex items-center gap-2 text-brand-600">
                  <SparklesIcon size={16} />
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]">
                    Questions sur {uc.shortName.toLowerCase()}
                  </p>
                </div>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {uc.faq.map((q) => (
                    <li
                      key={q.q}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <p className="text-sm font-semibold text-slate-900">{q.q}</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {q.a}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
