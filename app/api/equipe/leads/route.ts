import { NextResponse } from "next/server";
import { isTeamAuthenticated, checkSameOrigin } from "@/lib/auth";
import { listLeads, updateLead } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = ["nouveau", "a_relancer", "converti", "perdu"];

export async function GET() {
  if (!(await isTeamAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, leads: listLeads() });
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
  const fields: { status?: string; notes?: string | null } = {};
  if (typeof body.status === "string" && STATUSES.includes(body.status)) {
    fields.status = body.status;
  }
  if ("notes" in body) {
    fields.notes =
      typeof body.notes === "string" ? body.notes.trim().slice(0, 1000) : null;
  }
  updateLead(id, fields);
  return NextResponse.json({ ok: true });
}
