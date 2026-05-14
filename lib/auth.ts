import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "strasclean_admin";
const SESSION_DURATION_MS = 365 * 24 * 60 * 60 * 1000; // 1 an

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  // Fallback dev — surcharger en prod via .env.local
  "dev-only-fallback-please-set-SESSION_SECRET-in-env-local-32chars+";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

// ─── HMAC signing ───────────────────────────────────────────────────────
function hmac(payload: string): string {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
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
  if (!ADMIN_PASSWORD) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(ADMIN_PASSWORD);
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
