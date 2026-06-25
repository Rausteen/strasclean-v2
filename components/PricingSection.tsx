import Reveal from "./Reveal";
import { waLink } from "@/lib/site";
import { PLANS, Plan } from "@/lib/plans";
import VehiclePricing from "./VehiclePricing";
import PlansCarousel from "./PlansCarousel";
import { CheckIcon, WhatsAppIcon, PawIcon, SprayIcon } from "./Icon";

// Options ciblées sur l'état du véhicule — slim à 4 cas les plus
// fréquents (vs 6 avant), pour ne pas surcharger le client.
const OPTIONS = [
  { icon: <PawIcon size={16} />, label: "Poils d'animaux", price: "+15 à 30 €" },
  { icon: <SprayIcon size={16} />, label: "Taches tenaces", price: "+10 à 20 €" },
  { icon: <SprayIcon size={16} />, label: "Sièges très sales", price: "+15 à 25 €" },
  { icon: <SprayIcon size={16} />, label: "Traitement odeurs", price: "+20 à 40 €" },
];

type PricingSectionProps = {
  /** Mode allégé (accueil mobile) : masque le tableau "tarif véhicule" et le
   *  bloc "Options". Le calculateur juste en dessous porte déjà ces infos →
   *  évite le double pavé tarifaire. Les pages ville/use-case gardent le
   *  détail complet (compact=false). */
  compact?: boolean;
};

export default function PricingSection({ compact = false }: PricingSectionProps = {}) {
  return (
    <section id="formules" className="relative overflow-hidden bg-slate-50 py-16 sm:py-24">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 before:h-px before:w-6 before:bg-brand-500 before:opacity-70 before:content-['']">
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

        {/* Tarif selon le type de véhicule — masqué en mode compact (accueil) :
            le calculateur juste en dessous affiche déjà le supplément par
            véhicule. */}
        {!compact && (
          <Reveal>
            <div className="mt-10">
              <VehiclePricing />
            </div>
          </Reveal>
        )}

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-slate-600">
          Le tarif final peut varier selon l'état intérieur du véhicule et les
          options demandées.
        </p>

        {/* Options — masqué en mode compact (accueil) pour éviter d'allonger
            la section avant le calculateur. L'info reste dans le calculateur
            (« état très sale → on confirme ») et la FAQ. */}
        {!compact && (
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
        )}
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const popular = plan.highlight;
  return (
    <div id={plan.id} className="group relative h-full scroll-mt-24">
      {plan.badge && (
        <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-brand-500 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.04em] text-[#062b1e] shadow-card">
          {plan.badge}
        </span>
      )}
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border p-6 transition-all duration-300 sm:p-7 ${
          popular
            ? "border-brand-500/50 bg-white shadow-glow lg:scale-[1.03]"
            : "border-slate-200 bg-white shadow-soft group-hover:-translate-y-1 group-hover:border-slate-300 group-hover:shadow-card"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-slate-100 text-[22px]">
            {plan.emoji}
          </span>
          <h3 className="h-display text-lg font-bold text-slate-900 sm:text-[19px]">
            {plan.name}
          </h3>
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-500">
            à partir de
          </span>
        </div>
        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="h-display text-[52px] font-bold leading-none tracking-[-0.03em] text-slate-900">
            {plan.priceFrom}
          </span>
          <span className="text-[26px] font-semibold text-slate-500">€</span>
        </div>

        <p className="mt-3 text-[14.5px] leading-relaxed text-slate-700">
          {plan.tagline}
        </p>

        <ul className="mt-5 space-y-3">
          {plan.features.map((f) => {
            // La 1re ligne « Tout l'Essentiel / le Premium Intérieur inclus »
            // signale la nature cumulative de la formule → mise en avant
            // (texte gras, pastille pleine, séparateur sous la ligne).
            const isCumulative = f.startsWith("Tout ");
            return (
              <li
                key={f}
                className={`flex items-start gap-3 text-[14.5px] ${
                  isCumulative
                    ? "mb-1 border-b border-slate-200 pb-3 font-bold text-slate-900"
                    : "text-slate-700"
                }`}
              >
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                    popular || isCumulative
                      ? "bg-brand-500 text-[#062b1e]"
                      : "bg-brand-50 text-brand-700"
                  }`}
                >
                  <CheckIcon size={12} />
                </span>
                <span>{f}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-6">
          <a
            href={waLink(plan.ctaMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${popular ? "btn-wa" : "btn-primary"} h-12 w-full text-base`}
          >
            {popular ? <WhatsAppIcon size={18} /> : null}
            Réserver maintenant
          </a>
        </div>
      </div>
    </div>
  );
}
