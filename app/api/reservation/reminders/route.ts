import { NextRequest, NextResponse } from "next/server";
import { getRemindableReservations, markReminded } from "@/lib/db";
import { sendReservationReminder } from "@/lib/reservationEmail";

// Cron des rappels J-1 des réservations. À appeler ~toutes les heures :
// GET /api/reservation/reminders?key=<META_POLL_SECRET>
//
// Envoie un rappel pour tout RDV « à faire » dont l'heure tombe dans ~18-30 h,
// et qui n'a pas encore été rappelé (reminder_sent). Idempotent.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET = process.env.META_POLL_SECRET;
const H = 3600000;

export async function GET(req: NextRequest) {
  if (!SECRET || req.nextUrl.searchParams.get("key") !== SECRET) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const now = Date.now();
  const from = now + 18 * H;
  const to = now + 30 * H;
  const due = getRemindableReservations(from, to);
  let sent = 0;

  for (const j of due) {
    if (!j.email || !j.scheduled_at) continue;
    const when = new Date(j.scheduled_at).toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
    await sendReservationReminder({
      id: j.id,
      email: j.email,
      prenom: (j.customer_name || "").split(" ")[0] || "vous",
      service: [j.prestation, j.vehicle_type].filter(Boolean).join(" · "),
      when,
      price: j.total ?? j.price ?? 0,
      address: j.address ?? null,
    });
    markReminded(j.id);
    sent++;
  }

  return NextResponse.json({ ok: true, sent, checked: due.length });
}
