// ─────────────────────────────────────────────────────────────────────────
//  StrasClean — Quartiers Strasbourg intramuros (SEO local hyper-précis)
//
//  Pourquoi ce fichier séparé de cities.ts ?
//   - cities.ts = 12 communes alentours (Schiltigheim, Illkirch, etc.)
//   - quartiers.ts = quartiers DE Strasbourg (Krutenau, Robertsau, etc.)
//
//  Volume cumulé "X quartier strasbourg" : ~500-1500 recherches/mois,
//  faible concurrence locale. URLs générées :
//   - /nettoyage-voiture-domicile-{slug-quartier} (page Auto)
//   - /nettoyage-canape-{slug-quartier}           (Maison canapé)
//   - /nettoyage-tapis-{slug-quartier}            (Maison tapis)
//   - /nettoyage-matelas-{slug-quartier}          (Maison matelas)
//   - /nettoyage-fauteuil-chaise-{slug-quartier}  (Maison fauteuils)
//
//  Chaque quartier a un intro Auto + Maison UNIQUES (anti-cannibalisation).
//
//  ⚠️ Les slugs incluent "-strasbourg" pour la clarté SEO et éviter la
//  collision avec d'éventuelles villes du Bas-Rhin du même nom.
// ─────────────────────────────────────────────────────────────────────────

import type { City } from "./cities";

/** Un quartier suit la même structure qu'une City : permet de réutiliser
 *  tous les templates existants (CityHero, ServiceCityHero, LocalSection,
 *  homeServiceCityPath, etc.) sans dupliquer le code. */
