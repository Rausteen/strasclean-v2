import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { CITIES, cityPath } from "@/lib/cities";
import { SERVICES, servicePath } from "@/lib/services";
import { USE_CASES, useCasePath } from "@/lib/usecases";
import { HOME_SERVICES, homeServicePath } from "@/lib/homeServices";
import { HOME_SEO_PAGES, homeSeoPath } from "@/lib/homeSeoPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    // Hub formules
    {
      url: `${SITE.url}/formules`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Pages légales (priorité basse, non commerciales)
    {
      url: `${SITE.url}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE.url}/politique-de-confidentialite`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    // Pages ville
    ...CITIES.map((c) => ({
      url: `${SITE.url}${cityPath(c)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Pages service × ville
    ...SERVICES.flatMap((s) =>
      CITIES.map((c) => ({
        url: `${SITE.url}${servicePath(s, c)}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ),
    // Pages "pain point" / cas d'usage (forte intention commerciale)
    ...USE_CASES.map((uc) => ({
      url: `${SITE.url}${useCasePath(uc)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    // Pages "Maison" — canapé, tapis, matelas, fauteuil/chaise
    ...HOME_SERVICES.map((s) => ({
      url: `${SITE.url}${homeServicePath(s)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    // Pages SEO Maison — prix, Airbnb, cuir
    ...HOME_SEO_PAGES.map((s) => ({
      url: `${SITE.url}${homeSeoPath(s)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
