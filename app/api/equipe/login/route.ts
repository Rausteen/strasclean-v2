import { NextResponse } from "next/server";
import { checkTeamPassword, createTeamSessionCookie, checkSameOrigin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!checkSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Origine refusée" }, { status: 403 });
  }
  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Format invalide" }, { status: 400 });
  }
  if (!checkTeamPassword((body.password || "").trim())) {
    return NextResponse.json({ ok: false, error: "Mot de passe incorrect" }, { status: 401 });
  }
  await createTeamSessionCookie();
  return NextResponse.json({ ok: true });
}
