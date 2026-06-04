import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * robots.txt généré dynamiquement par Next.
 *  - Tout est autorisé sauf /admin et /api (zones privées / endpoints)
 *  - Sitemap déclaré pour aider les crawlers à découvrir nos 200+ pages
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/_next/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
