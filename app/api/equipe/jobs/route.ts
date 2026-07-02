import { NextResponse } from "next/server";
import { isTeamAuthenticated, checkSameOrigin } from "@/lib/auth";
import {
  listJobs,
  insertJob,
  updateJob,
  deleteJob,
  type JobInput,
} from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = ["a_faire", "termine"];

function num(v: unknown): number {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}
function str(v: unknown, max = 200): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().slice(0, max);
  return t.length > 0 ? t : null;
}
function statusOf(v: unknown): string {
  return typeof v === "string" && STATUSES.includes(v) ? v : "a_faire";
}

/** Construit un JobInput propre à partir d'un body brut. */
function toJobInput(b: Record<string, unknown>): JobInput {
  return {
    ts: typeof b.ts === "number" && Number.isFinite(b.ts) ? b.ts : Date.now(),
    phone: str(b.phone, 40),
    prestation: str(b.prestation, 120),
    vehicle_type: str(b.vehicle_type, 60),
    price: num(b.price),
    supplements: num(b.supplements),
    total: num(b.total),
    collected: b.collected ? 1 : 0,
    payment: str(b.payment, 40),
    source: str(b.source, 60),
    status: statusOf(b.status),
    notes: str(b.notes, 1000),
    scheduled_at:
      typeof b.scheduled_at === "number" && Number.isFinite(b.scheduled_at)
        ? b.scheduled_at
        : null,
    duration_min:
      typeof b.duration_min === "number" && Number.isFinite(b.duration_min)
        ? b.duration_min
        : null,
    customer_name: str(b.customer_name, 120),
    address: str(b.address, 200),
  };
}

export async function GET() {
  if (!(await isTeamAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, jobs: listJobs() });
}

export async function POST(req: Request) {
  if (!checkSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  if (!(await isTeamAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad body" }, { status: 400 });
  }
  const id = insertJob(toJobInput(body));
  return NextResponse.json({ ok: true, id });
}

export async function PATCH(req: Request) {
  if (!checkSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  if (!(await isTeamAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad body" }, { status: 400 });
  }
  const id = Number(body.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ ok: false, error: "id manquant" }, { status: 400 });
  }
  // Update partiel : on ne touche qu'aux champs présents dans le body.
  const fields: Partial<JobInput> = {};
  if ("ts" in body && typeof body.ts === "number") fields.ts = body.ts;
  if ("phone" in body) fields.phone = str(body.phone, 40);
  if ("prestation" in body) fields.prestation = str(body.prestation, 120);
  if ("vehicle_type" in body) fields.vehicle_type = str(body.vehicle_type, 60);
  if ("price" in body) fields.price = num(body.price);
  if ("supplements" in body) fields.supplements = num(body.supplements);
  if ("total" in body) fields.total = num(body.total);
  if ("collected" in body) fields.collected = body.collected ? 1 : 0;
  if ("payment" in body) fields.payment = str(body.payment, 40);
  if ("source" in body) fields.source = str(body.source, 60);
  if ("status" in body) fields.status = statusOf(body.status);
  if ("notes" in body) fields.notes = str(body.notes, 1000);
  if ("scheduled_at" in body)
    fields.scheduled_at =
      typeof body.scheduled_at === "number" ? body.scheduled_at : null;
  if ("duration_min" in body)
    fields.duration_min =
      typeof body.duration_min === "number" ? body.duration_min : null;
  if ("customer_name" in body) fields.customer_name = str(body.customer_name, 120);
  if ("address" in body) fields.address = str(body.address, 200);
  updateJob(id, fields);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!checkSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  if (!(await isTeamAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body: { id?: unknown };
  try {
    body = (await req.json()) as { id?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Bad body" }, { status: 400 });
  }
  const id = Number(body.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ ok: false, error: "id manquant" }, { status: 400 });
  }
  deleteJob(id);
  return NextResponse.json({ ok: true });
}
