import Link from "next/link";
import { SITE } from "@/lib/site";
import { City, inCity } from "@/lib/cities";
import {
  WhatsAppIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  BoltIcon,
  CheckIcon,
  CarIcon,
  SparklesIcon,
} from "./Icon";

export default function CityHero({ city }: { city: City }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      </div>

      <div className="container-x pt-8 pb-14 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Breadcrumb-ish back link */}
          <nav aria-label="Fil d'ariane" className="mb-5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/65 hover:text-white/80"
            >
              ← StrasClean
            </Link>
          </nav>

          <span className="chip mx-auto">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
            </span>
            {city.angle}
          </span>

          <h1 className="h-display mt-4 text-balance text-[34px] font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Nettoyage voiture à domicile{" "}
            <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 bg-clip-text text-transparent">
              {inCity(city)}.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
            StrasClean se déplace {inCity(city)} pour nettoyer votre véhicule
            en profondeur — intérieur, extérieur, shampouinage et detailing —
            directement chez vous, sur votre lieu de travail ou à l'adresse de
            votre choix.
          </p>

          <div className="mx-auto mt-6 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-7 sm:max-w-none sm:flex-row sm:justify-center">
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

          {/* Postal codes */}
          <ul className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-white/65 sm:mt-7 sm:text-sm">
            <li className="inline-flex items-center gap-1.5">
              <MapPinIcon size={14} className="text-brand-400" />
              {city.name}
            </li>
            {city.postalCodes.map((code) => (
              <li
                key={code}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/75"
              >
                {code}
              </li>
            ))}
            {city.distanceKm > 0 && (
              <li className="inline-flex items-center gap-1.5">
                <CarIcon size={14} className="text-brand-400" />
                {city.distanceKm} km de Strasbourg centre
              </li>
            )}
          </ul>

          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-2 text-[13px] text-brand-200 sm:mt-7 sm:gap-3 sm:px-4 sm:text-sm">
            <ClockIcon size={14} className="text-brand-300" />
            Créneaux disponibles cette semaine {inCity(city)}
          </div>
        </div>

        {/* Quick benefits row */}
        <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4">
          {[
            { icon: <SparklesIcon size={16} />, label: "Matériel pro" },
            { icon: <BoltIcon size={16} />, label: "Réservation rapide" },
            { icon: <CheckIcon size={16} />, label: "Devis gratuit" },
            { icon: <MapPinIcon size={16} />, label: "Sans déplacement" },
          ].map((it) => (
            <li
              key={it.label}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[13px] text-white/85 sm:text-sm"
            >
              <span className="text-brand-400">{it.icon}</span>
              {it.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
