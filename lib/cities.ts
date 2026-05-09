// ─────────────────────────────────────────────────────────────────────────
//  StrasClean — Pages ville (SEO local)
//
//  URL générée : /nettoyage-voiture-domicile-[slug]
//  Exemple    : /nettoyage-voiture-domicile-strasbourg
//
//  Pour ajouter / modifier une ville :
//    - dupliquer une entrée et adapter les champs.
//    - le slug doit rester en kebab-case sans accent.
//    - quartiers/postalCodes : vérifier les valeurs réelles.
// ─────────────────────────────────────────────────────────────────────────

export type City = {
  /** Slug de fin d'URL (sans le préfixe "nettoyage-voiture-domicile-") */
  slug: string;
  /** Nom affiché */
  name: string;
  /** Article + nom utilisé dans les phrases : "à Strasbourg", "à La Wantzenau" */
  preposition: "à" | "à la" | "à l'";
  /** Codes postaux principaux */
  postalCodes: string[];
  /** Quartiers ou zones connues (3 max — pour le SEO local naturel) */
  neighborhoods: string[];
  /** Distance approximative du centre de Strasbourg, en km */
  distanceKm: number;
  /** Paragraphe d'intro unique (évite le duplicate content) */
  intro: string;
  /** Argument local court — affiché en chip sous le H1 */
  angle: string;
  /** Avis personnalisé pour cette ville (témoignage en bas) */
  review: { name: string; text: string };
};

