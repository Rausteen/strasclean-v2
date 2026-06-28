import { NextRequest, NextResponse } from "next/server";
import { recordVisit, recordEvent } from "@/lib/db";
import { parseUserAgent, classifySource } from "@/lib/ua";
import { isMaisonPathname } from "@/lib/section";
import { checkRateLimit } from "@/lib/ratelimit";

const MAX_PAYLOAD_BYTES = 8 * 1024; // 8 KB max — un événement track tient en <1 KB

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(req: NextRequest): string | null {
  // Respect des reverse-proxies courants (nginx, Cloudflare, Vercel)
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  return null;
}

function parseQueryParams(query: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!query) return out;
  const sp = new URLSearchParams(query.startsWith("?") ? query.slice(1) : query);
  sp.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate limit anti-spam : 100 events/min par IP. Largement au-dessus du
  // trafic légitime (pageview + clicks ≈ 5-10 events / session), bloque
  // les bots qui voudraient saturer la DB.
  const rl = checkRateLimit(ip, {
    bucket: "track",
    maxAttempts: 100,
    windowMs: 60 * 1000,
    lockoutMs: 5 * 60 * 1000,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Rate limit exceeded" },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds) },
      },
    );
  }

  // Validation de la taille du payload (header Content-Length)
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Payload too large" },
      { status: 413 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const ua = req.headers.get("user-agent");
  const parsed = parseUserAgent(ua);
  const type = String(payload.type || "");
  const sid = (payload.sid as string) || null;
  const path = (payload.path as string) || "/";
  const referer = (payload.referer as string) || null;

  // Pages internes (app équipe, dashboard admin) : jamais comptées dans les
  // statistiques publiques.
  if (path.startsWith("/equipe") || path.startsWith("/admin")) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (type === "pageview") {
    const query = (payload.query as string) || "";
    const params = parseQueryParams(query);
    const source = classifySource(params, referer);

    recordVisit({
      ts: Date.now(),
      session_id: sid,
      ip,
      user_agent: ua,
      referer,
      path,
      query: query || null,
      utm_source: params.utm_source ?? null,
      utm_medium: params.utm_medium ?? null,
      utm_campaign: params.utm_campaign ?? null,
      utm_content: params.utm_content ?? null,
      utm_term: params.utm_term ?? null,
      gclid: params.gclid ?? null,
      fbclid: params.fbclid ?? null,
      source,
      device: parsed.device,
      os: parsed.os,
      browser: parsed.browser,
    });
  } else if (type === "whatsapp_click" || type === "phone_click") {
    const href = (payload.href as string) || null;
    // Section dérivée du path : permet de filtrer les conversions Maison
    // vs Auto dans le dashboard et de différencier les conversions Google Ads
    // par compte (2 comptes Ads possibles, 1 par section).
    const section = isMaisonPathname(path) ? "maison" : "auto";
    recordEvent({
      ts: Date.now(),
      session_id: sid,
      type,
      path,
      href,
      ip,
      user_agent: ua,
      source: null,
      section,
    });
  } else {
    return NextResponse.json({ ok: false, reason: "unknown type" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
