import { NextRequest, NextResponse } from "next/server";
import { getScheduledBetween, getBlocksBetween } from "@/lib/db";
import {
  getFormula,
  computeSlots,
  BOOKING_CONFIG,
  type Interval,
} from "@/lib/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/reservation/slots?date=YYYY-MM-DD&formula=<id>
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const date = p.get("date") || "";
  const f = getFormula(p.get("formula") || "");
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!f || !m) {
    return NextResponse.json({ ok: false, error: "params" }, { status: 400 });
  }

  const dayStart = new Date(
    Number(m[1]),
    Number(m[2]) - 1,
    Number(m[3]),
    0,
    0,
    0,
    0,
  ).getTime();
  const dayEnd = dayStart + 86400000;
  const now = Date.now();

  // Bornes : pas dans le passé, pas au-delà de l'horizon.
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  const maxDay = todayStart + BOOKING_CONFIG.horizonDays * 86400000;
  if (dayStart < todayStart || dayStart > maxDay) {
    return NextResponse.json({ ok: true, slots: [], duration: f.durationMin });
  }

  const exclude = Number(p.get("exclude")) || 0;
  const jobs = getScheduledBetween(dayStart, dayEnd).filter((j) => j.id !== exclude);
  const blocks = getBlocksBetween(dayStart, dayEnd);
  const busy: Interval[] = [
    ...jobs.map((j) => {
      const s = Math.round((j.scheduled_at - dayStart) / 60000);
      return { start: s, end: s + (j.duration_min ?? 90) };
    }),
    ...blocks.map((b) => ({
      start: Math.max(0, Math.round((b.start_at - dayStart) / 60000)),
      end: Math.min(1440, Math.round((b.end_at - dayStart) / 60000)),
    })),
  ];

  const slots = computeSlots(dayStart, f.durationMin, busy, now);
  return NextResponse.json({ ok: true, slots, duration: f.durationMin });
}
