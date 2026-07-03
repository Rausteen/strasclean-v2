// Force le fuseau horaire de l'application en Europe/Paris. Sans ça, un serveur
// (conteneur Dokploy) en UTC calcule les créneaux de réservation et le délai
// mini avec 2 h de décalage l'été → on pouvait réserver un créneau déjà passé.
// Défini avant tout usage de Date, quel que soit le TZ du système.
process.env.TZ = "Europe/Paris";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  // better-sqlite3 est un module natif Node : il ne doit pas être bundlé
  // (sinon Next essaie de l'embarquer côté client → crash au build).
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    // Inline le CSS critique directement dans le <head> du HTML → supprime
    // une requête bloquante (~600 ms gagnés sur Slow 4G d'après web.dev).
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Les photos en /public sont déjà optimisées : cache long côté CDN/navigateur
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
  },
  // Redirige www → non-www (le canonique du site est https://strasclean.fr).
  // Évite le contenu dupliqué et consolide le SEO sur une seule origine.
  // ⚠️ Nécessite que `www.strasclean.fr` ait un certificat TLS valide côté
  // hébergeur (Dokploy/Traefik) : cette redirection s'exécute APRÈS la
  // terminaison TLS, donc le cert www doit exister sinon Googlebot échoue
  // avant d'arriver ici.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.strasclean.fr" }],
        destination: "https://strasclean.fr/:path*",
        permanent: true,
      },
      // Lien court d'avis Google : à partager de vive voix, par WhatsApp/SMS
      // ou via un QR code. Ouvre directement le formulaire « écrire un avis ».
      // permanent: false (307) → pas de cache agressif si le lien Google change.
      {
        source: "/avis",
        destination: "https://g.page/r/CRa5hY3dnAMDEAE/review",
        permanent: false,
      },
      // Offre abonnement 99 €/mois masquée pour le moment → renvoi vers l'accueil.
      // permanent: false (307) pour pouvoir la réactiver sans souci de cache.
      // (Pour réactiver la page, supprime ce bloc.)
      {
        source: "/abonnement",
        destination: "/",
        permanent: false,
      },
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];
    // Cache 1 an immutable pour tous les assets statiques utilisés en
    // décor (heros, avant/après, OG). Hashed via Next/Image ou versionnés
    // implicitement par leur path immutable.
    const longCache = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];
    return [
      { source: "/:path*", headers: securityHeaders },
      // === Auto ===
      { source: "/avant-apres/:all*", headers: longCache },
      { source: "/hero.webp", headers: longCache },
      // === Maison === (équivalents pour la verticale ambre)
      { source: "/maison/:all*", headers: longCache },
      // === OG images ===
      { source: "/og.svg", headers: longCache },
      { source: "/og-maison.svg", headers: longCache },
      { source: "/og.webp", headers: longCache },
      { source: "/og-maison.webp", headers: longCache },
      // === Logos / favicon / manifest icons ===
      { source: "/og-logos/:all*", headers: longCache },
      { source: "/favicon.svg", headers: longCache },
      { source: "/logo-horizontal.svg", headers: longCache },
      { source: "/logo-icon.svg", headers: longCache },
      { source: "/logo-square.svg", headers: longCache },
    ];
  },
};

module.exports = nextConfig;
