import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────
//  Middleware — blocage d'IP (anti-troll / anti-spam).
//
//  Les IP listées ici reçoivent un 403 sur TOUT le site (pages + API), ce qui
//  coupe le spam du formulaire et le trolling. À gérer de 2 façons :
//   - rapide : ajouter l'IP dans DEFAULT_BLOCKED ci-dessous (commit + deploy)
//   - sans déploiement : variable d'env BLOCKED_IPS="ip1,ip2,..." côté Dokploy
//
//  ⚠️ Limite : une IP se contourne avec un VPN / la 4G. Pour stopper les CLICS
//  facturés sur Google Ads, il faut AUSSI exclure l'IP dans Google Ads
//  (Paramètres campagne → Exclusions d'adresses IP) — le clic est facturé
//  avant d'arriver ici.
// ─────────────────────────────────────────────────────────────────────────

const DEFAULT_BLOCKED = [
  "86.243.174.85",
];

const BLOCKED = new Set(
  [
    ...DEFAULT_BLOCKED,
    ...(process.env.BLOCKED_IPS?.split(",").map((s) => s.trim()) ?? []),
  ].filter(Boolean),
);

/** IP client réelle derrière le reverse-proxy (Traefik/Dokploy). */
function clientIp(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (
    req.headers.get("x-real-ip")?.trim() ??
    req.headers.get("cf-connecting-ip")?.trim() ??
    null
  );
}

export function middleware(req: NextRequest) {
  if (BLOCKED.size > 0) {
    const ip = clientIp(req);
    if (ip && BLOCKED.has(ip)) {
      return new NextResponse("Forbidden", {
        status: 403,
        headers: { "cache-control": "no-store" },
      });
    }
  }
  return NextResponse.next();
}

// On couvre pages + API, en excluant les internes Next et les assets statiques
// (inutile d'exécuter le middleware dessus).
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|webp|ico|txt|xml|woff2?)$).*)",
  ],
};
