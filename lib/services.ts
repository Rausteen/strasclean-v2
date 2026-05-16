// ─────────────────────────────────────────────────────────────────────────
//  StrasClean — Pages "service × ville" (SEO local)
//
//  URL générée : /{service-slug}-{city-slug}
//  Exemples :
//    /shampouinage-sieges-voiture-strasbourg
//    /detailing-auto-illkirch-graffenstaden
//    /nettoyage-poils-animaux-voiture-schiltigheim
//
//  Le matcher de slug fait la différence entre :
//   - une URL de ville (préfixe "nettoyage-voiture-domicile-…")
//   - une URL service × ville (préfixe = slug d'un service ci-dessous)
//
//  Pour ajouter un service : duplique une entrée et renseigne tous les champs.
// ─────────────────────────────────────────────────────────────────────────

import { CITIES, City, CITY_URL_PREFIX } from "./cities";
import { USE_CASES, UseCase, findUseCase } from "./usecases";

export type Service = {
  /** Slug d'URL — kebab-case, sans accent. Doit être un keyword SEO complet. */
  slug: string;
  /** Nom complet (utilisé en H1 et titres) */
  name: string;
  /** Nom court (utilisé dans les listes/labels) */
  shortName: string;
  /** Emoji représentatif */
  emoji: string;
  /** Tagline pour les cards (1 phrase, max ~80c) */
  shortDesc: string;
  /** Paragraphe d'intro contextualisé par ville (anti duplicate content) */
  introTemplate: (city: City) => string;
  /** Durée annoncée — string lisible */
  duration: string;
  /** Prix "à partir de" — entier en chaîne (sans €) */
  priceFrom: string;
  /** Formule recommandée pour cette prestation */
  recommendedPlanId: "confort" | "premium" | "luxury";
  /** Liste de ce qui est inclus */
  whatsIncluded: string[];
  /** Arguments clés (3 cards) */
  whyChoose: { title: string; desc: string }[];
  /** Q&R spécifiques au service */
  faq: { q: string; a: string }[];
  /** Message WhatsApp pré-rempli (la ville est ajoutée automatiquement à la fin) */
  ctaMessage: string;
};

