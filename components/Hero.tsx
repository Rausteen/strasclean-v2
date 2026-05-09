import Image from "next/image";
import { SITE } from "@/lib/site";
import {
  WhatsAppIcon,
  PhoneIcon,
  MapPinIcon,
  CarIcon,
  SparklesIcon,
  CheckIcon,
  BoltIcon,
  ClockIcon,
} from "./Icon";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      </div>

      <div className="container-x pt-8 pb-14 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Copy */}
          <div className="animate-fade-up">
            <span className="chip">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              Nettoyage auto à domicile à Strasbourg
            </span>

            <h1 className="h-display mt-4 text-balance text-[34px] font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Votre voiture propre comme neuve,{" "}
              <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 bg-clip-text text-transparent">
                sans vous déplacer.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
              StrasClean se déplace chez vous pour nettoyer votre véhicule en
              profondeur, avec des formules adaptées à votre besoin&nbsp;:
              entretien rapide, rénovation intérieure ou detailing complet.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row">
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa h-14 w-full px-6 text-base sm:h-12 sm:w-auto"
              >
                <WhatsAppIcon size={20} />
                Réserver sur WhatsApp
              </a>
              <a href={SITE.phoneHref} className="btn-ghost h-14 w-full px-6 text-base sm:h-12 sm:w-auto">
                <PhoneIcon size={18} />
                Appeler maintenant
              </a>
            </div>

            {/* Trust */}
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-white/70 sm:mt-7 sm:gap-x-5 sm:text-sm">
              {[
                { icon: <HomeChip />, label: "Intervention à domicile" },
                { icon: <MapPinIcon size={14} className="text-brand-400" />, label: "Strasbourg & alentours" },
                { icon: <BoltIcon size={14} className="text-brand-400" />, label: "Réservation rapide" },
                { icon: <CarIcon size={14} className="text-brand-400" />, label: "Intérieur / extérieur" },
                { icon: <CheckIcon size={14} className="text-brand-400" />, label: "Paiement simple" },
              ].map((t) => (
                <li key={t.label} className="inline-flex items-center gap-1.5">
                  {t.icon}
                  {t.label}
                </li>
              ))}
            </ul>

            {/* Availability strip */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-2 text-[13px] text-brand-200 sm:mt-7 sm:gap-3 sm:px-4 sm:text-sm">
              <ClockIcon size={14} className="text-brand-300" />
              Créneaux disponibles cette semaine sur Strasbourg
            </div>
          </div>

          {/* Visual */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HomeChip() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-md bg-brand-500/15 text-brand-400">
      <SparklesIcon size={12} />
    </span>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
      {/* Main car card */}
      <div className="relative animate-fade-up [animation-delay:120ms]">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 p-6 shadow-card">
          {/* Photo */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-950">
            <Image
              src="/hero.webp"
              alt="Voiture nettoyée par StrasClean — rendu showroom à Strasbourg"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
            {/* Subtle overlay to blend top/bottom edges with the dark UI */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
            <span className="absolute left-4 top-4 chip !bg-black/50 backdrop-blur-md">
              <SparklesIcon size={12} className="text-brand-400" />
              Rendu showroom
            </span>
            <span className="absolute right-4 top-4 chip !bg-black/50 !text-brand-200 backdrop-blur-md">
              ★★★★★
            </span>
          </div>

          {/* Booking row */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-whatsapp/15 text-whatsapp">
              <WhatsAppIcon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Réservation en 10 secondes</p>
              <p className="text-xs text-white/60">Envoyez quelques photos, on confirme votre créneau</p>
            </div>
            <a
              href="#formules"
              className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 sm:inline-flex"
            >
              Voir les formules
            </a>
          </div>
        </div>

        {/* Floating sticker - left */}
        <div className="absolute -left-4 top-6 hidden rotate-[-6deg] animate-float rounded-2xl border border-white/10 bg-ink-900/90 p-3 shadow-card backdrop-blur sm:block">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/15 text-brand-400">
              <BoltIcon size={16} />
            </span>
            <div>
              <p className="text-xs font-semibold text-white">Intervention rapide</p>
              <p className="text-[11px] text-white/60">Dès 1h30 sur place</p>
            </div>
          </div>
        </div>

        {/* Floating sticker - right */}
        <div className="absolute -right-4 -bottom-5 hidden rotate-[4deg] animate-float [animation-delay:1s] rounded-2xl border border-white/10 bg-ink-900/90 p-3 shadow-card backdrop-blur sm:block">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/15 text-brand-400">
              <MapPinIcon size={16} />
            </span>
            <div>
              <p className="text-xs font-semibold text-white">Strasbourg & alentours</p>
              <p className="text-[11px] text-white/60">12 communes desservies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

