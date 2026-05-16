// ─────────────────────────────────────────────────────────────────────────
//  Rate limiter en mémoire, par instance.
//
//  Note : sur un déploiement single-process (pm2 sans cluster), c'est
//  parfait. Si on passe en cluster mode ou multi-VPS, il faudra basculer
//  sur Redis ou un store partagé.
//
//  Algorithme : fenêtre fixe + verrouillage temporaire en cas de dépassement.
//   - Une entrée par IP, expirée après la fenêtre
//   - Compteur incrémenté à chaque hit
//   - Si > MAX dans la fenêtre → blocage durée LOCKOUT
//
//  Cleanup périodique pour éviter de remplir la mémoire (toutes les 5 min).
// ─────────────────────────────────────────────────────────────────────────

type Entry = {
  count: number;
  windowStart: number;
  lockedUntil?: number;
};

type Bucket = {
  store: Map<string, Entry>;
  maxAttempts: number;
  windowMs: number;
  lockoutMs: number;
};

const buckets = new Map<string, Bucket>();

/** Crée ou récupère un bucket nommé (un par route à limiter). */
function getBucket(
  name: string,
  maxAttempts: number,
  windowMs: number,
  lockoutMs: number,
): Bucket {
  let b = buckets.get(name);
  if (!b) {
    b = { store: new Map(), maxAttempts, windowMs, lockoutMs };
    buckets.set(name, b);
  }
  return b;
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number; reason: "window" | "lockout" };

/** Test du rate limit. Retourne immédiatement la décision. */
export function checkRateLimit(
  ip: string | null,
  options: {
    bucket: string;
    /** Nombre max de hits par fenêtre avant lockout */
    maxAttempts: number;
    /** Durée de la fenêtre en ms */
    windowMs: number;
    /** Durée du blocage en ms après dépassement */
    lockoutMs: number;
  },
): RateLimitResult {
  // IP inconnue (proxy mal configuré ?) → on ne bloque pas pour ne pas casser
  // le tracking légitime. C'est un trade-off.
  if (!ip) return { allowed: true };

  const b = getBucket(
    options.bucket,
    options.maxAttempts,
    options.windowMs,
    options.lockoutMs,
  );
  const now = Date.now();
  const entry = b.store.get(ip);

  // Vérifier si l'IP est verrouillée
  if (entry?.lockedUntil && entry.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
      reason: "lockout",
    };
  }

  // Pas d'entrée OU fenêtre expirée → nouvelle fenêtre
  if (!entry || entry.windowStart + b.windowMs < now) {
    b.store.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  // Dans la fenêtre courante
  entry.count++;
  if (entry.count > b.maxAttempts) {
    entry.lockedUntil = now + b.lockoutMs;
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(b.lockoutMs / 1000),
      reason: "window",
    };
  }
  return { allowed: true };
}

/** Cleanup périodique des entrées expirées pour éviter le memory leak.
 *  Lancé une seule fois au chargement du module. */
type GlobalWithCleanup = typeof globalThis & {
  __strascleanRateLimitCleanup?: NodeJS.Timeout;
};
const g = globalThis as GlobalWithCleanup;
if (!g.__strascleanRateLimitCleanup) {
  g.__strascleanRateLimitCleanup = setInterval(
    () => {
      const now = Date.now();
      for (const b of buckets.values()) {
        for (const [ip, entry] of b.store.entries()) {
          const expiredWindow = entry.windowStart + b.windowMs < now;
          const expiredLockout = !entry.lockedUntil || entry.lockedUntil < now;
          if (expiredWindow && expiredLockout) {
            b.store.delete(ip);
          }
        }
      }
    },
    5 * 60 * 1000, // 5 min
  );
}

/** Helper pour extraire l'IP client en respectant les reverse-proxies. */
export function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  return null;
}
