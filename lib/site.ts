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
  whatsappHref:
    "https://wa.me/33767052435?text=Bonjour%20StrasClean%2C%20je%20souhaite%20r%C3%A9server%20un%20nettoyage%20auto",
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
