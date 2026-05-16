// ─────────────────────────────────────────────────────────────────────────
//  StrasClean — Pages "Pain Point" (cas d'usage)
//
//  Pages SEO ciblant des intentions très précises avec forte conversion :
//   - "Comment enlever les poils de chien dans ma voiture ?"
//   - "Comment enlever l'odeur de tabac de ma voiture ?"
//   - "Comment préparer ma voiture pour la revente ?"
//
//  URLs générées (Strasbourg uniquement pour l'instant) :
//   - /enlever-poils-chien-voiture-strasbourg
//   - /enlever-odeur-tabac-voiture-strasbourg
//   - /preparer-voiture-revente-strasbourg
//
//  Pour ajouter un nouveau cas d'usage : duplique une entrée. Le slug
//  est l'URL complète (Strasbourg inclus). Le contenu doit être unique
//  et substantiel (>700 mots) pour ne pas être assimilé à du doorway.
// ─────────────────────────────────────────────────────────────────────────

export type UseCase = {
  /** Slug d'URL (sans le `/` initial) */
  slug: string;
  /** Nom court — utilisé dans cards et breadcrumbs */
  shortName: string;
  /** Emoji représentatif */
  emoji: string;
  /** SEO */
  metaTitle: string;
  metaDescription: string;
  /** Hero */
  hero: {
    chip: string;
    h1: string;
    h1Highlight: string; // sous-chaîne du H1 affichée en gradient
    subtitle: string;
  };
  /** Section "Le problème" */
  problem: {
    title: string;
    paragraphs: string[];
    bullets: string[];
  };
  /** Section "Pourquoi le DIY échoue" */
  whyDiy: {
    title: string;
    paragraphs: string[];
  };
  /** Section "Notre solution" + étapes du process */
  solution: {
    title: string;
    intro: string;
    steps: { title: string; desc: string }[];
  };
  /** Tarif et durée */
  pricing: {
    priceFrom: string;
    duration: string;
  };
  /** Slug du service StrasClean lié (pour lien interne) */
  recommendedServiceSlug?: string;
  /** Q&R spécifiques à ce cas d'usage */
  faq: { q: string; a: string }[];
  /** Message WhatsApp pré-rempli */
  ctaMessage: string;
};

