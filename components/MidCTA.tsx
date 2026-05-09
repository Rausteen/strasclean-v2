import { SITE, waLink } from "@/lib/site";
import { WhatsAppIcon, PhoneIcon } from "./Icon";
import Reveal from "./Reveal";

export default function MidCTA() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-brand-400/30 bg-gradient-to-br from-brand-500/15 via-ink-800 to-ink-900 p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-light bg-[size:36px_36px] opacity-[0.2]" />

            <div className="grid items-center gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <h2 className="h-display text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  Votre voiture mérite mieux qu'un simple coup d'aspirateur.
                </h2>
                <p className="mt-3 max-w-2xl text-white/80">
                  Envoyez-nous une photo de votre véhicule sur WhatsApp et
                  recevez une recommandation de formule rapidement. Pas de
                  formulaire, pas d'attente.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col">
                <a
                  href={waLink(
                    "Bonjour StrasClean, voici une photo de ma voiture, pouvez-vous me conseiller une formule ?"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa w-full"
                >
                  <WhatsAppIcon size={18} />
                  Envoyer un message WhatsApp
                </a>
                <a href={SITE.phoneHref} className="btn-ghost w-full">
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
