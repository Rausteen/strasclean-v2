import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StrasClean — Nettoyage voiture à domicile à Strasbourg",
    short_name: "StrasClean",
    description:
      "Nettoyage auto à domicile à Strasbourg et alentours. Intérieur, shampouinage, désinfection, lavage extérieur et detailing premium.",
    start_url: "/",
    display: "standalone",
    background_color: "#05070A",
    theme_color: "#05070A",
    lang: "fr",
    categories: ["business", "automotive", "lifestyle"],
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
