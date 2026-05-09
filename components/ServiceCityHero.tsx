import Link from "next/link";
import { SITE, waLink } from "@/lib/site";
import { City, inCity, cityPath } from "@/lib/cities";
import { Service } from "@/lib/services";
import {
  WhatsAppIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CheckIcon,
} from "./Icon";

export default function ServiceCityHero({
  service,
  city,
}: {
  service: Service;
  city: City;
}) {
  const message = `${service.ctaMessage} (${city.name}).`;

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      </div>

      <div className="container-x pt-8 pb-14 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'ariane" className="mb-5 text-xs">
            <Link href="/" className="font-medium text-white/55 hover:text-white/80">
              StrasClean
            </Link>
            <span className="mx-1.5 text-white/30">/</span>
            <Link
              href={cityPath(city)}
              className="font-medium text-white/55 hover:text-white/80"
            >
              {city.name}
            </Link>
            <span className="mx-1.5 text-white/30">/</span>
            <span className="text-white/75">{service.shortName}</span>
          </nav>

          <span className="chip mx-auto">
            <span className="text-base leading-none">{service.emoji}</span>
            {service.shortName} {inCity(city)}
          </span>

          <h1 className="h-display mt-4 text-balance text-[34px] font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            {service.name}{" "}
            <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 bg-clip-text text-transparent">
              {inCity(city)}.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
            {service.shortDesc} StrasClean intervient {inCity(city)}, à votre
            domicile ou sur votre lieu de travail, avec un matériel
            professionnel autonome.
          </p>

          {/* CTAs */}
          <div className="mx-auto mt-6 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-7 sm:max-w-none sm:flex-row sm:justify-center">
            <a
              href={waLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa h-14 w-full px-6 text-base sm:h-12 sm:w-auto"
            >
              <WhatsAppIcon size={20} />
              Réserver sur WhatsApp
            </a>
            <a
              href={SITE.phoneHref}
              className="btn-ghost h-14 w-full px-6 text-base sm:h-12 sm:w-auto"
            >
              <PhoneIcon size={18} />
              Appeler maintenant
            </a>
          </div>

          {/* Quick facts */}
          <ul className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-white/65 sm:mt-7 sm:text-sm">
            <li className="inline-flex items-center gap-1.5">
              <ClockIcon size={14} className="text-brand-400" />
              Durée : {service.duration}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <CheckIcon size={14} className="text-brand-400" />À partir de {service.priceFrom} €
            </li>
            <li className="inline-flex items-center gap-1.5">
              <MapPinIcon size={14} className="text-brand-400" />
              {city.name} — {city.postalCodes.join(" · ")}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
