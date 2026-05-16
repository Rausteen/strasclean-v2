import { NextRequest, NextResponse } from "next/server";
import { recordVisit, recordEvent } from "@/lib/db";
import { parseUserAgent, classifySource } from "@/lib/ua";
import { isMaisonPathname } from "@/lib/section";

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
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ip = getClientIp(req);
  const ua = req.headers.get("user-agent");
  const parsed = parseUserAgent(ua);
  const type = String(payload.type || "");
  const sid = (payload.sid as string) || null;
  const path = (payload.path as string) || "/";
  const referer = (payload.referer as string) || null;

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
