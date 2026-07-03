import Link from "next/link";
import { SITE } from "@/lib/site";
import Reveal from "./Reveal";
import { WhatsAppIcon, PhoneIcon, MapPinIcon, BoltIcon, CheckIcon, ArrowRightIcon } from "./Icon";

export default function FinalCTA() {
  return (
    <section id="reserver" className="relative py-16 sm:py-24">
      <div className="container-x">
        <Reveal>
          {/* CTA final : carte CLAIRE premium, teintée de vert de marque
              (halo + ring), pour clore la page sans assombrir. */}
          <div className="relative overflow-hidden rounded-[28px] border border-brand-500/15 bg-gradient-to-br from-brand-50 via-white to-white p-7 text-center shadow-soft ring-1 ring-brand-500/10 sm:rounded-[32px] sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -top-24 -right-10 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-brand-300/15 blur-3xl" />

            <span className="relative inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              Disponible cette semaine
            </span>

            <h2 className="h-display relative mx-auto mt-5 max-w-3xl text-balance text-[30px] font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Prêt à retrouver une voiture propre,{" "}
              <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                saine et agréable&nbsp;?
              </span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-2xl text-slate-600">
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
                  className="btn-ghost h-12 px-5 text-sm active:scale-[0.98] sm:w-auto"
                >
                  <PhoneIcon size={16} />
                  Appeler
                </a>
                <a
                  href={SITE.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost h-12 px-5 text-sm active:scale-[0.98] sm:w-auto"
                >
                  <WhatsAppIcon size={16} />
                  WhatsApp
                </a>
              </div>
            </div>

            <ul className="relative mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
              <li className="inline-flex items-center gap-2">
                <CheckIcon size={16} className="text-brand-600" />
                Satisfait ou on repasse
              </li>
              <li className="inline-flex items-center gap-2">
                <CheckIcon size={16} className="text-brand-600" />
                Devis gratuit · sans engagement
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPinIcon size={16} className="text-brand-600" />
                Strasbourg & alentours
              </li>
              <li className="inline-flex items-center gap-2">
                <BoltIcon size={16} className="text-brand-600" />
                Réponse rapide
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