export const CITIES: City[] = [
  {
    slug: "strasbourg",
    name: "Strasbourg",
    preposition: "à",
    postalCodes: ["67000", "67100", "67200"],
    neighborhoods: ["Centre", "Neudorf", "Robertsau", "Krutenau", "Esplanade", "Cronenbourg", "Meinau"],
    distanceKm: 0,
    intro:
      "À Strasbourg, trouver un créneau de lavage propre et professionnel sans bouger de chez soi est devenu un vrai gain de temps. StrasClean intervient dans tous les quartiers de la ville — du centre historique à la Robertsau, en passant par le Neudorf, la Krutenau et la Meinau — directement à votre domicile, en bas de votre immeuble ou sur votre lieu de travail.",
    angle: "Tous les quartiers desservis",
    review: {
      name: "Julien M.",
      text: "Intervention au pied de mon immeuble dans le centre. Voiture impeccable, plus aucune odeur. Réservation hyper simple par WhatsApp.",
    },
  },
  {
    slug: "schiltigheim",
    name: "Schiltigheim",
    preposition: "à",
    postalCodes: ["67300"],
    neighborhoods: ["Centre", "Quartier des Brasseries", "Ouest", "Adelshoffen"],
    distanceKm: 4,
    intro:
      "Schiltigheim, juste au nord de Strasbourg, est une ville dense où l'accès à un lavage auto en station n'est pas toujours pratique. StrasClean se déplace dans tous les secteurs — du centre au quartier des Brasseries — pour nettoyer votre véhicule devant chez vous, sans déplacement, ni file d'attente.",
    angle: "Intervention rapide depuis Strasbourg",
    review: {
      name: "Sarah B.",
      text: "Je n'avais pas le temps d'aller en station. Ils sont venus à Schilick, devant chez moi. Intérieur nickel.",
    },
  },
  {
    slug: "illkirch-graffenstaden",
    name: "Illkirch-Graffenstaden",
    preposition: "à",
    postalCodes: ["67400"],
    neighborhoods: ["Centre", "Baggersee", "Lixenbuhl", "Parc d'Innovation"],
    distanceKm: 7,
    intro:
      "Illkirch-Graffenstaden, au sud de Strasbourg, est une commune étendue avec de larges zones résidentielles et le Parc d'Innovation. StrasClean intervient à votre domicile, dans les zones d'entreprises ou sur les parkings du Baggersee, pour un nettoyage en profondeur sans avoir à vous déplacer.",
    angle: "Domicile & entreprises",
    review: {
      name: "Mehdi K.",
      text: "Le shampouinage des sièges a fait une énorme différence. Intervention nickel à Illkirch.",
    },
  },
  {
    slug: "bischheim",
    name: "Bischheim",
    preposition: "à",
    postalCodes: ["67800"],
    neighborhoods: ["Centre", "Guirbaden", "Canal"],
    distanceKm: 5,
    intro:
      "Bischheim, voisine de Schiltigheim et Hoenheim, est une commune où StrasClean intervient régulièrement. Que vous soyez en maison ou en immeuble, on se déplace avec tout le matériel professionnel pour nettoyer votre voiture sur place.",
    angle: "Zones résidentielles & immeubles",
    review: {
      name: "Camille V.",
      text: "Avec deux chiens, je désespérais. Plus aucun poil après leur passage à Bischheim. Top.",
    },
  },
  {
    slug: "ostwald",
    name: "Ostwald",
    preposition: "à",
    postalCodes: ["67540"],
    neighborhoods: ["Centre", "Wihrel", "Bohrie"],
    distanceKm: 6,
    intro:
      "Ostwald, au sud-ouest de Strasbourg, est une commune calme et résidentielle. StrasClean s'y déplace sans frais supplémentaires pour offrir un nettoyage intérieur et extérieur en profondeur, devant votre maison ou votre lieu de travail.",
    angle: "Pas de frais de déplacement",
    review: {
      name: "Antoine R.",
      text: "Formule Luxury à Ostwald, rendu vraiment showroom. Carrosserie brillante et habitacle comme neuf.",
    },
  },
  {
    slug: "lingolsheim",
    name: "Lingolsheim",
    preposition: "à",
    postalCodes: ["67380"],
    neighborhoods: ["Centre", "Tiergaertel", "Les Tanneries"],
    distanceKm: 6,
    intro:
      "Lingolsheim, au sud-ouest de l'agglomération strasbourgeoise, mêle zones résidentielles et zones d'activités. StrasClean intervient à votre domicile ou en entreprise pour un nettoyage auto complet, avec une réservation par WhatsApp en moins d'une minute.",
    angle: "Domicile & entreprises",
    review: {
      name: "Laura D.",
      text: "Service top, ils sont venus pendant que je télétravaillais à Lingolsheim. Zéro stress.",
    },
  },
  {
    slug: "hoenheim",
    name: "Hœnheim",
    preposition: "à",
    postalCodes: ["67800"],
    neighborhoods: ["Centre", "Cité du Ried", "Tram Hœnheim Gare"],
    distanceKm: 6,
    intro:
      "Hœnheim, terminus de la ligne B du tram, est une commune attenante à Bischheim. StrasClean s'y déplace pour un nettoyage auto en profondeur, sans que vous ayez à bouger votre véhicule, idéal quand on rentre du travail ou en télétravail.",
    angle: "Idéal pour le télétravail",
    review: {
      name: "Karim S.",
      text: "Réservé le mardi, fait le jeudi à Hœnheim. Pro, ponctuel, voiture rénovée.",
    },
  },
  {
    slug: "eckbolsheim",
    name: "Eckbolsheim",
    preposition: "à",
    postalCodes: ["67201"],
    neighborhoods: ["Centre", "Zone Ouest", "Plaine des Bouchers"],
    distanceKm: 5,
    intro:
      "Eckbolsheim, à l'ouest de Strasbourg, accueille de nombreux pavillons et zones d'activités. StrasClean y intervient à domicile ou sur votre lieu de travail, sans frais de déplacement supplémentaires.",
    angle: "À domicile ou au bureau",
    review: {
      name: "Thomas L.",
      text: "Shampouinage des sièges à Eckbolsheim, résultat impeccable. Je recommande sans hésiter.",
    },
  },
  {
    slug: "oberhausbergen",
    name: "Oberhausbergen",
    preposition: "à",
    postalCodes: ["67205"],
    neighborhoods: ["Centre", "Hauteurs", "Le Parc"],
    distanceKm: 6,
    intro:
      "Oberhausbergen, sur les hauteurs au nord-ouest de Strasbourg, est une commune résidentielle où StrasClean intervient sans surcoût. On vient nettoyer votre véhicule devant chez vous, avec tout le matériel pro nécessaire.",
    angle: "Zone résidentielle calme",
    review: {
      name: "Nathalie F.",
      text: "Très satisfaite, voiture comme neuve à Oberhausbergen. Très propre, très pro.",
    },
  },
  {
    slug: "mundolsheim",
    name: "Mundolsheim",
    preposition: "à",
    postalCodes: ["67450"],
    neighborhoods: ["Centre", "Zone Commerciale Nord"],
    distanceKm: 8,
    intro:
      "Mundolsheim, au nord de Strasbourg, abrite la grande zone commerciale Nord. StrasClean intervient aussi bien dans les quartiers résidentiels qu'auprès des entreprises locales, à domicile ou sur le parking de votre travail.",
    angle: "Domicile & zones d'activités",
    review: {
      name: "David P.",
      text: "Pratique : nettoyage fait pendant ma journée de boulot à Mundolsheim. Zéro perte de temps.",
    },
  },
  {
    slug: "vendenheim",
    name: "Vendenheim",
    preposition: "à",
    postalCodes: ["67550"],
    neighborhoods: ["Centre", "Le Ried"],
    distanceKm: 10,
    intro:
      "Vendenheim, à l'extrême nord de l'eurométropole, est une commune où StrasClean se déplace volontiers. Que vous soyez en pavillon ou dans une zone d'activité, on assure un nettoyage en profondeur de votre véhicule sur place.",
    angle: "Eurométropole nord",
    review: {
      name: "Émilie R.",
      text: "Première fois à domicile, je ne reviendrai pas en station. À Vendenheim, ils ont été parfaits.",
    },
  },
  {
    slug: "la-wantzenau",
    name: "La Wantzenau",
    preposition: "à la",
    postalCodes: ["67610"],
    neighborhoods: ["Centre", "Bords de l'Ill"],
    distanceKm: 14,
    intro:
      "La Wantzenau, commune verte au nord-est de Strasbourg, mérite un service auto qui se déplace plutôt qu'un long aller-retour en station. StrasClean s'y rend sur réservation pour un nettoyage complet à domicile, intérieur comme extérieur.",
    angle: "Service à domicile",
    review: {
      name: "Patrick H.",
      text: "À La Wantzenau, c'est plus simple qu'eux viennent que d'aller en ville. Service nickel.",
    },
  },
];

/** Préfixe d'URL utilisé pour toutes les pages ville */
export const CITY_URL_PREFIX = "nettoyage-voiture-domicile";

export const cityPath = (city: City) => `/${CITY_URL_PREFIX}-${city.slug}`;

export const findCityBySlug = (slug: string): City | undefined =>
  CITIES.find((c) => `${CITY_URL_PREFIX}-${c.slug}` === slug);

/** "à Strasbourg" / "à La Wantzenau" / "à l'…" — selon la ville */
export const inCity = (c: City) => `${c.preposition} ${c.name}`;
