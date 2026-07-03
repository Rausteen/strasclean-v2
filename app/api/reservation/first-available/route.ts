import { NextRequest, NextResponse } from "next/server";
import { getScheduledBetween, getBlocksBetween } from "@/lib/db";
import {
  getFormula,
  computeSlots,
  isOpenDay,
  BOOKING_CONFIG,
  type Interval,
} from "@/lib/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/reservation/first-available?formula=<id>
// Renvoie le 1er jour (dans l'horizon) qui a encore des créneaux libres.
export async function GET(req: NextRequest) {
  const f = getFormula(req.nextUrl.searchParams.get("formula") || "");
  if (!f) return NextResponse.json({ ok: false, error: "params" }, { status: 400 });

  const now = Date.now();
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  for (let i = 0; i <= BOOKING_CONFIG.horizonDays; i++) {
    // Recalcul jour par jour (robuste aux changements d'heure DST).
    const day = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
    if (!isOpenDay(day.getDay())) continue;

    const dayStart = day.getTime();
    const dayEnd = dayStart + 86400000;
    const busy: Interval[] = [
      ...getScheduledBetween(dayStart, dayEnd).map((j) => {
        const s = Math.round((j.scheduled_at - dayStart) / 60000);
        return { start: s, end: s + (j.duration_min ?? 90) };
      }),
      ...getBlocksBetween(dayStart, dayEnd).map((b) => ({
        start: Math.max(0, Math.round((b.start_at - dayStart) / 60000)),
        end: Math.min(1440, Math.round((b.end_at - dayStart) / 60000)),
      })),
    ];

    const slots = computeSlots(dayStart, f.durationMin, busy, now);
    if (slots.length) {
      const date = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
      return NextResponse.json({ ok: true, date, slots, duration: f.durationMin });
    }
  }

  return NextResponse.json({ ok: true, date: "", slots: [], duration: f.durationMin });
}
