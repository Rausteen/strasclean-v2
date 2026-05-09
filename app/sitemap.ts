import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { CITIES, cityPath } from "@/lib/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...CITIES.map((c) => ({
      url: `${SITE.url}${cityPath(c)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
