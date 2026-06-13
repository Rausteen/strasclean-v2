import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { CITIES, cityPath } from "@/lib/cities";
import { QUARTIERS } from "@/lib/quartiers";
import { SERVICES, servicePath } from "@/lib/services";
import { USE_CASES, useCasePath } from "@/lib/usecases";
import {
  HOME_SERVICES,
  homeServicePath,
  listHomeServiceCityCombos,
  homeServiceCityPath,
} from "@/lib/homeServices";
import { HOME_SEO_PAGES, homeSeoPath } from "@/lib/homeSeoPages";
import { GUIDES, guidePath } from "@/lib/guides";

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
    // Pages ville (communes + quartiers Strasbourg)
    ...[...CITIES, ...QUARTIERS].map((c) => ({
      url: `${SITE.url}${cityPath(c)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Pages service × ville (Auto) — communes + quartiers
    ...SERVICES.flatMap((s) =>
      [...CITIES, ...QUARTIERS].map((c) => ({
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
    // Page "Qui sommes-nous" globale (E-E-A-T pour Google, couvre Auto + Maison)
    {
      url: `${SITE.url}/qui-sommes-nous`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    // Pages service × ville Maison (44 nouvelles URLs : 4 services × 11
    // communes hors Strasbourg)
    ...listHomeServiceCityCombos().map(({ service, city }) => ({
      url: `${SITE.url}${homeServiceCityPath(service, city)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    // Pages de réservation en ligne (3e canal d'acquisition, désormais
    // actives, indexables et liées depuis les CTA + le Footer).
    {
      url: `${SITE.url}/reserver-auto`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE.url}/reserver-maison`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    // Hub guide / blog
    {
      url: `${SITE.url}/guide`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    // Articles guide / blog
    ...GUIDES.map((g) => ({
      url: `${SITE.url}${guidePath(g)}`,
      lastModified: new Date(g.updatedAt ?? g.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
