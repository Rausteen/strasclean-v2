/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  // better-sqlite3 est un module natif Node : il ne doit pas être bundlé
  // (sinon Next essaie de l'embarquer côté client → crash au build).
  serverExternalPackages: ["better-sqlite3"],
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
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Assets statiques : cache 1 an, immutable
        source: "/avant-apres/:all*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/hero.webp",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

module.exports = nextConfig;