export const SERVICES: Service[] = [
  {
    slug: "shampouinage-sieges-voiture",
    name: "Shampouinage sièges voiture",
    shortName: "Shampouinage sièges",
    emoji: "🧼",
    shortDesc:
      "Injection-extraction professionnelle pour des sièges nettoyés à neuf, sans tache ni odeur.",
    introTemplate: (c) =>
      `Le shampouinage des sièges, c'est la prestation qui retire les taches anciennes, les auréoles et les odeurs incrustées dans les fibres. À ${c.name}, StrasClean intervient à domicile avec un injecteur-extracteur professionnel pour traiter tous types de sièges — tissu, alcantara, similicuir et cuir.`,
    duration: "1h30 à 3h",
    priceFrom: "59",
    recommendedPlanId: "premium",
    whatsIncluded: [
      "Aspiration profonde du siège",
      "Pré-traitement spécifique des taches tenaces",
      "Injection-extraction sur l'ensemble du siège",
      "Désinfection bactéricide + neutralisation des odeurs",
      "Séchage assisté pour récupérer la voiture rapidement",
    ],
    whyChoose: [
      {
        title: "Méthode professionnelle",
        desc: "L'injection-extraction décolle la saleté en profondeur, là où l'aspirateur ne suffit pas.",
      },
      {
        title: "Tous types de sièges",
        desc: "Tissu, alcantara, similicuir ou cuir — produits adaptés à chaque surface.",
      },
      {
        title: "Résultat visible",
        desc: "Sièges plus propres, plus secs et débarrassés des odeurs dès la fin de l'intervention.",
      },
    ],
    faq: [
      {
        q: "Combien de temps les sièges mettent-ils à sécher ?",
        a: "Avec notre séchage assisté, vous pouvez généralement réutiliser la voiture le jour même. Comptez 2 à 4h pour un séchage complet selon la météo et la ventilation.",
      },
      {
        q: "Toutes les taches partent-elles ?",
        a: "La grande majorité des taches part. Pour les taches très anciennes (huiles, encres profondes), on vous donne notre avis honnête avant intervention pour éviter les mauvaises surprises.",
      },
      {
        q: "Vous traitez aussi les sièges en cuir ?",
        a: "Oui. Pour le cuir on utilise des produits dédiés et un nettoyage doux qui préserve la matière, suivi d'un soin nourrissant.",
      },
    ],
    ctaMessage: "Bonjour StrasClean, je souhaite un shampouinage des sièges de ma voiture",
  },

  {
    slug: "detailing-auto",
    name: "Detailing auto",
    shortName: "Detailing auto",
    emoji: "💠",
    shortDesc:
      "Niveau au-dessus du nettoyage classique — rendu showroom intérieur et extérieur.",
    introTemplate: (c) =>
      `Le detailing auto, c'est le niveau d'exigence au-dessus du nettoyage classique. À ${c.name}, StrasClean traite chaque surface avec des produits professionnels — lavage extérieur main, décontamination carrosserie, shampouinage complet, traitement des plastiques — pour un rendu showroom à la sortie.`,
    duration: "4h à 6h",
    priceFrom: "119",
    recommendedPlanId: "luxury",
    whatsIncluded: [
      "Lavage extérieur à la main + décontamination carrosserie",
      "Shampouinage complet de l'habitacle (sièges, moquette, plafonnier)",
      "Nettoyage et dressing des plastiques intérieurs et extérieurs",
      "Vitres intérieures et extérieures sans traces",
      "Désinfection bactéricide + parfum de finition",
    ],
    whyChoose: [
      {
        title: "Rendu showroom",
        desc: "Une voiture qui retrouve l'éclat du neuf, jusqu'au moindre détail visible.",
      },
      {
        title: "Idéal avant revente",
        desc: "Un véhicule en état de detailing se vend plus vite, et plus cher.",
      },
      {
        title: "Service à domicile",
        desc: "Pas de centre de detailing à trouver — on vient avec tout le matériel professionnel.",
      },
    ],
    faq: [
      {
        q: "Combien de temps dure un detailing complet ?",
        a: "Comptez 4 à 6h sur place pour un detailing complet, selon la taille du véhicule et son état initial.",
      },
      {
        q: "Faut-il préparer la voiture ?",
        a: "Non, on s'occupe de tout. Videz simplement les effets personnels du véhicule avant notre arrivée.",
      },
      {
        q: "Le detailing protège-t-il la peinture ?",
        a: "Oui, après lavage et décontamination on applique un produit de finition qui protège la peinture pendant plusieurs semaines.",
      },
    ],
    ctaMessage: "Bonjour StrasClean, je souhaite réserver un detailing auto complet",
  },

  {
    slug: "nettoyage-poils-animaux-voiture",
    name: "Nettoyage poils d'animaux",
    shortName: "Poils d'animaux",
    emoji: "🐾",
    shortDesc:
      "Élimination des poils incrustés sur sièges, moquette et coffre — méthode dédiée.",
    introTemplate: (c) =>
      `Si vous transportez régulièrement vos animaux, vous savez à quel point les poils s'incrustent dans les fibres et résistent à l'aspirateur classique. À ${c.name}, StrasClean utilise une méthode dédiée — turbo-brosse, adhésifs spécifiques et brossage manuel — pour décoller les poils en profondeur, partout où ils se cachent.`,
    duration: "2h à 3h",
    priceFrom: "69",
    recommendedPlanId: "premium",
    whatsIncluded: [
      "Aspiration spécialisée poils (turbo-brosse + adhésifs)",
      "Brossage manuel des fibres pour décoller les poils profonds",
      "Traitement complet sièges, moquette et coffre",
      "Désodorisation animale ciblée",
      "Désinfection bactéricide pour neutraliser les allergènes",
    ],
    whyChoose: [
      {
        title: "Méthode dédiée",
        desc: "Pas un simple coup d'aspirateur — un vrai protocole pour les véhicules avec animaux.",
      },
      {
        title: "Confort des passagers sensibles",
        desc: "Désinfection qui réduit les allergènes pour les enfants et personnes allergiques.",
      },
      {
        title: "Adapté aux gros chiens",
        desc: "Coffre, banquette arrière rabattable, contre-portes — chaque zone est traitée.",
      },
    ],
    faq: [
      {
        q: "Vous traitez aussi les coffres très chargés ?",
        a: "Oui. Le traitement coffre est inclus, qu'il soit utilisé pour des chiens, du transport de matériel ou les deux.",
      },
      {
        q: "Et l'odeur d'animal ?",
        a: "On utilise une déodorisation animale spécifique qui neutralise l'odeur, plutôt que de la masquer comme un parfum classique.",
      },
      {
        q: "Faut-il refaire souvent ?",
        a: "Tout dépend de la fréquence des trajets. Beaucoup de clients font un gros traitement 1 à 2 fois par an, avec un entretien plus léger entre les deux.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean, ma voiture contient beaucoup de poils d'animaux, je souhaite un nettoyage spécifique",
  },

  {
    slug: "nettoyage-interieur-voiture",
    name: "Nettoyage intérieur voiture",
    shortName: "Nettoyage intérieur",
    emoji: "🚗",
    shortDesc:
      "Habitacle aspiré, plastiques nettoyés, vitres claires, désinfection complète.",
    introTemplate: (c) =>
      `Le nettoyage intérieur, c'est la prestation d'entretien régulier qui maintient l'habitacle propre, sain et agréable à conduire. À ${c.name}, StrasClean se déplace à votre domicile pour aspirer en profondeur, nettoyer tous les plastiques, désinfecter les points de contact et redonner un aspect impeccable à votre intérieur.`,
    duration: "1h à 2h",
    priceFrom: "39",
    recommendedPlanId: "confort",
    whatsIncluded: [
      "Aspiration profonde de l'habitacle (sièges, moquette, coffre)",
      "Nettoyage du tableau de bord, plastiques et contre-portes",
      "Vitres intérieures sans traces",
      "Désinfection des points de contact",
      "Déodorisation professionnelle",
    ],
    whyChoose: [
      {
        title: "Idéal pour l'entretien",
        desc: "Tous les 1 à 3 mois pour garder un intérieur propre, sain et agréable à conduire.",
      },
      {
        title: "Service rapide",
        desc: "1h à 2h sur place — vous récupérez votre voiture le jour même.",
      },
      {
        title: "Prix accessible",
        desc: "À partir de 39 € — la prestation la plus demandée chez StrasClean.",
      },
    ],
    faq: [
      {
        q: "Faut-il prendre cette prestation tous les mois ?",
        a: "Tous les 1 à 3 mois est un bon rythme pour un usage quotidien. Plus souvent si vous transportez régulièrement enfants, animaux ou matériel.",
      },
      {
        q: "Le coffre est-il inclus ?",
        a: "Oui, l'aspiration du coffre est incluse. Pour un coffre très chargé, on peut ajouter un traitement renforcé en option.",
      },
      {
        q: "Quelle différence avec la formule Premium ?",
        a: "Le nettoyage intérieur (Confort) est de l'entretien. La Premium ajoute un shampouinage complet des sièges et de la moquette — utile quand la voiture est très sale ou tachée.",
      },
    ],
    ctaMessage: "Bonjour StrasClean, je souhaite un nettoyage intérieur de ma voiture",
  },

  {
    slug: "lavage-auto-domicile",
    name: "Lavage auto à domicile",
    shortName: "Lavage à domicile",
    emoji: "🧽",
    shortDesc:
      "Lavage extérieur à la main, jantes et vitres — chez vous, sans déplacement.",
    introTemplate: (c) =>
      `Plus besoin de faire la queue en station. À ${c.name}, StrasClean vient laver votre voiture directement à votre domicile ou sur votre lieu de travail, à la main, avec un matériel autonome et des produits qui respectent la peinture.`,
    duration: "1h à 2h",
    priceFrom: "39",
    recommendedPlanId: "luxury",
    whatsIncluded: [
      "Pré-lavage à la mousse active",
      "Lavage à la main avec gants de microfibre",
      "Rinçage et séchage soigneux (zéro trace)",
      "Nettoyage des jantes et bas de caisse",
      "Vitres extérieures sans traces",
    ],
    whyChoose: [
      {
        title: "Sans déplacement",
        desc: "On vient avec l'eau, l'électricité et le matériel. Vous ne bougez pas.",
      },
      {
        title: "Lavage main",
        desc: "Pas de rouleaux automatiques qui rayent la peinture — un lavage main soigné.",
      },
      {
        title: "Combinable intérieur",
        desc: "Profitez-en pour ajouter un nettoyage intérieur ou un detailing complet.",
      },
    ],
    faq: [
      {
        q: "Avez-vous besoin d'un point d'eau ?",
        a: "Selon le lieu d'intervention, nous pouvons être autonomes en eau ou utiliser un point d'eau extérieur. On vous le confirme à la réservation.",
      },
      {
        q: "Et si je suis en immeuble ?",
        a: "Pas de souci — on intervient en bas de l'immeuble, sur la place de stationnement habituelle, ou à votre lieu de travail.",
      },
      {
        q: "Quel temps si je veux aussi l'intérieur ?",
        a: "Comptez 2h30 à 4h pour un combiné intérieur + extérieur, selon la formule choisie.",
      },
    ],
    ctaMessage: "Bonjour StrasClean, je souhaite un lavage de ma voiture à mon domicile",
  },
];

/** Construit l'URL d'une page service × ville */
export const servicePath = (s: Service, c: City) => `/${s.slug}-${c.slug}`;

/** Trouve un service par son slug */
export const findService = (slug: string) => SERVICES.find((s) => s.slug === slug);

/** Résultat du routeur de slug : ville, service×ville, ou cas d'usage. */
export type SlugMatch =
  | { type: "city"; city: City }
  | { type: "service-city"; service: Service; city: City }
  | { type: "usecase"; useCase: UseCase };

/**
 * Identifie le type d'une URL StrasClean et renvoie les entités correspondantes.
 * Renvoie null si le slug ne correspond à aucun pattern connu (→ 404).
 */
export function matchSlug(slug: string): SlugMatch | null {
  // 1) Page ville : "nettoyage-voiture-domicile-{citySlug}"
  const cityFromCityPage = CITIES.find(
    (c) => slug === `${CITY_URL_PREFIX}-${c.slug}`,
  );
  if (cityFromCityPage) return { type: "city", city: cityFromCityPage };

  // 2) Page service × ville : "{serviceSlug}-{citySlug}"
  for (const service of SERVICES) {
    const city = CITIES.find((c) => slug === `${service.slug}-${c.slug}`);
    if (city) return { type: "service-city", service, city };
  }

  // 3) Page "cas d'usage" / pain point : slug complet et unique
  const uc = findUseCase(slug);
  if (uc) return { type: "usecase", useCase: uc };

  return null;
}

/** Service par défaut (le plus populaire) — utilisé sur la home */
export const DEFAULT_SERVICE = SERVICES[3]; // Nettoyage intérieur

/** Ville par défaut (siège commercial) — utilisée sur la home */
export const DEFAULT_CITY: City = CITIES[0]; // Strasbourg
