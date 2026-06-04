// ─────────────────────────────────────────────────────────────────────────
//  StrasClean Maison — services de nettoyage textile à domicile.
//
//  Pages 'sœurs' rendues par components/HomeServicePage.tsx (layout 100%
//  ambre, isolé de l'auto).
//
//  Routing : matchSlug() de lib/services.ts → type 'home-service'.
//
//  URLs générées :
//   - /nettoyage-canape-strasbourg
//   - /nettoyage-tapis-domicile-strasbourg
//   - /nettoyage-matelas-strasbourg
//   - /nettoyage-fauteuil-chaise-strasbourg
// ─────────────────────────────────────────────────────────────────────────

import type { UseCase } from "./usecases";
import type { FAQItem } from "./faq";

/**
 * HomeService — type d'une prestation Maison.
 *
 * Pour l'instant, structurellement identique à UseCase (problème + DIY +
 * solution + tariffs + FAQ + hero). On garde l'alias pour clarifier la
 * sémantique côté Maison (vs. les "pain points" auto qui sont aussi des
 * UseCase) et faciliter une divergence future si Maison gagne des champs
 * spécifiques (B2B pricing, photos clients, partenaires…).
 *
 * Migration future éventuelle : si on veut séparer strictement, on
 * créera un type indépendant et on adapte HomeServicePage en conséquence.
 */
export type HomeService = UseCase;

/** FAQ globale Maison — utilisée sur le hub /strasclean-maison ET fusionnée
 *  dans le JSON-LD des pages services Maison pour enrichir le SEO. */
export const MAISON_GLOBAL_FAQS: FAQItem[] = [
  {
    q: "Vous intervenez à mon domicile à Strasbourg ?",
    a: "Oui — c'est l'essence du service. On vient avec tout le matériel mobile, on travaille directement chez vous (ou à votre local pro). Strasbourg + 12 communes alentours, déplacement inclus dans le tarif annoncé.",
  },
  {
    q: "Combien de temps avant de pouvoir utiliser mon canapé / matelas / tapis ?",
    a: "Grâce à l'extraction haute puissance, le textile ressort presque sec. Comptez 2 à 4 heures pour un séchage complet à température ambiante. Vous récupérez l'usage de votre intérieur le jour même.",
  },
  {
    q: "Vous traitez tous types de tissus ?",
    a: "Oui — coton, polyester, lin, microfibre, alcantara, velours, cuir, simili. Le produit est adapté à chaque matière. Pour les tissus très précieux (vieux tapis persan, cuir Nappa), protocole spécifique sur demande.",
  },
  {
    q: "Vous avez une offre pour les pros (Airbnb, hôtels, restaurants) ?",
    a: "Oui : nettoyage entre locataires Airbnb (intervention dans la journée), entretien régulier d'hôtels, restaurants, bureaux, cabinets. Tarif dégressif selon volume, facture pro avec TVA, contrat d'entretien possible.",
  },
  {
    q: "Quels moyens de paiement ?",
    a: "Espèces, carte bancaire, virement, facture pro avec TVA. Paiement sur place après validation du résultat.",
  },
  {
    q: "Combien de temps avant d'avoir un créneau ?",
    a: "Généralement 2-5 jours selon notre planning. Pour les cas urgents (Airbnb, tache fraîche), on essaie de caler dans la journée ou le lendemain. Envoyez un message WhatsApp avec une photo, on vous répond rapidement.",
  },
];

