import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "strasclean_admin";
// Session admin : 30 jours, prolongée automatiquement à chaque appel
// authentifié (sliding expiration). Fenêtre de compromission plus courte
// qu'1 an, mais l'admin actif ne se déconnecte pas tant qu'il visite.
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
// Si le cookie expire dans moins de 7 jours, on en émet un nouveau lors
// de la prochaine vérification d'auth (refresh transparent).
const SESSION_REFRESH_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

const DEV_FALLBACK_SECRET =
  "dev-only-fallback-please-set-SESSION_SECRET-in-env-local-32chars+";

/** Résolution lazy du secret pour éviter de faire planter le build
 *  (NODE_ENV=production sans .env). Le check est exécuté au moment où
 *  l'auth est réellement utilisée (request-time). */
let warnedDevFallback = false;
function getSessionSecret(): string {
  const fromEnv = process.env.SESSION_SECRET;
  if (fromEnv && fromEnv !== DEV_FALLBACK_SECRET && fromEnv.length >= 32) {
    return fromEnv;
  }
  // En prod runtime : refus catégorique
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[StrasClean auth] SESSION_SECRET is required in production " +
        "(must be at least 32 chars and not equal to the dev fallback). " +
        "Set it in your .env.local or environment variables before starting.",
    );
  }
  // En dev/build : fallback toléré + warning visible (une seule fois)
  if (!warnedDevFallback && process.env.NODE_ENV !== "test") {
    warnedDevFallback = true;
    // eslint-disable-next-line no-console
    console.warn(
      "[StrasClean auth] Using DEV fallback SESSION_SECRET. " +
        "Set process.env.SESSION_SECRET to a 32+ char random string for production.",
    );
  }
  return DEV_FALLBACK_SECRET;
}

function getAdminPassword(): string {
  const pwd = process.env.ADMIN_PASSWORD || "";
  if (process.env.NODE_ENV === "production" && !pwd) {
    throw new Error(
      "[StrasClean auth] ADMIN_PASSWORD is required in production. " +
        "Set it in your environment variables before starting.",
    );
  }
  return pwd;
}

// ─── HMAC signing ───────────────────────────────────────────────────────
function hmac(payload: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

function sign(payload: object): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${hmac(body)}`;
}

function verify(token: string): { exp: number } | null {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  // constant-time compare
  const expected = hmac(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}

// ─── Password check ─────────────────────────────────────────────────────
function constantTimeEquals(input: string, secret: string): boolean {
  if (!secret) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function checkPassword(input: string): boolean {
  return constantTimeEquals(input, getAdminPassword());
}

// ─── Auth ÉQUIPE (app /equipe pour les nettoyeurs) ───────────────────────
// Mot de passe d'équipe distinct de l'admin. À défaut de TEAM_PASSWORD, on
// retombe sur ADMIN_PASSWORD pour que ça marche tout de suite (tu peux poser
// un TEAM_PASSWORD séparé plus tard pour que l'équipe n'ait PAS le mdp admin).
const TEAM_COOKIE_NAME = "strasclean_team";

function getTeamPassword(): string {
  return process.env.TEAM_PASSWORD || process.env.ADMIN_PASSWORD || "";
}

export function checkTeamPassword(input: string): boolean {
  return constantTimeEquals(input, getTeamPassword());
}

// ─── Cookie helpers ─────────────────────────────────────────────────────
export async function createSessionCookie() {
  const token = sign({ exp: Date.now() + SESSION_DURATION_MS });
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const payload = verify(token);
  if (!payload) return false;

  const now = Date.now();
  if (payload.exp <= now) return false;

  // Sliding expiration : si le cookie expire dans moins de SESSION_REFRESH_THRESHOLD_MS,
  // on en émet un nouveau qui repart de SESSION_DURATION_MS. L'admin actif
  // ne se déconnecte jamais, mais un cookie inactif > 30 jours expire.
  const remainingMs = payload.exp - now;
  if (remainingMs < SESSION_REFRESH_THRESHOLD_MS) {
    try {
      await createSessionCookie();
    } catch {
      // En lecture seule (ex: dans un middleware), on ne peut pas écrire
      // le cookie. C'est OK — la session reste valide jusqu'à exp.
    }
  }

  return true;
}

// ─── Cookie helpers ÉQUIPE ──────────────────────────────────────────────
export async function createTeamSessionCookie() {
  const token = sign({ exp: Date.now() + SESSION_DURATION_MS, role: "team" });
  const jar = await cookies();
  jar.set(TEAM_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  });
}

export async function clearTeamSessionCookie() {
  const jar = await cookies();
  jar.delete(TEAM_COOKIE_NAME);
}

/** Vrai si l'utilisateur est un membre de l'équipe OU l'admin (le gérant
 *  connecté à l'admin accède aussi à /equipe sans re-login). */
export async function isTeamAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(TEAM_COOKIE_NAME)?.value;
  if (token) {
    const payload = verify(token);
    if (payload && payload.exp > Date.now()) return true;
  }
  // Repli : session admin valide.
  return isAuthenticated();
}

/**
 * Vérifie que la requête provient bien du même site (anti-CSRF).
 *
 * Combiné avec le cookie sameSite=lax (déjà en place), assure qu'un site
 * tiers ne peut pas forger une requête POST authentifiée. On vérifie le
 * header Origin (priorité) ou Referer (fallback).
 *
 * Retourne true si l'origine est légitime.
 */
export function checkSameOrigin(req: Request): boolean {
  const host = req.headers.get("host");
  if (!host) return false;

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  // Fallback : referer si pas d'origin (anciens browsers / certains
  // fetch sans credentials).
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  // Pas d'origin ni de referer → on rejette par sécurité.
  return false;
}
