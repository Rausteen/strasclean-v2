import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import Analytics from "@/components/Analytics";
import Tracker from "@/components/Tracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  // Inter est utilisée pour le body (texte courant) — pas pour le H1 LCP.
  // On la sort du critical path : elle se télécharge après le premier
  // paint, sans le bloquer. Pendant ce temps le fallback système s'affiche.
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
  title: {
    default: "StrasClean — Nettoyage voiture à domicile à Strasbourg",
    template: "%s | StrasClean",
  },
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
  themeColor: "#05070A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDetailing",
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
  };

  return (
    <html lang="fr" className={`${inter.variable} ${sora.variable}`}>
      <head>
        {/* Préconnexions vers les origines tierces pour économiser le
            handshake TCP+TLS au premier hit (gtag, fonts, WhatsApp). */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body className="bg-ink-950 text-white antialiased">
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
