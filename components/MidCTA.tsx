import { SITE, waLink } from "@/lib/site";
import { WhatsAppIcon, PhoneIcon } from "./Icon";
import Reveal from "./Reveal";

export default function MidCTA() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="container-x">
        <Reveal>
          {/* CTA "fort" : carte sombre inversée pour casser le rythme
              clair des sections environnantes et faire ressortir l'action. */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/30 blur-2xl sm:blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />

            <div className="relative grid items-center gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <h2 className="h-display text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  Votre voiture mérite mieux qu'un simple coup d'aspirateur.
                </h2>
                <p className="mt-3 max-w-2xl text-slate-300">
                  Envoyez-nous une photo de votre véhicule sur WhatsApp et
                  recevez une recommandation de formule rapidement. Pas de
                  formulaire, pas d'attente.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col">
                <a
                  href={waLink(
                    "Bonjour StrasClean 👋 Je peux vous envoyer une photo pour choisir la bonne formule ?"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa w-full"
                >
                  <WhatsAppIcon size={18} />
                  Envoyer un message WhatsApp
                </a>
                <a
                  href={SITE.phoneHref}
                  className="btn inline-flex w-full items-center justify-center gap-2 border border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  <PhoneIcon size={16} />
                  Appeler StrasClean
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
