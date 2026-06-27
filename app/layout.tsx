import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import Analytics from "@/components/Analytics";
import Tracker from "@/components/Tracker";
import { getGooglePlaceData } from "@/lib/reviews";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  // Police body (pas l'élément LCP) → on la sort du critical path.
  // Pendant son téléchargement, le fallback système s'affiche.
  preload: false,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  // Seules ces graisses sont utilisées par .h-display (semibold/bold/extrabold).
  // Retirer 500 économise un fichier de fonte sur mobile.
  weight: ["600", "700", "800"],
  // Sora porte le H1 (élément LCP) → on garde le preload activé.
});

const description =
  "Nettoyage auto à domicile à Strasbourg et alentours. Intérieur, shampouinage, désinfection, lavage extérieur et detailing premium. Réservation rapide par WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  // Titre en chaîne simple (pas de `template`) : chaque page fournit un
  // <title> complet qui contient déjà la marque (« … — StrasClean » /
  // « … — StrasClean Maison » / « … — StrasClean Pro »). Un template
  // « %s | StrasClean » dupliquait la marque sur ~290 pages. Les pages guide,
  // dont le metaTitle n'a pas de marque, l'ajoutent elles-mêmes
  // (voir app/guide/[slug]/page.tsx).
  title: "StrasClean — Nettoyage voiture à domicile à Strasbourg",
  description,
  keywords: [
    "nettoyage voiture domicile Strasbourg",
    "lavage auto domicile Strasbourg",
    "nettoyage intérieur voiture Strasbourg",
    "detailing auto Strasbourg",
    "nettoyage siège voiture Strasbourg",
    "shampouinage siège voiture Strasbourg",
    "nettoyage voiture à domicile autour de Strasbourg",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: "StrasClean — Nettoyage voiture à domicile à Strasbourg",
    description,
    locale: "fr_FR",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "StrasClean — nettoyage voiture à domicile à Strasbourg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StrasClean — Nettoyage voiture à domicile à Strasbourg",
    description,
    images: ["/og.svg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F3F1E9",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const place = await getGooglePlaceData();
  const jsonLd = {
    "@context": "https://schema.org",
    // LocalBusiness est reconnu par Google Rich Results Test pour les
    // rich snippets (étoiles + count). AutoDetailing existe sur schema.org
    // mais n'est pas dans la liste blanche de Google → erreur de validation.
    "@type": "LocalBusiness",
    name: SITE.name,
    description,
    url: SITE.url,
    telephone: SITE.phoneDisplay,
    image: `${SITE.url}/og.svg`,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Strasbourg",
      addressRegion: "Grand Est",
      addressCountry: "FR",
    },
    areaServed: [
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
    ],
    sameAs: [],
    ...(place.rating && place.totalCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: place.rating.toFixed(1),
            reviewCount: String(place.totalCount),
            bestRating: "5",
            worstRating: "1",
          },
          // review uniquement aux côtés d'aggregateRating (sinon Google :
          // "avis multiples sans aggregateRating").
          ...(place.reviews.length > 0
            ? {
                review: place.reviews.map((r) => ({
                  "@type": "Review",
                  author: { "@type": "Person", name: r.author_name },
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: String(r.rating),
                    bestRating: "5",
                    worstRating: "1",
                  },
                  reviewBody: r.text,
                  ...(r.time
                    ? { datePublished: new Date(r.time * 1000).toISOString().slice(0, 10) }
                    : {}),
                })),
              }
            : {}),
        }
      : {}),
  };

  return (
    <html lang="fr" className={`${jakarta.variable} ${sora.variable}`}>
      <head>
        {/* Préconnexions vers les origines tierces pour économiser le
            handshake TCP+TLS au premier hit (gtag, fonts, WhatsApp). */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      {/* On retire bg-white pour laisser le fond "papier chaud" (--bg)
          défini dans globals.css s'appliquer. text-slate-900 = warm ink
          via l'override de la palette slate dans tailwind.config. */}
      <body className="text-slate-900 antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <Tracker />
      </body>
    </html>
  );
}
