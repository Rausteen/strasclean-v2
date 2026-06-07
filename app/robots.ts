import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * robots.txt généré dynamiquement par Next.
 *  - Tout est autorisé sauf /admin et /api (zones privées / endpoints)
 *  - Les crawlers IA (ChatGPT/OpenAI, Perplexity, Claude, Google-Extended…)
 *    sont explicitement autorisés : c'est la condition n°1 pour être lisible
 *    et citable dans ChatGPT Search & co (beaucoup de sites les bloquent sans
 *    le savoir → invisibilité totale côté IA).
 *  - Sitemap déclaré pour aider les crawlers à découvrir nos 200+ pages
 */
const AI_BOTS = [
  "GPTBot", // OpenAI — entraînement
  "OAI-SearchBot", // OpenAI — index ChatGPT Search
  "ChatGPT-User", // OpenAI — navigation en direct depuis ChatGPT
  "PerplexityBot", // Perplexity — index
  "Perplexity-User", // Perplexity — navigation en direct
  "ClaudeBot", // Anthropic — entraînement/index
  "Claude-User", // Anthropic — navigation en direct
  "anthropic-ai",
  "Google-Extended", // Google Gemini / AI Overviews
  "Applebot-Extended", // Apple Intelligence
  "Amazonbot",
  "CCBot", // Common Crawl (source d'entraînement de nombreux LLM)
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/admin/", "/api/", "/_next/"];
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      // Autorisation explicite des crawlers IA (même périmètre que le reste).
      {
        userAgent: AI_BOTS,
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
