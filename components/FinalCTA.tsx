import Link from "next/link";
import { SITE } from "@/lib/site";
import Reveal from "./Reveal";
import { WhatsAppIcon, PhoneIcon, MapPinIcon, BoltIcon, CheckIcon, ArrowRightIcon } from "./Icon";

export default function FinalCTA() {
  return (
    <section id="reserver" className="relative py-16 sm:py-24">
      <div className="container-x">
        <Reveal>
          {/* CTA final : carte vert forêt pour clore la page sur un
              accent fort de marque. Bg + halo radial gérés par la classe
              utilitaire surface-forest (globals.css). */}
          <div className="surface-forest relative overflow-hidden rounded-[28px] p-7 text-center sm:rounded-[32px] sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:36px_36px] opacity-[0.10] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <div className="pointer-events-none absolute -top-24 -right-10 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />

            <span className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              Disponible cette semaine
            </span>

            <h2 className="h-display relative mx-auto mt-5 max-w-3xl text-balance text-[30px] font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Prêt à retrouver une voiture propre,{" "}
              <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
                saine et agréable&nbsp;?
              </span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-2xl text-slate-300">
              Réservez votre nettoyage auto à domicile à Strasbourg en quelques
              secondes. On vous répond rapidement et on s'occupe de tout.
            </p>

            {/* CTA — 1 primaire (Réserver en ligne) + 2 secondaires démotés
                (WhatsApp, Appeler) pour ne pas diluer le clic. */}
            <div className="mx-auto mt-7 flex w-full max-w-md flex-col items-center justify-center gap-3">
              <Link
                href="/reserver"
                className="btn-primary h-14 w-full px-7 text-base active:scale-[0.98] sm:h-12 sm:w-auto"
              >
                Réserver en ligne
                <ArrowRightIcon size={16} />
              </Link>
              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-2.5">
                <a
                  href={SITE.phoneHref}
                  className="btn h-12 px-5 text-sm border border-white/25 bg-white/5 text-white hover:bg-white/10 active:scale-[0.98] sm:w-auto"
                >
                  <PhoneIcon size={16} />
                  Appeler
                </a>
                <a
                  href={SITE.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn h-12 px-5 text-sm border border-white/25 bg-white/5 text-white hover:bg-white/10 active:scale-[0.98] sm:w-auto"
                >
                  <WhatsAppIcon size={16} />
                  WhatsApp
                </a>
              </div>
            </div>

            <ul className="relative mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-300">
              <li className="inline-flex items-center gap-2">
                <CheckIcon size={16} className="text-brand-300" />
                Satisfait ou on repasse
              </li>
              <li className="inline-flex items-center gap-2">
                <CheckIcon size={16} className="text-brand-300" />
                Devis gratuit · sans engagement
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPinIcon size={16} className="text-brand-300" />
                Strasbourg & alentours
              </li>
              <li className="inline-flex items-center gap-2">
                <BoltIcon size={16} className="text-brand-300" />
                Réponse rapide
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
