// ─────────────────────────────────────────────────────────────────────────
//  StrasClean — Guides / Blog (contenu informationnel pour SEO top-funnel)
//
//  Stratégie : capter le trafic qui tape "comment / pourquoi / combien" avant
//  d'être prêt à acheter, puis le convertir en lead chaud via le CTA en bas
//  d'article. Chaque guide doit :
//   - répondre vraiment à la question (≥ 1000 mots utiles)
//   - finir par une mise en perspective "quand faire venir un pro"
//   - lier vers la page service correspondante pour le maillage interne
//
//  URL : /guide/{slug}
//
//  Pour ajouter un guide : dupliquer une entrée, adapter le contenu.
// ─────────────────────────────────────────────────────────────────────────

export type GuideCategory =
  | "canape"
  | "matelas"
  | "tapis"
  | "voiture"
  | "general";

export type GuideSection = {
  /** Titre H2 de la section */
  title: string;
  /** Paragraphes de la section (texte brut, pas de HTML) */
  paragraphs: string[];
  /** Liste à puces optionnelle */
  bullets?: string[];
};

export type Guide = {
  slug: string;
  category: GuideCategory;
  /** SEO */
  metaTitle: string;
  metaDescription: string;
  /** Affichage */
  title: string;
  excerpt: string;
  publishedAt: string; // ISO YYYY-MM-DD
  updatedAt?: string;
  /** Durée de lecture indicative (minutes) */
  readingMinutes: number;
  /** Slug de la page service à laquelle ce guide est lié (lien interne) */
  relatedServiceSlug?: string;
  /** Texte d'introduction (avant la 1re section) */
  intro: string;
  /** Sections de contenu (H2 + paragraphes) */
  sections: GuideSection[];
  /** Conclusion (avant le CTA final) */
  conclusion: string;
  /** CTA WhatsApp en bas d'article */
  cta: {
    title: string;
    description: string;
    message: string;
  };
};

/** Catégorie → label affiché */
export const CATEGORY_LABELS: Record<GuideCategory, string> = {
  canape: "Canapé",
  matelas: "Matelas",
  tapis: "Tapis",
  voiture: "Voiture",
  general: "Conseils",
};

