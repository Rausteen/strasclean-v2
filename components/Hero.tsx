import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { SITE } from "@/lib/site";

/** Vérifie au build si /public/hero.webp (ou variant) est présent.
 *  Sinon, le hero affiche un placeholder gradient discret au lieu d'une
 *  image cassée. Important pour les déploiements où l'image n'a pas
 *  encore été uploadée sur le VPS. */
const HERO_IMAGE_PATH = (() => {
  const exts = ["webp", "jpg", "jpeg", "png"] as const;
  const dir = path.join(process.cwd(), "public");
  for (const ext of exts) {
    if (fs.existsSync(path.join(dir, `hero.${ext}`))) {
      return `/hero.${ext}`;
    }
  }
  return null;
})();
import {
  WhatsAppIcon,
  PhoneIcon,
  MapPinIcon,
  CarIcon,
  SparklesIcon,
  CheckIcon,
  BoltIcon,
  StarIcon,
} from "./Icon";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Background — atmosphère light : grille discrète + un radial
          fade brand au top. Pas de blob circulaire (sinon clip visible
          au bas du Hero sur mobile court). */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade opacity-90" />
        <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="container-x pt-8 pb-14 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Copy — pas d'animation d'entrée : LCP doit être instantané */}
          <div>
            <span className="chip">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              Nettoyage auto à domicile à Strasbourg
            </span>

            <h1 className="h-display mt-4 text-balance text-[34px] font-bold leading-[1.05] text-slate-900 sm:text-5xl lg:text-6xl">
              Votre voiture propre comme neuve,{" "}
              <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-emerald-700 bg-clip-text text-transparent">
                sans vous déplacer.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
              StrasClean se déplace chez vous pour nettoyer votre véhicule en
              profondeur, avec des formules adaptées à votre besoin&nbsp;:
              entretien rapide, rénovation intérieure ou detailing complet.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row">
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa h-14 w-full px-6 text-base active:scale-[0.98] sm:h-12 sm:w-auto"
              >
                <WhatsAppIcon size={20} />
                Réserver sur WhatsApp
              </a>
              <a
                href="/reserver-auto"
                className="btn-ghost h-14 w-full px-6 text-base active:scale-[0.98] sm:h-12 sm:w-auto"
              >
                Réserver en ligne
              </a>
            </div>
            <a
              href={SITE.phoneHref}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <PhoneIcon size={14} />
              Ou appelez : {SITE.phoneDisplay}
            </a>

            {/* Preuve sociale + dispo — fusionnés en un seul bandeau dense */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] sm:mt-5 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <span className="flex items-center gap-0.5 text-amber-600">
                  <StarIcon size={14} />
                  <StarIcon size={14} />
                  <StarIcon size={14} />
                  <StarIcon size={14} />
                  <StarIcon size={14} />
                </span>
                <span className="font-semibold text-slate-900">Service local de confiance</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-brand-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
                </span>
                Dispo cette semaine
              </span>
            </div>

            {/* Trust strip (allégée, sans doublon avec la preuve sociale) */}
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-slate-600 sm:mt-6 sm:gap-x-5 sm:text-sm">
              {[
                { icon: <HomeChip />, label: "À domicile" },
                { icon: <MapPinIcon size={14} className="text-brand-600" />, label: "Strasbourg & alentours" },
                { icon: <BoltIcon size={14} className="text-brand-600" />, label: "Réponse rapide" },
                { icon: <CarIcon size={14} className="text-brand-600" />, label: "Intérieur / extérieur" },
                { icon: <CheckIcon size={14} className="text-brand-600" />, label: "Paiement sur place" },
              ].map((t) => (
                <li key={t.label} className="inline-flex items-center gap-1.5">
                  {t.icon}
                  {t.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual — desktop only : sur mobile, on file directement vers
              les Formules en dessous pour réduire le scroll avant prix. */}
          <div className="hidden lg:block">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeChip() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-md bg-brand-500/15 text-brand-600">
      <SparklesIcon size={12} />
    </span>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
      {/* Main car card */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 p-6 shadow-card">
          {/* Photo (avec fallback gradient si /public/hero.webp absent) */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white">
            {HERO_IMAGE_PATH ? (
              <Image
                src={HERO_IMAGE_PATH}
                alt="Voiture nettoyée par StrasClean — rendu showroom à Strasbourg"
                fill
                sizes="560px"
                quality={82}
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-700/40 via-slate-100 to-slate-50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.18),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_75%,rgba(255,255,255,0.06),transparent_55%)]" />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 grid place-items-center text-[140px] opacity-25"
                >
                  🚗
                </span>
              </div>
            )}
            {/* Subtle overlay to blend top/bottom edges with the dark UI */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
            <span className="absolute left-4 top-4 chip !bg-black/70 sm:!bg-black/50 sm:backdrop-blur-md">
              <SparklesIcon size={12} className="text-brand-600" />
              Rendu showroom
            </span>
            <span className="absolute right-4 top-4 chip !bg-black/70 !text-brand-700 sm:!bg-black/50 sm:backdrop-blur-md">
              ★★★★★
            </span>
          </div>

          {/* Booking row */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 p-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-whatsapp/15 text-whatsapp">
              <WhatsAppIcon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">Réservation en 10 secondes</p>
              <p className="text-xs text-slate-500">Envoyez quelques photos, on confirme votre créneau</p>
            </div>
            <a
              href="#formules"
              className="hidden rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 sm:inline-flex"
            >
              Voir les formules
            </a>
          </div>
        </div>

        {/* Floating sticker - left */}
        <div className="absolute -left-4 top-6 hidden rotate-[-6deg] animate-float rounded-2xl border border-slate-200 bg-slate-50/90 p-3 shadow-card backdrop-blur sm:block">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/15 text-brand-600">
              <BoltIcon size={16} />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-900">Équipe de 2</p>
              <p className="text-[11px] text-slate-500">Dès 30 min sur place</p>
            </div>
          </div>
        </div>

        {/* Floating sticker - right */}
        <div className="absolute -right-4 -bottom-5 hidden rotate-[4deg] animate-float [animation-delay:1s] rounded-2xl border border-slate-200 bg-slate-50/90 p-3 shadow-card backdrop-blur sm:block">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/15 text-brand-600">
              <MapPinIcon size={16} />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-900">Strasbourg & alentours</p>
              <p className="text-[11px] text-slate-500">12 communes desservies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

