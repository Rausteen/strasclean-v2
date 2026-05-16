import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { hideIp, unhideIp } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { ip?: string; action?: string; label?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad body" }, { status: 400 });
  }

  const ip = (body.ip || "").trim();
  if (!ip) {
    return NextResponse.json({ ok: false, error: "Missing ip" }, { status: 400 });
  }

  if (body.action === "unhide") {
    unhideIp(ip);
  } else {
    hideIp(ip, body.label?.trim() || undefined);
  }

  return NextResponse.json({ ok: true });
}
