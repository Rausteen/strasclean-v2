import { NextResponse } from "next/server";
import { isTeamAuthenticated, checkSameOrigin } from "@/lib/auth";
import { listBlocks, insertBlock, deleteBlock } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isTeamAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, blocks: listBlocks() });
}

export async function POST(req: Request) {
  if (!checkSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  if (!(await isTeamAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad body" }, { status: 400 });
  }
  const start = Number(b.start_at);
  const end = Number(b.end_at);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return NextResponse.json({ ok: false, error: "Période invalide" }, { status: 400 });
  }
  const reason =
    typeof b.reason === "string" ? b.reason.trim().slice(0, 120) || null : null;
  const id = insertBlock(start, end, reason);
  return NextResponse.json({ ok: true, id });
}

export async function DELETE(req: Request) {
  if (!checkSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  if (!(await isTeamAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let b: { id?: unknown };
  try {
    b = (await req.json()) as { id?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Bad body" }, { status: 400 });
  }
  const id = Number(b.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ ok: false, error: "id manquant" }, { status: 400 });
  }
  deleteBlock(id);
  return NextResponse.json({ ok: true });
}
