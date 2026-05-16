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
import { HOME_SERVICES, findHomeService } from "./homeServices";
import { HOME_SEO_PAGES, findHomeSeoPage } from "./homeSeoPages";

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
  /**
   * Message WhatsApp pré-rempli (la ville est ajoutée automatiquement à la fin
   * via les wrappers ServiceDetail/ServiceCityHero). Ne PAS terminer par un
   * point ni par "à Strasbourg" — le wrapper construit :
   *   `${ctaMessage} à {Ville}. Quels sont vos prochains créneaux ?`
   */
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
    duration: "45 min à 1h30",
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
    ctaMessage: "Bonjour StrasClean 👋 Je voudrais un shampouinage des sièges de ma voiture",
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
    duration: "2h à 3h",
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
        a: "Comptez 2 à 3h sur place pour un detailing complet — on travaille en équipe de 2, ce qui divise par 2 le temps versus un detailer solo. La durée dépend de la taille du véhicule et de son état initial.",
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
    ctaMessage: "Bonjour StrasClean 👋 Je voudrais réserver un detailing auto complet",
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
    duration: "1h à 1h30",
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
    ctaMessage: "Bonjour StrasClean 👋 Je voudrais un traitement poils d'animaux",
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
    duration: "30 à 50 min",
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
        desc: "30 à 50 min sur place — équipe de 2, vous récupérez votre voiture rapidement le jour même.",
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
    ctaMessage: "Bonjour StrasClean 👋 Je voudrais un nettoyage intérieur",
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
    duration: "30 min à 1h",
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
        a: "Comptez 1h15 à 2h pour un combiné intérieur + extérieur — on travaille en équipe de 2, donc deux fois plus rapide qu'un detailer solo.",
      },
    ],
    ctaMessage: "Bonjour StrasClean 👋 Je voudrais un lavage complet à domicile",
  },

  // ─── 6. Lavage extérieur (entrée de gamme à 29 €) ──────────────────────
  {
    slug: "lavage-exterieur-voiture",
    name: "Lavage extérieur voiture",
    shortName: "Lavage extérieur",
    emoji: "🚿",
    shortDesc:
      "Lavage carrosserie à la main, à domicile — la formule la plus accessible pour garder votre voiture propre.",
    introTemplate: (c) =>
      `À ${c.name}, StrasClean vient laver la carrosserie de votre véhicule à la main, directement à votre domicile. C'est notre prestation d'entrée — rapide, soignée et idéale pour un entretien régulier sans engagement.`,
    duration: "20 à 30 min",
    priceFrom: "29",
    recommendedPlanId: "luxury",
    whatsIncluded: [
      "Pré-lavage à la mousse active",
      "Lavage manuel carrosserie à la microfibre",
      "Rinçage et séchage sans trace",
      "Nettoyage des bas de caisse",
      "Méthode 2 seaux : zéro risque de micro-rayure",
    ],
    whyChoose: [
      {
        title: "Le tarif le plus accessible",
        desc: "L'entrée de gamme StrasClean — idéale pour un entretien régulier sans budget conséquent.",
      },
      {
        title: "Lavage main, jamais en rouleaux",
        desc: "Gants en microfibre + méthode 2 seaux : impossible de rayer la peinture.",
      },
      {
        title: "Parfait tous les 15-30 jours",
        desc: "Le rythme idéal pour garder une voiture présentable au quotidien.",
      },
    ],
    faq: [
      {
        q: "Quelle différence avec le « Lavage à domicile » à 39 € ?",
        a: "La version à 29 € est la plus basique : carrosserie uniquement. Le Lavage à domicile à 39 € ajoute le nettoyage détaillé des jantes et des vitres extérieures pour un rendu plus complet.",
      },
      {
        q: "Inclut-il les jantes et les vitres ?",
        a: "Non, pour rester au tarif d'entrée. Pour des jantes et vitres traitées, choisissez la formule Lavage à domicile à 39 €.",
      },
      {
        q: "Faut-il un point d'eau sur place ?",
        a: "Selon le lieu, on peut être autonome en eau ou utiliser un point d'eau extérieur. On vous le confirme à la réservation.",
      },
      {
        q: "Combien de fois par mois ?",
        a: "Idéal toutes les 2-4 semaines pour garder une carrosserie présentable. Beaucoup de clients prennent un rendez-vous récurrent à ce tarif.",
      },
    ],
    ctaMessage: "Bonjour StrasClean 👋 Je voudrais un lavage extérieur dès 29 €",
  },

  // ─── 7. Remise à neuf pour revente (129 €) ──────────────────────────────
  {
    slug: "remise-a-neuf-voiture-revente",
    name: "Remise à neuf pour revente",
    shortName: "Remise à neuf revente",
    emoji: "💰",
    shortDesc:
      "Préparation complète avant mise en vente — vous gagnez 5 à 15% sur le prix final.",
    introTemplate: (c) =>
      `Vous mettez votre voiture en vente ? À ${c.name}, StrasClean prépare votre véhicule pour qu'il sorte du lot sur les annonces. Lavage extérieur + décontamination + polissage léger + shampouinage complet + conseils photos. Une intervention qui rapporte en moyenne 800 à 1 200 € sur le prix de vente final.`,
    duration: "2h à 2h30",
    priceFrom: "129",
    recommendedPlanId: "luxury",
    whatsIncluded: [
      "Lavage extérieur main + décontamination carrosserie",
      "Polissage léger des optiques jaunies",
      "Shampouinage complet de l'habitacle (sièges, moquette, plafonnier)",
      "Dressing des plastiques intérieurs et extérieurs",
      "Vitres intérieures et extérieures cristal",
      "Désodorisation finale (impression de neuf)",
      "Conseils photos d'annonce inclus",
    ],
    whyChoose: [
      {
        title: "ROI ×6 à ×10",
        desc: "L'investissement de 129 € rapporte régulièrement 800 € à 2 000 € sur le prix de vente final.",
      },
      {
        title: "Vente 2× plus rapide",
        desc: "Sur les clients qui ont vendu après notre intervention : durée moyenne divisée par 2.",
      },
      {
        title: "Conseils photos inclus",
        desc: "On vous indique gratuitement les meilleurs angles + heure de prise de vue pour maximiser vos annonces.",
      },
    ],
    faq: [
      {
        q: "Quel délai avant de prendre les photos d'annonce ?",
        a: "On termine en fin de journée, prenez les photos le lendemain matin entre 9h et 11h (la meilleure lumière). On vous conseille les angles à privilégier.",
      },
      {
        q: "Quel ROI je peux espérer ?",
        a: "Sur les derniers clients revente : en moyenne +800 à 1 200 € sur le prix de vente final, durée de vente divisée par 2 versus une voiture non préparée.",
      },
      {
        q: "Pour un véhicule très usé, ça vaut le coup ?",
        a: "Encore plus que pour un véhicule récent. Plus la voiture est marquée au départ, plus l'effet « avant-après » est spectaculaire — c'est sur ces véhicules qu'on a vu les plus gros écarts (jusqu'à +2 500 € sur des SUV âgés).",
      },
      {
        q: "Différence avec la formule Luxury Detailing à 119 € ?",
        a: "Le Luxury Detailing est un service haut de gamme généraliste. La Remise à neuf revente est ciblée sur les besoins d'un véhicule à vendre : polissage des optiques, conseils photos d'annonce, accent sur le rendu « impression de neuf ».",
      },
    ],
    ctaMessage: "Bonjour StrasClean 👋 Je voudrais une préparation revente dès 129 €",
  },
];