export const GUIDES: Guide[] = [
  // ─── Guide 1 — Comment enlever une tache de vin rouge sur un canapé ─────
  {
    slug: "enlever-tache-vin-canape-tissu",
    category: "canape",
    metaTitle:
      "Comment enlever une tache de vin rouge sur un canapé tissu — Guide complet",
    metaDescription:
      "Tache de vin rouge sur le canapé ? Guide pas-à-pas par un pro du nettoyage textile à Strasbourg : les bons réflexes en 5 min, les erreurs à ne pas faire, et quand faire venir un professionnel.",
    title: "Comment enlever une tache de vin rouge sur un canapé tissu",
    excerpt:
      "Le guide pas-à-pas d'un pro du nettoyage textile à Strasbourg : les bons réflexes dans les 5 premières minutes, les méthodes maison qui marchent (vraiment), les erreurs courantes à éviter et le moment où ça vaut mieux d'appeler un pro.",
    publishedAt: "2026-05-15",
    readingMinutes: 8,
    relatedServiceSlug: "nettoyage-canape-strasbourg",
    intro:
      "Une tache de vin rouge sur un canapé tissu, c'est la panique. Le réflexe le plus courant est aussi le pire : frotter avec un torchon mouillé. Voici la méthode utilisée par les pros du textile à Strasbourg pour limiter les dégâts dans les 5 premières minutes, puis traiter en profondeur — sans abîmer la fibre ni laisser d'auréole. À la fin, on dit aussi honnêtement quand l'auto-traitement ne suffit plus.",
    sections: [
      {
        title: "Les 60 premières secondes : le réflexe qui sauve",
        paragraphs: [
          "Le vin rouge contient des pigments anthocyanes qui se fixent à la fibre en quelques minutes. Plus vous attendez, plus c'est compliqué. Mais surtout : ne frottez pas. Frotter étale la tache et l'enfonce dans la fibre. Le bon geste, c'est tamponner.",
          "Prenez un linge propre, en coton clair de préférence (un torchon, une serviette éponge fonctionnent). Tamponnez la tache de l'extérieur vers l'intérieur — pour ne pas l'étaler. Changez de zone du linge dès qu'elle se charge. L'objectif est d'absorber un maximum de liquide avant qu'il ne sèche.",
        ],
        bullets: [
          "🚫 Ne JAMAIS frotter — vous étalez et incrustez",
          "✅ Tamponner avec un linge propre et sec",
          "✅ Aller de l'extérieur vers l'intérieur",
          "✅ Changer de zone du linge dès qu'elle se charge",
        ],
      },
      {
        title: "L'absorption : sel de table ou maïzena",
        paragraphs: [
          "Après le tamponnage initial, le tissu est encore humide et il reste des pigments. Pour absorber le résidu, deux méthodes maison fonctionnent : le sel de table fin ou la maïzena (fécule de maïs).",
          "Saupoudrez généreusement la tache : la poudre absorbe à la fois le liquide et les pigments. Laissez agir au moins 30 minutes (idéalement 1 à 2 heures pour une tache importante). Vous verrez la poudre se colorer en rose / violet — c'est qu'elle fait son travail.",
          "Aspirez ensuite à l'aspirateur. Ne brossez pas, ne grattez pas : ça réincorporerait les pigments dans la fibre.",
        ],
        bullets: [
          "Sel fin ou maïzena (jamais de gros sel : pas assez absorbant)",
          "Couche épaisse, généreuse, sur toute la zone tachée",
          "30 min minimum, jusqu'à 2 h pour une grosse tache",
          "Aspirateur à la fin — pas de brosse",
        ],
      },
      {
        title: "Le détachage : eau gazeuse + savon de Marseille",
        paragraphs: [
          "Une fois la majeure partie absorbée, il reste souvent une auréole rosée. La méthode qui marche le mieux sans risque pour le tissu : eau gazeuse tiède + une goutte de savon de Marseille véritable (le vert, à l'huile d'olive).",
          "Imbibez un chiffon propre du mélange. Tamponnez la tache (toujours par tamponnage, pas par frottement). Le CO2 de l'eau gazeuse aide à décrocher les pigments, le savon nettoie sans agresser. Rincez avec un autre chiffon imbibé d'eau claire pour retirer le savon.",
          "Variante qui marche aussi : vinaigre blanc dilué (1 part vinaigre / 2 parts eau tiède). Le vinaigre acide neutralise les anthocyanes. Mais attention : faites un test sur une zone cachée du canapé d'abord — sur certains tissus colorés (lin teint, coton à motifs), le vinaigre peut décolorer.",
        ],
      },
      {
        title: "Les 5 erreurs qui aggravent une tache de vin",
        paragraphs: [
          "Les conseils qu'on lit partout ne marchent pas tous, et certains sont carrément dangereux pour votre canapé. Voici ceux à éviter absolument.",
        ],
        bullets: [
          "❌ Le vin blanc sur du vin rouge : mythe. Ça dilue la tache mais ne neutralise rien.",
          "❌ L'eau bouillante : fixe les pigments dans la fibre, c'est l'inverse du résultat voulu.",
          "❌ Frotter avec une éponge abrasive : abîme la fibre et étale la tache.",
          "❌ L'eau de Javel : sur du tissu coloré, vous décolorez la zone, et vous fragilisez la fibre.",
          "❌ Laisser sécher avant de traiter : la tache est 10× plus difficile à enlever après 24 h.",
        ],
      },
      {
        title: "Quand l'auto-traitement ne suffit plus",
        paragraphs: [
          "Vos méthodes maison marchent bien pour les taches fraîches sur des tissus simples (coton, lin, polyester). Elles atteignent leur limite dans plusieurs cas où il vaut mieux appeler un professionnel avant de bousiller le canapé.",
          "Tache ancienne (plus de 48 h sèche) : les pigments sont fixés à la fibre, l'extraction professionnelle au shampouineur est plus efficace que tout produit chimique maison. Tissu fragile (alcantara, velours, cuir, soie) : l'eau et le savon de Marseille peuvent laisser des auréoles. Le pro utilise des solvants ciblés. Tache importante (plus de 10 cm) ou récurrente (vous avez déjà essayé sans succès) : l'extracteur pro va beaucoup plus profond.",
          "À Strasbourg, on intervient à domicile sur ce type de tache avec un injecteur-extracteur professionnel : on injecte la solution détachante dans la fibre, on l'extrait immédiatement avec le pigment dissous. Pas de mouillage prolongé, pas d'auréole résiduelle, séchage rapide.",
        ],
      },
    ],
    conclusion:
      "En résumé : tamponner sans frotter, absorber au sel ou à la maïzena, traiter à l'eau gazeuse + savon de Marseille. Ça suffit dans 70% des cas si vous agissez vite. Pour les 30% restants — tache ancienne, tissu fragile, grande surface — l'injection-extraction pro reste la solution la plus fiable et la moins risquée pour votre canapé.",
    cta: {
      title: "Une tache de vin qui résiste sur votre canapé ?",
      description:
        "Envoyez-nous une photo sur WhatsApp. On vous dit honnêtement ce qui est traitable, et on intervient à domicile à Strasbourg sous 48 h.",
      message:
        "Bonjour StrasClean 👋 J'ai une tache de vin rouge sur mon canapé qui résiste, je vous envoie une photo. Vous pouvez intervenir ?",
    },
  },

  // ─── Guide 2 — Combien coûte un nettoyage de canapé à Strasbourg ────────
  {
    slug: "prix-nettoyage-canape-strasbourg-guide",
    category: "canape",
    metaTitle:
      "Combien coûte un nettoyage de canapé à Strasbourg ? Tarifs 2026",
    metaDescription:
      "Tarifs 2026 du nettoyage de canapé à Strasbourg : par taille, par matière, par méthode. Pressing vs à domicile, location Kärcher vs pro. Comparatif honnête + grille tarifaire claire.",
    title: "Combien coûte un nettoyage de canapé à Strasbourg ? (Tarifs 2026)",
    excerpt:
      "Comparatif honnête des prix du nettoyage canapé à Strasbourg en 2026 : par taille de canapé, par matière, par méthode (DIY vs pro), et explication de ce qui justifie les écarts. Pour choisir en connaissance de cause.",
    publishedAt: "2026-05-22",
    readingMinutes: 6,
    relatedServiceSlug: "prix-nettoyage-canape-strasbourg",
    intro:
      "Si vous tapez \"prix nettoyage canapé Strasbourg\", vous tombez sur des fourchettes qui vont de 30 € (DIY) à 350 € (pressing premium). Pourquoi un tel écart ? Qu'est-ce qui justifie réellement le prix ? Et comment choisir sans se faire avoir ? Voici la grille tarifaire honnête, par un pro qui travaille à Strasbourg.",
    sections: [
      {
        title: "Les 4 options possibles à Strasbourg",
        paragraphs: [
          "À Strasbourg, vous avez essentiellement 4 façons de faire nettoyer votre canapé. Chacune a son coût, sa méthode, son résultat — et ses limites. Comparons honnêtement.",
        ],
        bullets: [
          "🏠 Auto-traitement (produit + chiffon) : 10-20 € de matériel, 1-2 h de votre temps",
          "🔧 Location Kärcher / shampouineur : 30-50 € pour 24 h + produits 15-20 €",
          "🚐 Service à domicile professionnel : 79-149 € selon taille (canapé tissu)",
          "🏪 Pressing avec enlèvement : 150-300 € + 2-5 jours sans canapé",
        ],
      },
      {
        title: "Auto-traitement : 30 € — ce que vous obtenez vraiment",
        paragraphs: [
          "Le pulvérisateur supermarché + chiffon, c'est l'option la moins chère. Sur une tache fraîche et localisée, c'est suffisant. Sur un canapé qui n'a jamais été nettoyé en profondeur depuis 5 ans, c'est cosmétique — vous traitez la surface, pas le fond.",
          "Le résultat : tache de surface partie, mais l'acariens, les bactéries et les particules incrustées en profondeur restent. Et certains produits supermarché laissent un film qui colle la fibre et attire la poussière deux fois plus vite ensuite.",
        ],
      },
      {
        title: "Location Kärcher : 50 € — le piège fréquent",
        paragraphs: [
          "L'idée est séduisante : un appareil pro, vous le faites vous-même, vous économisez. La réalité à Strasbourg :",
          "D'abord, un shampouineur de location (type Vapormatic ou Lavor) n'a ni la puissance d'extraction d'un injecteur-extracteur professionnel, ni les produits adaptés à chaque matière. Vous mouillez, vous extrayez 60 % de l'eau injectée — le reste reste dans la mousse. Résultat : canapé humide pendant 24-48 h, risque de moisissure si appartement mal ventilé.",
          "Ensuite, sans formation, on a tendance à trop mouiller. C'est l'erreur n°1 des locations DIY : il faut 3-4 passages secs après le passage humide. Sinon, auréole quasi-garantie.",
          "Au final, pour 50 € de location + 20 € de produits + 3-4 h de votre temps + le risque d'auréole, l'économie face à un pro à 79 € n'est pas évidente.",
        ],
      },
      {
        title: "Service à domicile pro : 79-149 € — le bon rapport qualité/prix",
        paragraphs: [
          "C'est la solution standard à Strasbourg pour un canapé tissu. Un pro vient chez vous avec un injecteur-extracteur professionnel (Truvox, Karcher Puzzi pro, Numatic), produits adaptés à votre matière, équipe de 2 pour aller vite.",
          "Les tarifs 2026 à Strasbourg pour un nettoyage canapé pro à domicile :",
        ],
        bullets: [
          "Canapé 1 place / fauteuil : 39-59 €",
          "Canapé 2 places tissu : 79-99 €",
          "Canapé 3 places tissu : 99-129 €",
          "Canapé d'angle 4-5 places : 129-179 €",
          "Option cuir : +20 à +40 € selon taille (protocole pH-neutre)",
          "Option anti-poils animaux : +20 à +40 €",
        ],
      },
      {
        title: "Pressing avec enlèvement : 200-350 €",
        paragraphs: [
          "Très peu de pressings à Strasbourg prennent encore les canapés (l'activité a beaucoup régressé). Ceux qui le font enlèvent votre canapé en camion, le traitent dans leurs locaux, le ramènent 2 à 5 jours plus tard.",
          "Coût : 200-350 € pour un 3 places + 50-80 € de transport. Total proche du double d'un service à domicile, avec contrainte logistique majeure (vous êtes sans canapé plusieurs jours). Pour des cas très particuliers (canapé très précieux nécessitant traitement à sec spécialisé), ça peut se justifier. Pour 95% des canapés, le service à domicile fait aussi bien à moitié prix.",
        ],
      },
      {
        title: "Ce qui fait varier le prix d'un service à domicile",
        paragraphs: [
          "Si vous demandez 3 devis à Strasbourg, vous obtiendrez 3 prix différents. Voici les 5 facteurs qui justifient l'écart :",
        ],
        bullets: [
          "Taille du canapé : facteur n°1, prix presque linéaire au nombre de places",
          "Matière : cuir, alcantara, velours = +20 à +40 % vs tissu standard",
          "État initial : très sale = passage supplémentaire = surcoût possible",
          "Options : anti-poils, anti-tabac, anti-acariens = 20-40 € chacune",
          "Déplacement : selon votre commune (Strasbourg = inclus dans nos tarifs)",
        ],
      },
    ],
    conclusion:
      "Pour 90 % des canapés à Strasbourg, le service à domicile professionnel (79-149 €) est le meilleur compromis prix / résultat / praticité. Le DIY est tentant à 30 € mais traite surface. La location Kärcher est risquée. Le pressing est cher et contraignant. Demandez toujours un devis ferme par photo WhatsApp avant intervention — vous évitez les mauvaises surprises.",
    cta: {
      title: "Devis ferme en 5 minutes par photo WhatsApp",
      description:
        "Envoyez 2-3 photos de votre canapé et précisez la matière. On vous renvoie un tarif détaillé sous 1 h, sans engagement.",
      message:
        "Bonjour StrasClean 👋 Je voudrais un devis pour le nettoyage de mon canapé. Je vous envoie une photo, vous me dites le tarif ?",
    },
  },

  // ─── Guide 3 — Nettoyer un matelas soi-même : 5 erreurs ─────────────────
  {
    slug: "nettoyer-matelas-soi-meme-erreurs",
    category: "matelas",
    metaTitle:
      "Nettoyer son matelas soi-même : 5 erreurs courantes (et la bonne méthode)",
    metaDescription:
      "Nettoyer son matelas en DIY peut empirer la situation. Voici les 5 erreurs les plus fréquentes (bicarbonate mal utilisé, trop d'eau, séchage raté…) et la bonne méthode pas-à-pas.",
    title: "Nettoyer son matelas soi-même : 5 erreurs à éviter",
    excerpt:
      "Vouloir nettoyer son matelas soi-même est une bonne idée — mais 5 erreurs très fréquentes peuvent empirer la situation. Voici les pièges classiques et la bonne méthode, par un pro qui voit régulièrement des matelas \"DIY\" en pire état qu'avant.",
    publishedAt: "2026-05-29",
    readingMinutes: 7,
    relatedServiceSlug: "nettoyage-matelas-strasbourg",
    intro:
      "Le matelas est la pièce de votre maison qui absorbe le plus de votre vie (transpiration, peau morte, acariens, taches occasionnelles). Le nettoyer soi-même est tentant et possible — à condition d'éviter 5 erreurs très répandues qui peuvent l'abîmer définitivement. Voici ces erreurs et la bonne méthode, par quelqu'un qui voit régulièrement des matelas \"sauvés\" par leur propriétaire... mais en pire état qu'avant.",
    sections: [
      {
        title: "Erreur n°1 : trop mouiller le matelas",
        paragraphs: [
          "C'est l'erreur reine du nettoyage matelas DIY. On veut bien faire, on imbibe, on rince à grands flots, on pense que plus d'eau = plus propre. C'est l'inverse.",
          "Un matelas est conçu pour ne pas absorber l'humidité (au contraire). Mais une fois trempé, l'eau pénètre dans la mousse intérieure et ne ressort pas par évaporation simple. Résultat : développement de moisissures à cœur sous 48-72 h, odeur de moisi définitive, et matelas potentiellement bon à jeter.",
          "La règle d'or : aussi peu d'humidité que possible, et toujours extraire ce qu'on injecte. Si vous n'avez pas d'extracteur, n'injectez rien.",
        ],
      },
      {
        title: "Erreur n°2 : le bicarbonate laissé trop longtemps",
        paragraphs: [
          "Le bicarbonate de soude est un grand classique du nettoyage matelas — et il fonctionne, pour absorber l'humidité et neutraliser les odeurs. Mais beaucoup le laissent toute la nuit, voire 24 h. C'est trop.",
          "Au-delà de 4-6 h, le bicarbonate pénètre dans les fibres et devient extrêmement difficile à aspirer entièrement. Les résidus restent dans le matelas, attirent l'humidité ambiante, et peuvent à terme abîmer la mousse.",
          "Le timing correct : saupoudrer, attendre 1 à 2 heures, aspirer à fond avec un aspirateur puissant. Si vous voulez prolonger l'effet désodorisant, refaire le cycle plutôt que prolonger le contact.",
        ],
      },
      {
        title: "Erreur n°3 : eau de Javel ou ammoniaque sur les taches",
        paragraphs: [
          "Pour les taches biologiques (urine, sang, vomi), le réflexe est souvent les produits forts. Mauvais réflexe :",
          "L'eau de Javel décolore définitivement le tissu coutil de votre matelas (la couche extérieure imprimée), laissant des taches blanches permanentes. L'ammoniaque (présent dans certains nettoyants) attaque les fibres et peut fragiliser la mousse intérieure. Les détergents très alcalins (savon noir concentré, soude) peuvent décoloration et délavage du coutil.",
          "Pour les taches biologiques : eau froide (jamais chaude — la chaleur fixe les protéines), savon de Marseille, ou produit enzymatique spécifique matelas. Tamponner, jamais frotter.",
        ],
        bullets: [
          "🚫 Eau de Javel, ammoniaque, soude, détergents agressifs",
          "🚫 Eau chaude sur taches biologiques (fixe les protéines)",
          "✅ Eau FROIDE + savon de Marseille",
          "✅ Produit enzymatique spécifique (acheté en pharmacie)",
          "✅ Tamponner, jamais frotter",
        ],
      },
      {
        title: "Erreur n°4 : sécher au sèche-cheveux ou au soleil direct",
        paragraphs: [
          "Après le nettoyage, on veut sécher vite pour pouvoir redormir dessus. Deux mauvaises idées fréquentes :",
          "Le sèche-cheveux concentre la chaleur sur une zone, peut faire fondre les fibres synthétiques du coutil et créer des points durs. Le soleil direct, particulièrement par la fenêtre fermée, peut surchauffer la mousse intérieure (qui peut atteindre 60-70 °C) et altérer sa structure.",
          "Le bon séchage : courant d'air naturel, matelas posé verticalement (dressé contre un mur) pour exposer les deux faces, ventilateur si vous en avez un, 4-8 heures minimum avant de redormir dessus. Sur un matelas correctement traité avec peu d'humidité, ce délai est suffisant.",
        ],
      },
      {
        title: "Erreur n°5 : ignorer les acariens",
        paragraphs: [
          "Un matelas \"propre\" en apparence peut être un nid à acariens. C'est invisible mais c'est ce qui provoque allergies, rhinites, eczéma chez l'enfant. Le nettoyage cosmétique de surface ne touche pas le problème.",
          "Pour traiter les acariens : aspiration intense (aspirateur HEPA), idéalement avec embout vapeur ou matelas exposé au soleil 2-3 heures (la chaleur tue les acariens) puis ré-aspirer. Mais soyons honnête : un traitement définitif passe par l'injection-extraction pro avec un acaricide professionnel, suivie d'extraction qui retire les cadavres et déjections.",
        ],
      },
      {
        title: "La bonne méthode DIY en 4 étapes (résumé)",
        paragraphs: [
          "Si vous voulez quand même tenter par vous-même, voici le protocole qui marche sans risque :",
        ],
        bullets: [
          "1️⃣ Aspirer 10-15 min toute la surface (faces + tranches) avec un aspirateur puissant",
          "2️⃣ Saupoudrer bicarbonate, laisser 1-2 h, aspirer à fond",
          "3️⃣ Pour les taches : eau FROIDE + savon de Marseille, tamponner, sécher tampon sec",
          "4️⃣ Aérer 4-8 h en pièce ventilée avant de redormir dessus",
        ],
      },
      {
        title: "Quand faire venir un pro",
        paragraphs: [
          "Le DIY suffit pour un entretien régulier (2-3 fois par an) sur un matelas en bon état. Vous devriez appeler un professionnel dans 4 situations :",
        ],
        bullets: [
          "Tache importante (urine ancienne, sang, vomi) qui résiste au traitement maison",
          "Matelas neuf qu'on vient d'acheter (occasion ou récupération) — désinfection complète + acariens",
          "Famille avec bébé / enfant en bas âge — traitement anti-acariens régulier conseillé",
          "Matelas haut de gamme (>1500 €) — l'injection-extraction pro préserve la matière",
        ],
      },
    ],
    conclusion:
      "Nettoyer son matelas soi-même est faisable si on évite les 5 erreurs ci-dessus. Pour un entretien courant, le bicarbonate + aspiration suffit. Pour les taches importantes, les acariens ou un matelas haut de gamme, l'injection-extraction professionnelle reste plus sûre et plus efficace — et coûte moins cher qu'un matelas à remplacer.",
    cta: {
      title: "Un matelas qui mérite mieux qu'un traitement maison ?",
      description:
        "Envoyez une photo sur WhatsApp. On intervient à domicile à Strasbourg, équipe pro, séchage rapide, devis ferme sous 1 h.",
      message:
        "Bonjour StrasClean 👋 Je voudrais un devis pour le nettoyage d'un matelas. Je vous envoie une photo et le contexte ?",
    },
  },
];

/** Construit l'URL d'un guide */
export const guidePath = (g: Guide) => `/guide/${g.slug}`;

/** Trouve un guide par son slug exact */
export const findGuide = (slug: string) =>
  GUIDES.find((g) => g.slug === slug);
