import { NextResponse } from "next/server";
import { getJob, cancelReservation } from "@/lib/db";
import { checkResaToken } from "@/lib/reservationEmail";
import { BOOKING_CONFIG } from "@/lib/booking";
import { sendTelegram, tgEscape, tgWhen } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/reservation/cancel  { id, t }
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad body" }, { status: 400 });
  }

  const id = Number(b.id) || 0;
  const t = String(b.t || "");
  if (!id || !checkResaToken(id, t)) {
    return NextResponse.json({ ok: false, error: "Lien invalide" }, { status: 403 });
  }

  const job = getJob(id);
  if (!job || !job.scheduled_at) {
    return NextResponse.json({ ok: false, error: "Introuvable" }, { status: 404 });
  }
  if (job.status === "annule") {
    return NextResponse.json({ ok: true, already: true });
  }

  const minMs = BOOKING_CONFIG.cancelHoursBefore * 3600000;
  if (job.scheduled_at - Date.now() < minMs) {
    return NextResponse.json(
      {
        ok: false,
        error: `Annulation possible jusqu'à ${BOOKING_CONFIG.cancelHoursBefore} h avant le rendez-vous. Appelez-nous.`,
      },
      { status: 409 },
    );
  }

  cancelReservation(id);

  await sendTelegram(
    [
      "❌ <b>Réservation annulée</b> (par le client)",
      job.customer_name ? `👤 <b>${tgEscape(job.customer_name)}</b>` : "",
      `🧽 ${tgEscape([job.prestation, job.vehicle_type].filter(Boolean).join(" · "))}`,
      `🗓️ ${tgWhen(job.scheduled_at)}`,
      job.phone ? `📞 ${tgEscape(job.phone)}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return NextResponse.json({ ok: true });
}
