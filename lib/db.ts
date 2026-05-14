import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

// ─── Path : data/analytics.db à la racine du projet ─────────────────────
const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "analytics.db");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ─── Connexion partagée (Singleton) ─────────────────────────────────────
type GlobalWithDb = typeof globalThis & { __strascleanDb?: Database.Database };
const g = globalThis as GlobalWithDb;

function openDb(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL,
      session_id TEXT,
      ip TEXT,
      user_agent TEXT,
      referer TEXT,
      path TEXT NOT NULL,
      query TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_content TEXT,
      utm_term TEXT,
      gclid TEXT,
      fbclid TEXT,
      source TEXT,
      device TEXT,
      os TEXT,
      browser TEXT
    );
    CREATE INDEX IF NOT EXISTS visits_ts ON visits(ts DESC);
    CREATE INDEX IF NOT EXISTS visits_source ON visits(source);
    CREATE INDEX IF NOT EXISTS visits_session ON visits(session_id);

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL,
      session_id TEXT,
      type TEXT NOT NULL,
      path TEXT,
      href TEXT,
      ip TEXT,
      user_agent TEXT,
      source TEXT
    );
    CREATE INDEX IF NOT EXISTS events_ts ON events(ts DESC);
    CREATE INDEX IF NOT EXISTS events_type ON events(type);
    CREATE INDEX IF NOT EXISTS events_session ON events(session_id);
  `);

  return db;
}

export const db = g.__strascleanDb ?? (g.__strascleanDb = openDb());

// ─── Types ──────────────────────────────────────────────────────────────
export type Visit = {
  id: number;
  ts: number;
  session_id: string | null;
  ip: string | null;
  user_agent: string | null;
  referer: string | null;
  path: string;
  query: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  gclid: string | null;
  fbclid: string | null;
  source: string | null;
  device: string | null;
  os: string | null;
  browser: string | null;
};

export type Event = {
  id: number;
  ts: number;
  session_id: string | null;
  type: string;
  path: string | null;
  href: string | null;
  ip: string | null;
  user_agent: string | null;
  source: string | null;
};

// ─── Inserts ────────────────────────────────────────────────────────────
const insertVisitStmt = db.prepare(`
  INSERT INTO visits
    (ts, session_id, ip, user_agent, referer, path, query,
     utm_source, utm_medium, utm_campaign, utm_content, utm_term,
     gclid, fbclid, source, device, os, browser)
  VALUES
    (@ts, @session_id, @ip, @user_agent, @referer, @path, @query,
     @utm_source, @utm_medium, @utm_campaign, @utm_content, @utm_term,
     @gclid, @fbclid, @source, @device, @os, @browser)
`);

const insertEventStmt = db.prepare(`
  INSERT INTO events
    (ts, session_id, type, path, href, ip, user_agent, source)
  VALUES
    (@ts, @session_id, @type, @path, @href, @ip, @user_agent, @source)
`);

export function recordVisit(v: Omit<Visit, "id">) {
  insertVisitStmt.run(v);
}

export function recordEvent(e: Omit<Event, "id">) {
  insertEventStmt.run(e);
}

// ─── Queries pour le dashboard ──────────────────────────────────────────
export function getKpis() {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const cutoff24h = now - dayMs;
  const cutoff7d = now - 7 * dayMs;
  const cutoff30d = now - 30 * dayMs;

  const row = (sql: string, ...params: unknown[]) =>
    (db.prepare(sql).get(...params) as { c: number }).c;

  return {
    visitsTotal: row("SELECT COUNT(*) as c FROM visits"),
    visits24h: row("SELECT COUNT(*) as c FROM visits WHERE ts >= ?", cutoff24h),
    visits7d: row("SELECT COUNT(*) as c FROM visits WHERE ts >= ?", cutoff7d),
    visits30d: row("SELECT COUNT(*) as c FROM visits WHERE ts >= ?", cutoff30d),

    visitsAds7d: row(
      "SELECT COUNT(*) as c FROM visits WHERE ts >= ? AND source = 'ads'",
      cutoff7d,
    ),
    visitsOrganic7d: row(
      "SELECT COUNT(*) as c FROM visits WHERE ts >= ? AND source = 'organic'",
      cutoff7d,
    ),
    visitsDirect7d: row(
      "SELECT COUNT(*) as c FROM visits WHERE ts >= ? AND source = 'direct'",
      cutoff7d,
    ),
    visitsReferral7d: row(
      "SELECT COUNT(*) as c FROM visits WHERE ts >= ? AND source IN ('referral','social')",
      cutoff7d,
    ),

    whatsappClicks7d: row(
      "SELECT COUNT(*) as c FROM events WHERE ts >= ? AND type = 'whatsapp_click'",
      cutoff7d,
    ),
    phoneClicks7d: row(
      "SELECT COUNT(*) as c FROM events WHERE ts >= ? AND type = 'phone_click'",
      cutoff7d,
    ),
    whatsappClicksTotal: row(
      "SELECT COUNT(*) as c FROM events WHERE type = 'whatsapp_click'",
    ),
    phoneClicksTotal: row(
      "SELECT COUNT(*) as c FROM events WHERE type = 'phone_click'",
    ),
  };
}

export function getRecentVisits(limit = 100): Visit[] {
  return db
    .prepare("SELECT * FROM visits ORDER BY ts DESC LIMIT ?")
    .all(limit) as Visit[];
}

export function getRecentEvents(limit = 100): Event[] {
  return db
    .prepare("SELECT * FROM events ORDER BY ts DESC LIMIT ?")
    .all(limit) as Event[];
}

export function getTopPaths(limit = 10) {
  return db
    .prepare(
      `SELECT path, COUNT(*) as c
         FROM visits
        WHERE ts >= ?
        GROUP BY path
        ORDER BY c DESC
        LIMIT ?`,
    )
    .all(Date.now() - 30 * 24 * 60 * 60 * 1000, limit) as {
    path: string;
    c: number;
  }[];
}

export function getTopReferers(limit = 10) {
  return db
    .prepare(
      `SELECT referer, COUNT(*) as c
         FROM visits
        WHERE referer IS NOT NULL AND referer != ''
          AND ts >= ?
        GROUP BY referer
        ORDER BY c DESC
        LIMIT ?`,
    )
    .all(Date.now() - 30 * 24 * 60 * 60 * 1000, limit) as {
    referer: string;
    c: number;
  }[];
}
