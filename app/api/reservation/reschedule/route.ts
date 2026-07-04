import { NextResponse } from "next/server";
import {
  getJob,
  getScheduledBetween,
  getBlocksBetween,
  rescheduleReservation,
} from "@/lib/db";
import { checkResaToken } from "@/lib/reservationEmail";
import { BOOKING_CONFIG, computeSlots, type Interval } from "@/lib/booking";
import { sendTelegram, tgEscape, tgWhen } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/reservation/reschedule  { id, t, date: "YYYY-MM-DD", time: "HH:MM" }
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad body" }, { status: 400 });
  }

  const id = Number(b.id) || 0;
  const t = String(b.t || "");
  const dateM = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(b.date || ""));
  const timeM = /^(\d{2}):(\d{2})$/.exec(String(b.time || ""));
  if (!id || !checkResaToken(id, t)) {
    return NextResponse.json({ ok: false, error: "Lien invalide" }, { status: 403 });
  }
  if (!dateM || !timeM) {
    return NextResponse.json({ ok: false, error: "Créneau invalide" }, { status: 400 });
  }

  const job = getJob(id);
  if (!job || !job.scheduled_at || !job.duration_min) {
    return NextResponse.json({ ok: false, error: "Introuvable" }, { status: 404 });
  }
  if (job.status === "annule") {
    return NextResponse.json({ ok: false, error: "Réservation annulée" }, { status: 409 });
  }

  // On applique la même règle que l'annulation sur le rendez-vous ACTUEL.
  const minMs = BOOKING_CONFIG.cancelHoursBefore * 3600000;
  if (job.scheduled_at - Date.now() < minMs) {
    return NextResponse.json(
      {
        ok: false,
        error: `Report possible jusqu'à ${BOOKING_CONFIG.cancelHoursBefore} h avant le rendez-vous. Appelez-nous.`,
      },
      { status: 409 },
    );
  }

  const dayStart = new Date(+dateM[1], +dateM[2] - 1, +dateM[3], 0, 0, 0, 0).getTime();
  const dayEnd = dayStart + 86400000;
  const scheduled_at = dayStart + (+timeM[1] * 60 + +timeM[2]) * 60000;

  // Disponibilité en excluant la réservation elle-même.
  const busy: Interval[] = [
    ...getScheduledBetween(dayStart, dayEnd)
      .filter((j) => j.id !== id)
      .map((j) => {
        const s = Math.round((j.scheduled_at - dayStart) / 60000);
        return { start: s, end: s + (j.duration_min ?? 90) };
      }),
    ...getBlocksBetween(dayStart, dayEnd).map((bl) => ({
      start: Math.max(0, Math.round((bl.start_at - dayStart) / 60000)),
      end: Math.min(1440, Math.round((bl.end_at - dayStart) / 60000)),
    })),
  ];
  if (
    !computeSlots(dayStart, job.duration_min, busy, Date.now()).includes(
      `${timeM[1]}:${timeM[2]}`,
    )
  ) {
    return NextResponse.json(
      { ok: false, error: "Ce créneau n'est plus disponible." },
      { status: 409 },
    );
  }

  rescheduleReservation(id, scheduled_at, dayStart);

  await sendTelegram(
    [
      "🔄 <b>Réservation reportée</b> (par le client)",
      job.customer_name ? `👤 <b>${tgEscape(job.customer_name)}</b>` : "",
      `🧽 ${tgEscape([job.prestation, job.vehicle_type].filter(Boolean).join(" · "))}`,
      `🗓️ Avant : ${tgWhen(job.scheduled_at)}`,
      `✅ Après : <b>${tgWhen(scheduled_at)}</b>`,
      job.phone ? `📞 ${tgEscape(job.phone)}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return NextResponse.json({ ok: true, scheduled_at });
}
