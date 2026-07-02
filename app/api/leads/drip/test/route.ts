import { NextRequest, NextResponse } from "next/server";
import { sendLeadEmail } from "@/lib/leadEmails";
import type { Lead } from "@/lib/db";

// Aperçu des emails de relance sur une adresse au choix (test).
//   GET /api/leads/drip/test?key=<META_POLL_SECRET>&email=toi@ex.fr&step=0&name=Nathan
// step : 0=J0, 1=J3, 2=J5, 3=J7. Nécessite RESEND_API_KEY.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET = process.env.META_POLL_SECRET;

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  if (!SECRET || p.get("key") !== SECRET) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const email = p.get("email");
  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "email requis" }, { status: 400 });
  }
  const step = Math.max(0, Math.min(3, Number(p.get("step") ?? 0)));
  // Nom du lead FACTICE pour le test uniquement. Le vrai drip utilise le
  // prénom réel du lead (firstName(lead.full_name)). Passe &name=Prénom pour
  // tester la personnalisation.
  const name = p.get("name") || "Julie";

  const fake: Lead = {
    id: 999999,
    ts: Date.now(),
    source: "test",
    meta_lead_id: null,
    form_id: null,
    ad_id: null,
    full_name: name,
    phone: null,
    email,
    raw: null,
    status: "nouveau",
    notes: null,
    email_step: 0,
    last_email_at: null,
    email_opt_out: 0,
    created_at: Date.now(),
  };

  const ok = await sendLeadEmail(fake, step);
  return NextResponse.json({
    ok,
    step,
    email,
    hint: ok
      ? "Email envoyé ✅"
      : "Échec — vérifie RESEND_API_KEY et le domaine d'envoi (RELANCE_EMAIL_FROM / LEAD_NOTIFY_FROM).",
  });
}