export const USE_CASES: UseCase[] = [
  // ─── 1. Enlever les poils de chien ────────────────────────────────────
  {
    slug: "enlever-poils-chien-voiture-strasbourg",
    shortName: "Poils de chien",
    emoji: "🐶",
    metaTitle:
      "Enlever les poils de chien dans la voiture à Strasbourg — StrasClean",
    metaDescription:
      "Poils de chien incrustés dans le tissu, le coffre, les sièges ? StrasClean intervient à domicile à Strasbourg avec un protocole pro (turbo-brosse, adhésifs, désinfection) qui décolle tous les poils — même les plus tenaces. À partir de 69 €.",
    hero: {
      chip: "Solution dédiée poils d'animaux",
      h1: "Enlever les poils de chien dans votre voiture à Strasbourg.",
      h1Highlight: "à Strasbourg.",
      subtitle:
        "Aspirateur classique inefficace ? StrasClean utilise un protocole professionnel à domicile qui décolle même les poils incrustés à 1-2 cm dans le tissu — sièges, moquette, coffre et passages de roue.",
    },
    problem: {
      title: "Le calvaire des poils incrustés",
      paragraphs: [
        "Les chiens adorent les balades en voiture. Le problème, c'est que leurs poils s'invitent partout : sièges, tapis, contre-portes, ceintures de sécurité, coffre. Et plus on roule avec, plus les poils s'enfoncent dans les fibres et deviennent quasi impossibles à retirer.",
        "L'aspirateur de la maison ou de la station de lavage n'a aucune chance. Il aspire en surface, sans extraire les poils incrustés à 1 ou 2 cm dans le tissu. Résultat : votre voiture reste pleine de poils malgré tous vos efforts.",
        "Pour les conducteurs ou passagers allergiques, c'est encore pire : les allergènes restent dans l'habitacle et provoquent éternuements, démangeaisons et gêne respiratoire à chaque trajet.",
      ],
      bullets: [
        "Poils incrustés dans les fibres des sièges, invisibles à l'œil",
        "Odeur de chien persistante, même après aération",
        "Allergènes qui restent dans l'habitacle et déclenchent des réactions",
        "Coffre transformé en panier à poils après chaque sortie",
        "Sièges arrière où chaque trajet ajoute une nouvelle couche",
      ],
    },
    whyDiy: {
      title: "Pourquoi l'aspirateur seul ne suffit jamais",
      paragraphs: [
        "Les poils d'animaux ont une particularité physique : ils sont fins, électrostatiques, et s'accrochent profondément aux fibres textiles. Un aspirateur domestique aspire l'air en surface mais ne décolle pas mécaniquement les poils enchâssés dans la matière.",
        "Les astuces vues sur internet (gant en latex frotté, rouleau adhésif, brosse à cheveux humide) fonctionnent en surface, mais demandent des heures de travail manuel et n'enlèvent jamais 100 % des poils. Et même quand tout semble propre visuellement, les allergènes restent.",
      ],
    },
    solution: {
      title: "Le protocole StrasClean — résultat garanti à domicile",
      intro:
        "Chez StrasClean, on a affiné un protocole précis pour ce cas d'usage. On vient chez vous à Strasbourg ou dans les communes alentours, avec tout le matériel professionnel nécessaire : aspirateur haute puissance, turbo-brosse électrique, brosses adhésives pro et produits désinfectants neutralisant les allergènes.",
      steps: [
        {
          title: "Aspiration profonde haute puissance",
          desc: "Sur tous les sièges, tapis, coffre et passages de portière. Aspirateur 1500W avec embout adapté.",
        },
        {
          title: "Turbo-brosse électrique",
          desc: "Décolle mécaniquement les poils enchâssés à plus d'1 cm dans le tissu. C'est l'étape qui fait toute la différence.",
        },
        {
          title: "Brossage adhésif manuel",
          desc: "Sur les rebords de sièges, contours et ceintures — zones où les poils s'accumulent et que la turbo-brosse n'atteint pas.",
        },
        {
          title: "Désinfection bactéricide",
          desc: "Neutralise les allergènes et bactéries laissés par les animaux. Sans danger pour les passagers ni pour l'animal lors de son retour.",
        },
        {
          title: "Désodorisation animale ciblée",
          desc: "Pas un parfum qui masque, mais un produit qui détruit la molécule odorante à la source.",
        },
      ],
    },
    pricing: { priceFrom: "69", duration: "1 h à 1h30" },
    recommendedServiceSlug: "nettoyage-poils-animaux-voiture",
    faq: [
      {
        q: "Combien de temps tient le résultat après votre intervention ?",
        a: "Tout dépend de la fréquence de transport de votre animal. Pour un chien qui monte 2-3 fois par semaine, comptez un nouveau gros traitement tous les 3-4 mois, avec un entretien plus léger entre les deux. Beaucoup de nos clients font une formule Premium + traitement poils 2 fois par an.",
      },
      {
        q: "Faut-il que le chien soit absent pendant l'intervention ?",
        a: "Idéalement oui, pour éviter qu'il ne re-laisse des poils pendant qu'on nettoie. Mais si ce n'est pas possible (chien d'aveugle, gardiennage, etc.), on s'organise autrement avec vous.",
      },
      {
        q: "Vous traitez aussi les poils de chat ? De lapin ?",
        a: "Oui, tous types de poils d'animaux domestiques. Les poils de chat sont en fait souvent plus durs à retirer que ceux de chien — notre matériel est adapté aux deux.",
      },
      {
        q: "Quels produits utilisez-vous pour la désinfection ?",
        a: "Des produits professionnels homologués, sans danger pour les enfants ni pour vos animaux quand ils remontent dans la voiture après. On évite tout produit agressif type Javel ou ammoniaque.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je transporte mon chien régulièrement, je voudrais un traitement complet poils d'animaux pour ma voiture à Strasbourg. Vos disponibilités cette semaine ?",
  },

  // ─── 2. Enlever l'odeur de tabac ──────────────────────────────────────
  {
    slug: "enlever-odeur-tabac-voiture-strasbourg",
    shortName: "Odeur de tabac",
    emoji: "🚬",
    metaTitle:
      "Enlever l'odeur de tabac dans la voiture à Strasbourg — StrasClean",
    metaDescription:
      "L'odeur de tabac s'incruste partout : sièges, plafonnier, plastiques. StrasClean élimine vraiment l'odeur (pas qui la masque) à votre domicile à Strasbourg via extraction profonde + traitement à l'ozone. À partir de 89 €.",
    hero: {
      chip: "Traitement anti-odeur tabac",
      h1: "Enlever l'odeur de tabac dans votre voiture à Strasbourg.",
      h1Highlight: "à Strasbourg.",
      subtitle:
        "Désodorisant en grappe inefficace ? StrasClean utilise un protocole professionnel — injection-extraction + ozonation — qui élimine la molécule de nicotine à la source. Plus de masquage temporaire : résultat durable à votre domicile.",
    },
    problem: {
      title: "Une odeur qui s'incruste partout",
      paragraphs: [
        "L'odeur de tabac dans une voiture est l'une des plus tenaces qui existent. Le goudron et la nicotine s'accumulent sur TOUTES les surfaces : sièges, plafonnier, ciel de toit, plastiques, contre-portes, vitres intérieures. Même le filtre d'habitacle est saturé.",
        "Même après avoir arrêté de fumer dans la voiture, l'odeur persiste pendant des mois — voire des années. Pour quelqu'un qui achète un véhicule d'occasion ayant appartenu à un fumeur, c'est un problème immédiat. Et un argument de négociation à la baisse de 500 à 1 500 € sur le prix d'achat.",
        "Les passagers non-fumeurs — enfants, conjoint, clients pour les chauffeurs VTC ou taxi — sont incommodés à chaque trajet. Et soyons honnêtes : les désodorisants en grappe vendus en station-service ne font que masquer pendant quelques heures avant que tout revienne.",
      ],
      bullets: [
        "Odeur persistante imprégnée dans les tissus et les plastiques",
        "Taches jaunâtres de goudron sur le plafonnier et le ciel de toit",
        "Plastiques qui dégagent l'odeur dès qu'il fait chaud",
        "Vitres avec un film gras invisible à l'intérieur",
        "Filtre d'habitacle saturé qui re-diffuse l'odeur via la clim",
        "Impossible à enlever avec un simple lavage classique",
      ],
    },
    whyDiy: {
      title: "Pourquoi les sprays anti-tabac ne marchent jamais durablement",
      paragraphs: [
        "Les sprays anti-tabac vendus en station-service masquent l'odeur 24 à 48 heures, puis elle revient — parce qu'ils n'éliminent pas la cause, ils ajoutent juste un parfum par-dessus. Les housses de siège ne traitent ni le ciel de toit, ni les plastiques, ni le système de ventilation.",
        "Pour vraiment éliminer l'odeur, il faut décrocher physiquement les molécules de nicotine et de goudron des matériaux où elles se sont fixées. Aucun produit grand public ne peut faire ça à l'efficacité requise — il faut un équipement professionnel (injecteur-extracteur, générateur d'ozone) et le bon protocole.",
      ],
    },
    solution: {
      title: "Le protocole anti-tabac StrasClean",
      intro:
        "On applique le traitement complet en intervention unique à votre domicile à Strasbourg ou en proche banlieue. Comptez 1h30 à 2 h sur place — on travaille en équipe de 2, donc deux fois plus vite qu'un detailer solo. Plus aucune trace d'odeur après. Pour les véhicules très imprégnés, on peut combiner avec un traitement à l'ozone qui oxyde les molécules jusque dans la mousse des sièges.",
      steps: [
        {
          title: "Aspiration et pré-traitement",
          desc: "Toutes les surfaces sont aspirées et préparées : sièges, ciel de toit, contre-portes, coffre. On retire les filtres d'habitacle saturés.",
        },
        {
          title: "Injection-extraction des tissus",
          desc: "Shampouinage profond des sièges et du plafonnier avec un produit spécifique qui décroche le goudron incrusté dans les fibres.",
        },
        {
          title: "Dégraissage des plastiques et vitres",
          desc: "Les plastiques et l'intérieur des vitres sont nettoyés en profondeur — souvent recouverts d'un film gras invisible qu'un nettoyage standard ne retire pas.",
        },
        {
          title: "Traitement à l'ozone (30-60 min)",
          desc: "L'ozone oxyde les molécules d'odeur dans l'air ambiant ET dans les matériaux. C'est l'étape qui rend le résultat durable, pas juste cosmétique.",
        },
        {
          title: "Remplacement du filtre d'habitacle",
          desc: "Si nécessaire, on remplace votre filtre d'habitacle saturé. Sinon l'odeur revient via la ventilation à chaque fois que vous mettez la clim.",
        },
        {
          title: "Désodorisation finale neutre",
          desc: "Une note légère et neutre pour finir — pas un parfum lourd, juste une sensation de propreté.",
        },
      ],
    },
    pricing: { priceFrom: "89", duration: "1h30 à 2 h" },
    recommendedServiceSlug: "detailing-auto",
    faq: [
      {
        q: "L'ozone est-il dangereux ?",
        a: "Pas du tout après l'intervention. L'ozone détruit les odeurs en se transformant en oxygène naturel. On laisse la voiture ventiler 30 minutes après le traitement avant que vous remontiez dedans. Aucun résidu chimique, aucun risque.",
      },
      {
        q: "Combien de temps avant que l'odeur revienne ?",
        a: "Si vous arrêtez de fumer dans la voiture, le traitement tient des mois — voire indéfiniment. Si vous continuez à fumer dedans, l'odeur reviendra forcément en quelques semaines. Dans ce cas, on peut refaire un traitement en entretien tous les 6 mois.",
      },
      {
        q: "Marche-t-il pour les odeurs de shisha, vape ou cannabis ?",
        a: "Oui — toute molécule odorante incrustée dans les tissus est traitable par notre protocole. Le résultat est identique. Le traitement à l'ozone est particulièrement efficace sur ces odeurs.",
      },
      {
        q: "Faut-il déposer ma voiture chez vous ?",
        a: "Non, on vient à votre domicile à Strasbourg ou en proche banlieue. Vous n'avez besoin que d'une place de stationnement avec accès à une prise électrique pour notre équipement.",
      },
      {
        q: "Vous garantissez le résultat ?",
        a: "Pour 99 % des cas, oui. Pour les voitures très très imprégnées (plus de 10 ans de tabagisme intensif quotidien), on peut avoir besoin de 2 sessions espacées d'une semaine. On vous donne notre avis honnête lors du diagnostic avant intervention.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Ma voiture a une odeur de tabac persistante, je voudrais un traitement complet à mon domicile à Strasbourg. Vos disponibilités cette semaine ?",
  },

  // ─── 3. Préparer voiture pour revente ─────────────────────────────────
  {
    slug: "preparer-voiture-revente-strasbourg",
    shortName: "Préparer revente",
    emoji: "💰",
    metaTitle:
      "Préparer sa voiture pour la revente à Strasbourg — StrasClean",
    metaDescription:
      "Une voiture impeccable se vend 5 à 15 % plus cher et 2× plus vite. StrasClean prépare votre véhicule à domicile à Strasbourg avant la mise en vente — extérieur + intérieur + conseils photos. À partir de 119 €.",
    hero: {
      chip: "Préparation revente",
      h1: "Préparer votre voiture pour la revente à Strasbourg.",
      h1Highlight: "pour la revente.",
      subtitle:
        "Une voiture impeccable se vend 5 à 15 % plus cher et 2× plus vite. On la prépare en intervention unique à votre domicile — extérieur, intérieur, conseils photos — pour que vos annonces convertissent et que vos visites se concluent vite.",
    },
    problem: {
      title: "Pourquoi votre annonce ne convertit pas",
      paragraphs: [
        "Vendre sa voiture est souvent décourageant. Les acheteurs négocient à la baisse, les visites s'éternisent, les photos d'annonce ne se distinguent pas des autres sur LeBonCoin ou La Centrale. Et 80 % du temps, ce n'est pas le prix qui freine — c'est la présentation.",
        "Les acheteurs jugent en 30 secondes : carrosserie terne, intérieur sale, odeur, taches sur les sièges, plastiques marqués → ils baissent leur offre, ou passent leur chemin sans même venir voir. À l'inverse, une voiture qui brille sur les photos et qui sent le neuf à la visite déclenche la décision en quelques minutes.",
        "Statistiquement, un véhicule préparé professionnellement se vend 5 à 15 % plus cher en 2 fois moins de temps. C'est un investissement de 119 à 159 € qui rapporte régulièrement 500 à 2 000 €. Le ROI est l'un des meilleurs en automobile.",
      ],
      bullets: [
        "Carrosserie terne qui passe inaperçue dans les photos d'annonce",
        "Intérieur qui montre l'usure quotidienne (taches, poussière, odeur)",
        "Acheteurs qui négocient à la baisse sur des « détails »",
        "Visites qui ne se concrétisent pas après le test",
        "Temps de vente qui s'allonge → assurance + frais qui continuent",
      ],
    },
    whyDiy: {
      title: "Pourquoi un simple lavage en station ne suffit pas",
      paragraphs: [
        "Un lavage classique en station laisse la voiture « propre » mais pas « vendeuse ». Pour vraiment se démarquer, il faut un vrai traitement de detailing : décontamination de la carrosserie pour retrouver l'éclat du neuf, shampouinage des sièges et de la moquette pour éliminer les taches accumulées, dressing des plastiques pour qu'ils retrouvent leur couleur d'origine, et désodorisation complète.",
        "Les outils et produits nécessaires (injecteur-extracteur, décontaminant ferreux, dressing plastique pro, ozonation éventuelle) coûtent à eux seuls plus cher qu'une intervention StrasClean. Et il faut maîtriser le protocole pour ne pas abîmer la peinture ou les surfaces sensibles.",
      ],
    },
    solution: {
      title: "Le pack « préparation revente » StrasClean",
      intro:
        "On combine lavage extérieur à la main, décontamination, shampouinage intérieur complet, traitement des plastiques et désodorisation, en une seule intervention de 2 à 2h30 à votre domicile à Strasbourg. On travaille en équipe de 2, ce qui divise par 2 le temps habituel. Vous prenez ensuite vos photos d'annonce le lendemain matin dans une lumière favorable, et la voiture est prête pour les visites.",
      steps: [
        {
          title: "Lavage extérieur main + décontamination",
          desc: "Pré-lavage à la mousse, lavage manuel à la microfibre, décontamination ferreuse et organique pour éliminer les contaminants qui ternissent la peinture.",
        },
        {
          title: "Polissage léger si nécessaire",
          desc: "Optiques jaunies polies, micro-rayures atténuées sur les zones les plus visibles à l'œil nu.",
        },
        {
          title: "Shampouinage intérieur complet",
          desc: "Sièges, moquette, plafonnier passés à l'injection-extraction. Toutes les taches accumulées partent.",
        },
        {
          title: "Dressing des plastiques",
          desc: "Plastiques intérieurs et extérieurs (passages de roue, joints) retrouvent leur couleur et leur aspect d'origine.",
        },
        {
          title: "Vitres cristal",
          desc: "Vitres intérieures et extérieures sans aucune trace — point que les acheteurs remarquent immédiatement.",
        },
        {
          title: "Désodorisation finale",
          desc: "Odeur neutre et propre — la fameuse « impression de neuf » qui ferme la vente lors des visites.",
        },
        {
          title: "Conseils photos d'annonce",
          desc: "Gratuit : on vous indique quels angles privilégier, à quelle heure prendre les photos et dans quelle lumière pour maximiser l'impact de l'annonce.",
        },
      ],
    },
    pricing: { priceFrom: "119", duration: "2 h à 2h30" },
    recommendedServiceSlug: "detailing-auto",
    faq: [
      {
        q: "Quel délai avant que je puisse prendre les photos d'annonce ?",
        a: "On termine généralement en fin de journée. Prenez vos photos le lendemain matin entre 9h et 11h (la lumière la plus flatteuse). On vous conseille aussi gratuitement les angles à privilégier pour valoriser votre véhicule.",
      },
      {
        q: "Quel ROI je peux espérer ?",
        a: "Sur l'historique des clients StrasClean qui ont vendu après notre intervention, l'écart moyen est de +800 à +1 200 € sur le prix de vente versus l'estimation initiale, avec une durée de vente divisée par 2. ROI moyen : 6 à 10× le coût de l'intervention.",
      },
      {
        q: "Pour un véhicule très usé (200 000 km, intérieur très sale), ça vaut le coup ?",
        a: "Encore plus que pour un véhicule récent. Plus la voiture est marquée au départ, plus l'effet « avant-après » est spectaculaire — c'est sur ces véhicules qu'on a vu les plus gros écarts (jusqu'à +2 500 € sur des SUV âgés vendus à des pros).",
      },
      {
        q: "Que se passe-t-il si ma voiture ne se vend pas avant 1 mois ?",
        a: "On peut faire une retouche express (lavage extérieur + aspiration intérieure) à tarif préférentiel pour rafraîchir avant les nouvelles visites. La préparation principale reste valable plusieurs semaines de toute façon.",
      },
      {
        q: "Vous prenez aussi les photos ?",
        a: "Pas pour l'instant, on se concentre sur la préparation. Mais on a un partenariat informel avec un photographe auto local — on peut vous mettre en relation si tu veux un service photo pro (~50-80 € pour un shooting complet d'annonce).",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je vais mettre ma voiture en vente, je voudrais une préparation complète revente à mon domicile à Strasbourg. Vos disponibilités cette semaine ?",
  },

  // ─── 4. Enlever odeur de vomi ─────────────────────────────────────────
  {
    slug: "enlever-odeur-vomi-voiture-strasbourg",
    shortName: "Odeur de vomi",
    emoji: "🤢",
    metaTitle:
      "Enlever l'odeur de vomi dans la voiture à Strasbourg — StrasClean",
    metaDescription:
      "Vomi sur les sièges, le tapis ou la moquette ? StrasClean intervient à domicile à Strasbourg avec un protocole pro (extraction, désinfection, ozonation) qui supprime taches et odeur jusque dans la mousse. À partir de 89 €.",
    hero: {
      chip: "Traitement vomi urgent",
      h1: "Enlever l'odeur de vomi dans votre voiture à Strasbourg.",
      h1Highlight: "à Strasbourg.",
      subtitle:
        "Un enfant malade, une soirée qui finit mal, le mal des transports ? StrasClean intervient rapidement à domicile avec un protocole anti-vomi complet — extraction profonde, désinfection enzymatique, neutralisation d'odeur — qui traite jusqu'à la mousse sous le tissu. Plus de honte au prochain trajet.",
    },
    problem: {
      title: "Une situation d'urgence à traiter vite",
      paragraphs: [
        "Le vomi en voiture est l'un des accidents les plus traumatisants à nettoyer. La matière contient des sucs gastriques très acides qui pénètrent immédiatement dans le tissu, traversent la mousse du siège et atteignent la structure interne. Plus on attend, plus le problème s'enfonce.",
        "Au-delà des taches visibles, c'est l'odeur qui reste le vrai problème. Elle persiste pendant des semaines voire des mois car les bactéries qui digèrent les résidus organiques se logent dans la mousse, là où aucun produit grand public ne peut les atteindre. Chaque trajet ravive l'odeur — surtout quand il fait chaud ou que la voiture est restée fermée.",
        "Les nettoyages d'urgence à la maison (savon, vinaigre, lingettes) traitent la surface mais laissent la source intacte. Quelques jours plus tard, l'odeur revient et devient même plus tenace qu'au départ. Et plus le temps passe, plus le traitement professionnel devient compliqué.",
      ],
      bullets: [
        "Taches visibles sur sièges, moquette, ceintures et plastiques",
        "Odeur qui revient à chaque fois qu'il fait chaud dans l'habitacle",
        "Bactéries logées dans la mousse, inaccessibles au lavage manuel",
        "Risque d'imprégnation permanente si le traitement tarde",
        "Sensation de malaise pour les passagers à chaque trajet",
        "Perte de valeur du véhicule à la revente si l'odeur persiste",
      ],
    },
    whyDiy: {
      title: "Pourquoi le nettoyage à la maison ne suffit pas",
      paragraphs: [
        "Les sucs gastriques pénètrent dans le tissu en moins de 2 minutes. Une fois dans la mousse, ils nourrissent les bactéries qui produisent l'odeur. Un nettoyage de surface — même soigneux — n'atteint jamais cette zone. Vous croyez avoir gagné, et l'odeur revient au premier coup de chaud.",
        "Les remèdes de grand-mère (bicarbonate, marc de café, vinaigre blanc) absorbent les odeurs en surface pendant 24-48 heures. Ils ne tuent pas les bactéries dans la mousse. Pour un vrai traitement, il faut un injecteur-extracteur professionnel, des produits enzymatiques qui décomposent la matière organique au niveau moléculaire, et idéalement une ozonation finale qui détruit les molécules d'odeur dans tout l'habitacle.",
      ],
    },
    solution: {
      title: "Le protocole anti-vomi StrasClean",
      intro:
        "On peut intervenir rapidement à votre domicile à Strasbourg ou en proche banlieue — souvent dans les 24-48h selon votre urgence. Comptez 1h30 à 2 h sur place en équipe de 2. Le résultat est garanti : plus aucune odeur, plus aucune tache, plus aucune trace au prochain coup de chaud.",
      steps: [
        {
          title: "Diagnostic et délimitation",
          desc: "On identifie précisément les zones touchées (siège, dossier, moquette, ceinture, contre-porte) et l'ampleur de la pénétration dans la mousse.",
        },
        {
          title: "Aspiration profonde et pré-traitement",
          desc: "Aspiration haute puissance des zones contaminées + application d'un dégraissant enzymatique qui décompose les résidus organiques au cœur du tissu.",
        },
        {
          title: "Injection-extraction haute pression",
          desc: "L'injecteur-extracteur envoie de l'eau chaude additionnée d'un produit enzymatique dans la mousse, puis aspire immédiatement le tout. On répète 2 à 3 fois jusqu'à extraction complète.",
        },
        {
          title: "Désinfection bactéricide",
          desc: "Application d'un désinfectant professionnel qui tue les bactéries restantes — sans danger pour les passagers une fois sec.",
        },
        {
          title: "Traitement à l'ozone (30-60 min)",
          desc: "Étape clé : l'ozone oxyde les molécules d'odeur restantes dans l'air ET dans tous les matériaux poreux. C'est ce qui rend le résultat définitif, pas juste cosmétique.",
        },
        {
          title: "Désodorisation neutre + séchage",
          desc: "Désodorisation finale légère et ventilation. La voiture est utilisable dès la fin de l'intervention, sans humidité résiduelle.",
        },
      ],
    },
    pricing: { priceFrom: "89", duration: "1h30 à 2 h" },
    recommendedServiceSlug: "detailing-auto",
    faq: [
      {
        q: "Combien de temps après l'accident faut-il intervenir ?",
        a: "Le plus tôt possible — idéalement sous 48h. Au-delà, le vomi sèche et pénètre durablement dans la mousse, rendant l'extraction plus complexe (sans la rendre impossible). On a déjà traité avec succès des accidents vieux de plusieurs mois.",
      },
      {
        q: "Vous garantissez la disparition complète de l'odeur ?",
        a: "Oui, dans 95 % des cas en une seule intervention. Pour les contaminations très profondes (mousses très imprégnées, vomi vieux de plus de 2 semaines), une seconde session de retouche peut être nécessaire — on vous le dit honnêtement lors du diagnostic.",
      },
      {
        q: "Mes sièges seront-ils mouillés après l'intervention ?",
        a: "Légèrement humides au toucher, oui — mais l'extraction haute puissance retire 90 % de l'humidité immédiatement. La voiture peut être utilisée tout de suite, et le séchage complet est obtenu en quelques heures avec une ventilation normale.",
      },
      {
        q: "Mon enfant peut-il remonter dans la voiture juste après ?",
        a: "Oui sans aucun problème. Les produits utilisés sont homologués pour usage en habitacle automobile. On ventile la voiture 15-20 minutes après l'ozonation par précaution standard, et après c'est sans risque pour les enfants comme pour les animaux.",
      },
      {
        q: "C'est urgent — vous pouvez venir aujourd'hui ?",
        a: "Selon notre planning de la journée, oui c'est souvent possible — surtout si vous nous contactez le matin. Envoyez-nous un message WhatsApp avec quelques photos, on vous confirme un créneau dans la journée ou le lendemain.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 J'ai un accident de vomi dans ma voiture, j'aurais besoin d'un traitement urgent à mon domicile à Strasbourg. Vos disponibilités ?",
  },

  // ─── 5. Nettoyer tache café sur siège ─────────────────────────────────
  {
    slug: "nettoyer-tache-cafe-siege-voiture-strasbourg",
    shortName: "Tache de café",
    emoji: "☕",
    metaTitle:
      "Enlever une tache de café sur un siège de voiture à Strasbourg — StrasClean",
    metaDescription:
      "Café renversé sur le siège tissu ou cuir de votre voiture ? StrasClean intervient à domicile à Strasbourg avec injection-extraction pro pour faire disparaître complètement la tache, même séchée. À partir de 49 €.",
    hero: {
      chip: "Détachage café",
      h1: "Enlever une tache de café sur un siège de voiture à Strasbourg.",
      h1Highlight: "sur un siège de voiture.",
      subtitle:
        "Café renversé en démarrant, gobelet basculé dans un virage ? StrasClean détache professionnellement votre siège tissu ou cuir à domicile, sans auréole résiduelle et sans abîmer la matière. Même les taches séchées de plusieurs semaines partent.",
    },
    problem: {
      title: "Pourquoi le café est si difficile à enlever",
      paragraphs: [
        "Le café contient des tanins — des pigments naturels très adhérents aux fibres textiles et au cuir. Quand on renverse un café chaud, la chaleur ouvre les fibres et permet aux tanins de pénétrer en profondeur en quelques secondes. Avec le sucre et le lait éventuel, on a un cocktail de matière organique qui se fixe durablement.",
        "Le réflexe d'éponger immédiatement avec un mouchoir ou une serviette aide à retirer le surplus, mais étale aussi le café autour du point d'impact — créant une auréole qui sera visible pendant des mois. Et si on frotte trop, on peut endommager les fibres du tissu ou décolorer le cuir.",
        "Quelques jours plus tard, la tache a séché et est encore plus tenace. Les produits du commerce (Vanish, lingettes spéciales auto) éclaircissent parfois la zone mais laissent presque toujours une marque visible. Et sur les sièges cuir, beaucoup de produits abîment le grain ou enlèvent la patine.",
      ],
      bullets: [
        "Auréole brune persistante autour du point d'impact",
        "Tache plus sombre au centre, plus claire sur les bords",
        "Odeur de café qui persiste après séchage",
        "Sur cuir : risque de décoloration permanente avec mauvais produit",
        "Sur tissu : fibres collées et rigides au toucher",
        "Effet anti-esthétique majeur, visible immédiatement à chaque entrée",
      ],
    },
    whyDiy: {
      title: "Les pièges du nettoyage maison",
      paragraphs: [
        "La plupart des produits ménagers ou « auto » du commerce contiennent des tensioactifs qui décollent la tache… mais la redéposent en auréole à la périphérie quand ils sèchent. C'est exactement la marque circulaire qu'on retrouve souvent autour d'une tache mal traitée. Pour éviter ça, il faut une extraction immédiate — pas un simple frottage suivi d'un séchage à l'air libre.",
        "Sur un siège cuir, le problème est encore plus délicat. Le cuir réagit mal aux solvants agressifs (acétone, ammoniaque, eau de Javel) qui peuvent décolorer ou craqueler la matière. Il faut un nettoyant pH-neutre spécifique cuir, suivi d'une renutrition. Le faire soi-même sans le bon produit peut transformer une petite tache en zone décolorée permanente.",
      ],
    },
    solution: {
      title: "Le protocole détachage café StrasClean",
      intro:
        "On vient à votre domicile à Strasbourg ou en proche banlieue. L'intervention dure 30 à 50 minutes en équipe de 2 — souvent traitable dans la même session si vous avez aussi un nettoyage intérieur classique en cours. Résultat : zone uniformément propre, sans auréole et sans dommage à la matière.",
      steps: [
        {
          title: "Diagnostic de la tache et du support",
          desc: "Type de café (noir, lait, sucre), ancienneté, type de revêtement (tissu, alcantara, cuir, sky). Chaque combinaison demande un produit et une technique différente.",
        },
        {
          title: "Aspiration et pré-détachage ciblé",
          desc: "Aspiration profonde de la zone, puis application d'un détachant spécifique tanins (sur tissu) ou nettoyant cuir pH-neutre (sur cuir).",
        },
        {
          title: "Injection-extraction (sur tissu)",
          desc: "L'injecteur-extracteur envoie de l'eau additionnée d'un produit, puis aspire immédiatement — sans laisser le moindre résidu en auréole. On répète si nécessaire jusqu'à disparition complète.",
        },
        {
          title: "Détachage cuir spécifique (sur cuir)",
          desc: "Nettoyage doux par mouvements circulaires, puis renutrition du cuir pour redonner souplesse et brillance. Le cuir ressort comme neuf, sans aucune trace.",
        },
        {
          title: "Séchage rapide et vérification",
          desc: "Séchage à l'air pulsé pour éviter toute auréole résiduelle. Vérification de la zone sous différents angles de lumière pour s'assurer du résultat parfait.",
        },
      ],
    },
    pricing: { priceFrom: "49", duration: "30 à 50 min" },
    recommendedServiceSlug: "shampouinage-sieges-voiture",
    faq: [
      {
        q: "Combien de temps après la tache vous pouvez encore l'enlever ?",
        a: "Même après plusieurs mois, on arrive à enlever 95 % des taches de café. Plus c'est récent (moins de 48h), plus c'est facile et rapide. Si vous le pouvez, envoyez-nous une photo de la tache en WhatsApp dès que possible — on vous dit honnêtement si c'est traitable.",
      },
      {
        q: "Vous garantissez qu'aucune auréole ne restera ?",
        a: "Oui, c'est tout l'intérêt de l'injection-extraction professionnelle. La méthode amateur (frotter avec un chiffon humide puis laisser sécher) crée presque systématiquement une auréole. Notre matériel extrait l'eau et le produit avant qu'ils ne sèchent.",
      },
      {
        q: "Le siège sera mouillé après l'intervention ?",
        a: "Très légèrement humide au toucher pendant 1 à 2 heures. La voiture peut être utilisée immédiatement, le séchage complet est obtenu en quelques heures à température ambiante.",
      },
      {
        q: "Pour les sièges cuir, vous utilisez quoi ?",
        a: "Un nettoyant cuir pH-neutre professionnel — typiquement Sonax Leather Care ou Colourlock selon la couleur du cuir. Suivi d'un produit nourrissant pour redonner souplesse au cuir et éviter qu'il ne sèche.",
      },
      {
        q: "Si la tache est seule, ça vaut le coup de tout faire ?",
        a: "Si c'est juste une tache isolée et que le reste de votre véhicule est propre, on peut faire une intervention « détachage seul » à 49 €. Sinon, c'est souvent intéressant de combiner avec un shampouinage complet des sièges (69 €) qui uniformise toute la voiture en une fois.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 J'ai renversé du café sur mon siège, je voudrais un détachage à mon domicile à Strasbourg. Vos disponibilités cette semaine ?",
  },

  // ─── 6. Enlever traces d'eau sur vitres ───────────────────────────────
  {
    slug: "enlever-traces-eau-vitres-voiture-strasbourg",
    shortName: "Traces d'eau vitres",
    emoji: "💧",
    metaTitle:
      "Enlever les traces d'eau sur les vitres de voiture à Strasbourg — StrasClean",
    metaDescription:
      "Traces blanches de calcaire ou auréoles d'eau de pluie sur vos vitres et carrosserie ? StrasClean traite la décontamination minérale à domicile à Strasbourg. Vitres et carrosserie cristallines. À partir de 39 €.",
    hero: {
      chip: "Décontamination minérale",
      h1: "Enlever les traces d'eau sur les vitres de votre voiture à Strasbourg.",
      h1Highlight: "sur vos vitres.",
      subtitle:
        "Traces blanches après une pluie, auréoles de calcaire après un lavage en station, dépôts minéraux sur le pare-brise et la carrosserie ? StrasClean intervient à domicile à Strasbourg avec un protocole de décontamination minérale qui élimine définitivement les dépôts sans rayer.",
    },
    problem: {
      title: "Ces traces blanches qui résistent à tout",
      paragraphs: [
        "L'eau du robinet et l'eau de pluie contiennent du calcaire et des minéraux dissous. Quand l'eau sèche au soleil sur une vitre ou une carrosserie, elle s'évapore et laisse derrière elle ces minéraux — ce sont les fameuses traces blanches. Plus la voiture est chaude, plus le dépôt est marqué et difficile à enlever.",
        "À Strasbourg, l'eau est calcaire (TH élevé en Alsace) — donc particulièrement agressive pour les vitres et la carrosserie. Une voiture lavée à la station puis laissée sécher au soleil ressort presque toujours avec des traces. De même pour une voiture garée dehors lors d'une averse suivie d'éclaircies en été.",
        "Un essuie-glace ou un coup de raclette ne suffit jamais : le dépôt minéral est chimiquement lié au verre ou au vernis. Il faut un produit acide spécifique (à base d'acide oxalique ou citrique dilué) pour le décrocher — et le bon protocole pour ne pas attaquer le vernis ou les joints.",
      ],
      bullets: [
        "Vitres tachetées de points blancs visibles à contre-jour",
        "Pare-brise voilé qui dégrade la visibilité, surtout face au soleil",
        "Carrosserie marquée d'auréoles blanches sur peinture sombre",
        "Optiques jaunies ou tachetées par le calcaire",
        "Effet « sale » même immédiatement après un lavage",
        "Phénomène qui empire à chaque pluie/lavage si non traité",
      ],
    },
    whyDiy: {
      title: "Pourquoi le produit lave-vitre ne suffit pas",
      paragraphs: [
        "Les produits lave-vitres classiques (à base d'ammoniaque ou d'alcool) sont conçus pour les salissures organiques (graisse, poussière, traces de doigts). Ils sont inefficaces contre les dépôts minéraux qui demandent une chimie acide pour être dissous. Vous pouvez essuyer pendant des heures, les traces blanches reviennent dès le premier rayon de soleil.",
        "Sur la carrosserie, le problème est encore plus délicat. Le vernis peut être attaqué par un acide trop concentré ou trop longtemps laissé en contact. Il faut un produit professionnel dosé (type IronX ou équivalent), un temps d'action contrôlé, et un rinçage immédiat. C'est exactement ce qu'on appelle la décontamination minérale en detailing pro.",
      ],
    },
    solution: {
      title: "Le protocole décontamination minérale StrasClean",
      intro:
        "On vient à votre domicile à Strasbourg ou en proche banlieue. L'intervention dure 30 min à 1 h selon la surface à traiter (vitres seules, ou vitres + carrosserie + optiques). On travaille en équipe de 2. Résultat : vitres cristallines, carrosserie débarrassée des auréoles, optiques claires.",
      steps: [
        {
          title: "Diagnostic des zones touchées",
          desc: "Identification des dépôts minéraux : vitres uniquement, carrosserie, optiques, joints. Chaque surface demande une dilution et un temps d'action spécifique.",
        },
        {
          title: "Pré-lavage et dégraissage",
          desc: "Lavage classique préalable pour éliminer poussière et graisse — sinon le décontaminant minéral réagit aussi avec les salissures organiques et perd en efficacité.",
        },
        {
          title: "Décontamination minérale ciblée",
          desc: "Application d'un produit acide professionnel (IronX, Koch Chemie ou équivalent) sur les zones traitées. Temps d'action contrôlé (2-5 min selon support).",
        },
        {
          title: "Frottage à la microfibre dédiée",
          desc: "Microfibre dédiée pour décontamination minérale (jamais réutilisée pour autre chose). Mouvements doux pour ne pas marquer la surface.",
        },
        {
          title: "Rinçage abondant et séchage",
          desc: "Rinçage à l'eau claire (eau déminéralisée idéalement pour éviter de re-déposer du calcaire). Séchage immédiat à la microfibre pour finition cristalline.",
        },
        {
          title: "Protection anti-pluie optionnelle",
          desc: "Sur demande : application d'un traitement hydrophobe type Rain-X pro qui fait perler l'eau sur le pare-brise. Effet durable 2-3 mois, ralentit la réapparition des traces.",
        },
      ],
    },
    pricing: { priceFrom: "39", duration: "30 min à 1 h" },
    recommendedServiceSlug: "lavage-exterieur-voiture",
    faq: [
      {
        q: "Le traitement marche-t-il sur tous types de vitres ?",
        a: "Oui — pare-brise, vitres latérales, lunette arrière. Sur les vitres teintées d'origine, c'est même très efficace. Pour les vitres teintées par film adhésif (post-vente), on adapte la technique pour ne pas décoller le film.",
      },
      {
        q: "Quelle différence avec un simple lavage ?",
        a: "Un lavage classique enlève la saleté en surface (poussière, graisse, insectes). La décontamination minérale dissout chimiquement les dépôts incrustés dans le matériau — ce qu'aucun lavage classique ne peut faire, même répété 10 fois.",
      },
      {
        q: "Combien de temps avant que les traces reviennent ?",
        a: "Si vous lavez ensuite avec de l'eau du robinet et que vous laissez sécher au soleil, les traces reviennent en 1-2 lavages. Avec une protection hydrophobe (Rain-X pro), comptez 2-3 mois de tranquillité. Sinon, traitement à refaire tous les 6-12 mois selon l'usage.",
      },
      {
        q: "Vous pouvez traiter aussi mes optiques jaunies ?",
        a: "Si elles sont ternies par du calcaire, oui — c'est inclus dans la même intervention. Si elles sont vraiment jaunies par l'oxydation du polycarbonate (phares âgés), c'est un polissage différent qu'on peut faire en complément (rénovation optiques à 39 € la paire).",
      },
      {
        q: "Le produit utilisé est-il dangereux pour la peinture ?",
        a: "Non si l'utilisateur connaît son métier. Les produits pro sont conçus pour agir sur le calcaire sans attaquer le vernis si le temps d'action et la concentration sont respectés. Ne tentez pas avec un produit du commerce ou un détartrant ménager — ces produits sont trop agressifs pour la peinture auto.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 J'ai des traces blanches sur mes vitres / carrosserie, je voudrais une décontamination à mon domicile à Strasbourg. Vos disponibilités cette semaine ?",
  },

  // ─── 7. Nettoyage SUV à domicile ──────────────────────────────────────
  {
    slug: "nettoyage-suv-domicile-strasbourg",
    shortName: "Nettoyage SUV",
    emoji: "🚙",
    metaTitle:
      "Nettoyage SUV à domicile à Strasbourg — StrasClean",
    metaDescription:
      "Votre SUV (Tucson, X3, Q5, GLC, 3008, etc.) demande un protocole adapté : plus de surface, sièges 3e rang, coffre famille. StrasClean intervient à domicile à Strasbourg avec un forfait SUV dédié. À partir de 89 €.",
    hero: {
      chip: "Forfait SUV dédié",
      h1: "Nettoyage SUV à domicile à Strasbourg.",
      h1Highlight: "à domicile à Strasbourg.",
      subtitle:
        "Plus grand, plus haut, plus utilisé en famille : un SUV n'est pas une berline. StrasClean propose un forfait spécifique SUV — sièges 3e rang inclus, coffre famille, passages de roue plus larges — sans surcoût caché. À domicile, en équipe de 2, en moins de 2 heures.",
    },
    problem: {
      title: "Un SUV demande plus qu'une berline",
      paragraphs: [
        "Un SUV moderne, c'est en moyenne 25 à 35 % de surface intérieure en plus qu'une berline équivalente. Plus de sièges (5 ou 7), un coffre plus volumineux, des passages de roue plus marqués, et souvent une utilisation familiale intensive — courses, enfants, sport, animaux. Résultat : la salissure s'accumule plus vite et sur plus de zones.",
        "Le problème, c'est que beaucoup de detailers ou stations de lavage facturent un SUV au même prix qu'une berline, mais en faisant un travail bâclé pour rentrer dans le temps. Conséquence : la 3e rangée n'est jamais vraiment nettoyée, les passages de roue restent sales, et le coffre ne reçoit qu'un coup d'aspirateur superficiel.",
        "À l'inverse, certaines stations facturent un supplément SUV punitif (+30 à +50 €) sans en faire vraiment plus — juste parce que le véhicule est plus haut. Chez StrasClean, on a un forfait SUV transparent : on annonce le bon prix au départ, on prend le temps qu'il faut (en équipe de 2 pour aller vite), et on traite vraiment toutes les zones spécifiques aux SUV.",
      ],
      bullets: [
        "3e rangée de sièges souvent oubliée par les nettoyages standards",
        "Coffre famille avec résidus alimentaires, sable, herbe, jouets",
        "Passages de roue plus larges, plus exposés à la boue et au sel",
        "Sièges enfants et coques bébé qui marquent les sièges arrière",
        "Hauteur du véhicule qui complique le lavage extérieur (toit + montants)",
        "Tarif souvent surfacturé sans qualité supérieure en station",
      ],
    },
    whyDiy: {
      title: "Pourquoi un nettoyage SUV demande du matériel adapté",
      paragraphs: [
        "Pour nettoyer correctement un SUV, il faut un aspirateur professionnel avec une bonne longueur de tuyau (pour atteindre le fond du coffre et la 3e rangée), un injecteur-extracteur portable pour les sièges et la moquette du coffre, des brosses adaptées pour les passages de roue marqués, et un escabeau ou perche pour atteindre le toit en lavage extérieur. C'est un équipement complet — bien au-delà d'un seau et d'une éponge.",
        "Le temps nécessaire est aussi sous-estimé. Une berline propre se fait en 1h-1h30. Un SUV équivalent en condition similaire demande 1h45 à 2h30 — c'est mathématique, il y a plus à nettoyer. Tenter de le faire seul en station à 5 €/30 min, c'est garanti d'arriver à la fin du chrono avec la 3e rangée et le coffre encore sales.",
      ],
    },
    solution: {
      title: "Le forfait SUV StrasClean",
      intro:
        "On vient à votre domicile à Strasbourg ou en proche banlieue avec tout le matériel adapté SUV. Comptez 1h30 à 2 h sur place en équipe de 2 — donc fini en une matinée ou un après-midi. Tarif transparent annoncé d'avance, sans mauvaise surprise. Le forfait inclut toutes les zones spécifiques SUV (3e rangée, coffre famille, passages de roue, toit).",
      steps: [
        {
          title: "Aspiration complète 3 rangées + coffre",
          desc: "Toutes les rangées de sièges (jusqu'à 7 places), coffre famille, passages de portière. Embouts longs pour atteindre tous les recoins.",
        },
        {
          title: "Shampouinage des sièges les plus marqués",
          desc: "Sièges enfants, places des animaux, taches alimentaires — traitement injection-extraction localisé sur les zones les plus sales.",
        },
        {
          title: "Nettoyage profond du coffre",
          desc: "Tapis de coffre démonté et lavé, parois aspirées et désinfectées, traitement des plis et des recoins où s'accumulent miettes, sable, herbe.",
        },
        {
          title: "Plastiques et tableau de bord",
          desc: "Dégraissage et dressing des plastiques (souvent foncés et marqués sur SUV). Tableau de bord, console centrale, contre-portes, accoudoirs.",
        },
        {
          title: "Vitres intérieures sans traces",
          desc: "Toutes les vitres (y compris la lunette arrière souvent oubliée) — point critique sur SUV à cause de la hauteur de toit.",
        },
        {
          title: "Désodorisation adaptée famille",
          desc: "Produit neutre sans odeur forte (les enfants ne supportent pas les parfums lourds). Désinfection bactéricide des points de contact.",
        },
      ],
    },
    pricing: { priceFrom: "89", duration: "1h30 à 2 h" },
    recommendedServiceSlug: "nettoyage-interieur-voiture",
    faq: [
      {
        q: "Quels SUV traitez-vous ?",
        a: "Tous : compacts (Captur, Tucson, 2008), familiaux (3008, X3, Q5, GLC, Tiguan), grands SUV (X5, Q7, GLE, Touareg), et 7 places (Kodiaq, Tarraco, X7). Le tarif s'adapte au gabarit — on annonce le prix exact selon votre modèle au moment de la réservation.",
      },
      {
        q: "Quelle différence avec une berline en tarif ?",
        a: "Comptez +15 à +30 € selon le gabarit du SUV. C'est moins que les +30 à +50 € souvent pratiqués en station, et pour un travail bien plus complet. La 3e rangée et le coffre famille sont inclus, pas en option payante.",
      },
      {
        q: "Vous démontez les sièges enfants ?",
        a: "On peut, mais on préfère que vous les ayez retirés à notre arrivée — pour des raisons de responsabilité (mauvaise réinstallation = danger). Si vous ne pouvez pas, on travaille autour proprement.",
      },
      {
        q: "Mon SUV est garé dans un garage souterrain, c'est possible ?",
        a: "Oui sans problème — on a tout le matériel mobile et nous avons juste besoin d'une prise électrique à proximité. Vérifiez juste la hauteur du garage (notre matériel tient dans un véhicule standard).",
      },
      {
        q: "Vous lavez aussi l'extérieur du SUV ?",
        a: "L'intérieur SUV est inclus dans le forfait de base. L'extérieur (lavage main + carrosserie) est en option (+30 €) ou inclus si vous prenez la formule Luxury Detailing complète à 169 € pour SUV.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 J'ai un SUV, je voudrais un nettoyage complet à mon domicile à Strasbourg. Vos disponibilités cette semaine ?",
  },

  // ─── 8. Nettoyage utilitaire à domicile ───────────────────────────────
  {
    slug: "nettoyage-utilitaire-domicile-strasbourg",
    shortName: "Nettoyage utilitaire",
    emoji: "🚐",
    metaTitle:
      "Nettoyage utilitaire à domicile à Strasbourg — StrasClean",
    metaDescription:
      "Kangoo, Trafic, Master, Berlingo, Partner, Boxer ? StrasClean nettoie votre utilitaire pro à votre dépôt ou chantier à Strasbourg. Cabine + zone de chargement + résidus pro. Devis adapté pour pros et artisans. À partir de 79 €.",
    hero: {
      chip: "Forfait utilitaire pro",
      h1: "Nettoyage utilitaire à domicile à Strasbourg.",
      h1Highlight: "utilitaire pro.",
      subtitle:
        "Artisan, livreur, paysagiste, plombier ? Votre utilitaire mérite mieux qu'un coup de jet. StrasClean intervient à votre dépôt, chantier ou domicile à Strasbourg avec un protocole spécifique : cabine + zone de chargement + traitement des résidus professionnels. Sans déplacement, sans perte de temps.",
    },
    problem: {
      title: "Un utilitaire pro n'est pas une voiture comme les autres",
      paragraphs: [
        "Un Kangoo, Trafic, Master ou Boxer accumule des salissures que les voitures particulières ne connaissent pas : résidus de chantier (plâtre, ciment, peinture, copeaux de bois), graisses techniques, terre et boue, taches d'huile, odeurs de matériel, sueur de journée de travail. La cabine fait office de bureau, vestiaire, salle à manger et coffre à outils en même temps.",
        "Le résultat, après quelques mois d'usage intensif : sièges marqués, plastiques noircis, moquette saturée, tableau de bord couvert de poussière fine, et zone de chargement où s'accumulent débris et taches. À la revente, ça peut coûter 1 000 à 3 000 € de moins qu'un véhicule propre.",
        "Au-delà du prix de revente, un utilitaire propre fait une vraie différence sur l'image professionnelle. Un client qui vous voit arriver dans un véhicule impeccable a confiance dans votre travail. C'est gratuit en termes de marketing, mais ça demande un nettoyage régulier — qu'un artisan n'a souvent pas le temps de faire lui-même.",
      ],
      bullets: [
        "Résidus de chantier dans la cabine et la zone de chargement",
        "Sièges marqués par le quotidien (sueur, taches, accrocs)",
        "Plastiques tableau de bord couverts de poussière fine de matériaux",
        "Odeurs de matériel ou de produits techniques persistantes",
        "Vitres sales qui dégradent l'image professionnelle",
        "Perte de valeur à la revente (1 000-3 000 € sur un utilitaire moyen)",
      ],
    },
    whyDiy: {
      title: "Pourquoi externaliser le nettoyage de votre utilitaire",
      paragraphs: [
        "Pour un artisan, chaque heure passée à nettoyer son véhicule est une heure non facturée. Si vous facturez 50-80 €/h en tant que pro, passer 2-3 heures à nettoyer votre Kangoo représente un manque à gagner de 100-240 €. Pour 79-129 € HT, vous récupérez ces heures + un travail mieux fait.",
        "Surtout, certains résidus pro (peinture séchée, plâtre, ciment, mastic, graisse) demandent des produits spécifiques que vous n'avez pas forcément. Tenter de les enlever avec un produit ménager classique peut rayer la peinture ou enlever les marquages publicitaires. Un detailer pro sait quel produit utiliser sur quoi.",
      ],
    },
    solution: {
      title: "Le forfait utilitaire StrasClean",
      intro:
        "On vient à votre dépôt, chantier ou domicile à Strasbourg ou en proche banlieue. Intervention de 1h à 1h30 en équipe de 2 — pendant que vous travaillez ou en fin de journée. Facture pro (avec TVA récupérable). Tarif adapté à la taille de l'utilitaire (de Kangoo à Master/Boxer).",
      steps: [
        {
          title: "Nettoyage cabine complet",
          desc: "Aspiration profonde, dégraissage du tableau de bord, traitement des plastiques, nettoyage des contre-portes, vitres intérieures sans traces.",
        },
        {
          title: "Shampouinage des sièges et tapis",
          desc: "Sièges marqués par l'usage quotidien — injection-extraction sur les zones les plus sales, traitement des taches et de la sueur incrustée.",
        },
        {
          title: "Zone de chargement",
          desc: "Aspiration et désinfection. Selon votre activité : enlèvement des résidus (poussière de plâtre, copeaux, débris), dégraissage si nécessaire.",
        },
        {
          title: "Traitement des odeurs pro",
          desc: "Odeurs de peinture, solvants, matériaux ou simplement de journée de travail — neutralisation à la source par produits enzymatiques.",
        },
        {
          title: "Vitres extérieures + rétroviseurs",
          desc: "Souvent négligées sur utilitaire. Indispensable pour la sécurité et l'image pro.",
        },
        {
          title: "Lavage extérieur si demandé",
          desc: "En option : lavage main de la carrosserie, dégraissage des passages de roue, traitement des marquages publicitaires (respect des stickers).",
        },
      ],
    },
    pricing: { priceFrom: "79", duration: "1 h à 1h30" },
    recommendedServiceSlug: "nettoyage-interieur-voiture",
    faq: [
      {
        q: "Vous traitez les artisans avec résidus de chantier ?",
        a: "Oui — c'est même notre spécialité utilitaire. On a les produits pour le plâtre, le ciment séché, la peinture, les graisses techniques, les copeaux. Pour les véhicules très chargés, on peut prévoir une intervention plus longue (devis adapté).",
      },
      {
        q: "Vous pouvez intervenir sur mon chantier ?",
        a: "Oui, à condition d'avoir un accès stationnement et une prise électrique. On adapte l'intervention selon vos horaires (tôt le matin, sur la pause déjeuner, en fin de journée). Beaucoup d'artisans préfèrent qu'on vienne pendant qu'ils travaillent sur le chantier.",
      },
      {
        q: "Vous faites des contrats récurrents ?",
        a: "Oui, on peut mettre en place un entretien régulier (toutes les 4, 6 ou 8 semaines) à tarif préférentiel. Idéal pour les flottes ou les artisans qui veulent garder leur véhicule pro toute l'année. Contactez-nous pour un devis personnalisé.",
      },
      {
        q: "Vous fournissez une facture pro avec TVA ?",
        a: "Oui, facture pro avec TVA 20 % détaillée — déductible si votre véhicule est inscrit à votre activité. Paiement par CB, virement ou espèces. SIRET et coordonnées complètes sur la facture.",
      },
      {
        q: "Quels utilitaires traitez-vous ?",
        a: "Tous : Kangoo, Berlingo, Partner, Caddy (petits), Trafic, Vivaro, Expert, Jumpy, Transporter (moyens), Master, Movano, Boxer, Jumper, Ducato, Sprinter (grands). Le tarif s'adapte au gabarit.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 J'ai un utilitaire pro, je voudrais un nettoyage complet (avec facture pro). Vos disponibilités à Strasbourg cette semaine ?",
  },

  // ─── 9. Nettoyage voiture électrique ──────────────────────────────────
  {
    slug: "nettoyage-voiture-electrique-strasbourg",
    shortName: "Voiture électrique",
    emoji: "⚡",
    metaTitle:
      "Nettoyage voiture électrique à domicile à Strasbourg — StrasClean",
    metaDescription:
      "Tesla, ID.3/4, e-208, Megane E-Tech, Zoé ? Nettoyage adapté à votre véhicule électrique à domicile à Strasbourg : produits compatibles, précautions batterie HV, écrans tactiles. À partir de 49 €.",
    hero: {
      chip: "Adapté véhicules électriques",
      h1: "Nettoyage voiture électrique à domicile à Strasbourg.",
      h1Highlight: "voiture électrique.",
      subtitle:
        "Tesla, ID.3, Megane E-Tech, Zoé, e-208 ? Une voiture électrique demande des précautions spécifiques : produits compatibles écrans tactiles, distances de sécurité avec la batterie haute tension, protection des prises de recharge. StrasClean intervient à domicile à Strasbourg avec un protocole adapté.",
    },
    problem: {
      title: "Pourquoi une voiture électrique demande un nettoyage différent",
      paragraphs: [
        "Une voiture électrique moderne intègre des composants sensibles que les véhicules thermiques n'ont pas : grand écran tactile central (souvent 15 à 17 pouces), batterie haute tension sous le plancher, prises de recharge AC/DC, capteurs lidars/radars pour la conduite assistée, et finitions premium plus fragiles aux produits agressifs.",
        "Beaucoup de stations de lavage et de detailers utilisent encore des produits standards conçus pour les véhicules thermiques classiques. Résultat possible sur un véhicule électrique : écran tactile rayé par un produit incompatible, finitions matifiées, ou problèmes électriques mineurs liés à une infiltration d'eau dans une zone sensible.",
        "Pour un propriétaire de Tesla Model 3/Y, ID.4, Megane E-Tech ou Ioniq 5, c'est un risque réel — d'autant que la valeur du véhicule est élevée et que les pièces de remplacement (écran tactile notamment) coûtent extrêmement cher. Mieux vaut un nettoyage adapté qu'une économie de 20 € qui coûte 2 000 € en réparation.",
      ],
      bullets: [
        "Écran tactile central sensible aux produits standards (alcool, ammoniaque)",
        "Batterie haute tension sous le plancher — pas d'eau à proximité",
        "Prises de recharge à protéger pendant le lavage extérieur",
        "Capteurs lidars/radars sensibles aux produits gras ou abrasifs",
        "Finitions premium (cuir vegan, alcantara) qui demandent produits adaptés",
        "Risques coûteux si nettoyage standard mal exécuté",
      ],
    },
    whyDiy: {
      title: "Les pièges du nettoyage standard sur véhicule électrique",
      paragraphs: [
        "Le premier piège, c'est l'écran tactile. Un produit lave-vitres classique (à base d'alcool ou d'ammoniaque) attaque le revêtement oléophobe de l'écran qui repousse les traces de doigts. Une fois enlevé, l'écran devient terne et garde toutes les traces — exactement comme un smartphone dont on aurait abîmé la couche oléophobe.",
        "Le deuxième, c'est la batterie. Même si elle est protégée d'origine contre les éclaboussures, on évite tout nettoyeur haute pression dirigé sur le plancher ou les bas de caisse. Et lors du nettoyage extérieur, on vérifie que la trappe de recharge est bien fermée. Ces précautions sont basiques mais souvent ignorées en station classique.",
      ],
    },
    solution: {
      title: "Le protocole véhicule électrique StrasClean",
      intro:
        "On intervient à votre domicile à Strasbourg ou en proche banlieue avec un protocole adapté aux voitures électriques modernes. Produits pH-neutre compatibles écrans tactiles, nettoyant antistatique pour les capteurs, précautions standards autour de la batterie et des prises de recharge. Intervention en équipe de 2, généralement 1h-1h30.",
      steps: [
        {
          title: "Diagnostic spécifique électrique",
          desc: "Identification des zones sensibles selon le modèle (écran central, capteurs, trappe de charge). Adaptation du protocole à votre véhicule (Tesla, VW ID, Renault, Hyundai/Kia, etc.).",
        },
        {
          title: "Aspiration complète intérieur",
          desc: "Sièges, moquettes, coffre — protocole identique à un véhicule thermique. Pas de risque particulier ici.",
        },
        {
          title: "Nettoyage écran tactile dédié",
          desc: "Produit pH-neutre compatible avec le revêtement oléophobe, microfibre dédiée écrans. On préserve la sensibilité tactile et l'absence de traces.",
        },
        {
          title: "Plastiques et finitions premium",
          desc: "Produit doux compatible alcantara/cuir vegan. Dressing des plastiques sans laisser de film gras qui pourrait gêner les capteurs.",
        },
        {
          title: "Lavage extérieur sécurisé",
          desc: "Lavage main classique (pas de jet haute pression sur le bas de caisse ni vers la trappe de charge). Décontamination des capteurs avant et arrière sans produit agressif.",
        },
        {
          title: "Vitres et optiques",
          desc: "Vitres intérieures et extérieures sans alcool ni ammoniaque. Optiques nettoyées avec produit doux pour préserver les revêtements anti-UV des phares LED matriciels.",
        },
      ],
    },
    pricing: { priceFrom: "49", duration: "1 h à 1h30" },
    recommendedServiceSlug: "nettoyage-interieur-voiture",
    faq: [
      {
        q: "Vous traitez tous les modèles de voitures électriques ?",
        a: "Oui : Tesla (Model 3, Y, S, X), Volkswagen (ID.3, ID.4, ID.5, ID.7), Renault (Zoé, Megane E-Tech, Scénic E-Tech), Peugeot (e-208, e-2008, e-3008), Hyundai/Kia (Ioniq 5/6, EV6), BMW i3/i4/iX, Audi e-tron Q4/Q6/Q8, Mercedes EQS/EQE, etc. Le protocole s'adapte au modèle.",
      },
      {
        q: "Vous pouvez intervenir pendant que ma voiture est en charge ?",
        a: "Oui sans problème — c'est même pratique pour vous. On adapte le nettoyage intérieur autour du temps de charge. Pour l'extérieur, on évite simplement la zone de la trappe ouverte.",
      },
      {
        q: "Les produits sont-ils compatibles avec l'écran de ma Tesla ?",
        a: "Oui — on utilise un nettoyant écran tactile professionnel pH-neutre, sans alcool ni ammoniaque, validé pour les écrans tactiles automobiles modernes. Aucun risque pour le revêtement oléophobe.",
      },
      {
        q: "Le tarif est-il différent d'un véhicule thermique ?",
        a: "Quasiment identique — la formule de base démarre à 49 € comme pour un véhicule thermique équivalent. C'est juste le protocole qui change, pas le prix. La précision de notre protocole VE est un service inclus, pas un supplément.",
      },
      {
        q: "Vous nettoyez aussi le coffre avant (frunk) ?",
        a: "Oui, le frunk est inclus dans le nettoyage standard. Aspiration et désinfection. C'est une zone souvent oubliée par les nettoyages classiques car elle n'existe pas sur les véhicules thermiques.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 J'ai une voiture électrique, je voudrais un nettoyage complet adapté à mon domicile à Strasbourg. Vos disponibilités cette semaine ?",
  },

  // ─── 10. Nettoyage voiture de luxe ────────────────────────────────────
  {
    slug: "nettoyage-voiture-luxe-strasbourg",
    shortName: "Voiture de luxe",
    emoji: "💎",
    metaTitle:
      "Nettoyage voiture de luxe à domicile à Strasbourg — StrasClean",
    metaDescription:
      "Porsche, Mercedes AMG, BMW M, Audi RS, Range Rover ? Detailing premium à domicile à Strasbourg avec produits haut de gamme, lavage à la main et finition concours. À partir de 169 €.",
    hero: {
      chip: "Detailing premium",
      h1: "Nettoyage voiture de luxe à domicile à Strasbourg.",
      h1Highlight: "voiture de luxe.",
      subtitle:
        "Porsche, Mercedes AMG, BMW M, Audi RS, Range Rover, Maserati ? Votre véhicule mérite un detailing à la hauteur. StrasClean intervient à votre garage privé à Strasbourg avec des produits premium, un protocole lent et minutieux, et une finition concours — sans aucun risque pour la peinture ou les finitions précieuses.",
    },
    problem: {
      title: "Une voiture de luxe ne se confie pas à n'importe qui",
      paragraphs: [
        "Une Porsche 911, une Mercedes AMG ou une Range Rover Autobiography, ce n'est pas une voiture banale. Peinture multi-couches (souvent 5 à 7 couches avec vernis céramique), cuirs Nappa ou semi-aniline aux traitements spécifiques, jantes en alliage léger forgé, optiques laser à 3 000 € pièce, capteurs ADAS à recalibrer en cas de mauvaise manipulation. Chaque détail compte et chaque erreur coûte cher.",
        "Le réflexe « station de lavage automatique » est catastrophique sur ces véhicules : les brosses rotatives créent des swirls et hologrammes visibles dès la première séance, les produits standards attaquent les vernis céramique d'origine, et les chiffons mal entretenus rayent les surfaces vitrées. Une seule mauvaise expérience peut détruire des milliers d'euros de finition.",
        "À l'inverse, un detailing premium réalisé par un professionnel formé sur les véhicules d'exception préserve et magnifie votre véhicule : peinture qui retrouve son éclat de showroom, cuirs nourris et protégés, jantes débarrassées des poussières de freins sans abrasion. C'est exactement la prestation que propose StrasClean pour les propriétaires exigeants.",
      ],
      bullets: [
        "Peinture multi-couches sensible aux brosses et chiffons standards",
        "Cuirs précieux (Nappa, semi-aniline) qui demandent produits dédiés",
        "Jantes forgées en alliage léger sensibles aux acides agressifs",
        "Optiques laser/LED matriciels à manipuler avec précaution",
        "Vernis céramique d'origine à préserver — pas à dégrader",
        "Valeur du véhicule qui dépend de la qualité d'entretien visible",
      ],
    },
    whyDiy: {
      title: "Le piège du detailing « low cost » sur véhicule premium",
      paragraphs: [
        "Beaucoup de detailers proposent du « detailing premium » sans avoir ni la formation, ni les produits, ni le matériel adapté aux véhicules de luxe modernes. Le résultat est souvent visible sous l'éclairage adapté (lampe à LED 6500K) : swirls superficiels, hologrammes de polissage, traces sur les vitres latérales arrière difficiles d'accès, cuirs lustrés au lieu d'être protégés.",
        "Pour vraiment traiter une voiture de luxe, il faut des produits premium (Gyeon, Koch Chemie pro, Sonax Profiline, Adam's Polishes), des microfibres de qualité concours (jamais réutilisées entre véhicules), une polisseuse rotative et orbitale, et surtout du temps — un detailing premium sérieux demande 3 à 5 heures par véhicule. Pas 30 minutes au tunnel.",
      ],
    },
    solution: {
      title: "Le pack premium concours StrasClean",
      intro:
        "On vient à votre garage privé ou à votre domicile à Strasbourg ou en proche banlieue. Intervention de 3 à 4 h en équipe de 2 — nous prenons le temps qu'il faut pour un résultat concours. Produits premium uniquement (Koch Chemie, Gyeon, Sonax). Tarif transparent à partir de 169 € selon votre véhicule et l'état initial.",
      steps: [
        {
          title: "Diagnostic peinture et carrosserie",
          desc: "Inspection sous éclairage LED 6500K pour identifier swirls, micro-rayures, contaminants. Documentation photo avant intervention.",
        },
        {
          title: "Lavage main 2 seaux + microfibre concours",
          desc: "Pré-lavage à la mousse, lavage manuel à la microfibre premium, rinçage à l'eau déminéralisée si nécessaire. Aucune brosse, aucun risque de swirl.",
        },
        {
          title: "Décontamination chimique + clay bar",
          desc: "Décontaminant ferreux pour les particules métalliques (freinage), clay bar professionnel pour les contaminants organiques. La peinture redevient « lisse comme du verre ».",
        },
        {
          title: "Polissage léger si nécessaire",
          desc: "Atténuation des micro-rayures à la polisseuse orbitale (sans agressivité). Pas de polissage abrasif sans accord préalable — on préserve le vernis d'origine.",
        },
        {
          title: "Cuirs : nettoyage + nutrition + protection",
          desc: "Nettoyant cuir pH-neutre, baume nourrissant Koch Chemie/Gyeon, protection hydrophobe. Pour les cuirs Nappa et semi-aniline, produits dédiés sans risque de tachage.",
        },
        {
          title: "Jantes : décontamination + protection céramique",
          desc: "Nettoyage des jantes sans acide agressif (Koch Chemie Reactive Wheel Cleaner ou équivalent). Option : protection céramique courte durée pour faciliter l'entretien.",
        },
        {
          title: "Plastiques intérieurs + carbone forgé",
          desc: "Dressing premium sans brillance excessive (effet satiné mat haut de gamme). Pour les finitions carbone forgé/véritable, produit sans solvant.",
        },
        {
          title: "Finition : protection hydrophobe carrosserie",
          desc: "Application d'une cire ou sealant Gyeon Wet Coat / Sonax HCQ pour protection hydrophobe 2-4 semaines. Option : protection céramique 6-12 mois en supplément.",
        },
      ],
    },
    pricing: { priceFrom: "169", duration: "3 h à 4 h" },
    recommendedServiceSlug: "detailing-auto",
    faq: [
      {
        q: "Vous traitez quels véhicules de luxe ?",
        a: "Tous : Porsche (911, Cayenne, Taycan, Macan, Panamera), Mercedes-AMG (E63, GT, G63, S65), BMW M (M3, M4, M5, X5M, X6M), Audi RS (RS3, RS6, RS Q8, R8), Range Rover (Sport, Velar, Autobiography), Maserati, Aston Martin, Bentley, Tesla Plaid, Lamborghini Urus, Ferrari, etc. Devis personnalisé selon votre véhicule.",
      },
      {
        q: "Vous touchez à mon vernis céramique d'origine ?",
        a: "Non — on le préserve. Tous nos produits de lavage sont compatibles avec les revêtements céramique d'origine. Si votre véhicule a un revêtement céramique récent, on peut même le booster avec un produit d'entretien dédié (Gyeon Cure ou équivalent).",
      },
      {
        q: "Quelles assurances avez-vous ?",
        a: "Responsabilité civile professionnelle qui couvre les dommages éventuels pendant l'intervention. On documente l'état du véhicule à l'arrivée par photos pour transparence totale. Aucun incident à ce jour.",
      },
      {
        q: "Possibilité d'une protection céramique professionnelle ?",
        a: "Oui — sur devis. Protection céramique 6 mois (CarPro Reload), 1 an (Gyeon One) ou 2-3 ans (Gyeon Mohs/Quartz). Compter de +89 € (protection courte durée) à +349 € (protection longue durée 2 couches).",
      },
      {
        q: "L'intervention se fait obligatoirement à mon domicile ?",
        a: "Idéalement oui, dans votre garage privé pour la qualité de lumière et la propreté de l'environnement. On peut aussi intervenir en extérieur si conditions météo favorables (pas de pluie, pas de soleil direct écrasant). Devis adapté selon les conditions.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 J'ai une voiture haut de gamme, je voudrais un detailing premium à mon domicile à Strasbourg. Vos disponibilités ?",
  },

  // ─── 11. Page prix consolidée ─────────────────────────────────────────
  {
    slug: "prix-nettoyage-voiture-domicile-strasbourg",
    shortName: "Prix nettoyage",
    emoji: "💶",
    metaTitle:
      "Prix nettoyage voiture à domicile à Strasbourg — Tarifs StrasClean 2026",
    metaDescription:
      "Combien coûte un nettoyage de voiture à domicile à Strasbourg ? Tarifs détaillés par formule (39-119 €), par taille de véhicule (citadine, berline, SUV, utilitaire) et par prestation à la carte. Sans frais cachés.",
    hero: {
      chip: "Tarifs 2026 détaillés",
      h1: "Prix d'un nettoyage de voiture à domicile à Strasbourg.",
      h1Highlight: "à domicile à Strasbourg.",
      subtitle:
        "Combien coûte vraiment un nettoyage auto à domicile à Strasbourg en 2026 ? On vous donne tous les tarifs — par formule, par taille de véhicule, et par prestation à l'unité. Sans frais cachés, sans surcoût surprise sur place. Le prix annoncé est le prix payé.",
    },
    problem: {
      title: "Le flou des tarifs dans le nettoyage automobile",
      paragraphs: [
        "Quand on cherche un nettoyage de voiture à domicile à Strasbourg, la première frustration est presque toujours la même : impossible de savoir combien ça va coûter sans devis. Les sites affichent souvent « sur devis » ou « à partir de X € » sans préciser ce que ça inclut vraiment ni quels sont les suppléments réels.",
        "Résultat : on est obligé de remplir un formulaire, attendre un rappel, négocier — pour finalement découvrir des frais cachés sur place (taille du véhicule, options « obligatoires », déplacement). Ce manque de transparence fait perdre du temps à tout le monde et crée une méfiance vis-à-vis de toute la profession.",
        "Chez StrasClean, on a choisi l'inverse : afficher tous les tarifs en clair, expliquer ce qui fait varier le prix (taille du véhicule, état initial, options) et garantir qu'aucun supplément ne sera ajouté sur place sans accord préalable. Cette page vous donne tous les tarifs en vigueur en 2026 — vous savez exactement à quoi vous attendre avant de réserver.",
      ],
      bullets: [
        "Tarifs flous voire absents chez la plupart des prestataires",
        "Frais cachés découverts sur place (taille, options « obligatoires »)",
        "Difficile de comparer plusieurs prestataires sans devis individuels",
        "Méfiance générale liée au manque de transparence",
        "Perte de temps en allers-retours et négociations",
      ],
    },
    whyDiy: {
      title: "Ce qui fait vraiment varier le prix",
      paragraphs: [
        "Trois facteurs principaux font varier le prix réel d'un nettoyage à domicile : la formule choisie (Confort, Premium, Luxury Detailing), la taille du véhicule (citadine, berline, SUV, utilitaire), et l'état initial (entretien régulier vs très sale, présence de poils d'animaux, taches importantes, odeurs persistantes). Quelques options ponctuelles peuvent s'ajouter selon votre besoin spécifique.",
        "Le déplacement à domicile à Strasbourg et dans les 12 communes desservies (Schiltigheim, Illkirch, Ostwald, Lingolsheim, etc.) est inclus dans tous nos tarifs — pas de frais kilométriques surprise. Au-delà de cette zone, on vous indique honnêtement le supplément éventuel avant l'intervention.",
      ],
    },
    solution: {
      title: "Tous les tarifs StrasClean 2026 en clair",
      intro:
        "Les tarifs ci-dessous sont valables pour une citadine en état standard. Pour une berline, comptez +10 €. Pour un SUV, +20 €. Pour un utilitaire, +30 €. Les options éventuelles sont indiquées en bas. Aucun supplément non annoncé.",
      steps: [
        {
          title: "Formule Confort — dès 39 €",
          desc: "Entretien rapide : aspiration profonde, tableau de bord, vitres intérieures, désinfection points de contact, désodorisation. Durée 30-50 min. Idéale pour un entretien régulier mensuel.",
        },
        {
          title: "Formule Premium — dès 79 €",
          desc: "Nettoyage complet : tout le Confort + shampouinage sièges et moquettes, traitement cuir/tissu, dégraissage plastiques, désinfection bactéricide renforcée. Durée 45 min à 1h30. Le meilleur rapport qualité-prix.",
        },
        {
          title: "Formule Luxury Detailing — dès 119 €",
          desc: "Service d'exception : tout le Premium + lavage extérieur main, décontamination, vitres extérieures, plastiques extérieurs, traitement poils d'animaux inclus, parfum finition. Durée 2h-2h30. Rendu showroom complet.",
        },
        {
          title: "Lavage extérieur seul — dès 29 €",
          desc: "Pour ceux qui veulent juste un lavage extérieur main de qualité : pré-lavage mousse, lavage manuel microfibre, vitres extérieures, jantes. Durée 20-30 min.",
        },
        {
          title: "Shampouinage sièges seul — dès 59 €",
          desc: "Pour traiter spécifiquement des sièges marqués (taches, transpiration, café) sans formule complète. Injection-extraction profonde. Durée 45 min à 1h30.",
        },
        {
          title: "Traitement poils d'animaux — dès 69 €",
          desc: "Protocole spécifique poils incrustés (chien, chat) : turbo-brosse, adhésifs pro, désinfection allergènes. Durée 1h-1h30. Plus efficace qu'un aspirateur 10× plus longtemps.",
        },
        {
          title: "Remise à neuf revente — dès 129 €",
          desc: "Préparation complète avant mise en vente : extérieur, intérieur, polissage léger, conseils photos d'annonce. ROI moyen +800 à +1 200 € sur le prix de vente. Durée 2h-2h30.",
        },
        {
          title: "Suppléments par taille de véhicule",
          desc: "Citadine = tarif de base. Berline = +10 €. SUV = +20 €. Utilitaire = +30 €. Annoncé en clair avant intervention selon votre modèle exact.",
        },
        {
          title: "Options ponctuelles (sur demande)",
          desc: "Traitement anti-tabac/ozone (+30 €), détachage spécifique localisé (+20 €), traitement anti-moisissure (+40 €), protection hydrophobe carrosserie (+19 €), protection céramique courte durée (+89 €).",
        },
      ],
    },
    pricing: { priceFrom: "39", duration: "30 min à 4 h selon formule" },
    recommendedServiceSlug: "nettoyage-interieur-voiture",
    faq: [
      {
        q: "Le déplacement à mon domicile est-il facturé en plus ?",
        a: "Non, le déplacement est inclus pour Strasbourg et les 12 communes desservies (Schiltigheim, Illkirch, Bischheim, Ostwald, Lingolsheim, Hoenheim, Eckbolsheim, Oberhausbergen, Mundolsheim, Vendenheim, La Wantzenau). Au-delà, on vous indique honnêtement le supplément éventuel avant de confirmer.",
      },
      {
        q: "Y a-t-il des frais cachés ou des suppléments sur place ?",
        a: "Jamais. Le tarif est annoncé avant l'intervention (en fonction de votre formule et de votre véhicule). Si on découvre une situation qui demande plus de travail (très sale, poils incrustés, odeur tabac forte), on vous prévient AVANT de commencer et on attend votre accord. Vous ne payez jamais plus que le devis.",
      },
      {
        q: "Quel moyen de paiement acceptez-vous ?",
        a: "Espèces, carte bancaire (lecteur mobile), virement et facture pro (pour artisans/entreprises). Paiement à la fin de l'intervention, une fois que vous avez validé le résultat.",
      },
      {
        q: "Vous faites des tarifs dégressifs pour plusieurs véhicules ?",
        a: "Oui — si vous voulez faire nettoyer plusieurs véhicules le même jour (couple, famille, parents), on applique une remise de 10-15 % sur le 2e et 15-20 % sur les suivants. Demandez-nous un devis adapté.",
      },
      {
        q: "Possibilité d'un abonnement entretien régulier ?",
        a: "Oui, on propose des formules d'entretien régulier (toutes les 4, 6 ou 8 semaines) à tarif préférentiel (-15 à -25 % selon la fréquence). Idéal pour garder votre voiture impeccable toute l'année.",
      },
      {
        q: "Vos tarifs sont-ils négociables ?",
        a: "Les tarifs affichés sont nos meilleurs prix — pensés pour être justes dès le départ, sans marge de négociation. Pour les pros, flottes, abonnements ou interventions multiples, on a des tarifs dédiés (voir question précédente).",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je voudrais un devis précis pour le nettoyage de ma voiture à mon domicile à Strasbourg. Vos disponibilités cette semaine ?",
  },
];

/** Construit l'URL d'une page use case */
export const useCasePath = (uc: UseCase) => `/${uc.slug}`;

/** Trouve un use case par son slug exact */
export const findUseCase = (slug: string) =>
  USE_CASES.find((uc) => uc.slug === slug);