export const QUARTIERS: City[] = [
  {
    slug: "krutenau-strasbourg",
    name: "Krutenau",
    preposition: "à la",
    postalCodes: ["67000"],
    neighborhoods: ["Krutenau", "Petite-France", "Étoile-Bourse"],
    distanceKm: 1,
    intro:
      "À la Krutenau, le stationnement résidentiel et les rues étroites rendent compliqué le déplacement vers une station de lavage. StrasClean vient en bas de votre immeuble — souvent quai des Bateliers, rue de Zurich ou place d'Austerlitz — pour nettoyer votre voiture sans que vous ayez à bouger. Idéal pour les étudiants et jeunes actifs du quartier.",
    maisonIntro:
      "À la Krutenau, beaucoup d'appartements anciens à parquet et fenêtres simples accumulent l'humidité — canapés tissu, tapis et matelas en pâtissent. Notre injection-extraction pro vient à domicile au cœur du quartier (rue de Zurich, place d'Austerlitz, quai des Bateliers) et sèche en quelques heures. Souvent demandé en colocation étudiante et en location courte durée.",
    angle: "Stationnement compliqué ? On vient à vous.",
    review: {
      name: "Sarah K.",
      text: "Habitant rue de Zurich, impossible de bouger ma voiture sans perdre ma place. StrasClean est venu en bas de l'immeuble, deux heures plus tard ma voiture était impeccable.",
    },
  },
  {
    slug: "esplanade-strasbourg",
    name: "Esplanade",
    preposition: "à l'",
    postalCodes: ["67000", "67100"],
    neighborhoods: ["Esplanade", "Université", "Rotonde"],
    distanceKm: 2,
    intro:
      "À l'Esplanade, le quartier étudiant et résidentiel autour de l'université concentre beaucoup de premières voitures et de locations. StrasClean se déplace devant les résidences universitaires, rue de Rome, boulevard de la Victoire ou place d'Islande pour un nettoyage complet sans déplacement.",
    maisonIntro:
      "À l'Esplanade, les colocations étudiantes et les studios meublés tournent vite : le nettoyage canapé / matelas entre deux locataires est notre quotidien dans le quartier. Intervention rapide en bas de votre résidence universitaire ou de votre immeuble, séchage rapide, devis ferme par photo WhatsApp.",
    angle: "Quartier étudiant — colocs et meublés",
    review: {
      name: "Maxime D.",
      text: "Étudiant en master, j'avais besoin de nettoyer ma voiture avant de la revendre. RDV pris le matin, voiture comme neuve l'après-midi devant le campus de l'Esplanade.",
    },
  },
  {
    slug: "robertsau-strasbourg",
    name: "Robertsau",
    preposition: "à la",
    postalCodes: ["67000"],
    neighborhoods: ["Robertsau", "Wacken", "Quartier des XV"],
    distanceKm: 3,
    intro:
      "À la Robertsau, quartier résidentiel huppé entre forêt et Conseil de l'Europe, beaucoup de familles ont plusieurs véhicules et peu de temps à perdre en station de lavage. StrasClean intervient à domicile sur l'ensemble du quartier — rue Mélanie, route de la Wantzenau, allée des Comtes — pour un nettoyage haut de gamme sans contrainte.",
    maisonIntro:
      "À la Robertsau, les maisons familiales avec canapés cuir, tapis salon de bonne facture et matelas haut de gamme méritent une remise en état professionnelle, pas un nettoyage à sec amateur. Notre injection-extraction respecte les matières nobles, et on intervient au domicile dans tout le quartier (route de la Wantzenau, rue Mélanie, allée des Comtes).",
    angle: "Quartier résidentiel — service premium à domicile",
    review: {
      name: "Marie-Claire B.",
      text: "Service au top à la Robertsau : équipe ponctuelle, soigneuse, et résultat bluffant sur le canapé cuir qu'on pensait perdu après les enfants.",
    },
  },
  {
    slug: "neudorf-strasbourg",
    name: "Neudorf",
    preposition: "au",
    postalCodes: ["67100"],
    neighborhoods: ["Neudorf", "Musau", "Polygone"],
    distanceKm: 2,
    intro:
      "Au Neudorf, quartier dense et populaire du sud de Strasbourg, les rues comme route du Polygone, avenue de Colmar ou rue de la Plaine-des-Bouchers concentrent beaucoup d'habitants et peu de places de parking. StrasClean vient à votre adresse pour un nettoyage à domicile sans bouger votre voiture.",
    maisonIntro:
      "Au Neudorf, les appartements familiaux des années 70 ont souvent des canapés tissu qui ont vécu plusieurs générations d'enfants et d'animaux. Notre injection-extraction décolle les taches incrustées sans abîmer le tissu, à domicile route du Polygone, avenue de Colmar ou rue de la Plaine-des-Bouchers.",
    angle: "Quartier dense — service de proximité",
    review: {
      name: "Karim L.",
      text: "Le canapé du salon était horrible après 8 ans avec deux enfants et un chat. L'équipe StrasClean est venue au Neudorf et c'était bluffant, vraiment comme neuf.",
    },
  },
  {
    slug: "cronenbourg-strasbourg",
    name: "Cronenbourg",
    preposition: "à",
    postalCodes: ["67200"],
    neighborhoods: ["Cronenbourg", "Hautepierre frontière", "Le Hohberg"],
    distanceKm: 4,
    intro:
      "À Cronenbourg, quartier résidentiel au nord-ouest de Strasbourg, beaucoup de propriétaires de maisons et copropriétés ont besoin d'un nettoyage auto régulier sans aller en station. StrasClean intervient route d'Oberhausbergen, avenue François-Mitterrand ou rue de Hochfelden pour un service à domicile professionnel.",
    maisonIntro:
      "À Cronenbourg, les maisons et appartements familiaux du quartier ont souvent un canapé d'angle ou un tapis salon principal qui mérite mieux qu'un coup d'aspirateur. Notre équipe vient à domicile (route d'Oberhausbergen, avenue François-Mitterrand, rue de Hochfelden) avec le matériel pro pour un nettoyage en profondeur.",
    angle: "Quartier résidentiel — accès facile",
    review: {
      name: "Antoine R.",
      text: "Service efficace à Cronenbourg. Voiture nettoyée sur mon parking en moins de 2h, prix annoncé respecté.",
    },
  },
  {
    slug: "meinau-strasbourg",
    name: "Meinau",
    preposition: "à la",
    postalCodes: ["67100"],
    neighborhoods: ["Meinau", "Canardière", "Stockfeld"],
    distanceKm: 3,
    intro:
      "À la Meinau, quartier au sud-ouest de Strasbourg connu pour son stade et ses zones résidentielles, StrasClean intervient à domicile sur tout le quartier — route de Schirmeck, rue Saint-Léon-IX, avenue de Normandie — sans que vous ayez à déplacer votre véhicule.",
    maisonIntro:
      "À la Meinau, les pavillons familiaux du quartier ont souvent des canapés et tapis qui ont vu passer plusieurs étapes de vie (enfants, animaux, déménagements). Notre injection-extraction pro est idéale pour leur rendre une seconde jeunesse, à domicile route de Schirmeck ou rue Saint-Léon-IX.",
    angle: "Quartier sud — service à domicile",
    review: {
      name: "Stéphanie J.",
      text: "Très satisfaite du nettoyage matelas chez nous à la Meinau. Disparition des taches anciennes et plus aucune odeur, équipe pro.",
    },
  },
  {
    slug: "hautepierre-strasbourg",
    name: "Hautepierre",
    preposition: "à",
    postalCodes: ["67200"],
    neighborhoods: ["Hautepierre", "Jacqueline", "Eléonore"],
    distanceKm: 5,
    intro:
      "À Hautepierre, quartier d'habitat collectif à l'ouest de Strasbourg, les places de parking sont rares et le déplacement vers une station de lavage est rarement pratique. StrasClean vient au pied des immeubles (mailles Catherine, Brigitte, Karine) pour un nettoyage à domicile sans bouger votre voiture.",
    maisonIntro:
      "À Hautepierre, les appartements en habitat collectif (mailles Catherine, Brigitte, Karine) ont souvent des canapés et matelas qui auraient besoin d'un nettoyage en profondeur, sans avoir à les transporter en pressing. Notre service à domicile résout ce problème — extraction + séchage rapide, devis ferme par photo WhatsApp.",
    angle: "Habitat collectif — intervention en bas d'immeuble",
    review: {
      name: "Fatou D.",
      text: "Service au top à Hautepierre, équipe sympa qui est venue au pied de l'immeuble. Le canapé de mes parents a retrouvé sa couleur d'origine.",
    },
  },
  {
    slug: "neuhof-strasbourg",
    name: "Neuhof",
    preposition: "au",
    postalCodes: ["67100"],
    neighborhoods: ["Neuhof", "Stockfeld", "Ganzau"],
    distanceKm: 5,
    intro:
      "Au Neuhof, quartier sud de Strasbourg en pleine transformation, beaucoup d'habitants ont un véhicule mais peu de temps à passer en station de lavage. StrasClean se déplace à domicile route du Neuhof, rue de la Klebsau ou avenue du Neuhof pour un nettoyage professionnel.",
    maisonIntro:
      "Au Neuhof, les familles installées dans le quartier ont des canapés, matelas et tapis qui méritent un nettoyage en profondeur sans transport ni rendez-vous compliqué. Notre équipe vient à domicile avec le matériel pro et un devis ferme avant intervention.",
    angle: "Quartier sud — pas de déplacement nécessaire",
    review: {
      name: "Joël P.",
      text: "Très bonne prestation au Neuhof. Équipe ponctuelle, voiture nickel après leur passage, tarif annoncé respecté.",
    },
  },
  {
    slug: "wacken-strasbourg",
    name: "Wacken",
    preposition: "au",
    postalCodes: ["67000"],
    neighborhoods: ["Wacken", "Conseil de l'Europe", "Parlement européen"],
    distanceKm: 2,
    intro:
      "Au Wacken, quartier des institutions européennes et zone résidentielle haut de gamme, beaucoup de fonctionnaires et cadres ont des voitures de standing qu'ils n'ont pas le temps d'amener en station. StrasClean intervient avenue de l'Europe, rue Frischhof ou rue Strohl pour un nettoyage premium à domicile.",
    maisonIntro:
      "Au Wacken, les appartements de standing près du Conseil de l'Europe ont souvent des intérieurs soignés avec canapés cuir et tapis de qualité. Notre injection-extraction respecte les matières nobles et on intervient à domicile sur tout le quartier, équipe de deux, séchage rapide.",
    angle: "Quartier européen — service haut de gamme",
    review: {
      name: "Caroline H.",
      text: "Excellente prestation au Wacken sur notre canapé cuir blanc — résultat impeccable, équipe discrète et pro, je recommande.",
    },
  },
  {
    slug: "centre-strasbourg",
    name: "Centre / Grande-Île",
    preposition: "au",
    postalCodes: ["67000"],
    neighborhoods: ["Grande-Île", "Cathédrale", "Petite-France"],
    distanceKm: 0,
    intro:
      "Au centre historique de Strasbourg (Grande-Île, Cathédrale, Petite-France), le stationnement est l'enfer et bouger sa voiture pour la nettoyer relève de l'exploit. StrasClean vient au plus près de votre adresse — rue du Vieux-Marché-aux-Poissons, place Kléber, place Gutenberg, rue du Bain-aux-Plantes — pour un nettoyage sans bouger le véhicule.",
    maisonIntro:
      "Au centre historique de Strasbourg, les appartements à colombages et pierre apparente ont du charme mais aussi de l'humidité qui marque les canapés tissu, tapis et matelas. Notre injection-extraction pro intervient à domicile sur la Grande-Île, autour de la Cathédrale et dans la Petite-France pour redonner vie à vos textiles d'intérieur.",
    angle: "Centre historique — service en bas de chez vous",
    review: {
      name: "Julien M.",
      text: "Intervention au pied de mon immeuble près de la Cathédrale. Voiture impeccable, plus aucune odeur. Réservation hyper simple par WhatsApp.",
    },
  },
];

/** Slugs des pages Auto par quartier (pour le sitemap / footer) */
export const quartierAutoPath = (q: City) =>
  `/nettoyage-voiture-domicile-${q.slug}`;
