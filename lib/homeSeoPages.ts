// ─────────────────────────────────────────────────────────────────────────
//  StrasClean Maison — pages SEO secondaires.
//
//  Ces pages sont des "angles" complémentaires aux 4 prestations
//  principales (HOME_SERVICES). Elles ne sont PAS affichées dans la grille
//  MaisonServicesGrid (qui reste réservée aux 4 prestations centrales)
//  mais sont routées via le même slug match et rendues par HomeServicePage.
//
//  Stratégie SEO : chaque page cible un mot-clé distinct des pages
//  services pour éviter la cannibalisation.
//
//  URLs :
//   - /prix-nettoyage-canape-strasbourg            (pricing canapé)
//   - /prix-nettoyage-tapis-strasbourg             (pricing tapis)
//   - /prix-nettoyage-matelas-strasbourg           (pricing matelas)
//   - /prix-nettoyage-fauteuil-chaise-strasbourg   (pricing chaises/fauteuils)
//   - /nettoyage-airbnb-strasbourg                 (B2B Airbnb)
//   - /nettoyage-canape-cuir-strasbourg            (premium cuir)
// ─────────────────────────────────────────────────────────────────────────

import type { HomeService } from "./homeServices";

// Les pages SEO Maison utilisent le même schéma que les services Maison
// (HomeService) — ce sont des angles SEO autour des mêmes prestations.
export const HOME_SEO_PAGES: HomeService[] = [
  // ─── 1. Prix canapé ───────────────────────────────────────────────────
  {
    slug: "prix-nettoyage-canape-strasbourg",
    shortName: "Prix nettoyage canapé",
    emoji: "💶",
    metaTitle: "Prix nettoyage canapé Strasbourg — StrasClean",
    metaDescription:
      "Combien coûte un nettoyage de canapé à domicile à Strasbourg ? Tarifs par taille (1 place 39 €, 2 places 79 €, 3 places 109 €, angle 149 €), options cuir, comparatif pressing. Sans frais cachés.",
    hero: {
      chip: "Prix & tarifs",
      h1: "Prix d'un nettoyage de canapé à Strasbourg.",
      h1Highlight: "à Strasbourg.",
      subtitle:
        "Combien coûte vraiment un nettoyage de canapé à domicile à Strasbourg ? Tarifs détaillés par taille (de 39 € à 149 €), options (cuir, anti-poils), comparatif avec le pressing. Le prix annoncé est le prix payé.",
    },
    problem: {
      title: "Pourquoi les prix de nettoyage de canapé varient autant",
      paragraphs: [
        "Entre le shampoing à 12 € en grande surface, la mousse en bombe à 8 €, le tunnel de location à 30-50 € et le pressing pro à 150-250 €, difficile de s'y retrouver. Chaque solution a son prix — et son résultat. À Strasbourg, le marché du nettoyage canapé à domicile s'établit entre 60 € (entrée de gamme rapide) et 200 € (premium cuir). StrasClean se positionne sur l'efficacité pro à tarif transparent : 79 € pour un 2 places, 109 € pour un 3 places, 149 € pour un angle.",
      ],
      bullets: [
        "Taille du canapé (1 à 5 places) — facteur n°1",
        "Matière (tissu, cuir, alcantara, microfibre) — protocole adapté",
        "État initial (entretien régulier ou très sale)",
        "Options : anti-poils d'animaux, anti-tabac, anti-acariens",
        "Frais de déplacement (chez StrasClean : inclus)",
        "Garanties : devis ferme avant intervention",
      ],
    },
    whyDiy: {
      title: "À domicile vs pressing vs station — le vrai coût",
      paragraphs: [
        "Pressing pro : 150-250 € + transport du canapé (impossible sur un angle ou un grand 3 places) + 3-5 jours sans canapé. Tunnel de location : 30 €/2h + produit + résultat médiocre (mousse qui sèche en auréole) + risque d'abîmer la matière. À domicile pro : 79-149 €, intervention en 1h30, utilisable le soir même, zéro transport, équipe formée. Le calcul est vite fait — surtout sur un canapé d'angle où le pressing est techniquement impossible.",
      ],
    },
    solution: {
      title: "Ce qui est inclus dans le tarif StrasClean",
      intro:
        "Pas de surcoût caché. Le tarif annoncé couvre l'intégralité de l'intervention, du diagnostic au séchage. Confirmation avant de commencer, paiement après validation du résultat.",
      steps: [
        {
          title: "Déplacement à domicile",
          desc: "Strasbourg + 12 communes alentours. Inclus dans le tarif, jamais facturé en supplément.",
        },
        {
          title: "Diagnostic et devis ferme",
          desc: "En arrivant, on identifie le tissu, l'état, les taches. On confirme le tarif final AVANT de commencer.",
        },
        {
          title: "Tout le protocole pro",
          desc: "Aspiration, détachage ciblé, injection-extraction, désinfection, désodorisation. Aucune étape en option payante.",
        },
        {
          title: "Produits adaptés à votre matière",
          desc: "Tissu, cuir, alcantara, velours : produit dédié. Cuir = protocole pH-neutre + nutrition (+20 € seulement pour le produit cuir premium).",
        },
        {
          title: "Garantie résultat",
          desc: "Si une tache traitable ne part pas, on revient gratuitement la traiter à nouveau. Pas de double facturation.",
        },
        {
          title: "Paiement sur place",
          desc: "Espèces, CB, virement, facture pro avec TVA. Vous payez seulement après avoir validé le résultat.",
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
        note: "Nettoyant pH-neutre + baume nourrissant",
      },
      {
        label: "Traitement anti-poils renforcé",
        price: "+ 20 €",
        note: "Animaux régulièrement sur le canapé",
      },
      {
        label: "Désodorisation forte (tabac)",
        price: "+ 30 €",
        note: "Ozonation si nécessaire",
      },
    ],
    faq: [
      {
        q: "Le prix peut-il augmenter en cours d'intervention ?",
        a: "Non — jamais sans votre accord explicite. Si en arrivant on découvre une situation plus complexe que prévue (poils incrustés très profonds, taches inhabituelles), on vous donne un devis ajusté et vous décidez avant qu'on commence. Pas de mauvaise surprise sur la facture.",
      },
      {
        q: "Quel est le moins cher, un canapé 1 place ou un fauteuil ?",
        a: "Même tarif : 39 €. Un fauteuil 1 place et un canapé 1 place représentent le même travail. Pour un canapé convertible, on facture en fonction de la taille déplié (1 ou 2 places).",
      },
      {
        q: "Y a-t-il un tarif spécifique pour les canapés d'angle ?",
        a: "Oui — 149 €. Un angle représente l'équivalent de 4 à 5 places à traiter (assises + dossiers + accoudoirs + coussins fixes). Il faudrait 200-250 € en pressing pro.",
      },
      {
        q: "Faites-vous des tarifs dégressifs pour plusieurs canapés ?",
        a: "Oui : -15 % sur le 2e canapé traité dans la même intervention, -20 % sur les suivants. Idéal pour un grand salon avec canapé + 2 fauteuils, ou pour un loft avec plusieurs canapés.",
      },
      {
        q: "Quel moyen de paiement ?",
        a: "Espèces, carte bancaire (lecteur mobile), virement, facture pro avec TVA. Paiement sur place, après validation du résultat. Pas d'acompte demandé à la réservation.",
      },
      {
        q: "Avez-vous un abonnement entretien régulier ?",
        a: "Oui : -15 à -25 % selon la fréquence (tous les 6, 9 ou 12 mois). Idéal pour les canapés très utilisés ou les foyers avec animaux. Sans engagement de durée — résiliable à tout moment.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je voudrais un devis précis pour le nettoyage de mon canapé à Strasbourg. Quels sont vos prochains créneaux ?",
  },

  // ─── 2. Prix tapis ────────────────────────────────────────────────────
  {
    slug: "prix-nettoyage-tapis-strasbourg",
    shortName: "Prix nettoyage tapis",
    emoji: "💶",
    metaTitle: "Prix nettoyage tapis Strasbourg — StrasClean",
    metaDescription:
      "Combien coûte un nettoyage de tapis à domicile à Strasbourg ? Petit tapis 49 €, moyen 69 €, grand 99 €, ou 9 €/m² au-delà. Sans transport, sans pressing.",
    hero: {
      chip: "Prix & tarifs",
      h1: "Prix d'un nettoyage de tapis à Strasbourg.",
      h1Highlight: "à Strasbourg.",
      subtitle:
        "Tarifs détaillés pour le nettoyage de tapis à domicile à Strasbourg. De 49 € pour un petit tapis à 9 €/m² pour les très grandes pièces. Sans transport, sans pressing, sans frais cachés.",
    },
    problem: {
      title: "Pourquoi le tarif d'un nettoyage de tapis varie au m²",
      paragraphs: [
        "Contrairement à un canapé (taille standardisée par nombre de places), un tapis se mesure au m². Un tapis de salle de bain de 1 m² ne demande pas le même temps qu'un grand tapis de salon de 12 m². La tarification au m² est la plus juste : vous payez exactement le travail réel. À Strasbourg, le marché tourne entre 7 et 15 €/m² selon le type. StrasClean propose des forfaits par tranche (49 € / 69 € / 99 €) pour les tapis standards et 9 €/m² pour les grands — toujours plus avantageux que le pressing.",
      ],
      bullets: [
        "Taille du tapis (m² réels)",
        "Matière (synthétique, laine, viscose, jute, soie)",
        "État (entretien vs très sale, taches anciennes)",
        "Options : désinfection renforcée, anti-acariens",
        "Frais de déplacement (StrasClean : inclus)",
        "Type de tapis (précieux : protocole délicat sur devis)",
      ],
    },
    whyDiy: {
      title: "À domicile vs pressing — le vrai coût",
      paragraphs: [
        "Pressing tapis : 80-150 € pour un tapis moyen + transport aller-retour + 5-10 jours sans tapis. Pour un grand tapis ou un kilim, 200+ € fréquents. Faire-soi-même (shampoing tapis) : 15-25 € de produit + 2-3h de travail + résultat moyen + auréole quasi garantie sur les tapis clairs. À domicile pro : 49-99 € selon taille, 45 min à 1h30 sur place, séchage le jour même. Aucun déplacement, aucun risque.",
      ],
    },
    solution: {
      title: "Ce qui est inclus dans le tarif",
      intro:
        "Le tarif couvre toute l'intervention : déplacement, diagnostic, protocole complet et garantie résultat. Vous payez à la fin, sur place.",
      steps: [
        {
          title: "Déplacement inclus",
          desc: "Strasbourg + 12 communes alentours. Jamais facturé en supplément.",
        },
        {
          title: "Diagnostic de la matière",
          desc: "Synthétique, laine, viscose, sisal, kilim, persan : protocole et produit adaptés. Les tapis précieux sont devisés à part (protocole délicat).",
        },
        {
          title: "Pré-aspiration haute puissance",
          desc: "Retire la saleté sèche avant humidification. C'est 50 % du résultat — sans elle, l'humidité transforme la poussière en boue.",
        },
        {
          title: "Injection-extraction profonde",
          desc: "Eau chaude + produit sous pression, aspiration immédiate. Aucune auréole, séchage rapide.",
        },
        {
          title: "Désinfection + désodorisation",
          desc: "Bactéricide pour les tapis très fréquentés ou avec animaux. Désodorisation neutre sans masquer.",
        },
        {
          title: "Garantie résultat",
          desc: "Si une tache traitable ne part pas, on revient gratuitement. Devis ferme avant intervention.",
        },
      ],
    },
    pricing: { priceFrom: "49", duration: "45 min à 1h30" },
    tariffs: [
      { label: "Petit tapis (jusqu'à 4 m²)", price: "49 €" },
      { label: "Tapis moyen (4 à 8 m²)", price: "69 €" },
      { label: "Grand tapis (8 à 15 m²)", price: "99 €" },
      { label: "Très grand (>15 m²)", price: "9 €/m²", note: "Tarif au m²" },
      {
        label: "Tapis précieux (kilim, persan)",
        price: "Sur devis",
        note: "Protocole délicat dédié",
      },
      {
        label: "Désinfection renforcée",
        price: "+ 15 €",
        note: "Animaux, allergies",
      },
    ],
    faq: [
      {
        q: "Comment mesurer mon tapis pour avoir un devis ?",
        a: "Longueur × largeur en mètres. Exemple : 2,5 m × 3 m = 7,5 m² → tarif moyen (69 €). Si vous hésitez sur la tranche, envoyez-nous une photo avec un objet de référence (table, chaise) sur WhatsApp, on confirme.",
      },
      {
        q: "Que se passe-t-il si je dépasse de quelques cm la tranche ?",
        a: "On reste sur le tarif de la tranche annoncée. Un tapis de 4,2 m² reste à 49 €. On ne joue pas sur les centimètres — le tarif annoncé est le tarif payé.",
      },
      {
        q: "Faites-vous les moquettes pleine surface ?",
        a: "Oui — même technique, tarif au m² (9 €/m² standard). Pour une chambre 12 m², comptez ~108 €. Devis confirmé avec photos.",
      },
      {
        q: "Le prix change-t-il si mon tapis est très sale ?",
        a: "Pas automatiquement — le tarif standard couvre les tapis en condition normale. Pour les tapis très imprégnés (urine animale ancienne, taches multiples très anciennes), on peut proposer un traitement renforcé en option : on vous prévient avant et vous décidez.",
      },
      {
        q: "Faites-vous des tarifs dégressifs pour plusieurs tapis ?",
        a: "Oui : -10 % à partir du 2e tapis traité dans la même intervention. Pratique si vous avez un grand tapis de salon + plusieurs petits tapis (entrée, salle de bain, chambre).",
      },
      {
        q: "Avez-vous une offre pour les pros (boutiques, hôtels) ?",
        a: "Oui : tapis d'accueil de boutiques, tapis de chambres d'hôtels, tapis de salons. Tarif dégressif selon volume, contrat d'entretien régulier possible (tous les 2-3 mois), facture pro avec TVA.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je voudrais un devis précis pour le nettoyage de mon tapis à Strasbourg. Quels sont vos prochains créneaux ?",
  },

  // ─── 3. Prix matelas ──────────────────────────────────────────────────
  {
    slug: "prix-nettoyage-matelas-strasbourg",
    shortName: "Prix nettoyage matelas",
    emoji: "💶",
    metaTitle: "Prix nettoyage matelas Strasbourg — StrasClean",
    metaDescription:
      "Combien coûte un nettoyage de matelas à domicile à Strasbourg ? 1 personne 49 €, 2 personnes 79 €, king size 99 €. Anti-acariens, recto-verso, taches.",
    hero: {
      chip: "Prix & tarifs",
      h1: "Prix d'un nettoyage de matelas à Strasbourg.",
      h1Highlight: "à Strasbourg.",
      subtitle:
        "Tarifs détaillés pour le nettoyage de matelas à domicile à Strasbourg. De 49 € pour un matelas 1 personne à 99 € pour un king size. Options anti-acariens et recto-verso disponibles.",
    },
    problem: {
      title: "Combien ça coûte vraiment de faire nettoyer son matelas",
      paragraphs: [
        "Très peu de Strasbourgeois font nettoyer leur matelas — non pas par manque d'envie, mais par flou sur le prix. Les pressings refusent souvent (matelas trop encombrant), les services à domicile sont rares, et beaucoup pensent qu'il faut investir 150-200 €. La réalité : 49 à 99 € selon la taille du matelas. C'est moins cher qu'une nuit d'hôtel, pour un effet qui dure 6 à 12 mois.",
      ],
      bullets: [
        "Taille du matelas (1 personne, 2 personnes, king size)",
        "Recto-verso (les 2 faces) ou face seule",
        "État (entretien régulier vs jamais nettoyé)",
        "Options : anti-acariens renforcé, désinfection forte",
        "Frais de déplacement (StrasClean : inclus)",
        "Taches spécifiques (urine, sang, vomi) : pas de surcoût en général",
      ],
    },
    whyDiy: {
      title: "Nettoyer vs racheter — le ROI réel",
      paragraphs: [
        "Un matelas neuf de qualité décente : 500-1500 €. Un nettoyage pro avec anti-acariens : 49-99 € + 20 € en option. Vous prolongez la vie de votre matelas de 3 à 5 ans à chaque intervention. Sur la durée de vie totale d'un matelas (12-15 ans), 2-3 nettoyages = environ 200 € investis vs un rachat qui aurait coûté 1000 €. Le ROI est de 5 à 8×. Et vous évitez d'envoyer un matelas usé en déchèterie tous les 5 ans.",
      ],
    },
    solution: {
      title: "Ce qui est inclus dans le tarif",
      intro:
        "Le tarif couvre tout le protocole hygiène matelas — équivalent de ce que font les services d'hygiène hôteliers et hospitaliers. Aucune étape en option payante par défaut.",
      steps: [
        {
          title: "Déplacement à domicile inclus",
          desc: "Strasbourg + 12 communes alentours, sans supplément.",
        },
        {
          title: "Aspiration HEPA",
          desc: "Filtre médical qui retient les particules fines et allergènes. Impossible à reproduire avec un aspirateur ménager.",
        },
        {
          title: "Pré-traitement des taches",
          desc: "Enzymatique pour sueur/urine, organique pour sang, dégraissant pour cosmétiques. Inclus.",
        },
        {
          title: "Injection-extraction ciblée",
          desc: "Sur zones tachées, décroche la matière dans la mousse profonde. Pas d'humidité résiduelle.",
        },
        {
          title: "Désinfection bactéricide",
          desc: "Élimine bactéries, champignons et micro-organismes accumulés. Sans odeur résiduelle.",
        },
        {
          title: "Désodorisation neutre",
          desc: "Sensation de frais immédiate. Pas un parfum, juste une vraie élimination des molécules odorantes.",
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
      {
        label: "Désinfection forte",
        price: "+ 15 €",
        note: "Post-incident (vomi, urine ancienne)",
      },
    ],
    faq: [
      {
        q: "Quel est l'âge limite pour faire nettoyer un matelas ?",
        a: "Aucun — on traite tous les âges. Un matelas de plus de 10 ans bénéficie particulièrement du nettoyage : élimination des acariens accumulés, taches anciennes traitées, sensation de neuf. Tant qu'il est encore confortable et structurellement bon, ça vaut le coup.",
      },
      {
        q: "Y a-t-il un tarif spécifique pour les matelas épais (>30 cm) ?",
        a: "Non — tarif identique. Les matelas épais (mémoire de forme premium, hybrides ressorts+mousse) sont juste un peu plus longs à traiter (5-10 min en plus). On reste sur le tarif annoncé.",
      },
      {
        q: "Recto-verso, vraiment utile ?",
        a: "Oui pour les matelas non retournables (matelas à mémoire de forme, ressorts ensachés) qu'on dort toujours sur la même face : la face supérieure concentre 95 % des saletés. Pour les matelas retournables qu'on inverse régulièrement, recto-verso est un vrai plus.",
      },
      {
        q: "Vous traitez les matelas avec taches d'urine anciennes ?",
        a: "Oui — c'est même un cas fréquent (enfants, animaux). On utilise un protocole enzymatique spécifique. Sur les taches très anciennes (>1 an), on prévient honnêtement si une trace résiduelle est possible. Tarif inclus.",
      },
      {
        q: "Combien de temps avant de dormir dessus ?",
        a: "Le soir même — extraction haute puissance, séchage complet en 2-4 h. Pas d'humidité résiduelle qui favoriserait des moisissures.",
      },
      {
        q: "Offre pour Airbnb / hôtels ?",
        a: "Oui : nettoyage entre locataires Airbnb (intervention dans la journée), entretien régulier de chambres d'hôtels et chambres d'hôtes, désinfection post-incident. Tarif dégressif à partir de 5 matelas, facture pro avec TVA.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je voudrais un devis précis pour le nettoyage de mon matelas à Strasbourg. Quels sont vos prochains créneaux ?",
  },

  // ─── 4. Prix fauteuils / chaises ──────────────────────────────────────
  {
    slug: "prix-nettoyage-fauteuil-chaise-strasbourg",
    shortName: "Prix fauteuils & chaises",
    emoji: "💶",
    metaTitle: "Prix chaises & fauteuils Strasbourg — StrasClean",
    metaDescription:
      "Combien coûte un nettoyage de chaises et fauteuils à domicile à Strasbourg ? Chaise dès 12 €, lot 4 = 49 €, lot 6 = 69 €, fauteuil 39 €. Tarifs dégressifs pour pros.",
    hero: {
      chip: "Prix & tarifs",
      h1: "Prix d'un nettoyage de chaises et fauteuils à Strasbourg.",
      h1Highlight: "à Strasbourg.",
      subtitle:
        "Tarifs au lot pour les chaises de salle à manger, et à l'unité pour les fauteuils. De 12 € la chaise à 39 € le fauteuil, avec dégressivité claire à partir de 4 pièces. Idéal aussi pour restaurants, bureaux et salons.",
    },
    problem: {
      title: "Pourquoi tarifer au lot pour les chaises",
      paragraphs: [
        "Une chaise unique se nettoie en 5-7 minutes, mais le déplacement à domicile reste le même. Tarifer une seule chaise à 39 € serait dissuasif. Tarifer un lot de 4 chaises à 49 € reste rentable pour les deux parties : vous gagnez en effet d'échelle, on amortit le déplacement. C'est pourquoi 90 % des demandes chaises chez StrasClean concernent un lot complet — pas une chaise isolée.",
      ],
      bullets: [
        "Type d'assise (chaise, fauteuil, tabouret, banquette)",
        "Quantité (lot dégressif à partir de 4)",
        "Matière (tissu, alcantara, velours, cuir, simili)",
        "Coussins amovibles ou structure intégrée",
        "Frais de déplacement (StrasClean : inclus)",
        "Volume pro (10+ pièces) : devis spécifique",
      ],
    },
    whyDiy: {
      title: "Lot complet vs unitaire — le calcul",
      paragraphs: [
        "1 chaise à 12-15 € paraît cher rapporté à l'unité — mais c'est le coût d'un déplacement à domicile pour une intervention courte. À l'inverse, un lot de 4 chaises à 49 € = 12 €/chaise et l'intervention rentable. Un lot de 6 chaises à 69 € = 11,50 €/chaise. La logique : plus vous traitez d'assises en une fois, plus le tarif unitaire baisse. C'est aussi vrai pour les pros (restaurants à 12+ chaises) où le tarif peut descendre à 7-9 €/chaise.",
      ],
    },
    solution: {
      title: "Ce qui est inclus dans le tarif",
      intro:
        "Le tarif lot couvre toutes les pièces annoncées, traitées dans la même intervention. Si vous voulez ajouter une pièce de dernière minute (un fauteuil, un tabouret), on l'ajoute sur place au tarif unité.",
      steps: [
        {
          title: "Déplacement inclus",
          desc: "Que vous ayez 1 ou 12 pièces à traiter — pas de frais kilométriques ajoutés.",
        },
        {
          title: "Diagnostic par type d'assise",
          desc: "Tissu, alcantara, cuir, simili : produit adapté par matière. Diagnostic et adaptation incluses dans le tarif.",
        },
        {
          title: "Aspiration profonde par pièce",
          desc: "Retire poussières, miettes, cheveux avant humidification. Sur chaque chaise / fauteuil individuellement.",
        },
        {
          title: "Pré-détachage ciblé",
          desc: "Tanins (vin, café), gras (sauce, cosmétiques), organique (transpiration) : détachants spécifiques.",
        },
        {
          title: "Injection-extraction",
          desc: "Assises, dossiers, accoudoirs. Saleté décrochée et aspirée immédiatement. Aucune auréole.",
        },
        {
          title: "Traitement cuir si applicable",
          desc: "Sur fauteuils/chaises cuir : nettoyant pH-neutre + baume nourrissant. Compris dans l'option cuir (+5-10 €).",
        },
      ],
    },
    pricing: { priceFrom: "39", duration: "30 à 45 min" },
    tariffs: [
      { label: "Lot de 4 chaises", price: "49 €", note: "12,25 €/chaise" },
      { label: "Lot de 6 chaises", price: "69 €", note: "11,50 €/chaise" },
      { label: "Lot de 8 chaises", price: "89 €", note: "11,10 €/chaise" },
      { label: "Fauteuil 1 place", price: "39 €" },
      {
        label: "Option cuir",
        price: "+ 5 à 25 €",
        note: "Nettoyage pH-neutre + baume nourrissant, prix selon nombre de pièces",
      },
      {
        label: "Lot pro (10+ pièces)",
        price: "Sur devis",
        note: "Tarif dégressif jusqu'à 7-9 €/pièce",
      },
    ],
    faq: [
      {
        q: "À partir de combien de chaises le tarif lot est intéressant ?",
        a: "4 chaises : 49 € (12,25 €/chaise) — c'est déjà moins cher qu'1 chaise unitaire (12-15 €). Plus vous avez de pièces, plus le tarif unitaire baisse. Si vous n'avez que 2-3 chaises, on les compte à l'unité.",
      },
      {
        q: "Y a-t-il un tarif spécial pour les pros (restaurants, bars, salons) ?",
        a: "Oui — au-delà de 10 pièces, on passe sur un tarif sur devis qui descend jusqu'à 7-9 €/pièce selon volume. Intervention possible tôt le matin ou après fermeture pour ne pas gêner l'activité. Facture pro avec TVA, contrat d'entretien régulier possible.",
      },
      {
        q: "Et pour les banquettes (restaurants, bars) ?",
        a: "Tarif au mètre linéaire (15-25 €/mètre selon hauteur et matière). Devis ferme après photos. Souvent combiné avec le nettoyage des chaises pour un effet d'ensemble.",
      },
      {
        q: "Les coussins amovibles changent-ils le tarif ?",
        a: "Non, ils sont traités sur place avec la structure. Pour les coussins très épais ou en lin lavable, on peut conseiller un lavage machine en complément (gratuit en conseil).",
      },
      {
        q: "Combien de temps pour traiter un lot de 6 chaises ?",
        a: "30 à 45 minutes en équipe de 2 pour un lot standard. Plus rapide qu'on ne le pense grâce à l'injection-extraction.",
      },
      {
        q: "Vous traitez les chaises de bureau (home office) ?",
        a: "Oui — siège de bureau (assise + dossier + accoudoirs) : 25-35 € à l'unité. Important pour les indépendants qui reçoivent des clients, ou simplement pour le confort quotidien.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je voudrais un devis pour le nettoyage de fauteuils / chaises à Strasbourg. Quels sont vos prochains créneaux ?",
  },

  // ─── 5. Nettoyage Airbnb (B2B haute valeur) ───────────────────────────
  {
    slug: "nettoyage-airbnb-strasbourg",
    shortName: "Nettoyage Airbnb",
    emoji: "🏠",
    metaTitle: "Nettoyage Airbnb Strasbourg — StrasClean",
    metaDescription:
      "Hôte Airbnb à Strasbourg ? StrasClean nettoie canapés, matelas, tapis et fauteuils entre vos locataires. Intervention dans la journée, facture pro, contrat d'entretien possible.",
    hero: {
      chip: "B2B Airbnb",
      h1: "Nettoyage Airbnb à Strasbourg — entre vos locataires.",
      h1Highlight: "entre vos locataires.",
      subtitle:
        "Hôte Airbnb à Strasbourg ? StrasClean intervient entre vos locataires pour nettoyer canapés, matelas et tapis. Intervention rapide (24-48 h), résultat hôtelier, facture pro avec TVA. Idéal pour maintenir un 5 étoiles.",
    },
    problem: {
      title: "Le standard d'hygiène attendu sur Airbnb",
      paragraphs: [
        "À Strasbourg, 3000+ logements Airbnb actifs. Les voyageurs lisent les avis avant de réserver, et 'propre' est le 1er critère cité dans 80 % des évaluations. Un mauvais avis sur la propreté = perte de classement, baisse du taux de réservation, prix moyen en baisse. À l'inverse, les hôtes qui investissent dans un nettoyage textile régulier maintiennent leur 4,9-5 étoiles — et leur prix moyen au-dessus du marché.",
      ],
      bullets: [
        "Standard 5 étoiles attendu — pas de seconde chance",
        "Canapés tachés visibles sur les photos de l'annonce",
        "Matelas avec auréoles de transpiration = mauvais avis quasi garanti",
        "Tapis sale dans le salon = première impression négative",
        "Cycle court : ménage standard ne suffit pas entre 2 locataires",
        "Investissement productif : meilleur classement + prix plus élevé",
      ],
    },
    whyDiy: {
      title: "Faire soi-même entre 2 locataires : impossible",
      paragraphs: [
        "Le créneau de ménage entre 2 locataires Airbnb fait 4 à 6 heures maximum. Y inclure un vrai nettoyage textile (injection-extraction sur canapé + matelas + tapis) en plus du ménage standard est techniquement impossible — il faudrait 3-4 heures juste pour le textile. StrasClean intervient en parallèle de votre prestataire ménage habituel : pendant qu'il fait sols et sanitaires, on traite le textile. Tout est prêt avant l'arrivée du locataire suivant.",
      ],
    },
    solution: {
      title: "Le forfait Airbnb StrasClean",
      intro:
        "Forfaits adaptés au cycle Airbnb : intervention rapide (24-48 h), créneaux flexibles, facture pro avec TVA. Pour les hôtes avec plusieurs logements ou rotations fréquentes, contrat d'entretien régulier à tarif préférentiel.",
      steps: [
        {
          title: "Réservation rapide WhatsApp",
          desc: "Envoyez la date de check-out et le matériel à traiter. Confirmation de créneau dans la journée.",
        },
        {
          title: "Intervention dans la journée",
          desc: "On vient pendant le créneau entre 2 locataires. Coordonné avec votre prestataire ménage habituel.",
        },
        {
          title: "Tout le textile traité",
          desc: "Canapé + matelas + tapis + fauteuils si présents. Standard hôtelier appliqué.",
        },
        {
          title: "Séchage rapide",
          desc: "Extraction haute puissance → utilisable immédiatement. Pas de matelas humide à l'arrivée du locataire.",
        },
        {
          title: "Facture pro avec TVA",
          desc: "Déductible de vos revenus locatifs si vous êtes en régime réel. Récupération de la TVA si entreprise.",
        },
        {
          title: "Contrat d'entretien possible",
          desc: "Pour plusieurs logements ou rotations fréquentes : tarif dégressif, prioritisation des créneaux.",
        },
      ],
    },
    pricing: { priceFrom: "99", duration: "1 h à 2 h" },
    tariffs: [
      {
        label: "Pack basique (canapé 2 places + matelas 2 pers.)",
        price: "139 €",
        note: "Le minimum pour un studio/T2",
      },
      {
        label: "Pack standard (+ tapis 8 m²)",
        price: "199 €",
        note: "T2/T3 complet",
      },
      {
        label: "Pack premium (canapé angle + matelas king + 2 tapis)",
        price: "289 €",
        note: "T3/T4 haut de gamme",
      },
      {
        label: "Intervention express (24 h)",
        price: "+ 15 %",
        note: "Sur tous les packs",
      },
      {
        label: "Contrat mensuel (2+ interventions)",
        price: "-15 %",
        note: "Sur tous les tarifs",
      },
      {
        label: "Multi-logements (3+)",
        price: "Sur devis",
        note: "Tarif dégressif",
      },
    ],
    faq: [
      {
        q: "Vous intervenez en combien de temps après ma demande ?",
        a: "Standard : 48-72 h selon planning. Express (24 h) : +15 % sur le tarif. Pour les contrats réguliers, créneaux prioritaires garantis (réservation 1 semaine à l'avance).",
      },
      {
        q: "Vous travaillez avec mon prestataire ménage habituel ?",
        a: "Oui sans problème — on intervient en parallèle pendant le même créneau. Ça optimise le temps de rotation entre 2 locataires. Communication directe avec votre ménagier-e si vous voulez.",
      },
      {
        q: "Quel impact sur mes avis Airbnb ?",
        a: "Les hôtes qui investissent dans le textile voient en moyenne +0,2 à +0,4 étoile sur leur note 'Propreté' (la plus pénalisante quand basse). Sur l'année, c'est l'écart entre 4,7 et 4,9 — qui change le classement et le taux d'occupation.",
      },
      {
        q: "Vous prenez les locations courte durée hors Airbnb (Booking, Vrbo, Abritel) ?",
        a: "Oui, c'est strictement le même service. On parle d'Airbnb par habitude car c'est le standard, mais on traite toutes les plateformes (Booking, Vrbo, Abritel, locations directes).",
      },
      {
        q: "Avez-vous d'autres hôtes Airbnb comme clients à Strasbourg ?",
        a: "Oui — on développe activement ce segment. Plusieurs hôtes nous font confiance pour leurs rotations. Demandez-nous des références si vous voulez parler à un confrère avant de tester.",
      },
      {
        q: "Comment gérer un incident urgent (vomi, tache importante) entre 2 locataires ?",
        a: "Appelez/WhatsAppez-nous immédiatement. Intervention en urgence sous 4-6 h selon notre planning. Le tarif urgence (+30 % sur le standard) couvre la priorisation. On a souvent sauvé des hôtes d'une annulation de dernière minute.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je suis hôte Airbnb à Strasbourg, je voudrais un devis pour un nettoyage entre locataires (canapé / matelas / tapis). Quels sont vos prochains créneaux ?",
  },

  // ─── 6. Nettoyage canapé cuir (segment premium) ───────────────────────
  {
    slug: "nettoyage-canape-cuir-strasbourg",
    shortName: "Canapé cuir",
    emoji: "🛋️",
    metaTitle: "Nettoyage canapé cuir Strasbourg — StrasClean",
    metaDescription:
      "Canapé cuir terni, marqué ou qui craquelle ? StrasClean intervient à domicile à Strasbourg avec un protocole pH-neutre + baume nourrissant. Pleine fleur, Nappa, semi-aniline. Dès 99 €.",
    hero: {
      chip: "Premium cuir",
      h1: "Nettoyage canapé cuir à Strasbourg.",
      h1Highlight: "à Strasbourg.",
      subtitle:
        "Canapé cuir terni, sec, marqué ou qui commence à craqueler ? StrasClean applique un protocole spécifique pH-neutre + nutrition, adapté à chaque type de cuir (pleine fleur, Nappa, semi-aniline). Souplesse et éclat retrouvés.",
    },
    problem: {
      title: "Le cuir n'est pas un tissu — protocole spécifique obligatoire",
      paragraphs: [
        "Un canapé cuir vaut souvent 2000 à 8000 €. Un mauvais produit appliqué dessus (alcool, ammoniaque, nettoyant ménager standard) peut le décolorer définitivement, le craqueler ou enlever sa patine d'origine. À Strasbourg, beaucoup de canapés cuir sont abîmés non pas par l'usage mais par un mauvais nettoyage — un client bien intentionné qui a voulu bien faire avec le mauvais produit. La réparation d'un cuir abîmé chez un artisan : 300-1500 €. Mieux vaut faire bien dès le départ.",
      ],
      bullets: [
        "Cuir terni qui a perdu son éclat d'origine",
        "Cuir sec qui commence à craqueler aux endroits de flexion",
        "Taches de transpiration ou de cosmétiques sur le cuir clair",
        "Décoloration locale due à un mauvais produit appliqué",
        "Patine inégale (zones plus brillantes que d'autres)",
        "Cuir Nappa ou semi-aniline qui demande un produit ultra-doux",
      ],
    },
    whyDiy: {
      title: "Les produits du commerce abîment souvent le cuir",
      paragraphs: [
        "Les nettoyants 'spécial cuir' vendus en grande surface contiennent souvent des solvants trop agressifs (alcool, ammoniaque) ou des silicones qui bouchent les pores du cuir. Le résultat à court terme paraît bon (brillant immédiat), mais à 6-12 mois le cuir est plus sec qu'avant. Les vraies marques pro (Sonax Leather, Colourlock, Liquid Elements) sont à pH-neutre et nourrissent en profondeur — mais elles coûtent 30-60 € le flacon et demandent du savoir-faire. C'est ce qu'on utilise chez StrasClean.",
      ],
    },
    solution: {
      title: "Le protocole cuir StrasClean",
      intro:
        "Intervention à votre domicile à Strasbourg ou proche banlieue. 1h à 1h30 selon la taille du canapé. Produits pro Sonax / Colourlock adaptés à chaque type de cuir. Résultat : souplesse retrouvée, éclat d'origine, et protection durable.",
      steps: [
        {
          title: "Identification du cuir",
          desc: "Pleine fleur, Nappa, semi-aniline, fleur corrigée, simili. Le produit s'adapte — un protocole identique appliqué à tous abîmerait certains.",
        },
        {
          title: "Dépoussiérage doux",
          desc: "Aspiration à embout doux + microfibre pour retirer poussières et résidus en surface.",
        },
        {
          title: "Nettoyage pH-neutre",
          desc: "Application au tampon avec mouvements circulaires lents. Décrasse sans agresser. Sonax Leather Care ou Colourlock selon type.",
        },
        {
          title: "Traitement des taches ciblées",
          desc: "Sur taches anciennes (encre, cosmétiques, transpiration) : produit dédié. Pour les cuirs très tachés, plusieurs passes douces plutôt qu'une passe agressive.",
        },
        {
          title: "Nutrition en profondeur",
          desc: "Baume nourrissant qui pénètre les fibres du cuir. Restaure la souplesse, prévient les craquelures futures.",
        },
        {
          title: "Protection finale (en option)",
          desc: "Protection hydrophobe Sonax / Liquid Elements qui repousse taches et transpiration. Durée 3-6 mois.",
        },
      ],
    },
    pricing: { priceFrom: "99", duration: "1 h à 1h30" },
    tariffs: [
      { label: "Fauteuil cuir / 1 place", price: "59 €" },
      { label: "Canapé cuir 2 places", price: "99 €" },
      { label: "Canapé cuir 3 places", price: "129 €" },
      { label: "Canapé cuir d'angle", price: "179 €" },
      {
        label: "Protection hydrophobe",
        price: "+ 30 €",
        note: "Repousse taches et transpiration (3-6 mois)",
      },
      {
        label: "Retouche teinte (cuir décoloré)",
        price: "Sur devis",
        note: "Avec produit Colourlock",
      },
      {
        label: "Abonnement annuel",
        price: "-20 %",
        note: "Recommandé pour cuir > 3 ans",
      },
    ],
    faq: [
      {
        q: "Pourquoi le tarif cuir est plus élevé que le canapé tissu ?",
        a: "Trois raisons : produits 5-8× plus chers (pro pH-neutre + baume nourrissant), protocole plus long (mouvements doux pour ne rien agresser), savoir-faire spécifique par type de cuir. Vous payez l'expertise et la garantie de ne rien abîmer.",
      },
      {
        q: "Vous traitez quels types de cuir ?",
        a: "Tous les cuirs canapé courants : pleine fleur (le plus résistant), Nappa (souple, premium), semi-aniline (entre les deux), fleur corrigée (entrée de gamme), simili-cuir (PU/PVC). Chaque type a son produit dédié.",
      },
      {
        q: "Mon canapé cuir est craquelé, vous pouvez le réparer ?",
        a: "On peut nourrir le cuir en profondeur et stopper l'évolution des craquelures, mais on ne fait pas de retouches structurelles (pose de patch, recoloration). Pour les craquelures profondes, on vous oriente vers un artisan tapissier local.",
      },
      {
        q: "Combien de temps avant de m'asseoir dessus ?",
        a: "1 à 2 h pour le séchage du nettoyant + baume. Si protection hydrophobe en option : ajouter 30 min de séchage. Utilisable le jour même.",
      },
      {
        q: "À quelle fréquence faut-il nettoyer un canapé cuir ?",
        a: "1 fois par an pour un cuir < 3 ans, 2 fois par an pour un cuir > 3 ans ou en zone chaude/sèche (chauffage central, soleil direct). Le cuir aime être nourri régulièrement — c'est ce qui prolonge sa durée de vie de 10 à 20 ans.",
      },
      {
        q: "Garantissez-vous le résultat ?",
        a: "Oui — si le cuir n'a pas retrouvé sa souplesse et son éclat après notre intervention, on revient gratuitement. Pour les cuirs très âgés ou très abîmés, on donne un diagnostic honnête AVANT de commencer.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 J'ai un canapé cuir à nettoyer à Strasbourg. Quels sont vos prochains créneaux ?",
  },

  // ─── 7. B2B Hôtels ────────────────────────────────────────────────────
  {
    slug: "nettoyage-matelas-hotel-strasbourg",
    shortName: "Nettoyage hôtel",
    emoji: "🏨",
    metaTitle: "Nettoyage matelas et literie d'hôtel à Strasbourg — StrasClean Pro",
    metaDescription:
      "Hôtel indépendant ou résidence hôtelière à Strasbourg ? StrasClean intervient en équipe pour le nettoyage matelas, sommiers, têtes de lit, fauteuils et moquettes. Tarif dégressif chambres, planning adapté, facture pro.",
    hero: {
      chip: "Pro Hôtels",
      h1: "Nettoyage matelas et literie d'hôtel à Strasbourg.",
      h1Highlight: "à Strasbourg.",
      subtitle:
        "Hôtels, résidences hôtelières, chambres d'hôtes à Strasbourg : nous prenons en charge le nettoyage approfondi de votre literie, fauteuils et textiles d'ameublement. Intervention en équipe, planning adapté à votre taux d'occupation.",
    },
    problem: {
      title: "Une literie d'hôtel se doit d'être irréprochable",
      paragraphs: [
        "Vos clients paient une nuit pour dormir dans un lit qui doit être aussi propre que le leur — voire plus. Une tache sur un matelas, une odeur résiduelle dans un fauteuil ou une moquette qui marque, et c'est un avis 1 étoile sur Booking. Mais entretenir une centaine de matelas avec votre équipe ménage est irréaliste. C'est exactement ce qu'on prend en charge.",
      ],
      bullets: [
        "Matelas : taches biologiques, traces transpiration, acariens",
        "Fauteuils chambres : usure, marques cosmétiques, miettes",
        "Têtes de lit tissu : poussière, marques cheveux, traces parfums",
        "Moquettes couloirs : passage, taches café, vin, ménage chimique répété",
        "Banquettes lobby : usure quotidienne, taches accidentelles",
      ],
    },
    whyDiy: {
      title: "Pourquoi votre équipe ménage ne peut pas tout faire",
      paragraphs: [
        "Le ménage standard d'une chambre (lit refait, salle de bain, aspirateur) prend déjà 30 min. Y rajouter un nettoyage approfondi du matelas tous les 3 mois (1h) × 60 chambres = 60h de travail supplémentaire que votre équipe n'a pas. Externaliser ce volume précis est plus rentable, plus pro, et libère votre équipe pour ce qui compte (relation client).",
      ],
    },
    solution: {
      title: "Le service StrasClean Hôtels",
      intro:
        "Contrat trimestriel ou semestriel selon votre taux de rotation, planning d'intervention par étage / par bâtiment pour minimiser la fermeture chambres. Équipe de 2-3 personnes selon volume, facture pro mensuelle centralisée.",
      steps: [
        {
          title: "Audit gratuit",
          desc: "Visite de votre établissement, recommandations adaptées par zone.",
        },
        {
          title: "Planning sur mesure",
          desc: "Par étage, par bâtiment, ou en chambres vacantes selon votre booking.",
        },
        {
          title: "Intervention équipe",
          desc: "20-30 matelas / jour en équipe de 3, séchage rapide (chambre redispo le soir).",
        },
        {
          title: "Reporting et facturation",
          desc: "Détail des chambres traitées, photos avant/après si demandé, facture centralisée.",
        },
      ],
    },
    pricing: { priceFrom: "39", duration: "30 à 45 min / matelas" },
    tariffs: [
      { label: "Nettoyage matelas 1 personne", price: "49 €", note: "Tarif unitaire" },
      { label: "Nettoyage matelas 2 personnes", price: "69 €", note: "Tarif unitaire" },
      { label: "Contrat 20+ matelas", price: "−25 %", note: "Sur tarif unitaire" },
      { label: "Contrat 50+ matelas / trimestre", price: "Sur devis", note: "Tarif au plus bas + équipe dédiée" },
      { label: "Pack lobby (canapés + fauteuils + moquette)", price: "Sur devis", note: "Selon m²/pièces" },
    ],
    faq: [
      {
        q: "Vous intervenez sans bloquer toutes les chambres ?",
        a: "Oui — on adapte le planning à votre taux d'occupation : intervention par étage, par bâtiment, en chambres vacantes seulement. Séchage rapide (3-4h), chambre redisponible le soir.",
      },
      {
        q: "Quel volume par jour ?",
        a: "En équipe de 3, on traite 20-30 matelas par jour, ou 8-10 chambres complètes (matelas + fauteuils + moquette).",
      },
      {
        q: "Vous pouvez intervenir la nuit pour ne pas gêner ?",
        a: "Oui sur demande (+20 %), mais souvent inutile : nos protocoles sont silencieux et le bruit est limité aux extracteurs.",
      },
      {
        q: "Facture pro et TVA ?",
        a: "Bien sûr — facture pro avec TVA récupérable, virement bancaire, contrat annuel possible avec engagement de planning.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je gère un hôtel à Strasbourg, je voudrais un devis pour le nettoyage de matelas / literie en contrat trimestriel. Quel jour pouvez-vous passer pour un audit ?",
  },

  // ─── 8. B2B Restaurants ───────────────────────────────────────────────
  {
    slug: "nettoyage-chaises-restaurant-strasbourg",
    shortName: "Nettoyage restaurant",
    emoji: "🍽️",
    metaTitle: "Nettoyage chaises et banquettes restaurant Strasbourg — StrasClean Pro",
    metaDescription:
      "Restaurant, brasserie, café à Strasbourg ? StrasClean intervient pour le nettoyage en profondeur de vos chaises tissu, banquettes, fauteuils et moquettes. Intervention nuit ou jour de fermeture, devis sous 24 h.",
    hero: {
      chip: "Pro Restauration",
      h1: "Nettoyage chaises et banquettes de restaurant à Strasbourg.",
      h1Highlight: "à Strasbourg.",
      subtitle:
        "Chaises tissu, banquettes, fauteuils de bar : votre mobilier salle accumule taches, gras et odeurs. StrasClean intervient en nuit ou jour de fermeture pour un nettoyage en profondeur sans interrompre votre service.",
    },
    problem: {
      title: "Le textile salle, premier impact visuel de votre restaurant",
      paragraphs: [
        "Avant même de goûter votre cuisine, le client s'assoit sur votre chaise. Une chaise tachée, une banquette qui sent l'huile froide, un fauteuil de bar collant : c'est le signal d'alarme inconscient qui fait baisser la note. À l'inverse, un mobilier impeccable rassure et justifie le ticket moyen. C'est invisible quand c'est bien fait, dévastateur quand ça ne l'est pas.",
      ],
      bullets: [
        "Chaises tissu : taches café, vin, gras de cuisine, transpiration",
        "Banquettes : usure des accoudoirs, marques d'assise, miettes incrustées",
        "Fauteuils de bar : auréoles cocktails, traces mains, parfums clients",
        "Moquettes / tapis : passage clients × 365 jours / an",
        "Rideaux et nappes textile : odeurs cuisine absorbées",
      ],
    },
    whyDiy: {
      title: "Pourquoi un nettoyage chimique ponctuel ne suffit pas",
      paragraphs: [
        "Le pulvérisateur chimique enlève la tache visible mais laisse le produit dans la fibre, qui attire la saleté plus vite ensuite (les taches reviennent en 2 semaines). L'extraction professionnelle décolle ET retire le produit + la saleté dans la même opération. Le mobilier reste propre 5 à 10× plus longtemps.",
      ],
    },
    solution: {
      title: "Le service StrasClean Restauration",
      intro:
        "Intervention nuit (après fermeture 23h) ou jour de fermeture (souvent lundi à Strasbourg). Équipe de 2-3 personnes, traitement de toute la salle en 4-6h, séchage rapide pour rouverture le service suivant. Contrat trimestriel recommandé.",
      steps: [
        {
          title: "Audit + devis",
          desc: "Visite après service, comptage des pièces, devis ferme sous 48 h.",
        },
        {
          title: "Planning d'intervention",
          desc: "Nuit (23h-6h) ou jour de fermeture, on s'adapte à votre rythme.",
        },
        {
          title: "Traitement salle complète",
          desc: "Chaises, banquettes, moquette, rideaux selon devis. Équipe 2-3.",
        },
        {
          title: "Réouverture sécurisée",
          desc: "Séchage avant ouverture, contrôle qualité, photo reporting.",
        },
      ],
    },
    pricing: { priceFrom: "12", duration: "Selon volume" },
    tariffs: [
      { label: "Chaise tissu unitaire", price: "12 €", note: "Tarif unitaire en lot (min. 20)" },
      { label: "Banquette 4 places", price: "59 €", note: "" },
      { label: "Fauteuil de bar / lounge", price: "39 €", note: "" },
      { label: "Moquette restaurant (au m²)", price: "8 €/m²", note: "Min. 30 m²" },
      { label: "Contrat trimestriel salle complète", price: "Sur devis", note: "Tarif dégressif annuel" },
    ],
    faq: [
      {
        q: "Vous intervenez la nuit pour ne pas bloquer mon service ?",
        a: "Oui — intervention 23h-6h fréquente sur Strasbourg, sans surcoût horaire dans le cadre d'un contrat trimestriel. Toute la salle traitée en une nuit.",
      },
      {
        q: "Combien de chaises par nuit ?",
        a: "Équipe de 2 : 40-60 chaises tissu + banquettes complémentaires. Équipe de 3 : 80+. On dimensionne selon votre salle.",
      },
      {
        q: "Séchage rapide pour le service du midi ?",
        a: "Oui — extraction haute puissance, tout est sec sous 2-3h. Souvent on finit à 5h du matin, salle 100% utilisable pour le service midi.",
      },
      {
        q: "Vous traitez aussi les odeurs (huile, cuisine) ?",
        a: "Oui — décontamination + neutralisant pro éliminent les odeurs profondes. Souvent le 1er signal positif que les clients remarquent.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je gère un restaurant à Strasbourg, je voudrais un devis pour le nettoyage des chaises et banquettes en contrat trimestriel. Quel jour pouvez-vous passer pour un audit ?",
  },

  // ─── 9. B2B Conciergerie Airbnb / Welkeys / etc. ──────────────────────
  {
    slug: "nettoyage-textile-conciergerie-strasbourg",
    shortName: "Conciergerie",
    emoji: "🔑",
    metaTitle: "Nettoyage textile conciergerie Airbnb Strasbourg — StrasClean Pro",
    metaDescription:
      "Conciergerie Airbnb à Strasbourg ? StrasClean est votre partenaire textile : canapés, matelas, fauteuils, tapis sur l'ensemble de votre portefeuille. Intervention rapide, tarif partenaire, facture mensuelle centralisée.",
    hero: {
      chip: "Pro Conciergerie",
      h1: "Nettoyage textile pour conciergeries Airbnb à Strasbourg.",
      h1Highlight: "à Strasbourg.",
      subtitle:
        "Welkeys, Guest&Strategy, indépendants : StrasClean est votre prestataire textile sur Strasbourg. Une seule facture, un seul interlocuteur, intervention sous 48 h sur l'ensemble de votre portefeuille d'appartements.",
    },
    problem: {
      title: "Votre portefeuille = autant de canapés à entretenir",
      paragraphs: [
        "Gérer 20 appartements Airbnb à Strasbourg, c'est gérer 20 canapés, 20-40 matelas et autant de tapis qui prennent cher au rythme des rotations locataires. Chercher un prestataire textile fiable, négocier, planifier appart par appart : énergie perdue. Un partenaire textile unique vous fait gagner du temps et de l'argent.",
      ],
      bullets: [
        "Canapés/matelas usés par rotation rapide (taches, odeurs, taches biologiques)",
        "Demandes ponctuelles urgentes après incidents locataires",
        "Avis Airbnb sensibles à la propreté perçue (mention textile fréquente)",
        "Renouvellement précoce du mobilier sans entretien (coût caché)",
      ],
    },
    whyDiy: {
      title: "Pourquoi multiplier les prestataires ponctuels coûte plus",
      paragraphs: [
        "Faire venir un nettoyeur différent à chaque incident, comparer 3 devis à chaque fois, gérer 10 factures par mois : c'est de la charge mentale et de l'argent perdu. Un partenaire textile en tarif partenaire vous donne un prix au volume, un interlocuteur unique, une facture mensuelle. Et on connaît votre portefeuille (matières, contraintes accès, voisinage).",
      ],
    },
    solution: {
      title: "Le service StrasClean Conciergerie",
      intro:
        "Partenariat annuel ou trimestriel : tarif partenaire (-20 % à -30 % vs unitaire), priorité planning (sous 48 h), facture mensuelle centralisée. On gère l'accès via vos protocoles (code, lockbox, intervention en présence de votre équipe).",
      steps: [
        {
          title: "Conventionnement",
          desc: "Accord-cadre, tarif partenaire, protocole d'accès, contact unique.",
        },
        {
          title: "Demande par WhatsApp",
          desc: "Vous nous écrivez quand vous avez besoin (un appart, plusieurs).",
        },
        {
          title: "Intervention prioritaire",
          desc: "Sous 48 h en moyenne, sous 24 h en urgence.",
        },
        {
          title: "Facture mensuelle",
          desc: "Centralisée, détaillée par appartement, TVA récupérable.",
        },
      ],
    },
    pricing: { priceFrom: "59", duration: "1 h à 3 h selon presta" },
    tariffs: [
      { label: "Canapé 2 places (tarif partenaire)", price: "59 €", note: "-25 % vs unitaire" },
      { label: "Matelas 2 personnes", price: "59 €", note: "-15 % vs unitaire" },
      { label: "Tapis salon (≤6 m²)", price: "49 €", note: "" },
      { label: "Pack appart complet", price: "Sur devis", note: "Canapé + matelas + tapis" },
      { label: "Intervention urgence (24 h)", price: "+25 %", note: "Sur tarif partenaire" },
    ],
    faq: [
      {
        q: "Vous gérez plusieurs appartements par jour ?",
        a: "Oui — équipe de 2, 3-4 appartements par jour selon le volume textile par adresse. On optimise les tournées géographiquement.",
      },
      {
        q: "Vous prenez en charge l'accès en notre absence ?",
        a: "Oui — code, lockbox, ou intervention en présence de votre femme de ménage. Tout est cadré dans la convention de départ.",
      },
      {
        q: "Une seule facture mensuelle ?",
        a: "Oui — récap par appartement, totalisée en bas de facture, virement bancaire. TVA récupérable.",
      },
      {
        q: "Quel délai d'intervention en cas d'urgence (mauvais avis évité) ?",
        a: "Sous 24 h en cas d'urgence locataire (vomi, tache importante, odeur). Tarif urgence +25 %. On a sauvé plusieurs hôtes d'une cascade d'avis négatifs.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je gère une conciergerie Airbnb à Strasbourg avec X appartements, je voudrais un devis partenaire pour le nettoyage textile. Pouvons-nous en discuter ?",
  },
];

/** Construit l'URL d'une page SEO Maison */
export const homeSeoPath = (s: HomeService) => `/${s.slug}`;

/** Trouve une page SEO Maison par son slug exact */
export const findHomeSeoPage = (slug: string) =>
  HOME_SEO_PAGES.find((s) => s.slug === slug);
