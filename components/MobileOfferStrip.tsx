"use client";

import { usePathname } from "next/navigation";
import { BoltIcon } from "./Icon";
import { isMaisonPathname } from "@/lib/section";

/**
 * Bandeau d'information mobile sticky sous le header : ancre prix + dispo
 * dans le champ de vision dès l'arrivée. Caché sur desktop.
 *
 * ⚠️ Volontairement non-cliquable : c'est de la preuve sociale / promesse
 * tarifaire, pas un CTA. Évite la multiplication des boutons WhatsApp sur
 * une même vue mobile (Header / Hero / FloatingWhatsApp suffisent).
 *
 * Auto-adaptatif selon la section :
 *  - Auto   → "Dès 39 € · Réponse WhatsApp en moins de 30 min" (vert)
 *  - Maison → "Dès 39 € · Canapé, tapis, matelas à domicile"   (ambre)
 */
export default function MobileOfferStrip() {
  const pathname = usePathname() || "/";
  const isMaison = isMaisonPathname(pathname);

  if (isMaison) {
    return (
      <div className="lg:hidden">
        <div className="flex items-center justify-center gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[13px] font-medium text-amber-700">
          <BoltIcon size={14} className="text-amber-600" />
          <span>
            <strong className="font-bold text-slate-900">Dès 39 €</strong> · Canapé,
            tapis, matelas à domicile
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-center gap-2 border-b border-brand-500/30 bg-brand-500/10 px-4 py-2 text-[13px] font-medium text-brand-700">
        <BoltIcon size={14} className="text-brand-600" />
        <span>
          <strong className="font-bold text-slate-900">Dès 39 €</strong> · Réponse
          WhatsApp en moins de 30 min
        </span>
      </div>
    </div>
  );
}
