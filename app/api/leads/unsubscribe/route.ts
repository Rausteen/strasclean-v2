import { NextRequest, NextResponse } from "next/server";
import { setLeadOptOut } from "@/lib/db";
import { checkUnsub } from "@/lib/leadEmails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lien de désinscription des relances (RGPD). Token signé dans chaque email.
export async function GET(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));
  const t = req.nextUrl.searchParams.get("t") || "";
  if (!Number.isInteger(id) || !checkUnsub(id, t)) {
    return new NextResponse("Lien invalide.", { status: 400 });
  }
  setLeadOptOut(id);
  return new NextResponse(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Désinscription</title>
     <div style="font:16px/1.6 system-ui,sans-serif;max-width:480px;margin:60px auto;padding:0 20px;text-align:center;color:#15190F">
       <h1 style="font-size:22px;margin:0 0 8px">Désinscription confirmée ✅</h1>
       <p style="color:#6C7262;margin:0">Vous ne recevrez plus d'emails de relance de StrasClean. À bientôt !</p>
     </div>`,
    { status: 200, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
