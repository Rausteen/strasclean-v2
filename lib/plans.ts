// ─────────────────────────────────────────────────────────────────────────
//  StrasClean — Formules (packages tarifaires)
//
//  3 formules (l'id technique reste confort/premium/luxury pour les ancres
//  URL et le routage ; seul le nom affiché change) :
//    - Essentiel           (59 €)  — entretien rapide        [id: confort]
//    - Premium Intérieur   (89 €)  — nettoyage complet (la plus populaire) [id: premium]
//    - Intégrale StrasClean (139 €) — intérieur + extérieur   [id: luxury]
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
    name: "Formule Essentiel",
    priceFrom: "59",
    tagline: "L'essentiel pour un intérieur propre, sain et rafraîchi.",
    features: [
      "Aspiration profonde",
      "Nettoyage tableau de bord et plastiques",
      "Vitres intérieures sans traces",
      "Désinfection des points de contact",
      "Désodorisation professionnelle",
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je voudrais réserver la formule Essentiel dès 59 €. Quels sont vos prochains créneaux ?",
    accent: "from-white/10 to-white/0",
  },
  {
    id: "premium",
    emoji: "✨",
    name: "Formule Premium Intérieur",
    priceFrom: "89",
    tagline: "Nettoyage complet en profondeur — intérieur rénové comme neuf.",
    highlight: true,
    badge: "Le plus populaire ⭐",
    features: [
      "Tout l'Essentiel inclus",
      "Shampouinage sièges, moquettes et tapis",
      "Traitement cuir ou tissu",
      "Dégraissage & protection des plastiques",
      "Nettoyage contours de portes & coffre",
      "Désinfection bactéricide + désodorisation renforcée",
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je voudrais réserver la formule Premium Intérieur dès 89 €. Quels sont vos prochains créneaux ?",
    accent: "from-brand-500/30 to-brand-500/0",
  },
  {
    id: "luxury",
    emoji: "💠",
    name: "Formule Intégrale StrasClean",
    priceFrom: "139",
    tagline:
      "Nettoyage complet intérieur et extérieur à domicile. Idéal pour retrouver une voiture propre, saine et soignée sans se déplacer.",
    features: [
      "Tout le Premium Intérieur inclus",
      "Lavage extérieur à la main",
      "Décontamination carrosserie",
      "Jantes nettoyées + finitions",
      "Vitres extérieures sans traces",
      "Parfum de finition",
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je voudrais réserver la formule Intégrale StrasClean dès 139 €. Quels sont vos prochains créneaux ?",
    accent: "from-violet-500/20 to-violet-500/0",
  },
];

export const findPlan = (id: string) => PLANS.find((p) => p.id === id);

// ─── Supplément selon le type de véhicule ────────────────────────────────
//  Le prix affiché de chaque formule correspond à une citadine. Pour les
//  véhicules plus volumineux, un léger supplément forfaitaire est appliqué.
//  Centralisé ici pour rester cohérent partout (PricingSection, /formules).

// Classe de tarif (pour le prix des options). Plusieurs véhicules partagent
// la même classe (ex. Sportive → berline, Pick-up/Van → utilitaire).
export type VehicleTier = "citadine" | "berline" | "suv" | "utilitaire";

export type VehicleType = {
  id: string;
  label: string;
  /** Descriptif affiché sous le nom. */
  desc: string;
  /** Vignette (dans public/vehicules/…) — repli sur l'emoji si absente. */
  image?: string;
  emoji: string;
  /** Classe de tarif pour le prix des options. */
  tier: VehicleTier;
  /** Supplément en € au-dessus du prix de base "citadine". */
  surcharge: number;
};

export const VEHICLE_TYPES: VehicleType[] = [
  { id: "citadine", label: "Citadine", desc: "Petits véhicules (Mini, Fiat 500)", image: "/vehicules/citadine.png", emoji: "🚗", tier: "citadine", surcharge: 0 },
  { id: "berline", label: "Berline", desc: "Voitures standards (Audi A4, Classe C)", image: "/vehicules/berline.png", emoji: "🚙", tier: "berline", surcharge: 10 },
  { id: "sportive", label: "Sportive", desc: "Voitures de sport (Porsche, Ferrari)", image: "/vehicules/sportive.png", emoji: "🏎️", tier: "berline", surcharge: 10 },
  { id: "suv", label: "SUV", desc: "Véhicules plus grands (5008, Range Rover)", image: "/vehicules/suv.png", emoji: "🚙", tier: "suv", surcharge: 20 },
  { id: "pickup", label: "Pick-up", desc: "Pick-up, camionnettes (Silverado, Tacoma)", image: "/vehicules/pickup.png", emoji: "🛻", tier: "utilitaire", surcharge: 30 },
  { id: "van", label: "Van", desc: "Minivans, fourgonnettes", image: "/vehicules/van.png", emoji: "🚐", tier: "utilitaire", surcharge: 30 },
];

// ─── Options selon l'état du véhicule ────────────────────────────────────
//  Suppléments facultatifs facturés selon l'état réel. Le prix est FIXE mais
//  dépend du type de véhicule (SUV et utilitaire partagent la même colonne).
//  Source unique consommée par le calculateur ET le formulaire de
//  réservation Auto.

export type AutoOptionId = "poils" | "tres-sale" | "odeur" | "taches";

export type AutoOption = {
  id: AutoOptionId;
  label: string;
  /** Prix fixe (€) selon la CLASSE de véhicule (tier). */
  priceByVehicle: Record<VehicleTier, number>;
};

export const AUTO_OPTIONS: AutoOption[] = [
  {
    id: "poils",
    label: "Poils d'animaux",
    priceByVehicle: { citadine: 29, berline: 49, suv: 69, utilitaire: 69 },
  },
  {
    id: "tres-sale",
    label: "Véhicule très sale",
    priceByVehicle: { citadine: 29, berline: 49, suv: 69, utilitaire: 69 },
  },
  {
    id: "odeur",
    label: "Odeur persistante",
    priceByVehicle: { citadine: 49, berline: 59, suv: 69, utilitaire: 69 },
  },
  {
    id: "taches",
    label: "Taches tenaces",
    priceByVehicle: { citadine: 29, berline: 39, suv: 49, utilitaire: 49 },
  },
];

/** Prix d'une option pour un véhicule (via sa classe de tarif). */
export const autoOptionPrice = (o: AutoOption, vehicleId: string): number => {
  const tier = VEHICLE_TYPES.find((v) => v.id === vehicleId)?.tier ?? "citadine";
  return o.priceByVehicle[tier];
};

// ─── Services rapides du formulaire d'accueil (hero) ─────────────────────
//  Choix volontairement larges (≠ formules détaillées) pour un 1er contact
//  sans friction. Les ids sont acceptés par /api/booking-request (auto).
export type AutoQuickService = {
  id: "auto-interieur" | "auto-exterieur" | "auto-complet";
  label: string;
};

export const AUTO_QUICK_SERVICES: AutoQuickService[] = [
  { id: "auto-interieur", label: "Nettoyage auto intérieur" },
  { id: "auto-exterieur", label: "Nettoyage auto extérieur" },
  { id: "auto-complet", label: "Nettoyage auto complet" },
];
