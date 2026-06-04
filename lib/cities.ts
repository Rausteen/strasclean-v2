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
  preposition: "à" | "à la" | "à l'" | "au";
  /** Codes postaux principaux */
  postalCodes: string[];
  /** Quartiers ou zones connues (3 max — pour le SEO local naturel) */
  neighborhoods: string[];
  /** Distance approximative du centre de Strasbourg, en km */
  distanceKm: number;
  /** Paragraphe d'intro unique (évite le duplicate content) */
  intro: string;
  /** Variante Maison de l'intro (canapé / tapis / matelas / fauteuils).
   *  Affichée sur les pages service × ville Maison pour éviter d'avoir
   *  un contenu identique à 95 % avec la version Auto. */
  maisonIntro?: string;
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
    maisonIntro:
      "À Strasbourg, beaucoup d'appartements anciens du centre historique ou de la Krutenau ont des canapés tissu et tapis qui prennent l'humidité du grès rose — un cas idéal pour notre injection-extraction pro. Dans les quartiers étudiants (Esplanade, Krutenau), on intervient aussi sur les matelas en colocation entre rotations. Service à domicile partout dans Strasbourg, sans transport vers un pressing.",
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
    maisonIntro:
      "Schiltigheim mélange des immeubles modernes du quartier des Brasseries et des copropriétés anciennes du centre. Une bonne part de notre clientèle Maison y vit en appartement : canapés tissu sur lesquels la famille mange devant la TV, tapis de salon utilisés quotidiennement, matelas qui prennent l'humidité quand les radiateurs sèchent en hiver. On intervient le matin ou en début de soirée pour s'adapter aux horaires bureau.",
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
    maisonIntro:
      "Illkirch concentre beaucoup de maisons individuelles avec salons spacieux (canapés d'angle, gros tapis, fauteuils relax) et de chambres familiales (matelas pour enfants, animaux fréquents). StrasClean s'y déplace avec tout le matériel — l'intervention en pavillon individuel est souvent la plus efficace côté logistique. Le Parc d'Innovation a aussi nos clients pros (cabinets, bureaux avec fauteuils visiteurs).",
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
    maisonIntro:
      "Bischheim a un mix résidentiel intéressant pour notre activité Maison : familles en maison individuelle (canapés tissu fréquemment utilisés) et copropriétés du quartier Canal. Beaucoup de nos clients y ont des matelas qui n'ont pas été nettoyés depuis des années — un nettoyage anti-acariens à 79 € évite souvent un changement de matelas à 800 €+.",
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
    maisonIntro:
      "Ostwald est résidentielle au sens premier : maisons individuelles, canapés cuir de grandes pièces, salons bien équipés. C'est là que notre option cuir (+20 €) est la plus souvent demandée — protocole pH-neutre + baume nourrissant pour les canapés de plus de 5 ans qui commencent à sécher. Intervention discrète et propre, sans déranger la routine du quartier.",
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
    maisonIntro:
      "Lingolsheim accueille beaucoup de jeunes familles installées dans des maisons des Tanneries — canapés convertibles fréquemment utilisés en chambre d'amis, tapis d'enfants à laver, matelas de chambre d'invités peu sortis du lit. C'est aussi une commune où on traite régulièrement les chaises de salle à manger en lot après les anniversaires des kids.",
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
    maisonIntro:
      "Hœnheim, bien connectée par le tram, attire les actifs en télétravail. Beaucoup de nos clients Maison y ont un fauteuil de bureau et un canapé qu'ils utilisent toute la journée — usage intensif = entretien plus fréquent. On intervient idéalement en milieu de journée pendant une pause déj, pour ne pas couper la journée de boulot.",
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
    maisonIntro:
      "Eckbolsheim, c'est le pavillon avec jardin, le salon ouvert sur l'extérieur — donc canapés et tapis exposés aux entrées-sorties (chaussures, animaux). On y traite régulièrement les tapis salon poussiéreux et les canapés avec poils incrustés. Pour les bureaux et locaux pros du quartier Plaine des Bouchers, on a aussi une offre lot 8-10 fauteuils visiteurs sur devis.",
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
    maisonIntro:
      "Oberhausbergen, sur ses hauteurs calmes, regroupe surtout des résidences principales bien entretenues. Une partie de notre clientèle Maison y vit en pavillon avec mobilier haut de gamme : canapés cuir (option pH-neutre +20 €), tapis en laine, fauteuils relax. C'est aussi là qu'on intervient le plus tôt le matin pour préserver les habitudes calmes du quartier.",
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
    maisonIntro:
      "Mundolsheim mélange résidentiel calme et grande zone commerciale Nord. Côté Maison, on y intervient autant chez les particuliers (canapés famille, tapis salon) que pour les boutiques et bureaux du centre commercial avec banquettes ou fauteuils d'accueil à entretenir entre 2 saisons. Devis pro avec TVA récupérable, possibilité de contrat trimestriel.",
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
    maisonIntro:
      "Vendenheim, c'est le calme du grand pavillon avec terrain — donc des canapés bien occupés en famille, des tapis de salon volumineux, des chambres d'amis qui méritent un nettoyage de matelas annuel. Le déplacement (10 km du centre Strasbourg) est inclus dans le tarif, sans surcoût kilométrique.",
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
    maisonIntro:
      "La Wantzenau est l'une des communes les plus vertes de l'eurométropole — proximité Ill, jardins, animaux à la maison. Côté Maison, on y traite régulièrement les canapés et tapis qui prennent les poils de chien après les balades, les fauteuils de jardin couverts l'hiver et remis en service au printemps. Service à domicile sur réservation, déplacement inclus malgré les 14 km.",
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
