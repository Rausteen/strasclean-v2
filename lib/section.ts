// Détection de section (Auto vs Maison) basée sur le pathname.
// Utilisé par Header, Footer, FloatingWhatsApp pour adapter le thème.

const MAISON_SLUGS = [
  "nettoyage-canape-strasbourg",
  "nettoyage-tapis-domicile-strasbourg",
  "nettoyage-matelas-strasbourg",
  "nettoyage-fauteuil-chaise-strasbourg",
];

export function isMaisonPathname(pathname: string): boolean {
  if (pathname === "/strasclean-maison" || pathname === "/maison") return true;
  return MAISON_SLUGS.some((s) => pathname === `/${s}`);
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
