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

  // ─── Guide 4 — Odeurs persistantes dans la voiture ──────────────────────
  {
    slug: "odeurs-persistantes-voiture-solutions",
    category: "voiture",
    metaTitle:
      "Odeurs persistantes dans la voiture : causes et solutions définitives",
    metaDescription:
      "Mauvaise odeur dans la voiture qui revient ? Tabac, animal, humidité, alimentation : les vraies causes (souvent invisibles) et les méthodes qui marchent vraiment, par un pro à Strasbourg.",
    title: "Odeurs persistantes dans la voiture : pourquoi et comment s'en débarrasser",
    excerpt:
      "Désodorisant qui ne tient que 2 jours, odeur qui revient malgré le ménage : voici les vraies causes des odeurs tenaces dans une voiture et les solutions qui marchent vraiment — pas juste masquer.",
    publishedAt: "2026-06-05",
    readingMinutes: 7,
    relatedServiceSlug: "enlever-odeur-tabac-voiture-strasbourg",
    intro:
      "Vous avez nettoyé, aspiré, mis trois désodorisants — et l'odeur revient au bout de quelques jours. C'est normal : 90 % du traitement habituel s'attaque au symptôme, pas à la cause. Une odeur s'installe parce qu'une source invisible la nourrit en permanence. Tant que cette source est là, aucun spray ne tiendra. Voici les vraies causes (souvent surprenantes) et les solutions qui éliminent le problème pour de bon.",
    sections: [
      {
        title: "Pourquoi les désodorisants ne tiennent que 48 h",
        paragraphs: [
          "Un désodorisant (sapin sous le rétro, spray, gel diffuseur) fonctionne sur deux principes : il masque l'odeur par une autre plus forte, et certains absorbent une partie des molécules odorantes. Ça marche le temps que le produit s'évapore — 24 à 72 heures selon les marques.",
          "Le problème : la source de l'odeur, elle, est toujours là. Si la mauvaise odeur vient d'un siège qui a absorbé de la sueur, du tabac ou de l'urine animale, la source réémet en continu. Vous masquez, vous masquez, et au bout de quelques jours l'odeur revient identique.",
          "La vraie solution est toujours la même : identifier la source, l'éliminer (ou la neutraliser à la racine), puis seulement après désodoriser pour la touche finale.",
        ],
      },
      {
        title: "Les 6 sources d'odeur les plus fréquentes",
        paragraphs: [
          "En 5 ans de nettoyage auto à Strasbourg, voici par ordre de fréquence les causes réelles que je vois revenir :",
        ],
        bullets: [
          "1️⃣ Tabac absorbé dans les sièges, plafond et système ventilation",
          "2️⃣ Urine animale (chien, chat) dans la moquette sous les sièges",
          "3️⃣ Humidité dans la moquette (fuite, parapluie mouillé, neige fondue)",
          "4️⃣ Lait, café, sauce alimentaire renversé sous le siège ou dans le plancher",
          "5️⃣ Filtre d'habitacle saturé (jamais changé ou changé depuis 2 ans)",
          "6️⃣ Climatisation contaminée (bactéries dans l'évaporateur)",
        ],
      },
      {
        title: "Solution n°1 : aspiration profonde + extraction",
        paragraphs: [
          "Pour les odeurs liées à des liquides absorbés (sueur, urine, alimentation), l'aspirateur classique ne va pas assez loin. Les molécules odorantes sont à 1-3 cm dans la fibre du siège ou de la moquette. Il faut une extraction professionnelle.",
          "L'injecteur-extracteur projette une solution active dans la fibre puis ré-aspire le liquide chargé. Sur un siège : 3-5 passages. Sur une moquette : 5-8 passages. Le résultat est radical car on retire physiquement les molécules odorantes — pas on les masque.",
          "C'est ce qu'on fait à Strasbourg sur 80% des cas d'odeur tenace : aspiration profonde, extraction des sièges et de la moquette, puis désodorisation finale.",
        ],
      },
      {
        title: "Solution n°2 : le générateur d'ozone pour le tabac",
        paragraphs: [
          "Le tabac est la plus tenace de toutes les odeurs en voiture. Il imprègne le plafond, les sièges, les plastiques et la ventilation. Une extraction seule ne suffit pas — l'odeur revient toujours.",
          "La solution professionnelle : le générateur d'ozone (O3). Placé dans la voiture pendant 30-60 minutes (avec ventilation interne en circuit fermé), l'ozone pénètre partout et oxyde les molécules de tabac. Résultat : neutralisation complète et durable.",
          "Attention : à faire par un pro, l'ozone est toxique en cas d'inhalation prolongée. La voiture doit être aérée 1-2 h après traitement avant utilisation.",
        ],
      },
      {
        title: "Solution n°3 : remplacement du filtre d'habitacle",
        paragraphs: [
          "Le filtre d'habitacle (celui qui filtre l'air entrant par la ventilation) est une cause d'odeur très sous-estimée. Quand il est saturé (poussières, humidité, micro-particules), il devient un nid à bactéries qui propagent une odeur de \"renfermé\" ou \"chaussettes sales\" à chaque démarrage.",
          "Tarif : 15-30 € le filtre + 15-20 min de pose. C'est l'investissement le plus rapide à rentabiliser sur l'odeur. À faire tous les 15 000-20 000 km ou tous les 2 ans maximum.",
        ],
      },
      {
        title: "Solution n°4 : nettoyage de la climatisation",
        paragraphs: [
          "Si l'odeur sort par les bouches d'aération quand vous mettez la clim, le coupable est l'évaporateur. C'est une grille humide où les bactéries adorent se développer. Au démarrage de la clim, ces bactéries sont projetées dans l'habitacle — odeur instantanée.",
          "Solution : nettoyage chimique de l'évaporateur via une mousse spécialisée (Wynn's, Würth) injectée par un orifice dédié, ou démontage complet pour les cas graves. Tarif : 30-80 € selon profondeur de l'intervention.",
        ],
      },
      {
        title: "Ce qu'on conseille à Strasbourg",
        paragraphs: [
          "Pour une odeur persistante, voici la séquence efficace : 1) On démonte mentalement la voiture en zones (sièges, moquette, plafond, ventilation). 2) On localise où l'odeur est la plus forte. 3) On traite la zone à la cause appropriée (extraction si liquide, ozone si tabac, filtre/clim si ventilation).",
          "Dans 95 % des cas, une seule intervention bien ciblée règle le problème pour 6-12 mois. Le coût total se situe entre 70 et 150 € selon les zones traitées — bien moins que de revendre une voiture pour cause d'odeur.",
        ],
      },
    ],
    conclusion:
      "Une odeur persistante n'est jamais résolue par un désodorisant. La solution est toujours de remonter à la source physique (liquide absorbé, tabac dans les fibres, filtre saturé, clim contaminée) et de la traiter à la racine. Pour 70-150 €, on règle pour 6-12 mois ce que les sprays n'arrivent pas à masquer 48 h.",
    cta: {
      title: "Une odeur dans votre voiture qui revient toujours ?",
      description:
        "Décrivez l'odeur (tabac, animal, alimentation, autre) et le contexte sur WhatsApp. On vous dit honnêtement ce qui est traitable et le tarif sous 1 h.",
      message:
        "Bonjour StrasClean 👋 J'ai une odeur persistante dans ma voiture (à préciser). Je voudrais savoir comment vous pouvez la traiter à Strasbourg.",
    },
  },

  // ─── Guide 5 — Enlever les poils d'animaux dans la voiture ──────────────
  {
    slug: "enlever-poils-animaux-voiture-techniques",
    category: "voiture",
    metaTitle:
      "Enlever les poils de chien / chat dans la voiture : 6 techniques pro",
    metaDescription:
      "Poils d'animaux qui résistent à l'aspirateur ? 6 techniques professionnelles pour les décoller, par un nettoyeur auto à Strasbourg. Du gant de vaisselle au turbo-extracteur pro.",
    title: "Enlever les poils de chien ou chat dans la voiture : 6 techniques qui marchent",
    excerpt:
      "Les poils d'animaux s'incrustent dans les fibres et résistent à l'aspirateur classique. Voici 6 techniques, de la plus simple (gratuite, à la maison) à la plus pro (intervention spécialisée à domicile), par ordre d'efficacité.",
    publishedAt: "2026-06-12",
    readingMinutes: 6,
    relatedServiceSlug: "enlever-poils-chien-voiture-strasbourg",
    intro:
      "Si vous transportez régulièrement votre chien ou votre chat, vous savez : aspirer ne suffit pas. Les poils, surtout ceux à structure fine (Berger Australien, Golden Retriever, certains chats à poils longs), se logent perpendiculairement dans la fibre du siège et de la moquette. L'aspirateur passe au-dessus sans les déloger. Voici 6 techniques, de la plus simple à la plus pro, qui les décollent vraiment.",
    sections: [
      {
        title: "Pourquoi l'aspirateur classique échoue",
        paragraphs: [
          "Un aspirateur à 50 € génère 80-100 mbar de dépression. Sur un tissu propre, c'est largement suffisant pour la poussière. Mais un poil d'animal incrusté résiste à plus de 200 mbar — il faudrait un aspirateur pro pour le décrocher seul. Et même là, il faut souvent le pré-décoller mécaniquement.",
          "Conclusion : la stratégie gagnante combine toujours deux étapes. D'abord faire émerger les poils du tissu (les redresser), puis aspirer. C'est ce qui change tout.",
        ],
      },
      {
        title: "Technique 1 — Le gant de vaisselle (gratuit)",
        paragraphs: [
          "Un gant de vaisselle en latex humidifié frotté en cercles sur le siège ramasse les poils par friction électrostatique. C'est étonnamment efficace sur les premiers passages, surtout pour les poils courts (Labrador, Bouledogue).",
          "Conseil : humidifier le gant juste un peu (pas trempé), passer en cercles serrés, ramasser le \"tas\" de poils formé, recommencer zone par zone. Compter 20-30 min pour un siège conducteur + banquette arrière.",
        ],
      },
      {
        title: "Technique 2 — Le raclette d'épilation",
        paragraphs: [
          "Vendu en animalerie sous le nom \"Furminator\" ou \"FlyingPaws\" : c'est un racloir avec une bande caoutchouc qui ramasse les poils par accrochage. Plus efficace qu'un gant sur les poils plus longs (Berger Allemand, Chow-Chow).",
          "Compter 15-25 € pour un bon modèle, et la même durée d'utilisation que le gant. À utiliser en mouvement lent, dans le sens du tissu, en pressant légèrement.",
        ],
      },
      {
        title: "Technique 3 — Le rouleau adhésif géant",
        paragraphs: [
          "Le rouleau adhésif (type \"4Pets\" ou \"Akyga\") avec des feuilles autoadhésives décolle parfaitement les poils en surface. Très efficace après le gant ou la raclette pour finaliser. Inefficace seul sur les poils profondément incrustés.",
          "Tarif : 15-25 € le rouleau + recharges, environ 0,50 € par feuille utilisée. Compter 2-3 feuilles par siège.",
        ],
      },
      {
        title: "Technique 4 — La brosse en cuivre",
        paragraphs: [
          "Plus pro : la brosse à poils de cuivre courts. Le cuivre génère une charge électrostatique qui attire les poils. C'est l'outil utilisé en concours canin pour préparer les pelages — il marche aussi très bien sur les sièges.",
          "À frotter en cercles, puis aspirer. Compter 30 € pour une bonne brosse en magasin de pet shop.",
        ],
      },
      {
        title: "Technique 5 — La turbo-brosse + aspirateur puissant",
        paragraphs: [
          "Une turbo-brosse rotative (embout d'aspirateur avec brosse motorisée) tourne à 1500-3000 tr/min : elle décolle les poils en même temps qu'elle aspire. Combinée avec un aspirateur eau et poussières pro (Karcher MV, Festool CT26), c'est très efficace.",
          "Coût matériel : aspirateur pro 200-500 €, turbo-brosse 30-50 €. Investissement utile si vous avez plusieurs animaux ou plusieurs véhicules.",
        ],
      },
      {
        title: "Technique 6 — L'injecteur-extracteur pro à domicile",
        paragraphs: [
          "C'est la solution radicale pour les poils incrustés à plus de 1 cm dans la fibre (incidents fréquents avec chiens à poils fins type Berger Australien ou chats Maine Coon). L'injecteur-extracteur projette un produit qui détache mécaniquement les poils, puis les extrait avec le liquide.",
          "C'est notre service le plus demandé sur la partie animaux à Strasbourg. Tarif : 79 € pour une voiture standard avec passage anti-poils. Résultat : décolle même les poils que l'aspirateur le plus puissant laisse en place.",
        ],
      },
      {
        title: "La séquence gagnante",
        paragraphs: [
          "Si vous voulez résoudre vous-même : commencez par le gant de vaisselle (ramasse 60% des poils), puis raclette ou brosse cuivre (20% supplémentaires), terminez au rouleau adhésif + aspirateur (15%). Reste les 5% incrustés profond — c'est là qu'un pro intervient.",
          "Pour un nettoyage en profondeur (revente, allergie, etc.), passez directement à l'extracteur pro à domicile : 1h30 et c'est réglé pour de bon.",
        ],
      },
    ],
    conclusion:
      "Les poils d'animaux sont l'une des choses les plus tenaces dans une voiture parce qu'ils ne se laissent pas aspirer simplement. La bonne stratégie combine émergence (gant, raclette, brosse) + aspiration. Pour aller au bout, l'extraction professionnelle reste la seule méthode qui décolle même les poils incrustés en profondeur.",
    cta: {
      title: "Voiture pleine de poils d'animaux ?",
      description:
        "On intervient à domicile à Strasbourg avec un protocole anti-poils complet (turbo-brosse + extracteur). Dès 79 €. Photo WhatsApp pour devis ferme.",
      message:
        "Bonjour StrasClean 👋 Ma voiture est pleine de poils de chien/chat, je voudrais un devis pour un nettoyage anti-poils à Strasbourg.",
    },
  },

  // ─── Guide 6 — Préparer sa voiture pour la revente ──────────────────────
  {
    slug: "preparer-voiture-revente-checklist",
    category: "voiture",
    metaTitle:
      "Préparer sa voiture pour la revente : la check-list complète",
    metaDescription:
      "Vendre votre voiture au meilleur prix ? Voici la check-list complète d'un pro de la préparation auto à Strasbourg : ce qui paie vraiment (et ce qui ne paie pas) pour maximiser le prix de vente.",
    title: "Préparer sa voiture pour la revente : la check-list qui maximise le prix",
    excerpt:
      "Les acheteurs particuliers décident en 90 secondes. Une voiture bien préparée se vend 500-1500 € de plus qu'une voiture \"propre normale\". Voici la check-list précise par étape, du moins cher (10 €) au plus rentable (preparation complète).",
    publishedAt: "2026-06-19",
    readingMinutes: 8,
    relatedServiceSlug: "preparer-voiture-revente-strasbourg",
    intro:
      "Statistique terrain : une voiture préparée se vend en moyenne 500-1500 € de plus qu'une voiture \"propre normale\", et 3 à 5 fois plus vite. L'acheteur particulier décide dans les 90 premières secondes — visuellement et émotionnellement. Voici la check-list précise, étape par étape, avec ce qui paie vraiment (et ce qui ne paie pas), par un préparateur à Strasbourg.",
    sections: [
      {
        title: "Pourquoi préparer rapporte (chiffres réels)",
        paragraphs: [
          "Sur 200 ventes que je connais à Strasbourg ces 3 dernières années, voici les chiffres : voiture vendue sans préparation, dans son jus → -8 à -15 % par rapport à la cote. Voiture nettoyée standard (lavage + aspirateur) → cote moyenne. Voiture préparée pro avec finitions → +5 à +12 % au-dessus de la cote.",
          "Pour une voiture cotée 10 000 €, ça représente un différentiel de 1 500 à 2 500 € entre \"non préparée\" et \"bien préparée\". L'investissement dans la préparation se rentabilise toujours sur ces écarts.",
        ],
      },
      {
        title: "Étape 1 — Nettoyage extérieur (le visuel d'accueil)",
        paragraphs: [
          "L'acheteur regarde la carrosserie avant tout. Ce qu'il faut absolument faire :",
        ],
        bullets: [
          "Lavage à la main (pas en tunnel — micro-rayures inadmissibles à la revente)",
          "Décontamination clay-bar pour retirer les retombées industrielles (jantes ferreuses)",
          "Polish léger sur micro-rayures et hologrammes (1 passe machine)",
          "Brillance carrosserie : cire ou sealant 3-6 mois",
          "Pneus brillants : produit non gras (Sonax Tire Gloss, Meguiar's)",
          "Jantes parfaitement propres (creux, valves, étrier visible)",
          "Vitres extérieures sans aucune trace ni halo",
        ],
      },
      {
        title: "Étape 2 — Nettoyage intérieur (où ça se gagne)",
        paragraphs: [
          "C'est ici que beaucoup de vendeurs négligent — et perdent le plus d'argent. L'intérieur, c'est où l'acheteur s'imagine assis pendant les 3 prochaines années.",
        ],
        bullets: [
          "Aspiration profonde (sièges, tapis, coffre, joints) — partir des points cachés",
          "Shampouinage des sièges si taches visibles (sinon nettoyage sec suffit)",
          "Désinfection complète : volant, poignées, levier de vitesse, contacteurs",
          "Tableau de bord et plastiques : aspect mat naturel (jamais surbrillant artificiel)",
          "Cuir (si applicable) : nourrir avec un baume pH-neutre — restitue souplesse",
          "Vitres intérieures sans aucune trace (sources de halos sur photos)",
          "Désodorisation pro (pas un sapin) — neutralise les odeurs résiduelles",
        ],
      },
      {
        title: "Étape 3 — Compartiment moteur (signe de soin)",
        paragraphs: [
          "Souvent oublié, alors que beaucoup d'acheteurs ouvrent le capot \"pour voir\". Un compartiment moteur impeccable signale un propriétaire méticuleux.",
          "Aspiration des feuilles et poussières, dégraissage léger des parties accessibles (cache moteur, contour batterie), nettoyage avec un chiffon sec. PAS de produit brillant sur les durites ou la calandre — ça fait \"maquillé\".",
        ],
      },
      {
        title: "Étape 4 — Les détails qui font la différence",
        paragraphs: [
          "Les petits soins qui rassurent et différencient votre annonce :",
        ],
        bullets: [
          "Boîte à gants vide et propre (jamais avec tickets de péage, papiers anciens)",
          "Cendrier impeccable même si la voiture n'est pas fumeur (rassure)",
          "Coffre vide et propre, tapis aspiré, joints essuyés",
          "Roue de secours propre, cric et trousse à outils visibles",
          "Carnet d'entretien clair, factures rangées, dernière révision visible",
          "Plein d'essence (pas obligatoire mais bon signal)",
        ],
      },
      {
        title: "Étape 5 — Les photos pour l'annonce",
        paragraphs: [
          "L'acheteur décide d'appeler ou non en 8 secondes sur la photo principale. Quelques règles non négociables :",
          "Photographier dehors par temps couvert (lumière diffuse, pas d'ombre dure). Profil 3/4 avant droit comme photo principale. Vues détaillées : intérieur conducteur, intérieur passager, coffre ouvert, jantes, compartiment moteur. Évitez les fonds chaotiques (autres voitures, garage en désordre) — partez sur une place calme ou un parking propre.",
          "Avec une voiture préparée pro, les photos sortent presque toutes seules.",
        ],
      },
      {
        title: "Ce qui ne paie pas (à éviter)",
        paragraphs: [
          "Voici ce qui ne rapporte rien ou peut même retourner contre vous :",
        ],
        bullets: [
          "🚫 Repeindre une partie de carrosserie sans accord acheteur — signe de masquage",
          "🚫 Mettre 3 désodorisants — signal alarme \"il y a quelque chose à masquer\"",
          "🚫 Polir agressivement et risquer de marquer la peinture",
          "🚫 Utiliser des silicones brillants type vinyle (effet plastique faux)",
          "🚫 Cacher un problème mécanique sous une préparation cosmétique parfaite",
        ],
      },
      {
        title: "Budget préparation à Strasbourg",
        paragraphs: [
          "Tarifs pratiqués à Strasbourg en 2026, par un pro :",
        ],
        bullets: [
          "Préparation \"essentielle\" (lavage main + aspi + désinfection) : 79 €",
          "Préparation \"revente\" (essentielle + shampouinage + polish léger) : 129 €",
          "Préparation \"premium\" (revente + clay-bar + cire céramique) : 199 €",
          "DIY complet (vous, 6h, 60 € de produits) : ~60 €",
        ],
      },
    ],
    conclusion:
      "Une voiture préparée à 130 € se vend 500-1500 € de plus qu'une voiture \"propre normale\" — c'est un des meilleurs ROI sur la revente. La clé : faire l'intérieur ET l'extérieur sans rien forcer (zéro maquillage), photographier proprement, présenter le carnet d'entretien. C'est tout — et ça fonctionne à chaque fois.",
    cta: {
      title: "Vous voulez vendre votre voiture rapidement et au bon prix ?",
      description:
        "On propose à Strasbourg une formule \"préparation revente\" à 129 € : intérieur complet + extérieur + finitions. Devis sous 1 h par photo WhatsApp.",
      message:
        "Bonjour StrasClean 👋 Je vends ma voiture, je voudrais un devis pour une préparation revente à Strasbourg. Je vous envoie une photo ?",
    },
  },

  // ─── Guide 7 — Acariens dans le matelas ─────────────────────────────────
  {
    slug: "acariens-matelas-comment-eliminer",
    category: "matelas",
    metaTitle:
      "Acariens dans le matelas : comment vraiment s'en débarrasser",
    metaDescription:
      "Démangeaisons, allergies, rhinite ? Les acariens du matelas sont souvent en cause. Voici comment les éliminer durablement (et pourquoi le simple bicarbonate ne suffit pas), par un pro.",
    title: "Acariens dans le matelas : comment s'en débarrasser durablement",
    excerpt:
      "Allergies, rhinite chronique, démangeaisons inexpliquées : 80% du temps, les acariens du matelas sont en cause. Voici comment vraiment les éliminer — au-delà du simple bicarbonate qui ne fait que masquer le problème.",
    publishedAt: "2026-06-26",
    readingMinutes: 7,
    relatedServiceSlug: "nettoyage-matelas-strasbourg",
    intro:
      "Un matelas adulte non traité depuis 5 ans contient en moyenne 100 000 à 2 millions d'acariens. C'est invisible, indolore… mais ce sont eux qui causent les rhinites chroniques, l'eczéma de votre enfant, vos réveils avec les yeux gonflés. Le bicarbonate seul ne suffit pas — il neutralise les odeurs, pas les acariens. Voici les vraies solutions, dans l'ordre d'efficacité.",
    sections: [
      {
        title: "Pourquoi les acariens prolifèrent dans un matelas",
        paragraphs: [
          "Un acarien vit 6-8 semaines, mange notre peau morte (10-20 g par adulte et par mois — assez pour nourrir des centaines de milliers d'acariens), aime l'humidité (60-80%) et la chaleur (20-25°C). Le matelas humain est l'environnement parfait.",
          "Le problème n'est pas l'acarien lui-même — c'est ses déjections qui sont allergisantes pour 25% de la population. Plus la population est grande, plus l'exposition est forte, plus les symptômes apparaissent ou s'aggravent.",
        ],
      },
      {
        title: "Reconnaître une infestation",
        paragraphs: [
          "Pas de petite bête visible — les acariens font 0,2 à 0,5 mm. Les signaux indirects :",
        ],
        bullets: [
          "Rhinite au réveil (nez bouché, éternuements) qui s'améliore en journée",
          "Démangeaisons sur le tronc et le bras au réveil",
          "Eczéma chronique chez l'enfant qui empire en automne/hiver",
          "Yeux qui grattent ou \"collés\" le matin",
          "Toux nocturne sans rhume",
          "Matelas > 5 ans jamais traité",
        ],
      },
      {
        title: "Solution 1 — Aspiration intense (gratuit)",
        paragraphs: [
          "Un bon aspirateur (idéalement avec filtre HEPA pour ne pas rediffuser les déjections) passé 10-15 min sur tout le matelas chaque mois retire 30-50% des acariens et de leurs déjections.",
          "C'est l'action de base. Sans elle, aucune autre solution ne dure dans le temps. À faire toutes faces (dessus, dessous, tranches), avec un suceur fin dans les coutures et les boutons.",
        ],
      },
      {
        title: "Solution 2 — Bicarbonate (limité aux odeurs)",
        paragraphs: [
          "Le bicarbonate de soude neutralise les odeurs et absorbe l'humidité — c'est bien. Mais il ne tue pas les acariens ni leurs déjections. Le mythe \"bicarbonate anti-acariens\" est un mythe.",
          "Utilisez-le si vous avez aussi une problématique d'odeur. Sinon, son effet sur les acariens est marginal.",
        ],
      },
      {
        title: "Solution 3 — Soleil direct (efficace mais saisonnier)",
        paragraphs: [
          "Les acariens meurent à partir de 55°C. Un matelas exposé au plein soleil de l'été pendant 2-3 heures (faces alternées) atteint 60-70°C en surface. Ça en tue une bonne partie — mais pas en profondeur (centre du matelas reste à 25-30°C).",
          "Méthode utile en complément, peu efficace seule. Et impossible en hiver (sans soleil direct intense).",
        ],
      },
      {
        title: "Solution 4 — Produits acaricides (efficacité variable)",
        paragraphs: [
          "Sprays acaricides en supermarché ou pharmacie (Acardust, Atox, etc.). Le principe : pulvériser, laisser agir 30-60 min, aspirer. Efficacité réelle : 60-80% sur les acariens présents, 0% sur les déjections déjà déposées.",
          "Limite : le produit reste en surface, l'efficacité dépend du temps de contact et de la matière du matelas. Refaire tous les 3-6 mois pour maintenir l'effet.",
        ],
      },
      {
        title: "Solution 5 — Housse anti-acariens (préventif)",
        paragraphs: [
          "Une housse étanche aux acariens (à zip, type Allergocheck, Klinmam) encapsule le matelas et empêche les acariens d'y entrer ou d'en sortir. C'est très efficace en prévention pour un matelas déjà propre, ou en complément après un traitement profond.",
          "Tarif : 40-100 €. Idéal pour les chambres d'enfants allergiques ou après une intervention pro.",
        ],
      },
      {
        title: "Solution 6 — Injection-extraction professionnelle (radical)",
        paragraphs: [
          "C'est la solution la plus complète. L'injecteur-extracteur projette un acaricide pH-neutre en profondeur dans le matelas, puis l'extrait avec les acariens morts et leurs déjections. On retire physiquement le problème, pas juste on masque.",
          "Tarif à Strasbourg : 49 € (1 personne) à 79 € (matelas 2 personnes). Effet immédiat (population réduite >90%) et durable 12-18 mois avec un entretien aspirateur classique.",
        ],
      },
      {
        title: "Le protocole conseillé selon la situation",
        paragraphs: [
          "Sans symptômes apparents : aspirateur HEPA mensuel + bicarbonate trimestriel + soleil l'été. Suffisant en prévention.",
          "Symptômes légers : ajout d'un spray acaricide trimestriel + housse anti-acariens. Effet en 2-4 semaines.",
          "Symptômes importants ou allergie sévère : injection-extraction pro + housse + entretien aspirateur HEPA. C'est la séquence qui marche à coup sûr.",
        ],
      },
    ],
    conclusion:
      "Les acariens du matelas sont la cause cachée d'énormément de problèmes ORL et dermatologiques. Le bicarbonate seul est insuffisant. Pour un effet réel et durable, l'injection-extraction professionnelle + housse anti-acariens + aspirateur HEPA est la combinaison gagnante. Pour 50-80 € de traitement pro, vous traitez 18 mois de tranquillité.",
    cta: {
      title: "Allergie, rhinite, démangeaisons ? Le matelas est peut-être la cause.",
      description:
        "Traitement injection-extraction acaricide à domicile à Strasbourg, dès 49 €. Devis ferme sous 1 h par WhatsApp.",
      message:
        "Bonjour StrasClean 👋 Je voudrais un traitement anti-acariens sur mon matelas à Strasbourg. Vous pouvez intervenir ?",
    },
  },

  // ─── Guide 8 — Entretenir un tapis berbère ──────────────────────────────
  {
    slug: "entretenir-tapis-berbere-strasbourg",
    category: "tapis",
    metaTitle:
      "Tapis berbère : comment l'entretenir et le nettoyer sans l'abîmer",
    metaDescription:
      "Tapis berbère en laine ? Voici comment l'entretenir au quotidien et le nettoyer en profondeur sans abîmer la fibre, par un nettoyeur textile pro à Strasbourg.",
    title: "Comment entretenir et nettoyer un tapis berbère sans l'abîmer",
    excerpt:
      "Le tapis berbère est résistant mais demande des soins spécifiques. Trop d'eau, mauvais produit ou frottement trop énergique peuvent l'abîmer définitivement. Voici les bonnes pratiques quotidiennes et le bon protocole de nettoyage en profondeur.",
    publishedAt: "2026-07-03",
    readingMinutes: 6,
    relatedServiceSlug: "nettoyage-tapis-domicile-strasbourg",
    intro:
      "Le tapis berbère, qu'il soit Beni Ouarain, Boucherouite ou Azilal, est tissé à la main en laine vierge — une fibre robuste mais sensible. Bien entretenu, il dure 30-50 ans. Mal nettoyé, on peut le rendre inutilisable en une seule séance (rétrécissement, feutrage, décoloration). Voici les bonnes pratiques au quotidien, et le protocole de nettoyage en profondeur qui marche.",
    sections: [
      {
        title: "Pourquoi le tapis berbère est sensible",
        paragraphs: [
          "La laine du berbère est riche en lanoline naturelle (la graisse qui protège la fibre). Cette graisse repousse l'eau et la saleté. Mais elle disparaît avec les nettoyages agressifs — et là le tapis devient fragile, perd son moelleux et marque les taches.",
          "Trois ennemis principaux : l'eau chaude (>40°C : feutre la fibre, rétrécit le tapis), les détergents alcalins (savon noir, lessive : décolorent et abîment la laine), le frottement énergique (arrache les fibres, fait pelucher).",
        ],
      },
      {
        title: "Entretien quotidien : aspiration douce",
        paragraphs: [
          "Le geste essentiel : aspirateur sans brosse rotative, ou brosse rotative arrêtée (mode \"tapis\" sur les aspirateurs récents). La brosse motorisée arrache les fibres longues du berbère.",
          "Fréquence : 1 fois par semaine en passage léger, 1 fois par mois en passage approfondi (faces avant et arrière du tapis). Aspirer dans le sens du poil, pas à contresens.",
        ],
      },
      {
        title: "Taches fraîches : intervention immédiate",
        paragraphs: [
          "Un tapis berbère absorbe lentement (grâce à la lanoline). Vous avez 10-15 minutes pour réagir efficacement sur une tache fraîche :",
        ],
        bullets: [
          "1️⃣ Absorber au maximum avec un linge propre et sec (tamponner, jamais frotter)",
          "2️⃣ Eau froide tiède + savon de Marseille véritable très dilué",
          "3️⃣ Tamponner doucement de l'extérieur vers l'intérieur",
          "4️⃣ Rincer avec un linge humide propre (juste tamponner, pas d'eau abondante)",
          "5️⃣ Sécher en absorbant l'humidité avec un linge sec, puis air libre",
        ],
      },
      {
        title: "Ce qu'il ne faut JAMAIS faire",
        paragraphs: [
          "Les erreurs qui peuvent abîmer un berbère :",
        ],
        bullets: [
          "🚫 Le mettre en machine à laver (rétrécissement, feutrage : tapis perdu)",
          "🚫 Utiliser de l'eau chaude (>40°C) — feutre la laine, rétrécit le tapis",
          "🚫 Frotter avec une brosse à poils durs — arrache les fibres",
          "🚫 Eau de Javel ou produits chlorés — décolorent définitivement",
          "🚫 Sécher au sèche-cheveux ou directement sur radiateur — déforme la fibre",
          "🚫 Le laisser humide >24 h — moisissure et odeur permanente",
        ],
      },
      {
        title: "Nettoyage en profondeur : le protocole pro",
        paragraphs: [
          "Tous les 2-3 ans, un nettoyage complet est nécessaire pour retirer la saleté en profondeur, les acariens et raviver les couleurs. Le protocole pro à Strasbourg :",
        ],
        bullets: [
          "Aspiration intense des 2 faces (10-15 min)",
          "Battage léger pour décrocher la poussière incrustée",
          "Pré-traitement des taches avec produit pH-neutre laine",
          "Shampouinage par injection-extraction à basse température (35°C max)",
          "Plusieurs passes d'extraction pour sécher la fibre rapidement",
          "Brossage léger dans le sens du poil pour redresser la fibre",
          "Séchage en pièce ventilée 4-8 h (jamais sèche-linge, jamais soleil direct)",
        ],
      },
      {
        title: "Le séchage : moment critique",
        paragraphs: [
          "C'est l'étape la plus importante pour ne pas abîmer un berbère. Idéalement : séchage à plat dans une pièce ventilée et chauffée (18-22°C), surface dégagée, ventilateur en complément. Pas de soleil direct (décoloration), pas de chaleur intense (feutrage). Compter 6-12 h selon l'humidité ambiante.",
          "C'est pour ça que beaucoup de pros préfèrent intervenir à domicile : on contrôle le séchage et on est sûr du résultat. Un berbère bâché et expédié dans un atelier prend plus de risques.",
        ],
      },
      {
        title: "Tarifs nettoyage tapis berbère à Strasbourg",
        paragraphs: [
          "Tarifs 2026 pour le nettoyage à domicile d'un berbère :",
        ],
        bullets: [
          "Tapis 1,5×2 m : 59 €",
          "Tapis 2×3 m : 89 €",
          "Tapis 2,5×3,5 m : 119 €",
          "Pré-traitement tache importante : +20-40 €",
          "Tapis très chargé (animaux, allergies) : +30%",
        ],
      },
    ],
    conclusion:
      "Le berbère est un tapis durable mais sensible. Aspiration douce hebdomadaire, intervention rapide sur les taches fraîches, et nettoyage complet tous les 2-3 ans : c'est tout. Évitez surtout machine à laver, eau chaude et produits agressifs. Pour le nettoyage en profondeur, l'injection-extraction à basse température reste la méthode la plus respectueuse de la fibre.",
    cta: {
      title: "Un tapis berbère qui mérite un nettoyage pro ?",
      description:
        "On intervient à domicile à Strasbourg avec protocole laine basse température. Devis ferme par photo WhatsApp sous 1 h.",
      message:
        "Bonjour StrasClean 👋 J'ai un tapis berbère à nettoyer à Strasbourg, je vous envoie une photo pour devis ?",
    },
  },

  // ─── Guide 9 — Quand faire nettoyer son canapé tissu ────────────────────
  {
    slug: "quand-nettoyer-canape-tissu-frequence",
    category: "canape",
    metaTitle:
      "Quand faire nettoyer son canapé tissu : la fréquence idéale",
    metaDescription:
      "Tous les combien faire nettoyer son canapé tissu ? La fréquence varie selon l'usage, les enfants, les animaux. Voici la grille précise + les signaux d'urgence.",
    title: "Quand (et tous les combien) faire nettoyer son canapé tissu ?",
    excerpt:
      "Trop tôt, c'est jeter de l'argent. Trop tard, c'est risquer un canapé non récupérable. Voici la grille de fréquence précise selon votre usage, les signaux qui doivent vous alerter, et ce que vous risquez à laisser trop longtemps.",
    publishedAt: "2026-07-10",
    readingMinutes: 5,
    relatedServiceSlug: "nettoyage-canape-strasbourg",
    intro:
      "Beaucoup pensent qu'un canapé tissu n'a pas besoin d'être nettoyé en profondeur tant qu'il \"n'a pas l'air sale\". C'est un piège : la saleté s'incruste, devient invisible, et au moment où ça paraît, c'est souvent trop tard. Voici la fréquence idéale selon votre situation, les signaux qui doivent vous alerter, et les conséquences d'un nettoyage trop espacé.",
    sections: [
      {
        title: "La règle générale : tous les 12-18 mois",
        paragraphs: [
          "Pour un canapé utilisé normalement (couple, sans enfant en bas âge ni animal), un nettoyage en profondeur tous les 12-18 mois suffit. C'est le rythme préconisé par les fabricants haut de gamme (Roche Bobois, Cinna, Ligne Roset) pour préserver le tissu sur 15-20 ans.",
          "À cette fréquence, on retire la saleté incrustée avant qu'elle ne pénètre durablement, on traite les acariens, et on préserve les couleurs. Coût d'un nettoyage tous les 12-18 mois (79 € à Strasbourg) vs coût de remplacement (1500-5000 €) : le calcul est vite fait.",
        ],
      },
      {
        title: "Avec enfants en bas âge : tous les 8-12 mois",
        paragraphs: [
          "Présence d'enfants <8 ans = accidents fréquents (jus, lait, gouter, traces de doigts, dessins au stylo). Même bien réagi sur le moment, des résidus restent dans la fibre. Sans entretien régulier, ils s'accumulent et finissent par former une couche durcie ou une décoloration visible.",
          "Recommandation : 1 nettoyage complet tous les 8-12 mois. Idéalement pendant les vacances scolaires (chambre des enfants vide, séchage tranquille).",
        ],
      },
      {
        title: "Avec animaux : tous les 6-8 mois",
        paragraphs: [
          "Animal qui monte sur le canapé = sébum, poils, poussière de patte. La sébum d'animal est particulièrement collante et difficile à retirer une fois incrustée. Les poils s'enfoncent dans la fibre et résistent à l'aspirateur.",
          "Sans entretien régulier, le canapé prend une teinte grise/jaune et une odeur d'animal qui devient permanente. Avec un nettoyage tous les 6-8 mois (incluant traitement anti-poils), on garde le canapé en bon état des années.",
        ],
      },
      {
        title: "En location Airbnb : tous les 3-4 mois",
        paragraphs: [
          "Rotation rapide de locataires différents = profil d'usage très varié, taches accidentelles fréquentes, exigence des avis Booking/Airbnb sur la propreté visible. Pour un hôte sérieux, un nettoyage trimestriel est l'investissement minimum.",
          "Sur Strasbourg, beaucoup de conciergeries Airbnb ont adopté ce rythme — il maintient les notes >4,8/5 et prolonge la durée de vie du mobilier.",
        ],
      },
      {
        title: "Signaux d'urgence (intervention immédiate)",
        paragraphs: [
          "Indépendamment de la fréquence régulière, certains signaux nécessitent une intervention sous 7 jours :",
        ],
        bullets: [
          "🚨 Tache importante fraîche (vin, café, sang, urine) : agir dans les 24-48 h max",
          "🚨 Odeur perçue (animal, transpiration, tabac) : l'odeur installée = saleté installée",
          "🚨 Décoloration localisée (zones de contact comme accoudoirs, têtière)",
          "🚨 Texture qui change (zone qui devient \"granuleuse\" ou \"collante\")",
          "🚨 Réaction allergique de votre entourage en s'asseyant",
          "🚨 Démangeaisons après usage prolongé (acariens probables)",
        ],
      },
      {
        title: "Conséquences d'un nettoyage trop espacé",
        paragraphs: [
          "Ce que vous risquez si vous laissez 3-5 ans sans nettoyage :",
          "1) Saleté incrustée non récupérable au-delà d'un certain point. Le tissu garde une couleur grisâtre permanente même après nettoyage pro. 2) Acariens en quantité importante (provocant allergies/rhinites). 3) Dégradation prématurée du tissu : la saleté abrasive use les fibres à chaque assise. 4) Coût final : un canapé bien entretenu dure 15-20 ans ; mal entretenu, 5-8 ans. Différence : 1000-3000 € sur la durée.",
        ],
      },
      {
        title: "Le bon entretien entre 2 nettoyages",
        paragraphs: [
          "Pour espacer les nettoyages pro, voici les bons gestes :",
        ],
        bullets: [
          "Aspiration hebdomadaire (sièges + dossier + tranches)",
          "Réaction immédiate sur taches fraîches (15 min max)",
          "Aération régulière de la pièce (ventilation = moins d'humidité absorbée)",
          "Rotation des coussins si réversibles (usure homogène)",
          "Pas de produits gras sur la zone près du canapé (crèmes, huiles)",
        ],
      },
    ],
    conclusion:
      "12-18 mois en usage normal, 8-12 mois avec enfants, 6-8 mois avec animaux, 3-4 mois en Airbnb. À 79-149 € par nettoyage à Strasbourg, c'est l'investissement le plus rentable pour préserver un canapé qui coûte 1500-5000 € à remplacer. La règle d'or : ne pas attendre que le canapé \"ait l'air sale\" — à ce moment-là, on a déjà laissé passer 6-12 mois de trop.",
    cta: {
      title: "Votre canapé arrive à sa fréquence de nettoyage ?",
      description:
        "Envoyez une photo WhatsApp, on vous dit honnêtement s'il en a besoin et le tarif. Sans engagement.",
      message:
        "Bonjour StrasClean 👋 Je voudrais savoir si mon canapé a besoin d'un nettoyage. Je vous envoie une photo ?",
    },
  },

  // ─── Guide 10 — Canapé cuir blanc sans l'abîmer ─────────────────────────
  {
    slug: "nettoyer-canape-cuir-blanc-protocole",
    category: "canape",
    metaTitle:
      "Nettoyer un canapé cuir blanc sans l'abîmer ni le jaunir",
    metaDescription:
      "Le canapé cuir blanc est le plus sensible des cuirs. Mauvais produit = jaunissement définitif. Voici le protocole pour le nettoyer en préservant la teinte et la souplesse.",
    title: "Nettoyer un canapé cuir blanc sans l'abîmer ni le jaunir",
    excerpt:
      "Le cuir blanc est le matériau le plus piégeux : un mauvais produit (lingette grand public, alcool, vinaigre fort) le jaunit en quelques semaines. Voici le protocole précis pour le nettoyer en préservant teinte et souplesse, par un spécialiste cuir à Strasbourg.",
    publishedAt: "2026-07-17",
    readingMinutes: 6,
    relatedServiceSlug: "nettoyage-canape-cuir-strasbourg",
    intro:
      "Le canapé cuir blanc est l'un des matériaux les plus exigeants en termes d'entretien. C'est aussi celui où les erreurs coûtent le plus cher : un mauvais produit (lingettes \"toutes surfaces\", vinaigre, alcool ménager) peut faire jaunir le cuir en quelques semaines — et le jaunissement est rarement réversible. Voici le protocole précis utilisé par les pros du cuir.",
    sections: [
      {
        title: "Pourquoi le cuir blanc jaunit",
        paragraphs: [
          "Le jaunissement vient principalement de 3 causes : 1) Les UV (soleil direct) qui oxydent les pigments blancs du cuir et révèlent la teinte chamoisée naturelle de la peau. 2) Les corps gras (sébum des bras nus, crèmes solaires, parfums alcoolisés) qui s'imprègnent et se transforment chimiquement en jaune avec le temps. 3) Les produits inadaptés (lingettes ménagères, alcool, vinaigre) qui décomposent la finition pigmentée du cuir.",
          "Une fois jauni, un cuir blanc est très difficile (et coûteux) à re-blanchir. La prévention est essentielle.",
        ],
      },
      {
        title: "Identifier votre type de cuir blanc",
        paragraphs: [
          "Tous les cuirs blancs ne se traitent pas pareil. Trois grandes familles :",
        ],
        bullets: [
          "Cuir pleine fleur pigmenté (le plus courant en France) : surface lisse, résistante aux taches superficielles",
          "Cuir Nappa (haut de gamme) : très souple, mat, plus poreux donc plus délicat",
          "Cuir semi-aniline (chic) : couleur claire et matte, très sensible aux taches",
        ],
      },
      {
        title: "Entretien hebdomadaire : essuyage doux",
        paragraphs: [
          "1 fois par semaine, essuyer avec un chiffon microfibre légèrement humide (eau du robinet, juste mouillé). Suivi d'un chiffon sec pour éviter les traces d'humidité.",
          "Ça suffit pour 90% des poussières et traces de doigts. Ne JAMAIS utiliser de lingettes \"toutes surfaces\" ni de produits ménagers — même \"doux\".",
        ],
      },
      {
        title: "Nettoyage mensuel : savon de Marseille très dilué",
        paragraphs: [
          "1 fois par mois (ou en cas de tache visible) : eau tiède + 2 gouttes de savon de Marseille pur (le vert, à l'huile d'olive) dans un demi-litre d'eau. Application au chiffon microfibre, mouvements circulaires doux. Rinçage avec un autre chiffon humide eau pure. Séchage immédiat avec un chiffon sec.",
          "C'est la méthode douce qui marche pour 95% des taches courantes (sueur, traces de doigts, sébum léger, café, vin si pris à temps).",
        ],
      },
      {
        title: "Ce qu'il ne faut JAMAIS utiliser",
        paragraphs: [
          "Sur un cuir blanc, ces produits sont à proscrire absolument :",
        ],
        bullets: [
          "🚫 Lingettes \"toutes surfaces\" / désinfectantes / pour bébé",
          "🚫 Alcool ménager, alcool à brûler, alcool isopropylique",
          "🚫 Vinaigre blanc concentré (sec rapidement = OK très dilué, sinon attaque le pH)",
          "🚫 Eau de Javel, ammoniaque, soude",
          "🚫 Produits supermarché \"spécial canapé\" non dédiés cuir",
          "🚫 Eau chaude (>30°C : altère les pigments)",
        ],
      },
      {
        title: "Tous les 6 mois : crème nourrissante cuir blanc",
        paragraphs: [
          "Pour maintenir la souplesse et créer une barrière contre les taches, appliquer 2 fois par an une crème de soin spécifique cuir blanc (marques pro : Saphir, Famaco, Avel). Application au chiffon coton, en très fine couche, séchage 30 min, lustrage léger.",
          "Tarif : 15-25 € le tube qui dure 3-5 ans. C'est l'investissement entretien le plus rentable pour préserver un canapé cuir blanc.",
        ],
      },
      {
        title: "Tache importante : intervention pro recommandée",
        paragraphs: [
          "Pour les taches importantes (vin, encre, sébum incrusté, jaunissement débutant), une intervention professionnelle reste plus sûre. Le pro utilise des produits pH-neutre spécifiques cuir blanc, baumes nourrissants adaptés, et peut effectuer un \"reblanchissement\" léger si le jaunissement est superficiel.",
          "À Strasbourg, on traite régulièrement des canapés cuir blanc. Tarif : 99-179 € selon taille et état initial. Le résultat sur un cuir bien entretenu est radical — souplesse, blancheur et éclat retrouvés.",
        ],
      },
      {
        title: "Si votre cuir a déjà jauni",
        paragraphs: [
          "Le jaunissement avancé n'est jamais entièrement réversible par un simple nettoyage. Deux options : 1) Un re-pigmentage professionnel (re-coloration spécifique cuir blanc, durable 5-10 ans), tarif 250-450 € selon taille. 2) Vivre avec le jaunissement en l'entretenant régulièrement pour ne pas qu'il s'aggrave.",
          "Le re-pigmentage est rentable sur un canapé haut de gamme (>2000 €). Sur un canapé moyen, mieux vaut renouveler.",
        ],
      },
    ],
    conclusion:
      "Le canapé cuir blanc est exigeant mais tout à fait possible à entretenir : essuyage hebdo, savon de Marseille très dilué mensuel, crème de soin tous les 6 mois. Évitez absolument les produits agressifs (lingettes, alcool, vinaigre). Pour les taches importantes, un pro vous épargne la catastrophe — le coût d'une intervention (100-180 €) reste sans commune mesure avec le remplacement.",
    cta: {
      title: "Canapé cuir blanc taché ou qui commence à jaunir ?",
      description:
        "On intervient à domicile à Strasbourg avec un protocole spécifique cuir blanc. Devis ferme par photo WhatsApp sous 1 h.",
      message:
        "Bonjour StrasClean 👋 J'ai un canapé cuir blanc qui aurait besoin d'un nettoyage pro à Strasbourg, je vous envoie une photo ?",
    },
  },

  // ─── Guide 11 — Nettoyage vapeur vs injecteur-extracteur ────────────────
  {
    slug: "nettoyage-vapeur-vs-injecteur-extracteur",
    category: "general",
    metaTitle:
      "Nettoyage à vapeur vs injecteur-extracteur : lequel choisir ?",
    metaDescription:
      "Vapeur ou injection-extraction ? Les deux méthodes pros expliquées, leurs avantages, leurs limites, et le choix selon votre situation (canapé, matelas, tapis, voiture).",
    title: "Nettoyage à vapeur vs injecteur-extracteur : que choisir ?",
    excerpt:
      "Vapeur et injection-extraction sont les deux méthodes pros du nettoyage textile. Elles n'ont rien à voir techniquement et ne donnent pas le même résultat. Voici les différences réelles, les avantages, les limites — et le bon choix selon votre situation.",
    publishedAt: "2026-07-24",
    readingMinutes: 6,
    relatedServiceSlug: "nettoyage-canape-strasbourg",
    intro:
      "Quand on cherche un pro pour nettoyer un canapé, un matelas ou un tapis, deux méthodes reviennent : la vapeur et l'injection-extraction (souvent appelée \"shampouinage pro\"). Les deux sont présentées comme \"professionnelles\" — mais elles ne fonctionnent pas pareil et ne donnent pas le même résultat. Voici les différences réelles, en clair.",
    sections: [
      {
        title: "Comment fonctionne le nettoyage à vapeur",
        paragraphs: [
          "Le nettoyeur vapeur projette de la vapeur d'eau à haute température (130-180°C) sur la surface. La chaleur décolle la saleté et tue les bactéries / acariens. La surface est ensuite essuyée avec un chiffon ou aspirée légèrement.",
          "Principe : c'est de la chaleur + désinfection thermique. Pas de produit chimique (en théorie). Pas de réelle extraction de saleté — on déplace, on désincruste partiellement, mais on n'aspire pas le résidu en profondeur.",
        ],
      },
      {
        title: "Comment fonctionne l'injection-extraction",
        paragraphs: [
          "L'injecteur-extracteur (Karcher Puzzi, Truvox Quattro, Numatic CT) projette dans la fibre une solution active (eau + détergent pH-adapté), puis ré-aspire immédiatement le liquide chargé de saleté. C'est de l'aspiration mouillée en synchronie avec l'injection.",
          "Principe : on injecte → ça décolle la saleté → on extrait → le tissu ressort propre et peu humide. C'est mécanique + chimique + extraction simultanée.",
        ],
      },
      {
        title: "Le tableau comparatif",
        paragraphs: [
          "Pour chaque critère, qui gagne :",
        ],
        bullets: [
          "Profondeur du nettoyage : extracteur >> vapeur (l'extracteur retire la saleté, la vapeur la déplace)",
          "Temps de séchage : extracteur (3-4 h) > vapeur (1-2 h)",
          "Élimination acariens : extracteur (avec acaricide) ≈ vapeur (chaleur)",
          "Risque pour tissus délicats : vapeur < extracteur (vapeur à dose modérée plus sûre)",
          "Risque pour les couleurs : extracteur (avec mauvais produit) >> vapeur",
          "Élimination odeurs : extracteur >> vapeur (chaleur fixe certaines odeurs au lieu de les retirer)",
          "Convient pour : vapeur = entretien régulier, extracteur = nettoyage en profondeur",
        ],
      },
      {
        title: "Pour le canapé tissu : injecteur-extracteur gagne",
        paragraphs: [
          "Sur un canapé tissu sale, l'injection-extraction est nettement supérieure. La vapeur déloge la saleté en surface mais ne l'aspire pas — elle reste dans le tissu sous forme de résidus humides qui sèchent et reviennent en surface au bout de quelques jours.",
          "L'extracteur, lui, fait sortir physiquement la saleté avec le liquide. Le tissu ressort visiblement plus clair et l'effet dure des mois.",
        ],
      },
      {
        title: "Pour le matelas : injecteur-extracteur avec acaricide",
        paragraphs: [
          "Sur un matelas, l'injection-extraction est aussi plus efficace que la vapeur seule pour deux raisons : 1) On peut injecter un produit acaricide qui pénètre en profondeur, ce qui n'est pas possible avec la vapeur. 2) L'extraction retire les déjections d'acariens (les vraies responsables des allergies), pas seulement les acariens vivants.",
          "La vapeur seule sur un matelas reste utile en entretien régulier (mensuel) pour la désinfection de surface. Mais elle ne remplace pas un traitement annuel d'injection-extraction.",
        ],
      },
      {
        title: "Pour le tapis : selon la matière",
        paragraphs: [
          "Tapis en laine ou matière délicate (berbère, persan, soie) : la vapeur à basse pression est plus sûre. L'extracteur est utilisable mais demande un protocole pro (basse température, produit pH-neutre laine).",
          "Tapis synthétique ou polypropylène standard : l'extracteur est nettement supérieur. Pas de risque pour la fibre et résultat très efficace sur la saleté incrustée.",
        ],
      },
      {
        title: "Pour la voiture : injecteur-extracteur sans hésiter",
        paragraphs: [
          "Sur l'intérieur d'une voiture (sièges, moquette, plafond), l'injection-extraction est la référence pro. La vapeur seule en voiture est rarement suffisante car la saleté est très incrustée (huile, transpiration, alimentation) et l'extraction reste essentielle.",
          "Tous les detailers sérieux à Strasbourg utilisent un extracteur (Karcher Puzzi 30/4, Truvox HydroMatic) sur les voitures.",
        ],
      },
      {
        title: "Le choix final",
        paragraphs: [
          "Pour un entretien hebdomadaire / léger : la vapeur est très bien. Pour un nettoyage en profondeur (canapé, matelas, voiture sale, taches anciennes) : l'injection-extraction est nettement plus efficace.",
          "Si un \"pro\" vous propose UNIQUEMENT de la vapeur pour 100-150 €, c'est un mauvais signal — c'est un investissement matériel léger (300-800 €), pas un équipement de pro du textile en profondeur. Un vrai pro a un extracteur (1500-3500 €) et peut faire les deux selon la situation.",
        ],
      },
    ],
    conclusion:
      "Vapeur et injection-extraction ne s'opposent pas : ce sont deux outils complémentaires. Pour l'entretien régulier ou les tissus très délicats, la vapeur est très bien. Pour un nettoyage en profondeur ou des taches anciennes (la situation où la plupart des gens font appel à un pro), l'injection-extraction est nettement plus efficace. À Strasbourg comme ailleurs, c'est la méthode de référence des pros du textile.",
    cta: {
      title: "Vous hésitez sur la méthode pour votre cas ?",
      description:
        "Décrivez votre situation (matière, état, taches) sur WhatsApp. On vous dit honnêtement quelle méthode convient et le tarif.",
      message:
        "Bonjour StrasClean 👋 J'hésite entre vapeur et injection-extraction pour mon canapé / matelas / tapis. Vous pouvez me conseiller ?",
    },
  },

  // ─── Guide 12 — Louer un Kärcher pour son canapé ────────────────────────
  {
    slug: "louer-karcher-canape-bonne-idee",
    category: "canape",
    metaTitle:
      "Louer un Kärcher pour nettoyer son canapé : bonne ou mauvaise idée ?",
    metaDescription:
      "La location de Kärcher / shampouineur en grande surface est tentante pour économiser. Voici les vrais avantages, les pièges et le verdict honnête vs un service à domicile.",
    title: "Louer un Kärcher pour son canapé : la fausse bonne idée (et la vraie économie)",
    excerpt:
      "Louer un shampouineur en grande surface pour 30-50 € semble une économie évidente face aux 79-149 € d'un pro. La réalité est plus nuancée : voici les pièges connus (auréole, surmouillage, fatigue) et le vrai calcul économique.",
    publishedAt: "2026-07-31",
    readingMinutes: 5,
    relatedServiceSlug: "nettoyage-canape-strasbourg",
    intro:
      "Vous voyez l'affiche : \"Louer un shampouineur Kärcher / Vapormatic / Lavor à 30 € la journée\". L'économie semble évidente face à un service pro à 79-149 €. Mais en pratique, sur 100 personnes qui louent à Strasbourg, je vois revenir 20-30 % avec une auréole, un canapé trop humide, ou un résultat décevant — et qui finissent par appeler un pro. Voici l'analyse honnête.",
    sections: [
      {
        title: "Ce que la location vous coûte vraiment",
        paragraphs: [
          "Le tarif de 30 € est trompeur. Le coût réel d'une location DIY canapé :",
        ],
        bullets: [
          "Location appareil : 30-50 € (1 jour) ou 60-90 € (2 jours)",
          "Produit shampoing : 12-20 € (1 flacon obligatoire)",
          "Détachant pré-traitement (recommandé) : 8-15 €",
          "Déplacement aller-retour magasin : 1-2 h + carburant",
          "Temps de travail : 2-4 h pour nettoyer un canapé tissu correctement",
          "Risque : auréole ou surmouillage → potentiellement +150 € pour rattraper",
          "TOTAL réaliste : 60-100 € + 4-6 h de votre temps + risque",
        ],
      },
      {
        title: "Les 4 pièges récurrents de la location DIY",
        paragraphs: [
          "Les 4 erreurs que je vois constamment chez les clients qui m'appellent \"après\" une tentative DIY :",
        ],
        bullets: [
          "1️⃣ Surmouillage (canapé trop humide → moisissure 48 h plus tard)",
          "2️⃣ Auréole en bordure (extraction insuffisante = halo visible définitif)",
          "3️⃣ Mauvais produit (formule trop concentrée → décoloration du tissu)",
          "4️⃣ Frottement trop énergique (boulochage de la fibre → tissu ruiné)",
        ],
      },
      {
        title: "Pourquoi un Kärcher de location n'est pas un Kärcher pro",
        paragraphs: [
          "Différence technique : un shampouineur de location grande surface a une puissance d'extraction de 100-200 mbar. Un injecteur-extracteur pro (Karcher Puzzi 30/4, Truvox) tourne à 280-330 mbar.",
          "Concrètement, ça veut dire que le pro extrait 80-90 % du liquide qu'il injecte (le tissu ressort presque sec). Le DIY de location extrait 50-60 % : le tissu reste humide longtemps, et c'est exactement ce qui crée les problèmes (moisissure, auréole, odeur).",
        ],
      },
      {
        title: "Quand la location est OK",
        paragraphs: [
          "La location peut être une bonne idée dans 3 cas précis : 1) Vous avez plusieurs choses à nettoyer en même temps (canapé + tapis + matelas + voiture) — la rentabilité de la journée s'améliore. 2) Le canapé est en très bon état et vous voulez juste un rafraîchissement léger sur un tissu simple (coton, polyester). 3) Vous êtes équipé / expérimenté en DIY et savez exactement quoi faire.",
          "Dans tous les autres cas, le calcul économique est défavorable au DIY.",
        ],
      },
      {
        title: "Quand la location est risquée",
        paragraphs: [
          "À éviter dans ces situations :",
        ],
        bullets: [
          "🚫 Canapé tissu délicat (lin, velours, soie, alcantara)",
          "🚫 Canapé cuir (l'extracteur de location n'est pas adapté au cuir)",
          "🚫 Taches anciennes ou très importantes (extraction insuffisante)",
          "🚫 Si vous n'avez jamais utilisé d'appareil similaire",
          "🚫 Si vous n'avez pas de pièce bien ventilée pour le séchage",
        ],
      },
      {
        title: "Le vrai calcul économique",
        paragraphs: [
          "Comparons : DIY location bien réalisée → 80 € de coût total + 5 h de votre temps. Pro à domicile → 79-99 € (canapé 2-3 places à Strasbourg) en 1h30 sans aucun effort de votre part.",
          "L'écart économique réel est de 0-20 € maximum, en votre défaveur quand on inclut le temps et le risque. Et si le DIY tourne mal et que vous devez rattraper avec un pro, l'addition monte à 200-250 €.",
          "Pour 95 % des canapés, le pro à domicile est en réalité plus rentable que la location DIY.",
        ],
      },
      {
        title: "Ce qui rend un pro plus rentable",
        paragraphs: [
          "À 79-99 € à Strasbourg pour un canapé 2-3 places, le pro vous offre :",
        ],
        bullets: [
          "Aucun effort (1h30 votre temps libre)",
          "Matériel pro (extraction 280+ mbar, produits pH-adaptés)",
          "Garantie résultat (intervention gratuite si auréole)",
          "Pas de risque sur le tissu",
          "Séchage rapide (2-3 h vs 12-24 h en DIY)",
          "Conseils d'entretien personnalisés",
        ],
      },
    ],
    conclusion:
      "La location de Kärcher pour son canapé n'est pas une vraie économie dans la plupart des cas. Le tarif affiché (30 €) cache un coût total proche du tarif pro (60-100 €), avec un risque réel d'auréole, surmouillage ou tissu abîmé. À 79-99 € à Strasbourg pour un service à domicile équipé pro et garanti, le calcul est défavorable au DIY pour 95% des canapés.",
    cta: {
      title: "Plutôt un pro qui s'en occupe sans risque ?",
      description:
        "Tarif clair, devis ferme par photo WhatsApp, intervention à domicile sous 48 h à Strasbourg. Garantie résultat.",
      message:
        "Bonjour StrasClean 👋 J'aimerais un devis pour le nettoyage de mon canapé à Strasbourg. Je vous envoie une photo ?",
    },
  },

  // ─── Guide AEO — Prix nettoyage voiture à Strasbourg ────────────────────
  {
    slug: "prix-nettoyage-voiture-strasbourg-guide",
    category: "voiture",
    metaTitle:
      "Combien coûte un nettoyage de voiture à Strasbourg ? Prix 2026",
    metaDescription:
      "Prix d'un nettoyage de voiture à domicile à Strasbourg en 2026 : à partir de 39 € (entretien), 79 € (intérieur approfondi) et 119 € (detailing complet). Détail des tarifs, ce qui est inclus et ce qui fait varier le prix.",
    title: "Combien coûte un nettoyage de voiture à Strasbourg ? (prix 2026)",
    excerpt:
      "Tarifs clairs et à jour du nettoyage auto à domicile à Strasbourg : les 3 niveaux de prestation, ce qui est inclus à chaque formule, et les 4 facteurs qui font varier le devis final.",
    publishedAt: "2026-06-07",
    updatedAt: "2026-06-07",
    readingMinutes: 6,
    relatedServiceSlug: "nettoyage-voiture-domicile-strasbourg",
    intro:
      "À Strasbourg, un nettoyage de voiture à domicile coûte à partir de 39 € pour un entretien intérieur, 79 € pour un nettoyage intérieur approfondi avec shampouinage des sièges, et 119 € pour un detailing complet intérieur + extérieur. Le tarif final dépend surtout de la taille du véhicule et de son état. Voici le détail, ce que comprend chaque formule, et comment estimer votre prix sans surprise.",
    sections: [
      {
        title: "Les prix par formule (à domicile, à Strasbourg)",
        paragraphs: [
          "StrasClean propose trois niveaux de prestation, tous réalisés à domicile, sur votre lieu de travail ou à l'adresse de votre choix, à Strasbourg et dans les communes voisines. Les tarifs sont annoncés « à partir de » pour une citadine.",
        ],
        bullets: [
          "Formule Essentiel — dès 39 € (30 à 45 min) : aspiration complète, plastiques, vitres intérieures, finitions.",
          "Formule Premium Intérieur — dès 79 € (1h à 1h30) : intérieur approfondi + shampouinage des sièges + désinfection.",
          "Formule Intégrale StrasClean — dès 119 € (2h) : intérieur complet + lavage extérieur à la main + décontamination carrosserie + traitement poils d'animaux inclus.",
        ],
      },
      {
        title: "Ce qui fait varier le prix",
        paragraphs: [
          "Le prix « à partir de » correspond à une citadine en état d'entretien courant. Quatre facteurs principaux peuvent l'ajuster :",
        ],
        bullets: [
          "La taille du véhicule : berline +10 €, SUV/monospace +20 €, utilitaire +30 €.",
          "L'état intérieur : taches incrustées, sièges très sales ou véhicule très encrassé demandent plus de temps.",
          "Les poils d'animaux : inclus en Intégrale, en option (+15 à 30 €) sur les autres formules.",
          "Les options spécifiques : traitement des odeurs (+20 à 40 €), taches tenaces (+10 à 20 €).",
        ],
      },
      {
        title: "Pourquoi le tarif à domicile est compétitif",
        paragraphs: [
          "Un nettoyage à domicile évite le déplacement vers un centre et l'attente sur place : l'équipe vient à vous, le déplacement est inclus dans le tarif annoncé sur toute la zone desservie.",
          "StrasClean travaille en équipe de 2 professionnels, ce qui divise par deux le temps d'intervention par rapport à un detailer seul, à qualité équivalente. Le matériel est professionnel (injecteur-extracteur), pour un séchage rapide et sans auréole.",
        ],
      },
      {
        title: "Comment obtenir un prix ferme avant de réserver",
        paragraphs: [
          "Le plus simple est d'envoyer une photo de l'intérieur du véhicule par WhatsApp avec votre ville. Le tarif est confirmé avant l'intervention : pas de surprise une fois sur place.",
        ],
        bullets: [
          "Indiquez le type de véhicule (citadine, berline, SUV, utilitaire).",
          "Précisez l'état (entretien courant, poils d'animaux, taches, odeurs).",
          "Donnez votre commune pour confirmer la disponibilité du créneau.",
        ],
      },
      {
        title: "Questions fréquentes sur le prix",
        paragraphs: [],
        bullets: [
          "Quel est le prix minimum ? À partir de 39 € pour une citadine (formule Essentiel).",
          "Le lavage extérieur est-il compris ? Oui, dans la formule Intégrale StrasClean (119 €).",
          "Le déplacement est-il facturé en plus ? Non, il est inclus dans le tarif annoncé sur la zone desservie.",
          "Le prix peut-il changer une fois sur place ? Non : le tarif est confirmé avant l'intervention, après description ou photo.",
        ],
      },
    ],
    conclusion:
      "À Strasbourg, comptez 39 € (entretien), 79 € (intérieur approfondi) ou 119 € (detailing complet) pour un nettoyage de voiture à domicile, avec un supplément selon la taille du véhicule. Le meilleur réflexe pour un devis exact : envoyer une photo de l'intérieur par WhatsApp.",
    cta: {
      title: "Un devis précis en 2 minutes ?",
      description:
        "Envoyez une photo de votre véhicule par WhatsApp : on vous confirme la formule adaptée, le tarif ferme et un créneau à domicile à Strasbourg.",
      message:
        "Bonjour StrasClean 👋 J'aimerais le prix pour un nettoyage de ma voiture à Strasbourg. Je vous envoie une photo de l'intérieur ?",
    },
  },

  // ─── Guide AEO — Canapé : domicile, pressing ou soi-même ? ──────────────
  {
    slug: "nettoyage-canape-domicile-ou-pressing",
    category: "canape",
    metaTitle:
      "Nettoyage de canapé : à domicile, pressing ou soi-même ? Comparatif",
    metaDescription:
      "Faut-il nettoyer son canapé soi-même, l'emmener au pressing ou faire venir un pro à domicile ? Comparatif honnête des 3 options (coût, résultat, risques) pour bien choisir à Strasbourg.",
    title: "Nettoyage de canapé : à domicile, pressing ou soi-même ?",
    excerpt:
      "Les 3 façons de nettoyer un canapé comparées sans langue de bois : coût réel, qualité du résultat, risques d'auréole, et le cas où chaque option est la bonne.",
    publishedAt: "2026-06-07",
    updatedAt: "2026-06-07",
    readingMinutes: 7,
    relatedServiceSlug: "nettoyage-canape-strasbourg",
    intro:
      "Pour nettoyer un canapé en profondeur, trois options existent : le faire soi-même, le confier à un pressing/professionnel en atelier, ou faire venir un pro à domicile avec un injecteur-extracteur. La meilleure dépend de la matière, de l'état du canapé et de votre budget. Voici un comparatif clair pour décider rapidement.",
    sections: [
      {
        title: "Option 1 — Le faire soi-même",
        paragraphs: [
          "Le DIY (chiffon + savon, ou location d'un appareil type Kärcher) convient pour un entretien léger ou une petite tache fraîche. En revanche, sur un canapé encrassé, le risque principal est le surmouillage : trop d'eau mal extraite laisse des auréoles et peut faire moisir la mousse.",
        ],
        bullets: [
          "Coût : faible (produits) à ~30 € (location d'appareil).",
          "Résultat : correct en surface, limité en profondeur.",
          "Risque : auréoles, surmouillage, tissu détendu.",
          "Idéal pour : entretien courant, taches fraîches localisées.",
        ],
      },
      {
        title: "Option 2 — Le pressing / atelier",
        paragraphs: [
          "Confier les coussins déhoussables à un pressing est possible, mais la plupart des canapés ne sont pas (entièrement) déhoussables, et transporter une assise fixe est impraticable. Le pressing traite bien le textile déhoussable, moins la structure.",
        ],
        bullets: [
          "Coût : variable, souvent au coussin/housse.",
          "Résultat : bon sur housses déhoussables uniquement.",
          "Contrainte : transport, délai, canapé indisponible plusieurs jours.",
          "Idéal pour : housses amovibles, petites pièces textiles.",
        ],
      },
      {
        title: "Option 3 — Un pro à domicile (injecteur-extracteur)",
        paragraphs: [
          "L'intervention à domicile avec un injecteur-extracteur professionnel pulvérise une solution puis aspire immédiatement l'eau et la saleté : c'est ce qui permet un nettoyage en profondeur SANS surmouillage, avec un séchage rapide et sans auréole. Le canapé reste chez vous, traité sur place en une intervention.",
        ],
        bullets: [
          "Coût : à partir de 79 € à Strasbourg (selon taille et matière).",
          "Résultat : nettoyage en profondeur, sans auréole.",
          "Avantage : aucun transport, séchage rapide, adapté tissu/cuir/alcantara.",
          "Idéal pour : canapé encrassé, taches anciennes, odeurs, poils d'animaux.",
        ],
      },
      {
        title: "Tableau de décision rapide",
        paragraphs: [
          "Pour choisir en 10 secondes :",
        ],
        bullets: [
          "Petite tache fraîche → soi-même.",
          "Housses entièrement déhoussables → pressing possible.",
          "Canapé fixe, encrassé, taches anciennes ou odeurs → pro à domicile.",
          "Cuir, alcantara, tissu fragile → pro à domicile (produits adaptés à la matière).",
        ],
      },
      {
        title: "Questions fréquentes",
        paragraphs: [],
        bullets: [
          "Combien coûte un nettoyage de canapé à domicile à Strasbourg ? À partir de 79 €.",
          "Combien de temps de séchage ? Quelques heures avec l'injection-extraction (vs 1 à 2 jours en surmouillage maison).",
          "Le cuir peut-il être nettoyé à domicile ? Oui, avec des produits spécifiques cuir (jamais les mêmes que pour le tissu).",
        ],
      },
    ],
    conclusion:
      "Pour une petite tache, le DIY suffit. Pour des housses amovibles, le pressing peut convenir. Mais pour un canapé fixe, encrassé ou taché en profondeur, l'intervention d'un pro à domicile avec injecteur-extracteur (dès 79 € à Strasbourg) reste la solution la plus sûre : profondeur, séchage rapide, zéro auréole.",
    cta: {
      title: "Un canapé comme neuf, sans risque ?",
      description:
        "Devis par photo WhatsApp, intervention à domicile à Strasbourg, séchage rapide et sans auréole. Tissu, cuir ou alcantara.",
      message:
        "Bonjour StrasClean 👋 J'hésite pour le nettoyage de mon canapé. Pouvez-vous me conseiller et me donner un prix ? Je vous envoie une photo.",
    },
  },

  // ─── Guide AEO — Prix nettoyage tapis à Strasbourg ──────────────────────
  {
    slug: "prix-nettoyage-tapis-strasbourg-guide",
    category: "tapis",
    metaTitle:
      "Combien coûte un nettoyage de tapis à domicile à Strasbourg ? 2026",
    metaDescription:
      "Prix d'un nettoyage de tapis à domicile à Strasbourg en 2026 : à partir de 49 €. Ce qui fait varier le tarif (taille, matière, état), et pourquoi le nettoyage à domicile évite le pressing.",
    title: "Combien coûte un nettoyage de tapis à domicile à Strasbourg ?",
    excerpt:
      "Tarifs à jour du nettoyage de tapis à domicile à Strasbourg, les facteurs qui font varier le prix selon la taille et la matière, et l'avantage du traitement sur place sans transport vers un pressing.",
    publishedAt: "2026-06-07",
    updatedAt: "2026-06-07",
    readingMinutes: 5,
    relatedServiceSlug: "nettoyage-tapis-domicile-strasbourg",
    intro:
      "À Strasbourg, un nettoyage de tapis à domicile démarre à 49 €. Le prix dépend ensuite de la surface, de la matière (synthétique, laine, berbère) et de l'état (taches, odeurs, urine d'animaux). L'intérêt du nettoyage à domicile : pas de transport vers un pressing, le tapis est traité sur place avec un séchage maîtrisé.",
    sections: [
      {
        title: "Le prix de base et ce qui le fait varier",
        paragraphs: [
          "Le tarif « à partir de 49 € » correspond à un tapis de taille standard en entretien courant. Plusieurs éléments l'ajustent :",
        ],
        bullets: [
          "La surface : un grand tapis de salon demande plus de produit et de temps.",
          "La matière : laine et tapis berbères demandent des produits doux et un soin particulier.",
          "L'état : taches anciennes, odeurs, urine d'animaux nécessitent un traitement renforcé.",
          "L'épaisseur / les franges : les tapis épais ou à franges allongent le travail.",
        ],
      },
      {
        title: "Pourquoi nettoyer son tapis à domicile plutôt qu'en pressing",
        paragraphs: [
          "Emmener un tapis au pressing implique de le rouler, le transporter, puis attendre plusieurs jours. À domicile, le tapis est shampouiné et aspiré sur place avec un matériel professionnel (injection-extraction) : la saleté et l'eau sont extraites dans la foulée, pour un séchage rapide et sans auréole.",
          "C'est particulièrement utile pour les grands tapis ou les tapis fragiles qu'on préfère ne pas déplacer.",
        ],
      },
      {
        title: "Comment obtenir un devis exact",
        paragraphs: [
          "Le plus simple : envoyer une photo du tapis par WhatsApp avec ses dimensions approximatives et la matière si vous la connaissez. Le tarif est confirmé avant l'intervention.",
        ],
        bullets: [
          "Dimensions approximatives (longueur × largeur).",
          "Matière si connue (synthétique, laine, berbère…).",
          "Nature des taches éventuelles (boue, vin, urine animale…).",
        ],
      },
      {
        title: "Questions fréquentes",
        paragraphs: [],
        bullets: [
          "Prix minimum d'un nettoyage de tapis à Strasbourg ? À partir de 49 € à domicile.",
          "Combien de temps de séchage ? Quelques heures grâce à l'extraction (vs un tapis détrempé en lavage maison).",
          "Les odeurs d'animaux partent-elles ? Oui, avec un traitement désodorisant adapté en complément.",
        ],
      },
    ],
    conclusion:
      "Comptez à partir de 49 € pour un nettoyage de tapis à domicile à Strasbourg, le tarif final dépendant de la taille, de la matière et de l'état. Le nettoyage sur place évite le transport et garantit un séchage rapide sans auréole.",
    cta: {
      title: "Un tapis ravivé, sans le déplacer ?",
      description:
        "Envoyez une photo et les dimensions par WhatsApp : devis ferme et intervention à domicile à Strasbourg, séchage rapide.",
      message:
        "Bonjour StrasClean 👋 J'aimerais le prix pour le nettoyage de mon tapis à Strasbourg. Je vous envoie une photo avec les dimensions ?",
    },
  },

  // ─── Guide AEO — Detailing vs lavage classique ──────────────────────────
  {
    slug: "detailing-vs-lavage-classique-difference",
    category: "voiture",
    metaTitle:
      "Detailing auto vs lavage classique : quelle différence ? (2026)",
    metaDescription:
      "Detailing ou simple lavage : quelle différence concrète, pour quel résultat et quel prix ? Explication claire par un pro à Strasbourg pour savoir quelle prestation choisir.",
    title: "Detailing auto vs lavage classique : quelle différence ?",
    excerpt:
      "Lavage, nettoyage intérieur, detailing complet : ce que recouvre vraiment chaque terme, le résultat attendu, le prix, et comment choisir la bonne prestation pour votre voiture.",
    publishedAt: "2026-06-07",
    updatedAt: "2026-06-07",
    readingMinutes: 6,
    relatedServiceSlug: "nettoyage-voiture-domicile-strasbourg",
    intro:
      "Un lavage classique nettoie la surface (carrosserie, vitres, aspiration rapide). Le detailing, lui, est une remise en état complète et minutieuse, intérieure ET extérieure : shampouinage des sièges, décontamination de la carrosserie, finitions. La différence se voit surtout sur les voitures encrassées ou que l'on veut retrouver « comme neuves ». Voici comment distinguer les prestations et choisir la bonne.",
    sections: [
      {
        title: "Le lavage classique : l'entretien de surface",
        paragraphs: [
          "Le lavage classique vise la propreté visible et rapide : extérieur (carrosserie, vitres) et/ou une aspiration intérieure. C'est l'entretien régulier, idéal entre deux nettoyages plus poussés.",
        ],
        bullets: [
          "Objectif : propreté de surface, rapidité.",
          "Intérieur : aspiration, plastiques, vitres.",
          "À Strasbourg : formule Essentiel, dès 39 € à domicile.",
        ],
      },
      {
        title: "Le detailing : la remise à neuf complète",
        paragraphs: [
          "Le detailing est un travail minutieux, zone par zone. À l'intérieur : shampouinage et extraction des sièges, désinfection, traitement des plastiques et points de contact. À l'extérieur : lavage à la main, décontamination de la carrosserie (clay-bar), finition. L'objectif est un rendu « showroom », pas seulement « propre ».",
        ],
        bullets: [
          "Objectif : remise à neuf intérieure + extérieure.",
          "Intérieur : shampouinage sièges, désinfection, traitement complet.",
          "Extérieur : lavage main, décontamination, finition brillante.",
          "À Strasbourg : formule Intégrale StrasClean, dès 119 € à domicile.",
        ],
      },
      {
        title: "Entre les deux : le nettoyage intérieur approfondi",
        paragraphs: [
          "Beaucoup de besoins se situent entre le lavage rapide et le detailing complet : un intérieur vraiment approfondi avec shampouinage des sièges et désinfection, sans la partie extérieure poussée. C'est la formule Premium Intérieur (dès 79 €), idéale après un hiver, des trajets en famille ou avec des animaux.",
        ],
      },
      {
        title: "Comment choisir",
        paragraphs: [
          "Le bon choix dépend de l'état de la voiture et de votre objectif :",
        ],
        bullets: [
          "Entretien régulier, voiture déjà suivie → lavage / formule Essentiel (39 €).",
          "Intérieur sale, sièges tachés, poils, odeurs → intérieur approfondi / Premium Intérieur (79 €).",
          "Voiture très encrassée, avant une revente, rendu « comme neuf » → detailing / Intégrale (119 €).",
        ],
      },
      {
        title: "Questions fréquentes",
        paragraphs: [],
        bullets: [
          "Le detailing inclut-il l'extérieur ? Oui : lavage à la main + décontamination carrosserie.",
          "Un detailing aide-t-il à revendre ? Oui, un intérieur/extérieur remis à neuf valorise nettement le véhicule.",
          "Peut-on faire le detailing à domicile ? Oui, StrasClean le réalise chez vous à Strasbourg, en équipe de 2.",
        ],
      },
    ],
    conclusion:
      "Le lavage classique entretient, le detailing remet à neuf (intérieur + extérieur). Entre les deux, le nettoyage intérieur approfondi couvre la majorité des besoins. À Strasbourg, cela correspond à 39 € (Essentiel), 79 € (Premium Intérieur) et 119 € (Intégrale StrasClean), tout à domicile.",
    cta: {
      title: "Pas sûr de la prestation qu'il vous faut ?",
      description:
        "Envoyez une photo de votre voiture par WhatsApp : on vous oriente vers la bonne formule et un tarif ferme, à domicile à Strasbourg.",
      message:
        "Bonjour StrasClean 👋 Je ne sais pas s'il me faut un lavage ou un detailing. Pouvez-vous me conseiller ? Je vous envoie une photo.",
    },
  },
];

/** Construit l'URL d'un guide */
export const guidePath = (g: Guide) => `/guide/${g.slug}`;

/** Trouve un guide par son slug exact */
export const findGuide = (slug: string) =>
  GUIDES.find((g) => g.slug === slug);
