import { SITE } from "@/lib/site";
import Reveal from "./Reveal";
import { WhatsAppIcon, PhoneIcon, MapPinIcon, BoltIcon, CheckIcon } from "./Icon";

export default function FinalCTA() {
  return (
    <section id="reserver" className="relative py-20 sm:py-28">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-ink-800 via-ink-900 to-black p-10 text-center sm:p-16">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-fade" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-light bg-[size:36px_36px] opacity-[0.2] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <div className="pointer-events-none absolute -bottom-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />

            <span className="chip mx-auto">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              Disponible cette semaine
            </span>

            <h2 className="h-display mx-auto mt-5 max-w-3xl text-balance text-4xl font-bold text-white sm:text-5xl">
              Prêt à retrouver une voiture propre,{" "}
              <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
                saine et agréable&nbsp;?
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/75">
              Réservez votre nettoyage auto à domicile à Strasbourg en quelques
              secondes. On vous répond rapidement et on s'occupe de tout.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa h-12 px-7 text-base"
              >
                <WhatsAppIcon size={20} />
                Réserver sur WhatsApp
              </a>
              <a href={SITE.phoneHref} className="btn-primary h-12 px-7 text-base">
                <PhoneIcon size={18} />
                Appeler maintenant
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70">
              <li className="inline-flex items-center gap-2">
                <MapPinIcon size={16} className="text-brand-400" />
                Strasbourg & alentours
              </li>
              <li className="inline-flex items-center gap-2">
                <BoltIcon size={16} className="text-brand-400" />
                Réponse rapide
              </li>
              <li className="inline-flex items-center gap-2">
                <CheckIcon size={16} className="text-brand-400" />
                Devis gratuit
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
