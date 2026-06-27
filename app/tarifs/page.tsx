import type { Metadata } from "next";
import { PLANS, VEHICLE_TYPES, AUTO_OPTIONS } from "@/lib/plans";
import { SITE } from "@/lib/site";
import { CheckIcon, WhatsAppIcon, PhoneIcon } from "@/components/Icon";

// Page utilitaire "fiche tarifs" — pensée pour être envoyée au client
// (capture d'écran WhatsApp) quand il demande les prix ou ne connaît pas les
// formules. Lit les données canoniques (lib/plans.ts) → toujours à jour.
//
// noindex volontaire : le SEO des formules est porté par /formules, on évite
// le contenu dupliqué. Pas de Header/Footer/FloatingWhatsApp → capture propre.
export const metadata: Metadata = {
  title: "Tarifs — Nettoyage auto à domicile à Strasbourg | StrasClean",
  description:
    "Nos 3 formules de nettoyage auto à domicile à Strasbourg (Essentiel 59 €, Premium Intérieur 89 €, Intégrale StrasClean 139 €), suppléments véhicule et options.",
  robots: { index: false, follow: false },
};

const DURATIONS: Record<string, string> = {
  confort: "30–50 min",
  premium: "1h–1h30",
  luxury: "2h–2h30",
};

export default function TarifsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white py-10 sm:py-14">
      <div className="mx-auto max-w-2xl px-4">
        {/* En-tête */}
        <header className="text-center">
          <p className="h-display text-2xl font-extrabold tracking-tight text-slate-900">
            Stras<span className="text-brand-600">Clean</span>
          </p>
          <h1 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl">
            Nos formules &amp; tarifs
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Nettoyage auto à domicile · Strasbourg &amp; 12 communes · paiement
            sur place
          </p>
        </header>

        {/* 3 formules */}
        <div className="mt-8 space-y-4">
          {PLANS.map((plan) => {
            const popular = plan.highlight;
            return (
              <section
                key={plan.id}
                className={`relative rounded-3xl border bg-white p-5 sm:p-6 ${
                  popular
                    ? "border-brand-500/50 shadow-glow"
                    : "border-slate-200 shadow-soft"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-5 rounded-full bg-brand-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#062b1e] shadow-card">
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-slate-100 text-[22px]"
                    >
                      {plan.emoji}
                    </span>
                    <div>
                      <h2 className="h-display text-lg font-bold text-slate-900">
                        {plan.name.replace(/^Formule /, "")}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {DURATIONS[plan.id] ?? ""}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      dès
                    </p>
                    <p className="h-display text-3xl font-extrabold leading-none text-slate-900">
                      {plan.priceFrom}&nbsp;€
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {plan.tagline}
                </p>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => {
                    const isCumulative = f.startsWith("Tout ");
                    return (
                      <li
                        key={f}
                        className={`flex items-start gap-2.5 text-sm ${
                          isCumulative
                            ? "mb-0.5 border-b border-slate-200 pb-2 font-bold text-slate-900"
                            : "text-slate-700"
                        }`}
                      >
                        <span
                          className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                            popular || isCumulative
                              ? "bg-brand-500 text-[#062b1e]"
                              : "bg-brand-50 text-brand-700"
                          }`}
                        >
                          <CheckIcon size={10} />
                        </span>
                        <span>{f}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        {/* Supplément selon le véhicule */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Supplément selon le véhicule
          </h3>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-700">
            {VEHICLE_TYPES.map((v) => (
              <span key={v.id} className="inline-flex items-center gap-1.5">
                <span aria-hidden>{v.emoji}</span>
                {v.label} :{" "}
                <strong className="font-semibold text-slate-900">
                  {v.surcharge === 0 ? "inclus" : `+${v.surcharge} €`}
                </strong>
              </span>
            ))}
          </div>
        </section>

        {/* Options */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Options selon l'état{" "}
            <span className="font-medium normal-case text-slate-400">
              (facultatif)
            </span>
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="pb-2 text-left font-semibold">Option</th>
                  <th className="pb-2 text-right font-semibold">Citadine</th>
                  <th className="pb-2 text-right font-semibold">Berline</th>
                  <th className="pb-2 text-right font-semibold">
                    SUV&nbsp;/&nbsp;utilit.
                  </th>
                </tr>
              </thead>
              <tbody>
                {AUTO_OPTIONS.map((o) => (
                  <tr key={o.id} className="border-t border-slate-100">
                    <td className="py-2 pr-2 font-medium text-slate-800">
                      {o.label}
                    </td>
                    <td className="py-2 text-right tabular-nums text-slate-700">
                      {o.priceByVehicle.citadine}&nbsp;€
                    </td>
                    <td className="py-2 text-right tabular-nums text-slate-700">
                      {o.priceByVehicle.berline}&nbsp;€
                    </td>
                    <td className="py-2 text-right tabular-nums text-slate-700">
                      {o.priceByVehicle.suv}&nbsp;€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Tarif confirmé avant intervention selon l'état réel — jamais de
            surcoût surprise.
          </p>
        </section>

        {/* Pied de page / contact */}
        <footer className="mt-6 rounded-3xl bg-slate-900 p-5 text-center text-white sm:p-6">
          <p className="text-sm font-semibold">
            Devis gratuit &amp; sans engagement · Réponse rapide sur WhatsApp
          </p>
          <div className="mt-3 inline-flex items-center justify-center gap-2 text-base font-bold">
            <WhatsAppIcon size={18} className="text-brand-400" />
            <PhoneIcon size={16} className="text-brand-400" />
            <span>{SITE.phoneDisplay}</span>
          </div>
          <p className="mt-2 text-xs text-white/60">
            {SITE.url.replace(/^https?:\/\//, "")}
          </p>
        </footer>
      </div>
    </main>
  );
}
