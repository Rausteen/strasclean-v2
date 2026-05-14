import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad body" }, { status: 400 });
  }

  const password = body.password || "";
  if (!checkPassword(password)) {
    // Anti-bruteforce naïf : on attend 1s avant de répondre
    await new Promise((r) => setTimeout(r, 1000));
    return NextResponse.json(
      { ok: false, error: "Mot de passe incorrect" },
      { status: 401 },
    );
  }

  await createSessionCookie();
  return NextResponse.json({ ok: true });
}
