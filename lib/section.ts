// Détection de section (Auto vs Maison) basée sur le pathname.
// Utilisé par Header, Footer, FloatingWhatsApp pour adapter le thème.

/** Préfixes de slug qui appartiennent à la verticale Maison.
 *  Tout slug commençant par l'un d'eux est considéré comme Maison —
 *  ça couvre les 4 services + 11 villes + 6 SEO pages + 1 hub +
 *  qui-sommes-nous + redirect /maison.
 *
 *  ⚠️ À jour avec lib/homeServices.ts, lib/homeSeoPages.ts. Si tu ajoutes
 *  une nouvelle catégorie Maison (ex. "nettoyage-couette-"), ajoute son
 *  préfixe ici. */
const MAISON_SLUG_PREFIXES = [
  "nettoyage-canape-",
  "nettoyage-tapis-",
  "nettoyage-matelas-",
  "nettoyage-fauteuil-chaise-",
  "nettoyage-airbnb-",
  "prix-nettoyage-canape-",
  "prix-nettoyage-tapis-",
  "prix-nettoyage-matelas-",
  "prix-nettoyage-fauteuil-chaise-",
];

export function isMaisonPathname(pathname: string): boolean {
  // Hub Maison et tout sous-chemin (qui-sommes-nous, etc.)
  if (pathname === "/strasclean-maison") return true;
  if (pathname.startsWith("/strasclean-maison/")) return true;

  // Redirect raccourci /maison
  if (pathname === "/maison") return true;

  // Slug Maison (services, villes, SEO) — check par préfixe sur le 1er
  // segment du path (sans le slash initial).
  const slug = pathname.replace(/^\/+/, "").replace(/\/.*$/, "");
  return MAISON_SLUG_PREFIXES.some((p) => slug.startsWith(p));
}

/** Sections accessibles via ancres sur la home Auto */
export const NAV_AUTO = [
  { href: "/#formules", label: "Formules" },
  { href: "/#avant-apres", label: "Avant / Après" },
  { href: "/#fonctionnement", label: "Comment ça marche" },
  { href: "/#avis", label: "Avis" },
  { href: "/#faq", label: "FAQ" },
];

/** Sections accessibles via ancres sur la home Maison */
export const NAV_MAISON = [
  { href: "/strasclean-maison#prestations", label: "Prestations" },
  { href: "/strasclean-maison#avant-apres", label: "Avant / Après" },
  { href: "/strasclean-maison#process", label: "Comment ça marche" },
  { href: "/strasclean-maison#avis", label: "Avis" },
  { href: "/strasclean-maison#faq", label: "FAQ" },
];
