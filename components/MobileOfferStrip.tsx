"use client";

import { usePathname } from "next/navigation";
import { SITE, waLink } from "@/lib/site";
import { BoltIcon } from "./Icon";
import { isMaisonPathname } from "@/lib/section";

/**
 * Bandeau mobile sticky sous le header : ancre prix + dispo
 * immédiatement dans le champ de vision. Caché sur desktop (le hero
 * a déjà l'espace pour ces infos).
 *
 * Auto-adaptatif selon la section :
 *  - Auto  → "Dès 39 € · Réponse WhatsApp en moins de 30 min"  (vert brand)
 *  - Maison → "Dès 39 € · Canapé, tapis, matelas à domicile"   (ambre)
 */
export default function MobileOfferStrip() {
  const pathname = usePathname() || "/";
  const isMaison = isMaisonPathname(pathname);

  if (isMaison) {
    const waMaison = waLink(
      "Bonjour StrasClean 👋 Je voudrais un devis pour un nettoyage à domicile (canapé / tapis / matelas / fauteuils). Quels sont vos prochains créneaux ?",
    );
    return (
      <div className="lg:hidden">
        <a
          href={waMaison}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[13px] font-medium text-amber-700 active:bg-amber-500/15"
        >
          <BoltIcon size={14} className="text-amber-600" />
          <span>
            <strong className="font-bold text-slate-900">Dès 39 €</strong> · Canapé,
            tapis, matelas à domicile
          </span>
        </a>
      </div>
    );
  }

  return (
    <div className="lg:hidden">
      <a
        href={SITE.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 border-b border-brand-500/30 bg-brand-500/10 px-4 py-2 text-[13px] font-medium text-brand-700 active:bg-brand-500/15"
      >
        <BoltIcon size={14} className="text-brand-600" />
        <span>
          <strong className="font-bold text-slate-900">Dès 39 €</strong> · Réponse
          WhatsApp en moins de 30 min
        </span>
      </a>
    </div>
  );
}
