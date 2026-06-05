import fs from "node:fs";
import path from "node:path";
import BeforeAfterClient, { type BeforeAfterPair } from "./BeforeAfterClient";

// ─────────────────────────────────────────────────────────────────────────
//  BeforeAfter — wrapper SERVEUR.
//
//  Détecte les vraies photos clients dans /public/avant-apres/ au build,
//  puis passe les chemins résolus à BeforeAfterClient (qui gère les onglets).
//
//  Fichiers attendus :
//    /public/avant-apres/siegeavant.webp + siegeapres.webp
//    /public/avant-apres/tapisavant.webp + tapisapres.webp
//    /public/avant-apres/tableauavant.webp + tableauapres.webp
//    /public/avant-apres/carrosserieavant.webp + carrosserieapres.webp
//
//  Si une photo manque, un placeholder gradient prend le relais côté client.
// ─────────────────────────────────────────────────────────────────────────

type RawPair = {
  id: string;
  label: string;
  description: string;
  stem: string;
};

const PAIRS: RawPair[] = [
  {
    id: "sieges",
    label: "Sièges",
    description:
      "Taches profondes, traces et zones marquées disparues — extraction pro + désinfection.",
    stem: "siege",
  },
  {
    id: "tapis",
    label: "Tapis & moquettes",
    description:
      "Aspiration profonde, shampouinage et désodorisation. Pas d'auréole, séchage rapide.",
    stem: "tapis",
  },
  {
    id: "tableau",
    label: "Tableau de bord",
    description:
      "Plastiques rénovés, vitres claires et points de contact désinfectés.",
    stem: "tableau",
  },
  {
    id: "carrosserie",
    label: "Carrosserie",
    description:
      "Lavage à la main, décontamination clay-bar et finition brillante.",
    stem: "carrosserie",
  },
];

const EXT_ORDER = ["webp", "jpg", "jpeg", "png"] as const;
const PHOTO_DIR = path.join(process.cwd(), "public", "avant-apres");

/** Cherche le fichier {stem}{suffix}.{ext} dans /public/avant-apres/. */
function findPhoto(stem: string, suffix: "avant" | "apres"): string | null {
  for (const ext of EXT_ORDER) {
    const filename = `${stem}${suffix}.${ext}`;
    const full = path.join(PHOTO_DIR, filename);
    if (fs.existsSync(full)) {
      return `/avant-apres/${filename}`;
    }
  }
  return null;
}

export default function BeforeAfter() {
  const resolved: BeforeAfterPair[] = PAIRS.map((p) => ({
    id: p.id,
    label: p.label,
    description: p.description,
    before: {
      src: findPhoto(p.stem, "avant"),
      alt: `${p.label} — avant nettoyage StrasClean`,
      tone: "before",
    },
    after: {
      src: findPhoto(p.stem, "apres"),
      alt: `${p.label} — après nettoyage StrasClean`,
      tone: "after",
    },
  }));

  return <BeforeAfterClient pairs={resolved} />;
}
