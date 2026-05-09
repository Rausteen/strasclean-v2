import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { CITIES, cityPath } from "@/lib/cities";
import { SERVICES, servicePath } from "@/lib/services";

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
  ];
}
