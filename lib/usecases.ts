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
      "Bonjour StrasClean, je transporte mon chien régulièrement et j'aimerais un traitement complet poils d'animaux pour ma voiture à Strasbourg.",
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
      "Bonjour StrasClean, ma voiture a une odeur de tabac persistante, je voudrais un traitement complet à mon domicile à Strasbourg.",
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
      "Bonjour StrasClean, je vais mettre ma voiture en vente, je voudrais une préparation complète revente à mon domicile à Strasbourg.",
  },
];

/** Construit l'URL d'une page use case */
export const useCasePath = (uc: UseCase) => `/${uc.slug}`;

/** Trouve un use case par son slug exact */
export const findUseCase = (slug: string) =>
  USE_CASES.find((uc) => uc.slug === slug);
