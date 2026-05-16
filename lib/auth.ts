import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "strasclean_admin";
const SESSION_DURATION_MS = 365 * 24 * 60 * 60 * 1000; // 1 an

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
export function checkPassword(input: string): boolean {
  const pwd = getAdminPassword();
  if (!pwd) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pwd);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
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
  return payload.exp > Date.now();
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
