import Link from "next/link";
import Header from "./Header";
import TrustBar from "./TrustBar";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";
import Reveal from "./Reveal";
import HomeBeforeAfter from "./HomeBeforeAfter";
import HomeServiceCrossSell from "./HomeServiceCrossSell";
import {
  WhatsAppIcon,
  PhoneIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  HomeIcon,
  ArrowRightIcon,
} from "./Icon";
import { SITE, waLink } from "@/lib/site";
import { UseCase } from "@/lib/usecases";
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
      {/* Bandeau contexte Maison — discret mais clair */}
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
            href="/strasclean-maison"
            className="inline-flex items-center gap-1 font-medium text-amber-200/80 hover:text-amber-200"
          >
            Toute l'offre Maison
            <ArrowRightIcon size={12} />
          </Link>
        </div>
      </div>

      <main>
        {/* HERO — palette ambre */}
        <section id="top" className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-radial-fade" />
            <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.30] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl" />
          </div>

          <div className="container-x pt-8 pb-14 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Texte */}
              <div className="lg:col-span-7">
                <nav aria-label="Fil d'ariane" className="mb-5 text-xs">
                  <Link
                    href="/"
                    className="font-medium text-white/55 hover:text-white/80"
                  >
                    StrasClean
                  </Link>
                  <span className="mx-1.5 text-white/30">/</span>
                  <Link
                    href="/strasclean-maison"
                    className="font-medium text-white/55 hover:text-white/80"
                  >
                    Maison
                  </Link>
                  <span className="mx-1.5 text-white/30">/</span>
                  <span className="text-white/75">{service.shortName}</span>
                </nav>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-200">
                  <span className="text-base leading-none">{service.emoji}</span>
                  {service.hero.chip}
                </span>

                <h1 className="h-display mt-4 text-balance text-[32px] font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                  {h1Plain}{" "}
                  <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                    {service.hero.h1Highlight}
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
                  {service.hero.subtitle}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row">
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

                <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-white/65 sm:mt-7 sm:text-sm">
                  <li className="inline-flex items-center gap-1.5">
                    <ClockIcon size={14} className="text-amber-300" />
                    Durée : {service.pricing.duration}
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <CheckIcon size={14} className="text-amber-300" />
                    À partir de {service.pricing.priceFrom} €
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <MapPinIcon size={14} className="text-amber-300" />
                    Strasbourg & alentours
                  </li>
                </ul>
              </div>

              {/* Visual placeholder Maison */}
              <div className="lg:col-span-5">
                <HeroVisual service={service} />
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* PROBLÈME */}
        <section className="relative overflow-hidden py-14 sm:py-24 lg:py-28">
          <div className="container-x">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Le problème
                </p>
                <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                  {service.problem.title}
                </h2>
                <ul className="mt-8 grid gap-3">
                  {service.problem.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85"
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
                <div className="relative h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
                  <div className="space-y-4 text-[15px] leading-relaxed text-white/80">
                    {service.problem.paragraphs.map((p, i) => (
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                Pourquoi le DIY échoue
              </p>
              <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {service.whyDiy.title}
              </h2>
              <div className="mx-auto mt-6 max-w-2xl space-y-4 text-left text-[15px] leading-relaxed text-white/75 sm:text-center">
                {service.whyDiy.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* SOLUTION + PROCESS */}
        <section className="relative overflow-hidden py-14 sm:py-24 lg:py-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
          </div>
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                Notre solution
              </p>
              <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {service.solution.title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-relaxed text-white/75 sm:text-base">
                {service.solution.intro}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
              {service.solution.steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 60}>
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

            {/* Bandeau tarif + CTA WhatsApp */}
            <Reveal>
              <div className="mt-12 grid items-center gap-5 rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-ink-800 to-ink-900 p-6 sm:p-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                    Intervention complète
                  </p>
                  <p className="mt-2 text-[15px] text-white/85">
                    Une seule intervention à domicile à Strasbourg —{" "}
                    <strong className="text-white">
                      à partir de {service.pricing.priceFrom} €
                    </strong>{" "}
                    · durée {service.pricing.duration}. On vient avec tout le
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
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <HomeBeforeAfter />

        <Testimonials
          googleReviews={place.reviews}
          googleRating={place.rating}
          googleTotalCount={place.totalCount}
          googleProfileUrl={place.profileUrl}
        />

        <HomeServiceCrossSell excludeSlug={service.slug} />

        <FAQ extraSchemaFAQs={service.faq} />

        {/* FAQ visuelle spécifique */}
        <section className="relative overflow-hidden pb-14 sm:pb-24">
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <div className="flex items-center gap-2 text-amber-300">
                  <SparklesIcon size={16} />
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]">
                    Questions sur {service.shortName.toLowerCase()}
                  </p>
                </div>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.faq.map((q) => (
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

        {/* CTA final Maison */}
        <section className="relative overflow-hidden py-14 sm:py-20">
          <div className="container-x">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-ink-800 to-ink-900 p-8 text-center sm:p-12">
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-amber-500/25 blur-3xl" />
                <h2 className="h-display mx-auto max-w-2xl text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  Prêt à redonner vie à votre intérieur ?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-white/75">
                  Envoyez-nous quelques photos sur WhatsApp, on vous confirme un
                  devis et un créneau rapide.
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
                  <a
                    href={SITE.phoneHref}
                    className="btn-ghost h-12 px-6"
                  >
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

/** Visuel placeholder du hero, propre tant qu'on n'a pas de vraies photos. */
function HeroVisual({ service }: { service: UseCase }) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:ml-auto">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 p-5 shadow-card">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200/20 via-orange-300/15 to-amber-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-[120px] opacity-60 sm:text-[160px]">
              {service.emoji}
            </span>
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