/** Construit l'URL d'une page service × ville */
export const servicePath = (s: Service, c: City) => `/${s.slug}-${c.slug}`;

/** Trouve un service par son slug */
export const findService = (slug: string) => SERVICES.find((s) => s.slug === slug);

/** Résultat du routeur de slug : ville, service×ville, cas d'usage, ou prestation Maison. */
export type SlugMatch =
  | { type: "city"; city: City }
  | { type: "service-city"; service: Service; city: City }
  | { type: "usecase"; useCase: UseCase }
  | { type: "home-service"; homeService: UseCase };

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

  // 4) Page service Maison (canapé, tapis, matelas, fauteuil/chaise) :
  //    type dédié pour qu'on rende un layout 100% Maison (pas de pollution
  //    avec les formules / before-after / process auto).
  const hs = findHomeService(slug);
  if (hs) return { type: "home-service", homeService: hs };

  // 5) Page SEO Maison (prix, Airbnb, cuir, etc.) — même rendu que les
  //    services Maison, mais isolées de la grille MaisonServicesGrid.
  const hsp = findHomeSeoPage(slug);
  if (hsp) return { type: "home-service", homeService: hsp };

  return null;
}

/** Service par défaut (le plus populaire) — utilisé sur la home */
export const DEFAULT_SERVICE = SERVICES[3]; // Nettoyage intérieur

/** Ville par défaut (siège commercial) — utilisée sur la home */
export const DEFAULT_CITY: City = CITIES[0]; // Strasbourg
