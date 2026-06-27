import { NextResponse } from "next/server";
import { clearTeamSessionCookie, checkSameOrigin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!checkSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Origine refusée" }, { status: 403 });
  }
  await clearTeamSessionCookie();
  return NextResponse.json({ ok: true });
}
