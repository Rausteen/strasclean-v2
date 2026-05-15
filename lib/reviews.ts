import "server-only";

// ─────────────────────────────────────────────────────────────────────────
//  Google Reviews — récupération automatique depuis Google Places API.
//
//  Configuration (côté serveur uniquement, PAS de NEXT_PUBLIC_) :
//   - GOOGLE_PLACES_API_KEY  : clé API Google Cloud (Places API activée)
//   - GOOGLE_PLACE_ID        : Place ID de la fiche Google Business StrasClean
//
//  Sans ces variables, la fonction renvoie [] et le composant Testimonials
//  retombe sur ses avis fictifs par défaut. Aucun appel API n'est fait.
//
//  Cache : la réponse est mise en cache 1h par Next.js (next.revalidate).
// ─────────────────────────────────────────────────────────────────────────

export type GoogleReview = {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description?: string;
  text: string;
  time?: number; // unix timestamp
};

const REVALIDATE_SECONDS = 60 * 60; // 1h

export async function getGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return [];

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "reviews,rating,user_ratings_total");
    url.searchParams.set("language", "fr");
    url.searchParams.set("reviews_sort", "newest");
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as {
      result?: { reviews?: GoogleReview[] };
      status?: string;
    };
    if (data.status && data.status !== "OK") return [];

    const reviews = data.result?.reviews ?? [];
    // On garde les 6 plus pertinents, on filtre les notes < 4 (rare avec
    // sort=newest, mais évite d'afficher un avis 1★ sur une landing).
    return reviews.filter((r) => r.rating >= 4).slice(0, 6);
  } catch {
    return [];
  }
}
