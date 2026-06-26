import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { SITE } from "@/lib/site";
import HeroLeadForm from "./HeroLeadForm";

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

type HeroProps = {
  /** Note moyenne Google réelle (ex. 5). Si absente → repli "Service local de confiance". */
  rating?: number;
  /** Nombre total d'avis Google. */
  reviewCount?: number;
  /** URL publique de la fiche Google (pour rendre la note cliquable). */
  reviewsUrl?: string;
};

export default function Hero({ rating, reviewCount, reviewsUrl }: HeroProps = {}) {
  const hasRating = typeof rating === "number" && typeof reviewCount === "number" && reviewCount > 0;
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Background — photo en fond avec voile pour la lisibilité. Repli sur
          le décor light (grille + radial fade) si l'image n'est pas présente.
          Pas de `priority` : le LCP reste le H1, on ne le concurrence pas. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Décor light — base, et SEUL fond sur mobile : une photo full-bleed
            derrière une longue colonne empilée (texte + formulaire) rend mal
            sur petit écran. */}
        <div className="absolute inset-0 bg-radial-fade opacity-90" />
        <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        {/* Image de fond — DESKTOP uniquement, avec voile dégradé blanc →
            transparent pour garder le texte lisible à gauche. */}
        {HERO_IMAGE_PATH && (
          <div className="absolute inset-0 hidden lg:block">
            <Image
              src={HERO_IMAGE_PATH}
              alt=""
              fill
              sizes="100vw"
              quality={70}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/40" />
          </div>
        )}
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

            <h1 className="h-display mt-5 text-balance text-[clamp(34px,10vw,64px)] font-bold leading-[1.02] tracking-[-0.02em] text-slate-900">
              Votre voiture propre comme neuve,{" "}
              <span className="bg-gradient-to-r from-brand-600 to-brand-900 bg-clip-text text-transparent">
                sans vous déplacer.
              </span>
            </h1>

            <p className="mt-5 max-w-[36ch] text-balance text-[16px] leading-relaxed text-slate-700 sm:text-[19px]">
              On vient chez vous nettoyer votre véhicule en profondeur — entretien
              rapide, rénovation intérieure ou detailing complet. Vous ne bougez
              pas.
            </p>

            {/* CTA — hiérarchie claire : 1 primaire (WhatsApp) + Appeler en
                secondaire. La réservation en ligne est portée par le
                formulaire ci-contre → on retire le bouton redondant (loi de
                Hick : moins de choix concurrents = clic moins dilué). */}
            <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center">
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
                href={SITE.phoneHref}
                className="btn-ghost h-12 w-full px-4 text-sm active:scale-[0.98] sm:w-auto"
              >
                <PhoneIcon size={16} />
                Appeler
              </a>
            </div>

            {/* Preuve sociale + dispo — fusionnés en un seul bandeau dense.
                La note vient des vrais avis Google (props) ; repli neutre
                si la fiche n'est pas connectée. */}
            <div className="mt-6 flex flex-wrap items-center gap-x-[18px] gap-y-2 text-sm">
              {hasRating ? (
                <a
                  href={reviewsUrl ?? "#avis"}
                  {...(reviewsUrl
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex items-center gap-1.5 transition hover:opacity-80"
                >
                  <span className="flex items-center gap-px text-amber-600">
                    <StarIcon size={15} />
                    <StarIcon size={15} />
                    <StarIcon size={15} />
                    <StarIcon size={15} />
                    <StarIcon size={15} />
                  </span>
                  <span className="font-bold text-slate-900">
                    {rating!.toFixed(1).replace(".", ",")}/5
                  </span>
                  <span className="text-slate-600">
                    · {reviewCount} avis Google
                  </span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <span className="flex items-center gap-px text-amber-600">
                    <StarIcon size={15} />
                    <StarIcon size={15} />
                    <StarIcon size={15} />
                    <StarIcon size={15} />
                    <StarIcon size={15} />
                  </span>
                  <span className="font-bold text-slate-900">Service local de confiance</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 font-semibold text-brand-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
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

          {/* Formulaire rapide — à droite sur desktop, sous le texte sur
              mobile. Capture d'intention en 4 champs (cf. HeroLeadForm). */}
          <div className="lg:pl-4">
            <HeroLeadForm />
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


