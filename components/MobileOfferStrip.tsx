"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoltIcon } from "./Icon";
import { isMaisonPathname } from "@/lib/section";
import { waLink } from "@/lib/site";

/**
 * Bandeau d'offre mobile sticky sous le header : ancre prix + dispo dans le
 * champ de vision dès l'arrivée. Caché sur desktop.
 *
 * Désormais CLIQUABLE → deep-link WhatsApp contextualisé : c'est un
 * emplacement premium (100 % de visibilité à l'arrivée), on capte l'intention
 * chaude au lieu de le laisser inerte. Le chevron signale l'affordance.
 *
 * Auto-adaptatif selon la section :
 *  - Auto   → "Dès 49 € · Réservez en ligne en 1 min" → /reserver (vert)
 *  - Maison → "Dès 39 € · Canapé, tapis, matelas à domicile" → WhatsApp (ambre)
 */
export default function MobileOfferStrip() {
  const pathname = usePathname() || "/";
  const isMaison = isMaisonPathname(pathname);

  const maisonHref = waLink(
    "Bonjour StrasClean 👋 Je voudrais un devis pour un nettoyage à domicile (canapé / tapis / matelas / fauteuils). Quels sont vos prochains créneaux ?",
  );

  if (isMaison) {
    return (
      <div className="lg:hidden">
        <a
          href={maisonHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Demander un devis Maison sur WhatsApp"
          className="flex items-center justify-center gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[13px] font-medium text-amber-700 transition active:bg-amber-500/20"
        >
          <BoltIcon size={14} className="text-amber-600" />
          <span>
            <strong className="font-bold text-slate-900">Dès 39 €</strong> · Canapé,
            tapis, matelas à domicile
          </span>
          <span aria-hidden className="font-bold text-amber-600">›</span>
        </a>
      </div>
    );
  }

  return (
    <div className="lg:hidden">
      <Link
        href="/reserver"
        aria-label="Réserver un nettoyage auto en ligne"
        className="flex items-center justify-center gap-2 border-b border-brand-500/30 bg-brand-500/10 px-4 py-2 text-[13px] font-medium text-brand-700 transition active:bg-brand-500/20"
      >
        <BoltIcon size={14} className="text-brand-600" />
        <span>
          <strong className="font-bold text-slate-900">Dès 49 €</strong> ·
          Réservez en ligne en 1 min
        </span>
        <span aria-hidden className="font-bold text-brand-600">›</span>
      </Link>
    </div>
  );
}