export const HOME_SERVICES: HomeService[] = [
  // ─── Canapé ───────────────────────────────────────────────────────────
  {
    slug: "nettoyage-canape-strasbourg",
    shortName: "Nettoyage canapé",
    emoji: "🛋️",
    metaTitle: "Nettoyage canapé à domicile Strasbourg — StrasClean",
    metaDescription:
      "Canapé tissu, cuir, alcantara ? StrasClean intervient à domicile à Strasbourg avec injection-extraction professionnelle. Canapé 2 places dès 79 €, 3 places dès 109 €. Séchage rapide.",
    hero: {
      chip: "StrasClean Maison",
      h1: "Nettoyage canapé à domicile à Strasbourg.",
      h1Highlight: "à domicile à Strasbourg.",
      subtitle:
        "Tissu, cuir, alcantara — on traite votre canapé en profondeur chez vous. Injection-extraction pro, produits adaptés à chaque matière, séchage rapide. Utilisable le jour même.",
    },
    problem: {
      title: "Pourquoi votre canapé mérite mieux qu'un coup d'éponge",
      paragraphs: [
        "Un canapé absorbe pendant des années repas, taches, transpiration, poussières et acariens — sans qu'on s'en rende compte. L'aspirateur retire la surface ; le reste reste piégé dans la mousse. Résultat : tissu terni, taches anciennes visibles, odeur diffuse.",
      ],
      bullets: [
        "Taches anciennes (café, vin, gras, encre)",
        "Odeur persistante d'usage, tabac ou animaux",
        "Acariens et allergènes dans la mousse profonde",
        "Cuir terne, sec, qui commence à craqueler",
        "Pelouches et poils d'animaux entre les coussins",
      ],
    },
    whyDiy: {
      title: "Le shampoing du commerce ne suffit pas",
      paragraphs: [
        "Les mousses du commerce traitent la surface mais redéposent une auréole en séchant. Pour un vrai résultat, il faut un injecteur-extracteur professionnel : eau chaude sous pression dans la fibre, aspiration immédiate. Aucun résidu, aucune trace. C'est l'équipement standard du detailing — qui marche aussi bien sur le mobilier.",
      ],
    },
    solution: {
      title: "Le protocole canapé StrasClean",
      intro:
        "À votre domicile à Strasbourg ou en proche banlieue. 1 h à 1h30 en équipe de 2. Vous pouvez vous rasseoir dessus le soir même.",
      steps: [
        {
          title: "Diagnostic du tissu",
          desc: "Tissu, cuir, alcantara, velours — le produit s'adapte à chaque matière pour ne rien abîmer.",
        },
        {
          title: "Aspiration profonde",
          desc: "Retrait des poussières, poils et miettes avant l'humidification — étape cruciale.",
        },
        {
          title: "Détachage ciblé",
          desc: "Détachants spécifiques sur chaque tache (tanins, gras, organique) avant l'extraction.",
        },
        {
          title: "Injection-extraction",
          desc: "Eau chaude + produit envoyés dans la fibre, aspirés immédiatement. Sans auréole.",
        },
        {
          title: "Cuir : nettoyage + nutrition",
          desc: "Sur cuir : produit pH-neutre + baume nourrissant. Le cuir retrouve souplesse et éclat.",
        },
        {
          title: "Désodorisation finale",
          desc: "Élimine les molécules d'odeur sans les masquer. Sensation de frais immédiate.",
        },
      ],
    },
    pricing: { priceFrom: "79", duration: "1 h à 1h30" },
    tariffs: [
      { label: "Canapé 2 places", price: "79 €" },
      { label: "Canapé 3 places", price: "109 €" },
      { label: "Canapé d'angle", price: "149 €" },
      {
        label: "Cuir (toutes tailles)",
        price: "+ 20 €",
        note: "Nettoyage pH-neutre + nutrition",
      },
    ],
    faq: [
      {
        q: "Combien de temps avant de pouvoir m'asseoir ?",
        a: "L'extraction haute puissance retire 90 % de l'humidité immédiatement. Vous pouvez vous rasseoir le soir même — comptez 2 à 4 heures pour un séchage complet.",
      },
      {
        q: "Vous traitez les canapés cuir ?",
        a: "Oui, avec un protocole dédié : nettoyant pH-neutre + baume nourrissant. Recommandé une fois par an pour les canapés cuir de plus de 3 ans.",
      },
      {
        q: "Vous garantissez de faire partir toutes les taches ?",
        a: "On garantit 90-95 % des taches sur tissu. Les taches très profondes (encre, sang séché ancien, peinture) peuvent laisser une trace très atténuée. Diagnostic honnête en arrivant.",
      },
      {
        q: "Intervenez-vous pour les pros (Airbnb, hôtels, cliniques) ?",
        a: "Oui — offre B2B : entretien régulier, tarif dégressif selon volume, facture pro avec TVA. Devis adapté sur demande.",
      },
      {
        q: "Quel délai pour une intervention ?",
        a: "Généralement 2 à 5 jours selon notre planning. Cas urgents (Airbnb, tache fraîche) : souvent possible dans la journée.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je voudrais un nettoyage de canapé à Strasbourg. Quels sont vos prochains créneaux ?",
  },

  // ─── Tapis ────────────────────────────────────────────────────────────
  {
    slug: "nettoyage-tapis-domicile-strasbourg",
    shortName: "Nettoyage tapis",
    emoji: "🧶",
    metaTitle:
      "Nettoyage tapis à domicile à Strasbourg — StrasClean",
    metaDescription:
      "Tapis sale, taché ou qui ternit ? StrasClean intervient à domicile à Strasbourg pour un shampouinage professionnel. Tapis dès 49 €. Séchage rapide, aucune auréole.",
    hero: {
      chip: "StrasClean Maison",
      h1: "Nettoyage tapis à domicile à Strasbourg.",
      h1Highlight: "à domicile à Strasbourg.",
      subtitle:
        "Tapis taché, terni ou avec odeur d'animaux ? Pas besoin d'un pressing — on intervient chez vous avec un shampouinage pro. Aucune auréole, séchage rapide, prêt à remarcher dessus dans la journée.",
    },
    problem: {
      title: "Ce que votre tapis a accumulé sans qu'on le voie",
      paragraphs: [
        "80 % de la saleté reste piégée dans les fibres, hors d'atteinte d'un aspirateur classique. Au fil des années, le tapis ternit, prend une odeur diffuse, et les taches anciennes deviennent permanentes sans traitement professionnel.",
      ],
      bullets: [
        "Taches anciennes (café, vin, urine animale, encre)",
        "Tapis terni qui a perdu sa couleur d'origine",
        "Acariens et allergènes dans les fibres profondes",
        "Odeur d'animaux ou d'humidité persistante",
        "Transport impossible vers un pressing (trop grand, trop lourd)",
      ],
    },
    whyDiy: {
      title: "Pourquoi le shampoing tapis ne marche pas",
      paragraphs: [
        "Le shampoing à tapis du commerce mousse abondamment, dégrade la fibre, et laisse un résidu qui ré-attrape la poussière dans les jours suivants. Le seul vrai résultat passe par un injecteur-extracteur professionnel — la même machine que pour le detailing automobile.",
      ],
    },
    solution: {
      title: "Le protocole tapis StrasClean",
      intro:
        "À votre domicile à Strasbourg ou en proche banlieue. 45 min à 1h30 selon la taille. Séchage rapide grâce à l'extraction haute puissance.",
      steps: [
        {
          title: "Diagnostic du tapis",
          desc: "Laine, synthétique, viscose, sisal, kilim, persan — produit et technique adaptés.",
        },
        {
          title: "Aspiration haute puissance",
          desc: "Retire toute la saleté sèche avant humidification (50 % du résultat se joue ici).",
        },
        {
          title: "Pré-traitement des taches",
          desc: "Détachants spécifiques selon la nature (tanins, gras, organique animal).",
        },
        {
          title: "Injection-extraction",
          desc: "Saleté décrochée et aspirée dans la foulée. Aucune auréole, aucun résidu.",
        },
        {
          title: "Désinfection + désodorisation",
          desc: "Bactéricide + neutralisation des odeurs animales / humidité.",
        },
      ],
    },
    pricing: { priceFrom: "49", duration: "45 min à 1h30" },
    tariffs: [
      { label: "Petit (jusqu'à 4 m²)", price: "49 €" },
      { label: "Moyen (4 à 8 m²)", price: "69 €" },
      { label: "Grand (8 à 15 m²)", price: "99 €" },
      { label: "Plus grand", price: "9 €/m²" },
      {
        label: "Tapis précieux (kilim, persan)",
        price: "Sur devis",
        note: "Protocole délicat sur demande",
      },
    ],
    faq: [
      {
        q: "Faut-il que je déplace mon tapis ?",
        a: "Non — on travaille directement chez vous, sur le tapis en place. Aucun transport, aucun pressing.",
      },
      {
        q: "Vous traitez tous types de tapis ?",
        a: "Oui — synthétiques, naturels (laine, coton, jute, sisal), tapis d'orient (persan, kilim). Pièces de collection : protocole délicat dédié.",
      },
      {
        q: "Combien de temps avant de remarcher dessus ?",
        a: "Le tapis ressort presque sec. Vous pouvez circuler dès la fin de l'intervention, séchage complet en 2-4 h.",
      },
      {
        q: "Vous traitez aussi les moquettes pleine surface ?",
        a: "Oui — même technique. Tarif au m². Devis avec photos avant intervention.",
      },
      {
        q: "Offres pour les pros (Airbnb, hôtels, boutiques) ?",
        a: "Oui : tapis d'accueil, tapis d'Airbnb entre locataires, contrats d'entretien régulier. Facture pro, tarif dégressif.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je voudrais un nettoyage de tapis à mon domicile à Strasbourg. Quels sont vos prochains créneaux ?",
  },

  // ─── Matelas ──────────────────────────────────────────────────────────
  {
    slug: "nettoyage-matelas-strasbourg",
    shortName: "Nettoyage matelas",
    emoji: "🛏️",
    metaTitle: "Nettoyage matelas à domicile Strasbourg — StrasClean",
    metaDescription:
      "Acariens, taches, transpiration ? StrasClean nettoie votre matelas à domicile à Strasbourg avec une aspiration HEPA + désinfection. Matelas 1 personne dès 49 €, 2 personnes dès 79 €.",
    hero: {
      chip: "StrasClean Maison",
      h1: "Nettoyage matelas à domicile à Strasbourg.",
      h1Highlight: "à domicile à Strasbourg.",
      subtitle:
        "Vous passez un tiers de votre vie dessus. Aspiration HEPA, désinfection anti-acariens, traitement des taches (transpiration, sang, urine), désodorisation. Une nuit comme dans un hôtel neuf.",
    },
    problem: {
      title: "Ce que votre matelas accumule chaque nuit",
      paragraphs: [
        "Transpiration, peaux mortes, poussières, allergènes — tout pénètre la mousse. En quelques mois sans nettoyage profond, plusieurs millions d'acariens par m². Cause directe d'allergies respiratoires, nez bouché et fatigue inexpliquée au réveil.",
      ],
      bullets: [
        "Millions d'acariens dans la mousse — allergies",
        "Taches anciennes (sueur jaune, pipi enfant, sang)",
        "Odeur d'humidité ou de transpiration imprégnée",
        "Réveil avec nez bouché, éternuements, yeux qui piquent",
        "Hygiène générale qu'on ne peut pas vérifier à l'œil nu",
      ],
    },
    whyDiy: {
      title: "Aspirateur + soleil ne suffisent pas",
      paragraphs: [
        "Un aspirateur ménager retire la surface ; 90 % des acariens vivent dans la mousse profonde, hors d'atteinte. Le nettoyage pro combine aspiration HEPA, produit anti-acariens en injection-extraction, et désinfection ciblée — équivalent des protocoles d'hygiène hôteliers et hospitaliers.",
      ],
    },
    solution: {
      title: "Le protocole matelas StrasClean",
      intro:
        "À votre domicile à Strasbourg ou en proche banlieue. 45 min à 1 h. Dormez dessus le soir même — séchage complet en 2-4 h.",
      steps: [
        {
          title: "Aspiration HEPA des deux faces",
          desc: "Retient les particules fines et allergènes — impossible avec un aspirateur ménager.",
        },
        {
          title: "Pré-traitement des taches",
          desc: "Enzymatique pour sueur/urine, organique pour sang, dégraissant pour cosmétiques.",
        },
        {
          title: "Injection-extraction ciblée",
          desc: "Sur les zones tachées : décroche la matière dans la mousse profonde.",
        },
        {
          title: "Traitement anti-acariens",
          desc: "Produit pro sans danger après séchage. Efficace 6 à 12 mois.",
        },
        {
          title: "Désinfection + désodorisation",
          desc: "Élimine bactéries, champignons et odeurs résiduelles. Sensation de frais.",
        },
      ],
    },
    pricing: { priceFrom: "49", duration: "45 min à 1 h" },
    tariffs: [
      { label: "1 personne (90 × 190)", price: "49 €" },
      { label: "2 personnes (140-160)", price: "79 €" },
      { label: "King size (180 × 200+)", price: "99 €" },
      {
        label: "Recto-verso (2 faces)",
        price: "+ 20 €",
        note: "Sur toutes les tailles",
      },
      {
        label: "Anti-acariens renforcé",
        price: "+ 20 €",
        note: "Recommandé pour allergiques",
      },
    ],
    faq: [
      {
        q: "Combien de temps avant de dormir dessus ?",
        a: "Le matelas ressort presque sec. Vous pouvez dormir dessus le soir même, séchage complet en 2-4 h sans humidité résiduelle.",
      },
      {
        q: "Quels types de matelas traitez-vous ?",
        a: "Tous : mousse classique, mémoire de forme, latex, ressorts ensachés. Toutes tailles et toutes épaisseurs.",
      },
      {
        q: "Vos produits sont-ils sans danger ?",
        a: "Oui — homologués pour usage résidentiel et hôtelier. Sans danger pour enfants, allergiques, animaux après séchage.",
      },
      {
        q: "Offre pour Airbnb / hôtels ?",
        a: "Oui : nettoyage entre locataires, entretien régulier, désinfection post-incident. Tarif dégressif, facture pro avec TVA.",
      },
      {
        q: "Fréquence recommandée ?",
        a: "Tous les 6 à 12 mois pour un usage standard. Tous les 3-6 mois si allergies respiratoires, enfants ou animaux dans le lit.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je voudrais un nettoyage de matelas à mon domicile à Strasbourg. Quels sont vos prochains créneaux ?",
  },

  // ─── Fauteuil / Chaise ────────────────────────────────────────────────
  {
    slug: "nettoyage-fauteuil-chaise-strasbourg",
    shortName: "Fauteuils & chaises",
    emoji: "🪑",
    metaTitle:
      "Nettoyage fauteuils et chaises à domicile à Strasbourg — StrasClean",
    metaDescription:
      "Chaises de salle à manger marquées, fauteuils tachés ? StrasClean intervient à domicile à Strasbourg pour un shampouinage par lot. Chaise dès 12 €, lot 4 chaises 49 €, fauteuil dès 39 €.",
    hero: {
      chip: "StrasClean Maison",
      h1: "Nettoyage fauteuils et chaises à domicile à Strasbourg.",
      h1Highlight: "à domicile à Strasbourg.",
      subtitle:
        "Chaises de salle à manger marquées, fauteuils tachés, sièges de bureau usés ? Shampouinage pro par lot, à votre domicile ou local pro. Idéal aussi pour restaurants, bureaux et salles d'attente.",
    },
    problem: {
      title: "Des assises qui prennent tout sans qu'on les voie",
      paragraphs: [
        "Chaque repas dépose des micro-projections sur les chaises, chaque journée de télétravail marque le siège de bureau. Sur les tissus clairs, l'usure se voit en 5 ans. Sur les fauteuils, c'est la transpiration estivale et les cheveux gras qui laissent leur trace.",
      ],
      bullets: [
        "Chaises de salle à manger tissu marquées (repas, enfants)",
        "Fauteuils club, relax, scandinaves usés à reprendre",
        "Sièges de bureau home office (transpiration, taches)",
        "Chaises de pros (restaurants, cabinets) à entretenir",
        "Tissus clairs qui montrent tout (lin, beige, écru)",
      ],
    },
    whyDiy: {
      title: "Le bon outil pour les lots",
      paragraphs: [
        "Pour une chaise unique, un détachant ménager peut suffire. Pour 6 chaises ou un fauteuil entier, c'est plusieurs heures de travail manuel avec des auréoles garanties sur les tissus clairs. Le shampouinage pro traite un lot complet en 30-45 min sans laisser de trace — c'est la différence entre 'à peu près propre' et 'comme neuf'.",
      ],
    },
    solution: {
      title: "Le protocole fauteuils & chaises StrasClean",
      intro:
        "À votre domicile ou local pro à Strasbourg ou en proche banlieue. 30 à 45 min pour un lot. Séchage rapide, utilisables dans la journée.",
      steps: [
        {
          title: "Diagnostic du tissu",
          desc: "Tissu, alcantara, velours, cuir — produit adapté à chaque matière.",
        },
        {
          title: "Aspiration profonde",
          desc: "Sur chaque pièce : poussières, miettes, cheveux retirés avant humidification.",
        },
        {
          title: "Pré-traitement des taches",
          desc: "Détachants spécifiques selon nature (tanins, gras, organique).",
        },
        {
          title: "Injection-extraction",
          desc: "Sur assises, dossiers, accoudoirs. Saleté profonde décrochée, aspirée immédiatement.",
        },
        {
          title: "Traitement cuir (si applicable)",
          desc: "Cuir : nettoyant pH-neutre + baume nourrissant. Souplesse et éclat retrouvés.",
        },
      ],
    },
    pricing: { priceFrom: "39", duration: "30 à 45 min" },
    tariffs: [
      { label: "Lot de 4 chaises", price: "49 €" },
      { label: "Lot de 6 chaises", price: "69 €" },
      { label: "Lot de 8 chaises", price: "89 €" },
      { label: "Fauteuil 1 place", price: "39 €" },
      {
        label: "Option cuir",
        price: "+ 5 à 25 €",
        note: "Selon taille / nombre de pièces",
      },
      {
        label: "Lot pro (10+ pièces)",
        price: "Sur devis",
        note: "Tarif dégressif",
      },
    ],
    faq: [
      {
        q: "Vous traitez les chaises avec coussins amovibles ?",
        a: "Oui — coussins amovibles traités sur place ou séparément selon préférence. Évaluation à l'arrivée.",
      },
      {
        q: "Vous intervenez pour les restaurants et bars ?",
        a: "Oui — chaises et banquettes de restaurants, sièges de salons et instituts. Intervention tôt le matin ou après fermeture. Tarif dégressif à partir de 10 pièces.",
      },
      {
        q: "Combien de temps avant de m'asseoir ?",
        a: "1 à 2 h pour des chaises, 2 à 4 h pour un fauteuil. Vous récupérez vos assises le jour même.",
      },
      {
        q: "Vous travaillez avec urgence pour un événement ?",
        a: "Souvent oui : 2-3 jours d'avance suffisent. Envoyez-nous une photo et votre délai sur WhatsApp.",
      },
      {
        q: "Différence avec un pressing classique ?",
        a: "Le pressing nettoie principalement les housses amovibles. On traite directement la structure complète (assise + dossier + accoudoirs) sur place, sans rien démonter.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je voudrais un nettoyage de fauteuils / chaises à mon domicile à Strasbourg. Quels sont vos prochains créneaux ?",
  },
];

/** Construit l'URL d'une page service Maison (par défaut Strasbourg, slug
 *  inclut '-strasbourg'). */
export const homeServicePath = (s: HomeService) => `/${s.slug}`;

/** Trouve un service Maison par son slug exact */
export const findHomeService = (slug: string) =>
  HOME_SERVICES.find((s) => s.slug === slug);

// ─── Pages service × ville Maison ─────────────────────────────────────────
// Chaque service Maison existe pour Strasbourg (slug natif, ex. 'nettoyage-
// canape-strasbourg') ET pour chacune des 11 autres communes desservies
// (ex. 'nettoyage-canape-schiltigheim').
//
// On dérive le "slug de base" en retirant le suffixe '-strasbourg' du slug
// natif du service, puis on appose le slug de la ville cible.

import { CITIES, type City } from "./cities";

/** Slug "base" d'un service Maison sans suffixe ville
 *  ex: 'nettoyage-canape-strasbourg' → 'nettoyage-canape' */
export const homeServiceBaseSlug = (s: HomeService) =>
  s.slug.replace(/-strasbourg$/, "");

/** URL d'une page service Maison × ville
 *  - Strasbourg → reste sur le slug natif (déjà '-strasbourg')
 *  - autre ville → '{base}-{city.slug}' */
export const homeServiceCityPath = (s: HomeService, city: City) => {
  if (city.slug === "strasbourg") return homeServicePath(s);
  return `/${homeServiceBaseSlug(s)}-${city.slug}`;
};

/** Tente de matcher un slug en (service, city) pour une ville autre que
 *  Strasbourg. Renvoie null si le slug ne correspond à aucune combinaison.
 *  Strasbourg est volontairement exclue car gérée par findHomeService(). */
export function matchHomeServiceCity(
  slug: string,
): { service: HomeService; city: City } | null {
  // Import lazy pour éviter dépendance circulaire avec cities.ts
  const { QUARTIERS } = require("./quartiers") as typeof import("./quartiers");
  const ALL = [...CITIES, ...QUARTIERS];

  for (const service of HOME_SERVICES) {
    const base = homeServiceBaseSlug(service);
    for (const city of ALL) {
      // Strasbourg commune est gérée par findHomeService() (slug natif).
      // Les quartiers (centre-strasbourg, krutenau-strasbourg, etc.) sont
      // traités ici normalement — leur slug est distinct de "strasbourg".
      if (city.slug === "strasbourg") continue;
      if (slug === `${base}-${city.slug}`) {
        return { service, city };
      }
    }
  }
  return null;
}

/** Liste exhaustive des combinaisons service × ville (hors Strasbourg).
 *  Utilisée par generateStaticParams + sitemap. */
export function listHomeServiceCityCombos(): {
  service: HomeService;
  city: City;
  slug: string;
}[] {
  const { QUARTIERS } = require("./quartiers") as typeof import("./quartiers");
  const ALL = [...CITIES, ...QUARTIERS];

  const out: { service: HomeService; city: City; slug: string }[] = [];
  for (const service of HOME_SERVICES) {
    const base = homeServiceBaseSlug(service);
    for (const city of ALL) {
      if (city.slug === "strasbourg") continue;
      out.push({ service, city, slug: `${base}-${city.slug}` });
    }
  }
  return out;
}
