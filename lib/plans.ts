// ─────────────────────────────────────────────────────────────────────────
//  StrasClean — Formules (packages tarifaires)
//
//  3 formules :
//    - Confort  (39 €) — entretien rapide
//    - Premium  (79 €) — nettoyage complet (la plus populaire)
//    - Luxury   (119 €) — detailing showroom
//
//  Pour modifier les prix / inclus / nom : tout est ici.
// ─────────────────────────────────────────────────────────────────────────

export type Plan = {
  /** Identifiant stable utilisé pour les ancres URL (#confort, #premium, #luxury) */
  id: "confort" | "premium" | "luxury";
  emoji: string;
  name: string;
  /** Prix "à partir de" sans le symbole € */
  priceFrom: string;
  /** Phrase courte décrivant la formule */
  tagline: string;
  /** Liste des prestations incluses */
  features: string[];
  /** Marquer comme la formule "vedette" */
  highlight?: boolean;
  /** Texte du badge ("Le plus populaire ⭐") — s'affiche si défini */
  badge?: string;
  /** Message WhatsApp pré-rempli pour réserver cette formule */
  ctaMessage: string;
  /** Couleur d'accentuation pour le glow de la card */
  accent: string;
};

export const PLANS: Plan[] = [
  {
    id: "confort",
    emoji: "🚗",
    name: "Formule Confort",
    priceFrom: "39",
    tagline: "L'essentiel pour un intérieur propre, sain et rafraîchi.",
    features: [
      "Aspiration profonde",
      "Nettoyage tableau de bord et plastiques",
      "Vitres intérieures sans traces",
      "Désinfection des points de contact",
      "Déodorisation professionnelle",
    ],
    ctaMessage:
      "Bonjour StrasClean, je souhaite réserver la formule Confort (à partir de 39 €).",
    accent: "from-white/10 to-white/0",
  },
  {
    id: "premium",
    emoji: "✨",
    name: "Formule Premium",
    priceFrom: "79",
    tagline: "Nettoyage complet en profondeur — intérieur rénové comme neuf.",
    highlight: true,
    badge: "Le plus populaire ⭐",
    features: [
      "Aspiration complète",
      "Shampouinage sièges, moquettes et tapis",
      "Traitement cuir ou tissu",
      "Dégraissage & protection plastiques",
      "Nettoyage contours de portes & coffre",
      "Désinfection bactéricide + désodorisation renforcée",
    ],
    ctaMessage:
      "Bonjour StrasClean, je souhaite réserver la formule Premium (à partir de 79 €).",
    accent: "from-brand-500/30 to-brand-500/0",
  },
  {
    id: "luxury",
    emoji: "💠",
    name: "Formule Luxury Detailing",
    priceFrom: "119",
    tagline:
      "Service d'exception à domicile — rendu showroom intérieur + extérieur.",
    features: [
      "Tout le contenu Premium inclus",
      "Lavage extérieur à la main",
      "Décontamination carrosserie",
      "Vitres intérieures & extérieures",
      "Traitement plastiques extérieurs",
      "Traitement poils d'animaux inclus",
      "Parfum de finition",
    ],
    ctaMessage:
      "Bonjour StrasClean, je souhaite réserver la formule Luxury Detailing (à partir de 119 €).",
    accent: "from-violet-500/20 to-violet-500/0",
  },
];

export const findPlan = (id: string) => PLANS.find((p) => p.id === id);

// ─── Supplément selon le type de véhicule ────────────────────────────────
//  Le prix affiché de chaque formule correspond à une citadine. Pour les
//  véhicules plus volumineux, un léger supplément forfaitaire est appliqué.
//  Centralisé ici pour rester cohérent partout (PricingSection, /formules).

export type VehicleType = {
  id: "citadine" | "berline" | "suv" | "utilitaire";
  label: string;
  emoji: string;
  /** Supplément en € au-dessus du prix de base "citadine" */
  surcharge: number;
};

export const VEHICLE_TYPES: VehicleType[] = [
  { id: "citadine", label: "Citadine", emoji: "🚗", surcharge: 0 },
  { id: "berline", label: "Berline", emoji: "🚙", surcharge: 10 },
  { id: "suv", label: "SUV", emoji: "🚐", surcharge: 20 },
  { id: "utilitaire", label: "Utilitaire", emoji: "🚛", surcharge: 30 },
];
