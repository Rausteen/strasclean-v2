import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createSessionCookie, checkSameOrigin } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Anti-CSRF : empêche un site tiers de soumettre le formulaire login
  // pour brute-force depuis le navigateur de la victime.
  if (!checkSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(req);

  // Rate limit : max 5 tentatives par fenêtre de 15 min, blocage 30 min
  // au-delà. Protection anti-bruteforce essentielle vu que le password
  // admin est un secret partagé en clair (cf. audit sécurité).
  const rl = checkRateLimit(ip, {
    bucket: "admin-login",
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    lockoutMs: 30 * 60 * 1000,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: `Trop de tentatives. Réessayez dans ${Math.ceil(rl.retryAfterSeconds / 60)} min.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rl.retryAfterSeconds),
        },
      },
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad body" }, { status: 400 });
  }

  const password = body.password || "";
  if (!checkPassword(password)) {
    // Anti-bruteforce : délai côté serveur pour ralentir les attaques en
    // parallèle. Cumulé avec le rate limit IP, fournit une protection
    // robuste.
    await new Promise((r) => setTimeout(r, 1000));
    return NextResponse.json(
      { ok: false, error: "Mot de passe incorrect" },
      { status: 401 },
    );
  }

  await createSessionCookie();
  return NextResponse.json({ ok: true });
}
