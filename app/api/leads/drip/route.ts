import { NextRequest, NextResponse } from "next/server";
import { listLeadsForDrip, markLeadEmailed } from "@/lib/db";
import { sendLeadEmail, DRIP_DAYS, DRIP_GRACE_DAYS } from "@/lib/leadEmails";

// Cron des relances email des prospects (J0/J3/J5). À appeler ~toutes les
// heures : GET /api/leads/drip?key=<META_POLL_SECRET>
//
// Envoie AU PLUS UN email par lead et par passage. Les étapes trop tardives
// (au-delà de la fenêtre de grâce) sont sautées sans envoi → pas de spam de
// l'historique au 1er lancement.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET = process.env.META_POLL_SECRET;
const DAY = 86400000;

export async function GET(req: NextRequest) {
  if (!SECRET || req.nextUrl.searchParams.get("key") !== SECRET) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const now = Date.now();
  const leads = listLeadsForDrip(DRIP_DAYS.length);
  let sent = 0;
  let skipped = 0;

  for (const lead of leads) {
    let step = lead.email_step;
    while (step < DRIP_DAYS.length) {
      const dueAt = lead.ts + DRIP_DAYS[step] * DAY;
      if (now < dueAt) break; // pas encore l'heure de cette étape
      const tooLate = now - dueAt > DRIP_GRACE_DAYS[step] * DAY;
      if (tooLate) {
        // Étape ratée → on la saute (sans envoyer) pour rattraper la séquence.
        markLeadEmailed(lead.id, step + 1);
        step++;
        skipped++;
        continue;
      }
      const ok = await sendLeadEmail(lead, step);
      if (ok) {
        markLeadEmailed(lead.id, step + 1);
        sent++;
      }
      break; // un seul email par lead par passage
    }
  }

  return NextResponse.json({ ok: true, candidates: leads.length, sent, skipped });
}
