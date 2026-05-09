import Reveal from "./Reveal";
import { SITE, waLink } from "@/lib/site";
import { CheckIcon, WhatsAppIcon, ArrowRightIcon, PawIcon, SprayIcon, CarIcon } from "./Icon";

type Plan = {
  id: string;
  emoji: string;
  name: string;
  priceFrom: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
  ctaMessage: string;
  accent: string;
};

const PLANS: Plan[] = [
  {
    id: "confort",
    emoji: "🚗",
    name: "Formule Confort",
    priceFrom: "39",
    tagline: "L'essentiel pour un intérieur propre, sain et rafraîchi.",
    features: [
      "Aspiration profonde",
      "Nettoyage tableau de bord et plastiques",
      "Vitres intérieures sans traces",
      "Désinfection des points de contact",
      "Déodorisation professionnelle",
    ],
    ctaMessage:
      "Bonjour StrasClean, je souhaite réserver la formule Confort (à partir de 39 €).",
    accent: "from-white/10 to-white/0",
  },
  {
    id: "premium",
    emoji: "✨",
    name: "Formule Premium",
    priceFrom: "79",
    tagline: "Nettoyage complet en profondeur — intérieur rénové comme neuf.",
    highlight: true,
    badge: "Le plus populaire ⭐",
    features: [
      "Aspiration complète",
      "Shampouinage sièges, moquettes et tapis",
      "Traitement cuir ou tissu",
      "Dégraissage & protection plastiques",
      "Nettoyage contours de portes & coffre",
      "Désinfection bactéricide + désodorisation renforcée",
    ],
    ctaMessage:
      "Bonjour StrasClean, je souhaite réserver la formule Premium (à partir de 79 €).",
    accent: "from-brand-500/30 to-brand-500/0",
  },
  {
    id: "luxury",
    emoji: "💠",
    name: "Formule Luxury Detailing",
    priceFrom: "119",
    tagline:
      "Service d'exception à domicile — rendu showroom intérieur + extérieur.",
    features: [
      "Tout le contenu Premium inclus",
      "Lavage extérieur à la main",
      "Décontamination carrosserie",
      "Vitres intérieures & extérieures",
      "Traitement plastiques extérieurs",
      "Traitement poils d'animaux inclus",
      "Parfum de finition",
    ],
    ctaMessage:
      "Bonjour StrasClean, je souhaite réserver la formule Luxury Detailing (à partir de 119 €).",
    accent: "from-violet-500/20 to-violet-500/0",
  },
];

const OPTIONS = [
  { icon: <PawIcon size={16} />, label: "Poils d'animaux" },
  { icon: <SprayIcon size={16} />, label: "Taches tenaces" },
  { icon: <SprayIcon size={16} />, label: "Sièges très sales" },
  { icon: <SprayIcon size={16} />, label: "Coffre très sale" },
  { icon: <SprayIcon size={16} />, label: "Traitement odeurs" },
  { icon: <CarIcon size={16} />, label: "SUV / utilitaire" },
];

export default function PricingSection() {
  return (
    <section id="formules" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
      </div>

      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
            Formules
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Du simple entretien au detailing complet.
          </h2>
          <p className="mt-4 text-white/70">
            Trois formules claires, pensées pour s'adapter à l'état de votre
            véhicule et à votre besoin. Réservation en quelques secondes par
            WhatsApp.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <PlanCard plan={p} />
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-white/55">
          Le tarif peut varier selon la taille du véhicule, l'état intérieur et
          les options demandées.
        </p>

        {/* Options */}
        <Reveal>
          <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="h-display text-xl font-semibold text-white sm:text-2xl">
                  Options & cas particuliers
                </h3>
                <p className="mt-1 text-sm text-white/60">
                  Indiquez vos besoins lors de la réservation, on adapte la
                  formule.
                </p>
              </div>
              <a
                href={waLink(
                  "Bonjour StrasClean, j'aimerais ajouter des options à ma formule (poils d'animaux, taches, etc.)."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa"
              >
                <WhatsAppIcon size={16} /> Demander une option
              </a>
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {OPTIONS.map((o) => (
                <li
                  key={o.label}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85"
                >
                  <span className="text-brand-400">{o.icon}</span>
                  {o.label}
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
    <div
      className={`group relative h-full overflow-hidden rounded-3xl border p-7 transition-all duration-300 ${
        popular
          ? "border-brand-400/40 bg-gradient-to-b from-brand-500/10 to-ink-900 shadow-glow"
          : "border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:border-white/20"
      }`}
    >
      {/* Glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-b ${plan.accent} blur-2xl`}
      />

      {plan.badge && (
        <span className="absolute right-5 top-5 rounded-full bg-brand-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-950">
          {plan.badge}
        </span>
      )}

      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-xl">
          {plan.emoji}
        </span>
        <h3 className="h-display text-xl font-semibold text-white">{plan.name}</h3>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-white/55">
          à partir de
        </span>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="h-display text-5xl font-extrabold text-white">{plan.priceFrom}</span>
        <span className="text-2xl font-semibold text-white/70">€</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-white/70">{plan.tagline}</p>

      <ul className="mt-6 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-white/85">
            <span
              className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full ${
                popular ? "bg-brand-500 text-ink-950" : "bg-white/10 text-brand-300"
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
          className={popular ? "btn-wa w-full" : "btn-primary w-full"}
        >
          {popular ? <WhatsAppIcon size={18} /> : null}
          Réserver maintenant
        </a>
        <a
          href={SITE.phoneHref}
          className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white/70 hover:text-white"
        >
          En savoir plus <ArrowRightIcon size={14} />
        </a>
      </div>
    </div>
  );
}
