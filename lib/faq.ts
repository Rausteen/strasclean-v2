// Données FAQ — extraites pour pouvoir alimenter à la fois l'UI et le
// JSON-LD FAQPage utilisé pour le SEO (rich snippets dans Google).

export type FAQItem = { q: string; a: string };

export const FAQS: FAQItem[] = [
  {
    q: "Est-ce que vous vous déplacez à domicile ?",
    a: "Oui, c'est même le cœur de notre service. On intervient à votre domicile, sur votre lieu de travail ou à l'adresse de votre choix, à Strasbourg et dans les communes voisines.",
  },
  {
    q: "Combien de temps dure un nettoyage ?",
    a: "Comptez environ 30 à 45 min pour la formule Essentiel, 1h à 1h30 pour la Premium Intérieur, et 2h pour l'Intégrale StrasClean. La durée dépend de la taille du véhicule et de son état. On travaille en équipe de 2, ce qui divise par 2 le temps versus un detailer solo.",
  },
  {
    q: "Le prix peut-il changer ?",
    a: "Les prix sont indiqués « à partir de » et peuvent varier selon la taille de la voiture (citadine, berline, SUV, utilitaire), l'état intérieur et les options demandées. On confirme toujours le tarif avant intervention.",
  },
  {
    q: "Dois-je fournir l'eau ou l'électricité ?",
    a: "Selon la formule et le lieu d'intervention, nous vous confirmerons les besoins exacts lors de la réservation. Pour la plupart des prestations à domicile, un simple accès à une prise électrique suffit.",
  },
  {
    q: "Nettoyez-vous les poils d'animaux ?",
    a: "Oui. Le traitement des poils d'animaux est disponible en option sur toutes nos formules (39 à 79 € selon le véhicule). On utilise un matériel adapté pour vraiment décoller les poils incrustés dans les tissus.",
  },
  {
    q: "Faites-vous le lavage extérieur ?",
    a: "Oui. Le lavage extérieur à la main, la décontamination de la carrosserie et le nettoyage des vitres extérieures sont inclus dans la formule Intégrale StrasClean.",
  },
  {
    q: "Comment réserver ?",
    a: "Le plus simple : réservez en ligne en 1 minute — choisissez votre formule, puis le jour et l'heure précise qui vous arrangent. Vous recevez une confirmation immédiate. Vous préférez qu'on s'en occupe ? Écrivez-nous sur WhatsApp ou appelez-nous.",
  },
  {
    q: "Intervenez-vous en dehors de Strasbourg ?",
    a: "Oui. On couvre Schiltigheim, Illkirch, Bischheim, Ostwald, Lingolsheim, Hoenheim, Eckbolsheim, Oberhausbergen, Mundolsheim, Vendenheim, La Wantzenau, et les alentours. Si votre commune n'est pas listée, demandez-nous.",
  },
  {
    q: "Puis-je envoyer des photos avant de réserver ?",
    a: "Bien sûr, on encourage même cette démarche. Quelques photos de l'intérieur (sièges, moquette, coffre) nous permettent de vous conseiller la formule la plus adaptée et d'être précis sur le tarif.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Espèces, carte bancaire et virement. Le paiement se fait sur place, à la fin de la prestation, une fois que le résultat vous convient.",
  },
];

/** Génère un objet FAQPage JSON-LD prêt à être sérialisé. */
export function faqJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
      },
    })),
  };
}
