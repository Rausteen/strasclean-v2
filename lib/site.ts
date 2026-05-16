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
    "https://wa.me/33767052435?text=Bonjour%20StrasClean%20%F0%9F%91%8B%20Je%20voudrais%20un%20devis%20pour%20le%20nettoyage%20de%20ma%20voiture.%20Vos%20disponibilit%C3%A9s%20cette%20semaine%20%3F",
  email: "contact@strasclean.fr",
  city: "Strasbourg",
  region: "Grand Est",
  country: "FR",
} as const;

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
