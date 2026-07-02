import { NextRequest, NextResponse } from "next/server";
import { markReviewStep } from "@/lib/db";
import { checkResaToken } from "@/lib/reservationEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/reservation/review-unsub?id=<jobId>&t=<token>
export async function GET(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id")) || 0;
  const t = req.nextUrl.searchParams.get("t") || "";

  const page = (msg: string) =>
    new NextResponse(
      `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>StrasClean</title></head>
       <body style="margin:0;background:#f4f5f2;font:16px/1.6 -apple-system,system-ui,sans-serif;color:#15190F">
       <div style="max-width:440px;margin:12vh auto;padding:28px 24px;background:#fff;border:1px solid #e7e5df;border-radius:20px;text-align:center">
         <div style="font-size:20px;font-weight:800">Stras<span style="color:#10B981">Clean</span></div>
         <p style="margin:16px 0 0;color:#3f463a">${msg}</p>
       </div></body></html>`,
      { status: 200, headers: { "content-type": "text/html; charset=utf-8" } },
    );

  if (!id || !checkResaToken(id, t)) {
    return page("Lien invalide.");
  }
  markReviewStep(id, 99); // stoppe toute relance d'avis
  return page("C'est noté — vous ne recevrez plus de message à propos des avis. Merci de votre confiance 🙏");
}
