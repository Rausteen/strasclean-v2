import "server-only";

// ─────────────────────────────────────────────────────────────────────────
//  Google Reviews — Places API (New) v1
//
//  Endpoint : https://places.googleapis.com/v1/places/{PLACE_ID}
//  Auth     : header X-Goog-Api-Key
//  Field    : header X-Goog-FieldMask
//
//  Pourquoi v1 et pas l'ancienne API ? L'ancienne (place/details/json)
//  ne contient pas toujours les fiches SAB récentes. La v1 a un index
//  plus à jour. Si la v1 renvoie 404 / NOT_FOUND, on retombe sur l'ancienne
//  en backup (certaines fiches plus anciennes y sont mieux indexées).
//
//  Configuration (côté serveur uniquement) :
//   - GOOGLE_PLACES_API_KEY  : clé Google Cloud (Places API + Places API
//                              New activées)
//   - GOOGLE_PLACE_ID        : Place ID au format ChIJ...
//
//  Sans ces variables, la fonction renvoie [] silencieusement et le
//  composant Testimonials retombe sur les avis fictifs.
//
//  Cache : 1h via Next.js fetch revalidate.
// ─────────────────────────────────────────────────────────────────────────

export type GoogleReview = {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description?: string;
  text: string;
  time?: number;
};

const REVALIDATE_SECONDS = 60 * 60;

type V1ReviewRaw = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
  publishTime?: string;
};

function normalizeV1(r: V1ReviewRaw): GoogleReview | null {
  const name = r.authorAttribution?.displayName;
  // Prend la traduction si dispo, sinon l'original
  const text = r.text?.text ?? r.originalText?.text;
  if (!name || !text || typeof r.rating !== "number") return null;
  const t = r.publishTime ? Date.parse(r.publishTime) / 1000 : undefined;
  return {
    author_name: name,
    author_url: r.authorAttribution?.uri,
    profile_photo_url: r.authorAttribution?.photoUri,
    rating: r.rating,
    relative_time_description: r.relativePublishTimeDescription,
    text,
    time: t,
  };
}

async function fetchV1(placeId: string, apiKey: string): Promise<GoogleReview[]> {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=fr`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "reviews,rating,userRatingCount,displayName",
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { reviews?: V1ReviewRaw[] };
  return (data.reviews ?? [])
    .map(normalizeV1)
    .filter((r): r is GoogleReview => r !== null);
}

async function fetchLegacy(placeId: string, apiKey: string): Promise<GoogleReview[]> {
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
  return data.result?.reviews ?? [];
}

export async function getGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return [];

  try {
    // 1) On essaie la nouvelle API (souvent plus à jour pour SAB récents)
    let reviews = await fetchV1(placeId, apiKey);

    // 2) Fallback sur l'ancienne API si la nouvelle ne renvoie rien
    if (reviews.length === 0) {
      reviews = await fetchLegacy(placeId, apiKey);
    }

    // On garde les avis 4★+, 6 max (limite Google de toute façon)
    return reviews.filter((r) => r.rating >= 4).slice(0, 6);
  } catch {
    return [];
  }
}
