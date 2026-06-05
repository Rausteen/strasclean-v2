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
