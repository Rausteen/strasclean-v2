import Link from "next/link";
import Reveal from "./Reveal";
import { waLink } from "@/lib/site";
import { PLANS, Plan } from "@/lib/plans";
import { SERVICES, servicePath } from "@/lib/services";
import { DEFAULT_CITY } from "@/lib/services";
import VehiclePricing from "./VehiclePricing";
import PlansCarousel from "./PlansCarousel";
import { CheckIcon, WhatsAppIcon, ArrowRightIcon, PawIcon, SprayIcon, ClockIcon } from "./Icon";

// Options ciblées sur l'état du véhicule (la taille est déjà gérée par le
// bandeau VehiclePricing affiché plus haut → on ne la duplique pas ici).
const OPTIONS = [
  { icon: <PawIcon size={16} />, label: "Poils d'animaux", price: "+15 à 30 €" },
  { icon: <SprayIcon size={16} />, label: "Taches tenaces", price: "+10 à 20 €" },
  { icon: <SprayIcon size={16} />, label: "Sièges très sales", price: "+15 à 25 €" },
  { icon: <SprayIcon size={16} />, label: "Coffre très sale", price: "+10 à 20 €" },
  { icon: <SprayIcon size={16} />, label: "Traitement odeurs", price: "+20 à 40 €" },
  { icon: <SprayIcon size={16} />, label: "Moisissure", price: "+15 à 30 €" },
];

export default function PricingSection() {
  return (
    <section id="formules" className="relative overflow-hidden py-14 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-2xl sm:blur-3xl" />
      </div>

      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
            Formules
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Du simple entretien au detailing complet.
          </h2>
          <p className="mt-4 text-slate-600">
            Trois formules claires, pensées pour s'adapter à l'état de votre
            véhicule et à votre besoin. Réservation en quelques secondes par
            WhatsApp.
          </p>
        </Reveal>

        {/* Carrousel swipeable mobile / grille desktop — voir PlansCarousel */}
        <div className="mt-6 sm:mt-12">
          <PlansCarousel>
            {PLANS.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </PlansCarousel>
        </div>

        {/* Tarif selon le type de véhicule */}
        <Reveal>
          <div className="mt-10">
            <VehiclePricing />
          </div>
        </Reveal>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-slate-600">
          Le tarif final peut varier selon l'état intérieur du véhicule et les
          options demandées.
        </p>

        {/* Options */}
        <Reveal>
          <div className="mt-14 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="h-display text-xl font-semibold text-slate-900 sm:text-2xl">
                  Options & cas particuliers
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Indiquez vos besoins lors de la réservation, on adapte la
                  formule.
                </p>
              </div>
              <a
                href={waLink(
                  "Bonjour StrasClean 👋 Je voudrais ajouter une option à ma formule. Pouvez-vous me conseiller ?"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa w-full sm:w-auto"
              >
                <WhatsAppIcon size={16} /> Demander une option
              </a>
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {OPTIONS.map((o) => (
                <li
                  key={o.label}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span className="text-brand-600 shrink-0">{o.icon}</span>
                  <span className="flex-1 text-sm text-slate-800">{o.label}</span>
                  <span className="shrink-0 rounded-full bg-brand-500/15 px-2 py-0.5 text-xs font-semibold text-brand-700">
                    {o.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Prestations complémentaires — uniquement les prestations
            qui sortent du cadre des formules (extérieur seul + revente). */}
        <Reveal>
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="h-display text-xl font-semibold text-slate-900 sm:text-2xl">
                  Prestations complémentaires
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Deux prestations en plus des formules — pour un besoin
                  précis : extérieur uniquement, ou remise à neuf pour la revente.
                </p>
              </div>
            </div>

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {SERVICES.filter((s) =>
                ["lavage-exterieur-voiture", "remise-a-neuf-voiture-revente"].includes(s.slug)
              ).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={servicePath(s, DEFAULT_CITY)}
                    className="group flex h-full items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-brand-500/10"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-lg leading-none">
                      {s.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-900">
                        {s.name}
                      </span>
                      <span className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] text-slate-600">
                        <ClockIcon size={11} />
                        {s.duration}
                        <span className="text-slate-300">·</span>
                        <span className="text-brand-600 font-semibold">
                          dès {s.priceFrom} €
                        </span>
                      </span>
                    </span>
                    <ArrowRightIcon
                      size={14}
                      className="mt-2 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const popular = plan.highlight;
  return (
    <div id={plan.id} className="group relative h-full scroll-mt-24">
      {plan.badge && (
        <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-brand-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-900 shadow-lg">
          {plan.badge}
        </span>
      )}
      <div
        className={`relative h-full overflow-hidden rounded-3xl border p-6 transition-all duration-300 sm:p-7 ${
          popular
            ? "border-brand-400/40 bg-gradient-to-b from-brand-500/10 to-slate-50 shadow-glow"
            : "border-slate-200 bg-slate-50 group-hover:-translate-y-1 group-hover:border-slate-300"
        }`}
      >
        {/* Glow */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-b ${plan.accent} blur-2xl`}
        />

        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-xl">
            {plan.emoji}
          </span>
          <h3 className="h-display text-lg font-semibold text-slate-900 sm:text-xl">{plan.name}</h3>
        </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
          à partir de
        </span>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="h-display text-5xl font-extrabold text-slate-900">{plan.priceFrom}</span>
        <span className="text-2xl font-semibold text-slate-600">€</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600">{plan.tagline}</p>

      <ul className="mt-6 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-slate-800">
            <span
              className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full ${
                popular ? "bg-brand-500 text-slate-900" : "bg-slate-100 text-brand-600"
              }`}
            >
              <CheckIcon size={12} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-col gap-2">
        <a
          href={waLink(plan.ctaMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${popular ? "btn-wa" : "btn-primary"} h-12 w-full text-base`}
        >
          {popular ? <WhatsAppIcon size={18} /> : null}
          Réserver maintenant
        </a>
        <Link
          href={`/formules#${plan.id}`}
          className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Voir les villes desservies <ArrowRightIcon size={14} />
        </Link>
      </div>
      </div>
    </div>
  );
}
