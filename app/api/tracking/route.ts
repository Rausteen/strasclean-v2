import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Config de tracking (GA4 / Google Ads / Meta Pixel) lue au RUNTIME, pas au
// build. → changer une variable dans l'hébergeur + restart suffit, SANS rebuild
// (fini le souci de build-args du Dockerfile).
//
// L'accès via l'alias `e[...]` (clé dynamique) empêche Next d'inliner les
// NEXT_PUBLIC_* au build → on lit bien la valeur runtime. On accepte les deux
// nommages : sans préfixe (recommandé) OU l'ancien NEXT_PUBLIC_* (compat).
export function GET() {
  const e = process.env as Record<string, string | undefined>;
  const pick = (...keys: string[]): string | null => {
    for (const k of keys) {
      const v = e[k];
      if (v) return v;
    }
    return null;
  };

  return NextResponse.json(
    {
      gaId: pick("GA_ID", "NEXT_PUBLIC_GA_ID"),
      pixelId: pick("META_PIXEL_ID", "NEXT_PUBLIC_META_PIXEL_ID"),
      adsAuto: {
        id: pick("GOOGLE_ADS_AUTO_ID", "NEXT_PUBLIC_GOOGLE_ADS_AUTO_ID"),
        label: pick("GOOGLE_ADS_AUTO_LABEL", "NEXT_PUBLIC_GOOGLE_ADS_AUTO_LABEL"),
        reservation: pick(
          "GOOGLE_ADS_AUTO_RESERVATION_LABEL",
          "NEXT_PUBLIC_GOOGLE_ADS_AUTO_RESERVATION_LABEL",
        ),
        wa: pick("GOOGLE_ADS_AUTO_WA_LABEL", "NEXT_PUBLIC_GOOGLE_ADS_AUTO_WA_LABEL"),
        phone: pick(
          "GOOGLE_ADS_AUTO_PHONE_LABEL",
          "NEXT_PUBLIC_GOOGLE_ADS_AUTO_PHONE_LABEL",
        ),
        form: pick("GOOGLE_ADS_AUTO_FORM_LABEL", "NEXT_PUBLIC_GOOGLE_ADS_AUTO_FORM_LABEL"),
      },
      adsMaison: {
        id: pick("GOOGLE_ADS_MAISON_ID", "NEXT_PUBLIC_GOOGLE_ADS_MAISON_ID"),
        label: pick("GOOGLE_ADS_MAISON_LABEL", "NEXT_PUBLIC_GOOGLE_ADS_MAISON_LABEL"),
        wa: pick("GOOGLE_ADS_MAISON_WA_LABEL", "NEXT_PUBLIC_GOOGLE_ADS_MAISON_WA_LABEL"),
        phone: pick(
          "GOOGLE_ADS_MAISON_PHONE_LABEL",
          "NEXT_PUBLIC_GOOGLE_ADS_MAISON_PHONE_LABEL",
        ),
        form: pick(
          "GOOGLE_ADS_MAISON_FORM_LABEL",
          "NEXT_PUBLIC_GOOGLE_ADS_MAISON_FORM_LABEL",
        ),
      },
    },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
