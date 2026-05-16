// ─────────────────────────────────────────────────────────────────────────
//  StrasClean — central configuration
//  Modifie ces valeurs pour mettre à jour le numéro, WhatsApp, zones, etc.
// ─────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: "StrasClean",
  tagline: "Nettoyage voiture à domicile à Strasbourg",
  url: "https://strasclean.fr",
  // Contact
  phoneDisplay: "+33 7 67 05 24 35",
  phoneHref: "tel:+33767052435",
  whatsappNumber: "33767052435",
  // Message pré-rempli volontairement court, conversationnel et auto-suffisant :
  // l'utilisateur peut l'envoyer SANS RIEN AJOUTER. Plus de friction = +taux
  // de conversion clic WA → message envoyé.
  whatsappHref:
    "https://wa.me/33767052435?text=Bonjour%20StrasClean%20%F0%9F%91%8B%20Je%20voudrais%20un%20devis%20pour%20le%20nettoyage%20de%20ma%20voiture.%20Quels%20sont%20vos%20prochains%20cr%C3%A9neaux%20%3F",
  email: "contact@strasclean.fr",
  city: "Strasbourg",
  region: "Grand Est",
  country: "FR",
  /**
   * URLs publiques de la marque sur les réseaux et fiches externes.
   * Renseignées dans le JSON-LD LocalBusiness (champ sameAs) pour
   * confirmer à Google la cohérence d'identité multi-canale.
   *
   * À MAINTENIR : ajoute ici toute nouvelle URL pro (Facebook, Insta,
   * LinkedIn, Pages Jaunes, etc.) au fil du temps.
   */
  socials: [
    // Fiche Google Business (la plus importante pour le SEO local)
    "https://maps.app.goo.gl/?q=StrasClean+Strasbourg",
    // 👇 décommente / ajoute les profils existants
    // "https://www.facebook.com/strasclean",
    // "https://www.instagram.com/strasclean",
    // "https://www.linkedin.com/company/strasclean",
  ],
  /**
   * Horaires d'intervention StrasClean.
   * Format Schema.org `openingHoursSpecification` simplifié :
   * { days: ["Mon", "Tue", ...], opens: "HH:MM", closes: "HH:MM" }.
   * Plusieurs entries possibles si horaires différents selon les jours.
   */
  openingHours: [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      opens: "08:00",
      closes: "20:00",
    },
    {
      days: ["Sat"],
      opens: "09:00",
      closes: "19:00",
    },
    // Pas de dimanche par défaut. Si tu travailles dimanche, ajoute :
    // { days: ["Sun"], opens: "10:00", closes: "18:00" },
  ],
} as const;

/** Helper qui transforme SITE.openingHours en JSON-LD
 *  openingHoursSpecification compatible Schema.org. */
export function openingHoursJsonLd() {
  // Mapping court → forme longue Schema.org
  const fullName: Record<string, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };
  return SITE.openingHours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days.map((d) => fullName[d] ?? d),
    opens: h.opens,
    closes: h.closes,
  }));
}

export const ZONES: string[] = [
  "Strasbourg",
  "Schiltigheim",
  "Illkirch-Graffenstaden",
  "Bischheim",
  "Ostwald",
  "Lingolsheim",
  "Hoenheim",
  "Eckbolsheim",
  "Oberhausbergen",
  "Mundolsheim",
  "Vendenheim",
  "La Wantzenau",
];

export const waLink = (message: string) =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
