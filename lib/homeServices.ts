// ─────────────────────────────────────────────────────────────────────────
//  StrasClean Maison — Services de nettoyage à domicile (canapé, tapis,
//  matelas, fauteuil/chaise).
//
//  Architecture : on REUTILISE le type UseCase et le composant
//  UseCasePage (lib/usecases.ts + components/UseCasePage.tsx) pour
//  bénéficier de tout le rendu existant. Les pages sont routées via
//  matchSlug() de lib/services.ts (case 'usecase').
//
//  Ces pages couvrent un segment différent (Maison vs Auto) et sont
//  visibles depuis :
//   - la section "StrasClean Maison" sur la home
//   - le footer (lien "Nettoyage à domicile : canapé, tapis, matelas")
//   - le sitemap (via app/sitemap.ts)
//
//  URLs générées :
//   - /nettoyage-canape-strasbourg
//   - /nettoyage-tapis-domicile-strasbourg
//   - /nettoyage-matelas-strasbourg
//   - /nettoyage-fauteuil-chaise-strasbourg
// ─────────────────────────────────────────────────────────────────────────

import type { UseCase } from "./usecases";

export const HOME_SERVICES: UseCase[] = [
  // ─── Canapé ───────────────────────────────────────────────────────────
  {
    slug: "nettoyage-canape-strasbourg",
    shortName: "Nettoyage canapé",
    emoji: "🛋️",
    metaTitle: "Nettoyage canapé à domicile à Strasbourg — StrasClean",
    metaDescription:
      "Canapé tissu, cuir, alcantara ? StrasClean intervient à domicile à Strasbourg avec injection-extraction professionnelle. Canapé 2 places dès 79 €, 3 places dès 109 €. Séchage rapide.",
    hero: {
      chip: "StrasClean Maison",
      h1: "Nettoyage canapé à domicile à Strasbourg.",
      h1Highlight: "à domicile à Strasbourg.",
      subtitle:
        "Canapé tissu marqué par les taches, le temps et l'usage quotidien ? Cuir terne, alcantara qui jaunit ? StrasClean redonne vie à votre canapé en intervention unique à domicile — injection-extraction professionnelle, produits adaptés à chaque matière, séchage rapide. Comme neuf à la fin de la journée.",
    },
    problem: {
      title: "Un canapé concentre des années de quotidien",
      paragraphs: [
        "Le canapé est l'un des meubles les plus utilisés de la maison — et l'un des plus rarement nettoyés en profondeur. Repas devant la télé, taches de café, enfants, animaux, sueur estivale, poussière et acariens : tout s'accumule dans les fibres et la mousse au fil des années. Le résultat est souvent invisible à l'œil nu mais bien réel — odeur diffuse, sensation de moins en moins agréable, allergènes accumulés.",
        "Sur les canapés en tissu (les plus courants), les taches anciennes prennent une teinte foncée permanente quand elles ne sont pas traitées correctement. Le café, le vin, les jus de fruits, les graisses alimentaires laissent des auréoles que les nettoyants ménagers du commerce n'enlèvent jamais complètement — au mieux ils les éclaircissent, souvent ils créent des halos pires que la tache d'origine.",
        "Sur les canapés cuir, le problème est différent : le cuir s'assèche, craque, perd sa couleur d'origine. Une intervention de nettoyage + nutrition régulière prolonge la durée de vie d'un canapé cuir de plusieurs années. À Strasbourg, en saison de chauffage (octobre à avril), le cuir souffre particulièrement à cause de l'air sec — un entretien annuel est presque indispensable.",
      ],
      bullets: [
        "Taches anciennes incrustées (café, vin, gras, encre, sang)",
        "Odeur persistante d'usage, de tabac ou d'animaux",
        "Acariens et allergènes dans la mousse profonde",
        "Cuir terne, sec ou qui commence à craqueler",
        "Alcantara/microfibre qui jaunit avec le temps",
        "Pelouches et poils d'animaux entre les coussins",
        "Couleur d'origine partie, aspect terne général",
      ],
    },
    whyDiy: {
      title: "Pourquoi le nettoyage maison atteint ses limites",
      paragraphs: [
        "Les produits ménagers du commerce (Vanish, K2R, mousses spéciales) sont conçus pour un usage léger en surface. Ils n'extraient pas la saleté profonde de la mousse — ils la déplacent au mieux, créant souvent une auréole en séchant. Le résultat ressemble à un canapé propre pendant 48h, puis l'auréole apparaît et reste visible des mois.",
        "Pour vraiment nettoyer un canapé, il faut un injecteur-extracteur professionnel : la machine envoie de l'eau chaude sous pression dans la fibre, puis aspire immédiatement la solution sale avec un puissant vide d'air. Cette technique extrait les particules même dans la mousse profonde — et sans aucune auréole car rien ne sèche en surface. C'est l'équipement standard du detailing automobile, qui marche tout aussi bien sur le mobilier.",
        "Sur le cuir, c'est encore plus délicat : un nettoyant trop alcalin ou trop acide peut décolorer définitivement la matière. Il faut un produit pH-neutre spécifique cuir suivi d'un baume nourrissant. Les produits du commerce sont rarement adaptés au cuir de canapé moderne (semi-aniline, pleine fleur, nubuck) qui demande chacun un traitement différent.",
      ],
    },
    solution: {
      title: "Le protocole canapé StrasClean",
      intro:
        "On intervient à votre domicile à Strasbourg ou en proche banlieue. Comptez 1h à 1h30 sur place selon la taille (2 places, 3 places ou angle). On travaille en équipe de 2 — la mousse extraite ressort presque sèche au toucher, séchage complet en 2 à 4 heures avec ventilation normale. Vous pouvez utiliser votre canapé le soir même.",
      steps: [
        {
          title: "Diagnostic du canapé",
          desc: "Identification du tissu (coton, polyester, lin, microfibre, alcantara, velours, cuir, simili), des zones les plus marquées, des taches spécifiques à traiter. Le produit est choisi selon le diagnostic — pas une approche unique.",
        },
        {
          title: "Aspiration profonde",
          desc: "Aspiration haute puissance pour retirer poussière, miettes, poils d'animaux et particules sèches avant l'humidification. Cette étape est cruciale — sinon la saleté sèche se transforme en boue au contact de l'eau.",
        },
        {
          title: "Pré-traitement ciblé des taches",
          desc: "Application d'un détachant spécifique sur chaque tache identifiée (tanins, gras, organique, protéiné). Temps d'action contrôlé puis incorporation à la machine.",
        },
        {
          title: "Injection-extraction sur l'ensemble (tissus)",
          desc: "Passage homogène de l'injecteur-extracteur sur toute la surface : assises, dossiers, accoudoirs, contours. La mousse profonde libère ses particules, qui sont aspirées dans la foulée — sans auréole.",
        },
        {
          title: "Traitement cuir spécifique (si cuir)",
          desc: "Nettoyant cuir pH-neutre par mouvements circulaires doux, puis baume nourrissant Sonax Leather Care ou Colourlock selon couleur. Le cuir retrouve souplesse et éclat.",
        },
        {
          title: "Désodorisation finale",
          desc: "Produit neutre qui élimine les molécules d'odeur — pas un parfum qui masque. Idéal pour canapés avec tabagisme, animaux, ou simplement très utilisés.",
        },
        {
          title: "Séchage assisté",
          desc: "Avec l'extraction haute puissance, le canapé ressort déjà presque sec. Séchage complet en 2-4h à température ambiante. Vous récupérez l'usage de votre canapé le jour même.",
        },
      ],
    },
    pricing: { priceFrom: "79", duration: "1 h à 1h30" },
    faq: [
      {
        q: "Combien coûte un nettoyage de canapé chez StrasClean ?",
        a: "Canapé 1 place ou fauteuil : 39 €. Canapé 2 places : 79 €. Canapé 3 places : 109 €. Canapé d'angle : 149 €. Cuir : +20 € pour le traitement spécifique (nettoyage pH-neutre + baume nourrissant). Prix transparents, annoncés avant intervention.",
      },
      {
        q: "Combien de temps avant que je puisse utiliser mon canapé ?",
        a: "L'extraction haute puissance retire 90 % de l'humidité immédiatement. Vous pouvez vous asseoir dessus le soir même — comptez 2 à 4 heures pour un séchage complet sans aucune humidité résiduelle. Aucune mauvaise odeur d'humidité car la mousse est correctement extraite.",
      },
      {
        q: "Vous traitez les canapés cuir ?",
        a: "Oui, avec un protocole spécifique : nettoyant pH-neutre dédié, mouvements doux à la microfibre, puis baume nourrissant pour redonner souplesse au cuir. Particulièrement recommandé une fois par an pour les canapés cuir vieux de plus de 3 ans qui commencent à sécher.",
      },
      {
        q: "Vous garantissez de faire partir toutes les taches ?",
        a: "On garantit 90-95 % des taches sur tissu. Les taches anciennes très profondes (encre, sang séché ancien, peinture, hydrocarbures) peuvent laisser une trace très atténuée mais visible. On vous donne un diagnostic honnête en arrivant avant de commencer.",
      },
      {
        q: "Intervenez-vous pour les pros (Airbnb, hôtels, cliniques) ?",
        a: "Oui — nous avons une offre B2B pour les locations courte durée (Airbnb, Booking), hôtels, cabinets, restaurants. Tarif dégressif selon le volume, facture pro avec TVA, abonnement entretien régulier possible. Contactez-nous pour un devis adapté à votre besoin.",
      },
      {
        q: "Quel délai pour avoir une intervention ?",
        a: "Généralement 2 à 5 jours selon notre planning. Pour les cas urgents (Airbnb avec arrivée le lendemain, tache fraîche à traiter vite), on essaie de caler dans la journée ou le lendemain — envoyez-nous un message WhatsApp avec une photo, on vous répond rapidement.",
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
        "Tapis terni par la poussière et le passage quotidien, taches anciennes, odeurs d'animaux ? Pas besoin de le déplacer chez un pressing — StrasClean intervient à votre domicile à Strasbourg avec un shampouinage professionnel qui ressort le tapis comme neuf, sans le transporter.",
    },
    problem: {
      title: "Un tapis garde tout ce qu'on y dépose",
      paragraphs: [
        "Un tapis dans une pièce de vie absorbe en permanence : poussière, miettes, terre rapportée par les chaussures, poils d'animaux, allergènes, micro-particules en suspension. Même avec un aspirateur passé régulièrement, 80 % de la saleté reste piégée dans les fibres profondes — invisible à l'œil mais réelle. Au bout de quelques années, le tapis ternit, perd sa couleur d'origine et dégage parfois une odeur diffuse.",
        "Les taches ponctuelles (café, vin, animaux, encre, chocolat) sont l'autre problème classique. Plus on attend, plus elles s'incrustent dans la fibre. Une tache fraîche se traite en quelques minutes. La même tache une semaine plus tard demande un détachage professionnel — et un mois plus tard, elle peut devenir permanente sans un vrai shampouinage.",
        "Et il y a la question logistique : déplacer un grand tapis pour le faire nettoyer dans un pressing spécialisé est un calvaire — il faut le rouler, le transporter, le récupérer. Sans parler du tarif souvent prohibitif (compter 80-150 € pour un tapis moyen + le trajet aller-retour). StrasClean intervient directement chez vous, sans déplacement.",
      ],
      bullets: [
        "Taches anciennes (café, vin, animaux, encre) impossibles à enlever seul",
        "Tapis terni qui a perdu sa couleur d'origine",
        "Acariens et allergènes accumulés dans les fibres profondes",
        "Odeur d'animaux ou d'humidité persistante",
        "Tapis trop grand ou trop lourd à transporter chez un pressing",
        "Coût élevé du nettoyage en pressing + déplacement",
        "Saleté noire qui sort à l'humidification quand on essaie soi-même",
      ],
    },
    whyDiy: {
      title: "Les pièges du nettoyage tapis maison",
      paragraphs: [
        "Le shampoing à tapis vendu en grande surface est presque toujours décevant : il mousse abondamment, dégrade les fibres avec un produit trop alcalin, et surtout laisse une grande quantité de produit dans la fibre qui re-attrape la poussière dans les jours suivants. Résultat : un tapis qui ressemble propre pendant une semaine, puis qui devient plus sale qu'avant.",
        "Les recettes maison (vinaigre blanc, bicarbonate, eau savonneuse) peuvent fonctionner sur des taches très récentes — mais sur un tapis dans son ensemble, elles laissent une humidité résiduelle importante qui favorise les moisissures, et ne désincrustent jamais la saleté profonde. Pour un vrai résultat, il faut un injecteur-extracteur professionnel — la même machine que nous utilisons pour les sièges auto et les canapés.",
      ],
    },
    solution: {
      title: "Le protocole tapis StrasClean",
      intro:
        "On intervient à votre domicile à Strasbourg ou en proche banlieue avec tout le matériel nécessaire. Comptez 45 min à 1h30 selon la taille du tapis. Séchage rapide (2-4h) grâce à l'extraction haute puissance — le tapis ressort presque sec au toucher. Vous récupérez votre pièce le jour même.",
      steps: [
        {
          title: "Diagnostic et préparation",
          desc: "Identification du type de tapis (laine, synthétique, viscose, sisal, kilim, persan) et adaptation du produit. Photographie des taches à traiter. Délimitation des zones les plus marquées.",
        },
        {
          title: "Aspiration haute puissance",
          desc: "Passage minutieux à l'aspirateur professionnel pour retirer toute la saleté sèche avant l'humidification. C'est cette étape qui fait 50 % du résultat — sans elle, l'humidité transforme la poussière en boue.",
        },
        {
          title: "Pré-traitement des taches",
          desc: "Application ciblée de détachants spécifiques sur chaque tache (tanins pour café/vin, enzymatique pour organique animal, dégraissant pour gras alimentaire). Temps d'action contrôlé.",
        },
        {
          title: "Injection-extraction sur l'ensemble",
          desc: "Passage homogène de l'injecteur-extracteur sur toute la surface du tapis. L'eau chaude additionnée d'un produit doux décolle la saleté profonde, qui est immédiatement aspirée. Aucune auréole, aucun résidu de produit.",
        },
        {
          title: "Désinfection et désodorisation",
          desc: "Désinfectant bactéricide pour tapis (zones très fréquentées, animaux, taches biologiques anciennes). Désodorisation neutre qui élimine les odeurs sans les masquer.",
        },
        {
          title: "Séchage assisté",
          desc: "Passage final à l'extraction pour retirer le maximum d'humidité. Séchage à température ambiante en 2-4h avec ventilation normale. Aucun risque de moisissure car la fibre est correctement extraite.",
        },
      ],
    },
    pricing: { priceFrom: "49", duration: "45 min à 1h30" },
    faq: [
      {
        q: "Combien coûte un nettoyage de tapis à domicile ?",
        a: "Petit tapis (jusqu'à 4 m²) : 49 €. Tapis moyen (4-8 m²) : 69 €. Grand tapis (8-15 m²) : 99 €. Au-delà : 9 €/m². Les tapis précieux (laine pure, persan, kilim ancien) peuvent demander un traitement plus délicat — devis adapté. Le déplacement à votre domicile à Strasbourg et alentours est inclus.",
      },
      {
        q: "Faut-il que je déplace mon tapis ?",
        a: "Non — c'est tout l'intérêt de notre service. On vient avec tout le matériel mobile, on travaille directement chez vous sur le tapis en place. Aucun déplacement de votre côté. Pour les pièces où on traite à la fois le tapis et un canapé, on peut combiner les deux en une intervention.",
      },
      {
        q: "Vous traitez tous les types de tapis ?",
        a: "Oui — synthétiques (polypropylène, polyester), naturels (laine, coton, jute, sisal), tapis d'orient (persan, kilim), tapis de salle de bain. Pour les pièces très précieuses (vieux tapis persans signés, pièces de collection), on travaille avec un protocole spécifique très doux — devis sur photos.",
      },
      {
        q: "Combien de temps avant de pouvoir remarcher dessus ?",
        a: "Le tapis ressort presque sec au toucher grâce à l'extraction haute puissance. Comptez 2 à 4 heures pour un séchage complet sans humidité résiduelle. Vous pouvez circuler dans la pièce et utiliser votre canapé/lit dès la fin de l'intervention.",
      },
      {
        q: "Vos clients pros (Airbnb, hôtels) sont-ils nombreux ?",
        a: "Oui, c'est un segment qu'on développe : tapis de chambre d'hôtel, tapis d'Airbnb entre locataires, tapis d'accueil de cabinets et boutiques. Tarif dégressif selon volume, facture pro avec TVA. Contrats d'entretien régulier possibles (tous les 2-3 mois).",
      },
      {
        q: "Vous travaillez aussi les moquettes pleine surface ?",
        a: "Oui — même technique, même matériel. On peut traiter une chambre, un salon, un escalier en moquette. Tarif au m². On confirme le devis avec photos avant intervention.",
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
    metaTitle: "Nettoyage matelas à domicile à Strasbourg — StrasClean",
    metaDescription:
      "Acariens, taches, transpiration ? StrasClean nettoie votre matelas à domicile à Strasbourg avec une aspiration HEPA + désinfection. Matelas 1 personne dès 49 €, 2 personnes dès 79 €.",
    hero: {
      chip: "StrasClean Maison",
      h1: "Nettoyage matelas à domicile à Strasbourg.",
      h1Highlight: "à domicile à Strasbourg.",
      subtitle:
        "Vous passez un tiers de votre vie sur votre matelas — mais quand l'avez-vous nettoyé en profondeur pour la dernière fois ? StrasClean traite votre matelas chez vous à Strasbourg : aspiration HEPA, désinfection anti-acariens, traitement des taches, élimination des odeurs. Une nuit comme dans un hôtel neuf.",
    },
    problem: {
      title: "Un matelas qu'on retourne ne suffit pas",
      paragraphs: [
        "Un matelas accumule chaque nuit transpiration, peaux mortes, poussières, allergènes — le tout dans une mousse qui ne respire qu'à peine. Au bout de quelques mois sans nettoyage profond, la population d'acariens y est de l'ordre de plusieurs millions par m². Pour une personne allergique, c'est la cause directe des éternuements matinaux, du nez bouché, de la fatigue inexpliquée au réveil.",
        "Les taches sur matelas sont l'autre problème courant : transpiration jaune, pipi d'enfant ou d'animal, sang, vomi, taches de café ou de produits cosmétiques. Tout pénètre dans la mousse car celle-ci absorbe comme une éponge. Une fois sec, le nettoyage de surface ne fait pratiquement rien — il faut une vraie extraction professionnelle pour décrocher la matière dans la profondeur.",
        "Et il y a la question hygiène générale : un matelas n'est jamais lavé en machine, jamais désinfecté, et accumule donc l'équivalent de plusieurs années de sueur, peaux, et micro-organismes. Les fabricants eux-mêmes recommandent un nettoyage professionnel tous les 6 à 12 mois — recommandation que presque personne ne suit, faute de service disponible à domicile.",
      ],
      bullets: [
        "Millions d'acariens dans la mousse — cause d'allergies",
        "Taches anciennes (sueur, pipi enfant, sang, animaux)",
        "Odeur d'humidité ou de transpiration imprégnée",
        "Allergies respiratoires inexpliquées au réveil",
        "Matelas qu'on n'ose pas montrer quand on a des invités",
        "Hygiène générale qu'on ne peut pas vérifier à l'œil nu",
        "Coût et complexité de remplacer un matelas vs le nettoyer",
      ],
    },
    whyDiy: {
      title: "Pourquoi l'aspirateur et le soleil ne suffisent pas",
      paragraphs: [
        "Beaucoup pensent qu'aspirer le matelas et le mettre au soleil quelques heures suffit à le désinfecter. C'est partiellement vrai — l'aspiration retire les particules de surface, et les UV tuent une partie des acariens visibles. Mais 90 % des acariens vivent dans la mousse profonde, hors de portée de l'aspirateur domestique et invisibles aux UV. Et les taches profondes ne se retirent ni à l'aspirateur ni au soleil.",
        "Le nettoyage professionnel utilise une combinaison : aspiration avec filtre HEPA qui retient les allergènes (impossible avec aspirateur ménager standard), produit anti-acariens spécifique appliqué en injection-extraction, et désinfection ciblée. C'est l'équipement et le protocole qu'utilisent les services d'hygiène des hôtels et hôpitaux — chez vous, en une intervention.",
      ],
    },
    solution: {
      title: "Le protocole matelas StrasClean",
      intro:
        "On intervient à votre domicile à Strasbourg ou en proche banlieue. Comptez 45 min à 1h selon la taille du matelas (1 personne, 2 personnes, king size). Le matelas ressort utilisable dès la fin de l'intervention — séchage complet en 2-4 heures avec ventilation normale. Vous pouvez dormir dessus le soir même.",
      steps: [
        {
          title: "Aspiration HEPA des deux faces",
          desc: "Aspiration haute puissance avec filtre HEPA qui retient les particules fines et les allergènes — impossible à reproduire avec un aspirateur ménager. Retrait des acariens morts, peaux mortes, poussières profondes.",
        },
        {
          title: "Pré-traitement des taches identifiées",
          desc: "Application de détachants spécifiques selon la nature des taches : enzymatique pour sueur/urine, organique pour sang/vomi, dégraissant pour cosmétiques. Temps d'action contrôlé pour décrocher en profondeur.",
        },
        {
          title: "Injection-extraction ciblée",
          desc: "Sur les zones tachées, passage de l'injecteur-extracteur pour décrocher et aspirer la matière en profondeur dans la mousse. Aucune auréole, séchage rapide grâce à l'extraction.",
        },
        {
          title: "Traitement anti-acariens",
          desc: "Application d'un produit anti-acariens professionnel sur l'ensemble de la surface. Sans danger pour les enfants et les personnes allergiques après séchage (15-30 min). Efficacité : 6 à 12 mois selon les conditions de la chambre.",
        },
        {
          title: "Désinfection bactéricide",
          desc: "Désinfection des points où les fluides s'accumulent (zone tête, milieu). Élimine bactéries, champignons, micro-organismes. Sans odeur résiduelle chimique.",
        },
        {
          title: "Désodorisation finale",
          desc: "Produit neutre qui élimine les molécules d'odeur — sueur, animaux, humidité. Sensation de fraîcheur immédiate. Pas un parfum lourd qui se mélangerait à l'odeur d'origine.",
        },
      ],
    },
    pricing: { priceFrom: "49", duration: "45 min à 1 h" },
    faq: [
      {
        q: "Combien coûte un nettoyage de matelas à domicile ?",
        a: "Matelas 1 personne (90×190) : 49 €. Matelas 2 personnes (140×190 ou 160×200) : 79 €. King size (180×200 et plus) : 99 €. Recto-verso (les deux faces) : +20 €. Traitement spécial anti-acariens renforcé : +20 €. Le déplacement à votre domicile à Strasbourg et alentours est inclus.",
      },
      {
        q: "Combien de temps avant de pouvoir dormir dessus ?",
        a: "Le matelas ressort presque sec grâce à l'extraction haute puissance. Comptez 2 à 4 heures pour un séchage complet sans humidité résiduelle. Vous pouvez dormir dessus le soir même. Pas de risque de moisissure car la mousse est correctement extraite, pas juste mouillée.",
      },
      {
        q: "Vous traitez quels types de matelas ?",
        a: "Tous : mousse classique, mousse à mémoire de forme, latex, ressorts ensachés. Matelas neufs ou anciens, simple ou recto-verso, toutes tailles. Pour les matelas très épais (>30 cm) ou les modèles haut de gamme spécifiques, l'intervention peut être un peu plus longue — on adapte sans frais cachés.",
      },
      {
        q: "Vos produits sont-ils sans danger pour les enfants ?",
        a: "Oui — on utilise des produits professionnels homologués pour usage en milieu résidentiel et hôtelier. Sans danger pour enfants, allergiques, animaux après séchage (15-30 min). Pas d'odeur chimique persistante. C'est le même type de produit utilisé dans les hôpitaux pour le nettoyage des lits.",
      },
      {
        q: "Vous intervenez pour les hôtels et Airbnb ?",
        a: "Oui — c'est un segment où on développe une offre B2B : nettoyage entre locataires Airbnb (intervention dans la journée), entretien régulier d'hôtels et chambres d'hôtes, désinfection après cas de punaises ou autre. Tarif dégressif selon volume, facture pro avec TVA.",
      },
      {
        q: "À quelle fréquence faut-il nettoyer son matelas ?",
        a: "Idéalement tous les 6 à 12 mois pour un usage standard (1-2 personnes, pas d'enfants ni d'animaux dans le lit). Tous les 3-6 mois si vous avez des allergies respiratoires, des enfants qui dorment parfois dans le lit, ou des animaux. Les fabricants recommandent eux-mêmes ce rythme.",
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
        "Chaises de salle à manger marquées par des années de repas en famille, fauteuils de salon tachés, sièges de bureau usés ? StrasClean traite vos assises en lot à votre domicile à Strasbourg avec injection-extraction professionnelle. Idéal aussi pour les pros : restaurants, bureaux, salles d'attente.",
    },
    problem: {
      title: "Les chaises et fauteuils prennent tout sans qu'on les voie",
      paragraphs: [
        "Les chaises de salle à manger sont parmi les assises les plus utilisées et les moins nettoyées de la maison. Chaque repas y dépose des micro-projections (sauce, vin, gras), chaque enfant qui s'y assoit avec des doigts collants laisse une trace, chaque été y dépose de la transpiration. Au bout de 5 ans, l'assise est marquée — surtout sur les tissus clairs (lin, beige, gris clair) qui sont à la mode mais qui montrent tout.",
        "Les fauteuils du salon (relax, club, scandinaves) accumulent quotidiennement la transpiration estivale, les cheveux gras posés sur le dossier, les taches de café ou de chocolat des soirées télé. Comme pour les canapés, le nettoyage de surface n'extrait rien en profondeur — il faut un vrai shampouinage par injection-extraction pour ressortir le fauteuil comme neuf.",
        "Et il y a les sièges de bureau : home office en pleine expansion, on passe 8h par jour dessus. Sueur, repas pris devant l'écran, traces d'usage quotidiennes. Pour les indépendants qui reçoivent des clients dans leur bureau, c'est une question d'image — un siège marqué donne une mauvaise impression dès l'entrée.",
      ],
      bullets: [
        "Chaises de salle à manger tissu marquées par les repas et les enfants",
        "Fauteuils club, relax, scandinaves usés mais qu'on ne veut pas jeter",
        "Sièges de bureau utilisés en home office (transpiration, taches alimentaires)",
        "Chaises de pros (restaurants, cabinets, salles d'attente) à entretenir régulièrement",
        "Tissus clairs qui montrent tout (lin, beige, écru)",
        "Cuir d'assise qui craque ou perd sa couleur",
        "Coussins de chaises lavables vs non-lavables — distinction pas toujours évidente",
      ],
    },
    whyDiy: {
      title: "Pourquoi ces petites pièces demandent un traitement pro",
      paragraphs: [
        "Pour une chaise unique, le réflexe est souvent d'essayer un nettoyage à la main avec un nettoyant ménager. Mais pour un lot complet de 6 chaises, ou un fauteuil entier avec dossier et accoudoirs, c'est plusieurs heures de travail manuel pour un résultat inégal. Et surtout, les détachants ménagers laissent presque systématiquement une auréole sur les tissus clairs — exactement la signature visible d'un nettoyage amateur.",
        "Le shampouinage professionnel par injection-extraction règle les deux problèmes : il traite un lot complet en 30-45 minutes (au lieu de plusieurs heures de travail manuel), et il ne laisse aucune auréole car la solution est aspirée avant de sécher. Pour les pros (restaurants, bureaux, salles d'attente), c'est un service essentiel — l'entretien régulier prolonge la durée de vie du mobilier de plusieurs années.",
      ],
    },
    solution: {
      title: "Le protocole fauteuils & chaises StrasClean",
      intro:
        "On intervient à votre domicile ou local pro à Strasbourg ou en proche banlieue. Pour un lot de 4-6 chaises ou 1-2 fauteuils : comptez 30 à 45 minutes en équipe de 2. Pour un grand volume (restaurants, salles d'attente, bureaux), devis adapté sur demande. Séchage rapide grâce à l'extraction — utilisable dans la journée.",
      steps: [
        {
          title: "Diagnostic des assises",
          desc: "Identification du tissu (lin, coton, polyester, microfibre, alcantara, velours, cuir, simili), photographie des taches à traiter. Adaptation du produit à chaque matière.",
        },
        {
          title: "Aspiration profonde par pièce",
          desc: "Aspiration haute puissance sur chaque chaise / fauteuil pour retirer poussière, miettes, cheveux et particules sèches avant l'humidification.",
        },
        {
          title: "Pré-traitement des taches",
          desc: "Application de détachants spécifiques selon la nature des taches : tanins (café, vin), gras (huile, sauce), organique (transpiration, animaux). Temps d'action contrôlé.",
        },
        {
          title: "Injection-extraction sur tissu",
          desc: "Passage de la machine sur assises, dossiers, accoudoirs. La saleté profonde est décrochée et aspirée immédiatement — sans auréole, sans surplus d'humidité.",
        },
        {
          title: "Traitement cuir spécifique (si applicable)",
          desc: "Pour les fauteuils ou chaises cuir : nettoyant pH-neutre + baume nourrissant. Le cuir retrouve souplesse et couleur d'origine.",
        },
        {
          title: "Désinfection et finition",
          desc: "Désinfectant bactéricide sur les zones de contact (assises, accoudoirs). Désodorisation neutre. Les pièces ressortent prêtes à utiliser en quelques heures.",
        },
      ],
    },
    pricing: { priceFrom: "39", duration: "30 à 45 min" },
    faq: [
      {
        q: "Combien coûte un nettoyage de chaise / fauteuil ?",
        a: "Chaise unique : 12-15 €. Lot 4 chaises : 49 €. Lot 6 chaises : 69 €. Fauteuil 1 place : 39 €. Tabouret de bar : 12 €. Chaise/fauteuil cuir : +5 à 10 € pour traitement spécifique. Tarifs dégressifs pour les pros au-delà de 8 pièces. Le déplacement à votre domicile ou local à Strasbourg est inclus.",
      },
      {
        q: "Vous traitez les chaises avec coussins amovibles ?",
        a: "Oui — les coussins amovibles peuvent être traités sur place ou séparément selon votre préférence. Pour les coussins en housses lavables, on conseille parfois un lavage machine + traitement de la structure interne par injection-extraction. On fait l'évaluation à l'arrivée.",
      },
      {
        q: "Vous intervenez pour les restaurants et bars ?",
        a: "Oui, et c'est un segment qu'on développe : chaises et banquettes de restaurants, fauteuils de bars/lounges, sièges de salons de coiffure et instituts. Tarif dégressif selon le volume (à partir de 10 pièces). Intervention possible tôt le matin ou après fermeture pour ne pas gêner l'activité.",
      },
      {
        q: "Combien de temps avant de pouvoir m'asseoir ?",
        a: "Les chaises / fauteuils ressortent presque secs grâce à l'extraction haute puissance. Comptez 1 à 2 heures pour un séchage complet. Pour les fauteuils plus volumineux, 2 à 4 heures. Vous récupérez vos assises le jour même.",
      },
      {
        q: "Vous pouvez intervenir le même jour pour un événement (mariage, ouverture) ?",
        a: "Selon notre planning, oui — surtout si vous nous prévenez 2-3 jours à l'avance pour les volumes importants. Pour quelques chaises en urgence (1-2 jours avant l'événement), c'est très souvent possible. Envoyez-nous une photo et un message WhatsApp avec votre délai.",
      },
      {
        q: "Quelle différence entre StrasClean et un pressing classique ?",
        a: "Le pressing nettoie principalement des housses retirables. Nous, on traite directement la structure complète (assise + dossier + accoudoirs + coussins fixes) sur place, sans rien démonter. Idéal pour les chaises et fauteuils dont les housses ne se retirent pas, et pour les lots où le transport serait compliqué.",
      },
    ],
    ctaMessage:
      "Bonjour StrasClean 👋 Je voudrais un nettoyage de fauteuils / chaises à mon domicile à Strasbourg. Quels sont vos prochains créneaux ?",
  },
];

/** Construit l'URL d'une page service Maison */
export const homeServicePath = (s: UseCase) => `/${s.slug}`;

/** Trouve un service Maison par son slug exact */
export const findHomeService = (slug: string) =>
  HOME_SERVICES.find((s) => s.slug === slug);
