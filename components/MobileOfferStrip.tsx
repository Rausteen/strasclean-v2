import { SITE } from "@/lib/site";
import { ClockIcon, BoltIcon } from "./Icon";

/**
 * Bandeau mobile sticky sous le header : ancre prix + dispo
 * immédiatement dans le champ de vision. Caché sur desktop (le hero
 * a déjà l'espace pour ces infos).
 */
export default function MobileOfferStrip() {
  return (
    <div className="lg:hidden">
      <a
        href={SITE.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 border-b border-brand-500/30 bg-brand-500/10 px-4 py-2 text-[13px] font-medium text-brand-100 active:bg-brand-500/15"
      >
        <BoltIcon size={14} className="text-brand-300" />
        <span>
          <strong className="font-bold text-white">Dès 39 €</strong> · Réponse WhatsApp en moins de 30 min
        </span>
      </a>
    </div>
  );
}
