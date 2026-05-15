import "server-only";

// ─────────────────────────────────────────────────────────────────────────
//  Google Reviews — Places API (New) v1
//
//  Endpoint  : https://places.googleapis.com/v1/places/{PLACE_ID}
//  Auth      : header X-Goog-Api-Key
//  Fields    : header X-Goog-FieldMask
//
//  Renvoie {reviews, rating, totalCount} pour afficher non seulement
//  les avis mais aussi la note moyenne et le nombre total côté UI.
//
//  Stratégie :
//   1. Places API (New) v1 — souvent la seule à connaître les SAB récents
//   2. Fallback sur l'ancienne API si la v1 ne renvoie rien
//
//  Texte des avis : on force la langue fr et on préfère systématiquement
//  l'`originalText` quand il est en français (sinon Google traduit en
//  anglais et on perd la voix authentique du client).
//
//  Variables d'env (server-only) :
//   - GOOGLE_PLACES_API_KEY
//   - GOOGLE_PLACE_ID  (format ChIJ...)
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

export type PlaceData = {
  reviews: GoogleReview[];
  /** Note moyenne 1-5 affichée sur la fiche Google */
  rating?: number;
  /** Nombre total d'avis Google (peut être > au nombre d'avis renvoyés) */
  totalCount?: number;
};

const EMPTY: PlaceData = { reviews: [] };
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

function pickFrenchText(r: V1ReviewRaw): string | undefined {
  const t = r.text?.text;
  const tLang = r.text?.languageCode ?? "";
  // Si le texte renvoyé est déjà en français → on le garde
  if (t && tLang.toLowerCase().startsWith("fr")) return t;
  // Sinon on retombe sur l'originalText (généralement en français pour StrasClean)
  const o = r.originalText?.text;
  const oLang = r.originalText?.languageCode ?? "";
  if (o && oLang.toLowerCase().startsWith("fr")) return o;
  // Dernier recours : le texte traduit ou l'original, n'importe lequel
  return o ?? t;
}

function normalizeV1(r: V1ReviewRaw): GoogleReview | null {
  const name = r.authorAttribution?.displayName;
  const text = pickFrenchText(r);
  if (!name || !text || typeof r.rating !== "number") return null;
  const t = r.publishTime ? Math.floor(Date.parse(r.publishTime) / 1000) : undefined;
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

async function fetchV1(placeId: string, apiKey: string): Promise<PlaceData> {
  // `languageCode=fr` demande à Google de privilégier les textes en français
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=fr&regionCode=fr`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "reviews,rating,userRatingCount,displayName",
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return EMPTY;
  const data = (await res.json()) as {
    reviews?: V1ReviewRaw[];
    rating?: number;
    userRatingCount?: number;
  };
  const reviews = (data.reviews ?? [])
    .map(normalizeV1)
    .filter((r): r is GoogleReview => r !== null);
  return {
    reviews,
    rating: typeof data.rating === "number" ? data.rating : undefined,
    totalCount:
      typeof data.userRatingCount === "number" ? data.userRatingCount : undefined,
  };
}

async function fetchLegacy(placeId: string, apiKey: string): Promise<PlaceData> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "reviews,rating,user_ratings_total");
  url.searchParams.set("language", "fr");
  url.searchParams.set("reviews_sort", "newest");
  url.searchParams.set("key", apiKey);
  const res = await fetch(url.toString(), {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return EMPTY;
  const data = (await res.json()) as {
    result?: {
      reviews?: GoogleReview[];
      rating?: number;
      user_ratings_total?: number;
    };
    status?: string;
  };
  if (data.status && data.status !== "OK") return EMPTY;
  return {
    reviews: data.result?.reviews ?? [],
    rating: data.result?.rating,
    totalCount: data.result?.user_ratings_total,
  };
}

export async function getGooglePlaceData(): Promise<PlaceData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return EMPTY;

  try {
    let data = await fetchV1(placeId, apiKey);
    if (data.reviews.length === 0) {
      data = await fetchLegacy(placeId, apiKey);
    }
    // 4★ minimum, max 6 (limite Google côté détails de toute façon)
    return {
      ...data,
      reviews: data.reviews.filter((r) => r.rating >= 4).slice(0, 6),
    };
  } catch {
    return EMPTY;
  }
}

// Backward compat — renvoie juste les reviews
export async function getGoogleReviews(): Promise<GoogleReview[]> {
  const data = await getGooglePlaceData();
  return data.reviews;
}
