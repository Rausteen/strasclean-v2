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
      source TEXT,
      section TEXT
    );
    CREATE INDEX IF NOT EXISTS events_ts ON events(ts DESC);
    CREATE INDEX IF NOT EXISTS events_type ON events(type);
    CREATE INDEX IF NOT EXISTS events_session ON events(session_id);
  `);

  // Migration douce : si la table events existait avant qu'on ajoute la
  // colonne section, on l'ajoute maintenant (SQLite n'accepte pas
  // ADD COLUMN IF NOT EXISTS, d'où le try/catch).
  try {
    db.exec(`ALTER TABLE events ADD COLUMN section TEXT`);
  } catch {
    // Colonne déjà présente — ignore
  }

  // Index sur section, créé APRES la garantie que la colonne existe.
  db.exec(`CREATE INDEX IF NOT EXISTS events_section ON events(section);`);

  db.exec(`
    CREATE TABLE IF NOT EXISTS hidden_ips (
      ip TEXT PRIMARY KEY,
      label TEXT,
      hidden_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS review_tags (
      review_id TEXT PRIMARY KEY,
      tag TEXT NOT NULL,
      tagged_at INTEGER NOT NULL
    );
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
  /** 'auto' | 'maison' — dérivé du path côté serveur, permet de filtrer
   *  les conversions par section dans le dashboard et Google Ads. */
  section: string | null;
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
    (ts, session_id, type, path, href, ip, user_agent, source, section)
  VALUES
    (@ts, @session_id, @type, @path, @href, @ip, @user_agent, @source, @section)
`);

export function recordVisit(v: Omit<Visit, "id">) {
  insertVisitStmt.run(v);
}

export function recordEvent(e: Omit<Event, "id">) {
  insertEventStmt.run(e);
}

// ─── IPs cachées ────────────────────────────────────────────────────────
// Les IPs présentes ici sont exclues de TOUTES les statistiques (KPIs,
// listes, top paths, etc). Utilisé pour ne pas polluer les chiffres avec
// nos propres visites de test/dev.
export type HiddenIp = { ip: string; label: string | null; hidden_at: number };

export function hideIp(ip: string, label?: string) {
  db.prepare(
    `INSERT OR REPLACE INTO hidden_ips (ip, label, hidden_at) VALUES (?, ?, ?)`,
  ).run(ip, label ?? null, Date.now());
}

export function unhideIp(ip: string) {
  db.prepare(`DELETE FROM hidden_ips WHERE ip = ?`).run(ip);
}

export function getHiddenIps(): HiddenIp[] {
  return db
    .prepare(`SELECT * FROM hidden_ips ORDER BY hidden_at DESC`)
    .all() as HiddenIp[];
}

// ─── Tags d'avis Google (auto / maison / both) ──────────────────────────
export type ReviewTagValue = "auto" | "maison" | "both";
export type ReviewTag = { review_id: string; tag: ReviewTagValue; tagged_at: number };

export function setReviewTag(reviewId: string, tag: ReviewTagValue) {
  db.prepare(
    `INSERT OR REPLACE INTO review_tags (review_id, tag, tagged_at) VALUES (?, ?, ?)`,
  ).run(reviewId, tag, Date.now());
}

export function clearReviewTag(reviewId: string) {
  db.prepare(`DELETE FROM review_tags WHERE review_id = ?`).run(reviewId);
}

/** Renvoie une Map reviewId → tag pour appliquer côté UI. */
export function getReviewTagsMap(): Record<string, ReviewTagValue> {
  const rows = db.prepare(`SELECT review_id, tag FROM review_tags`).all() as {
    review_id: string;
    tag: ReviewTagValue;
  }[];
  const out: Record<string, ReviewTagValue> = {};
  for (const r of rows) out[r.review_id] = r.tag;
  return out;
}

/** Renvoie la clause SQL "AND ip NOT IN (...)" + params à passer. Vide si aucune IP cachée. */
function excludeHiddenClause(): { sql: string; params: string[] } {
  const ips = db.prepare(`SELECT ip FROM hidden_ips`).all() as { ip: string }[];
  if (ips.length === 0) return { sql: "", params: [] };
  const placeholders = ips.map(() => "?").join(",");
  return {
    sql: ` AND ip NOT IN (${placeholders})`,
    params: ips.map((r) => r.ip),
  };
}

// ─── Queries pour le dashboard ──────────────────────────────────────────
export function getKpis() {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const cutoff24h = now - dayMs;
  const cutoff7d = now - 7 * dayMs;
  const cutoff30d = now - 30 * dayMs;

  const hidden = excludeHiddenClause();
  // Pour les KPIs "AND ts >= ?" est déjà présent — on append directement
  // la clause excludeHidden. Pour le count total "SELECT COUNT(*) ...", on
  // gère séparément avec "WHERE 1=1".
  const row = (sql: string, ...params: unknown[]) =>
    (db.prepare(sql).get(...params) as { c: number }).c;

  return {
    visitsTotal: row(
      `SELECT COUNT(*) as c FROM visits WHERE 1=1${hidden.sql}`,
      ...hidden.params,
    ),
    visits24h: row(
      `SELECT COUNT(*) as c FROM visits WHERE ts >= ?${hidden.sql}`,
      cutoff24h,
      ...hidden.params,
    ),
    visits7d: row(
      `SELECT COUNT(*) as c FROM visits WHERE ts >= ?${hidden.sql}`,
      cutoff7d,
      ...hidden.params,
    ),
    visits30d: row(
      `SELECT COUNT(*) as c FROM visits WHERE ts >= ?${hidden.sql}`,
      cutoff30d,
      ...hidden.params,
    ),

    visitsAds7d: row(
      `SELECT COUNT(*) as c FROM visits WHERE ts >= ? AND source = 'ads'${hidden.sql}`,
      cutoff7d,
      ...hidden.params,
    ),
    visitsOrganic7d: row(
      `SELECT COUNT(*) as c FROM visits WHERE ts >= ? AND source = 'organic'${hidden.sql}`,
      cutoff7d,
      ...hidden.params,
    ),
    visitsDirect7d: row(
      `SELECT COUNT(*) as c FROM visits WHERE ts >= ? AND source = 'direct'${hidden.sql}`,
      cutoff7d,
      ...hidden.params,
    ),
    visitsReferral7d: row(
      `SELECT COUNT(*) as c FROM visits WHERE ts >= ? AND source IN ('referral','social')${hidden.sql}`,
      cutoff7d,
      ...hidden.params,
    ),

    whatsappClicks7d: row(
      `SELECT COUNT(*) as c FROM events WHERE ts >= ? AND type = 'whatsapp_click'${hidden.sql}`,
      cutoff7d,
      ...hidden.params,
    ),
    phoneClicks7d: row(
      `SELECT COUNT(*) as c FROM events WHERE ts >= ? AND type = 'phone_click'${hidden.sql}`,
      cutoff7d,
      ...hidden.params,
    ),
    whatsappClicksTotal: row(
      `SELECT COUNT(*) as c FROM events WHERE type = 'whatsapp_click'${hidden.sql}`,
      ...hidden.params,
    ),
    phoneClicksTotal: row(
      `SELECT COUNT(*) as c FROM events WHERE type = 'phone_click'${hidden.sql}`,
      ...hidden.params,
    ),

    // Conversions split par section (Auto / Maison) — utile pour mesurer
    // le CPL différencié si tu lances 2 campagnes Ads.
    whatsappAuto7d: row(
      `SELECT COUNT(*) as c FROM events WHERE ts >= ? AND type = 'whatsapp_click' AND (section = 'auto' OR section IS NULL)${hidden.sql}`,
      cutoff7d,
      ...hidden.params,
    ),
    whatsappMaison7d: row(
      `SELECT COUNT(*) as c FROM events WHERE ts >= ? AND type = 'whatsapp_click' AND section = 'maison'${hidden.sql}`,
      cutoff7d,
      ...hidden.params,
    ),
    phoneAuto7d: row(
      `SELECT COUNT(*) as c FROM events WHERE ts >= ? AND type = 'phone_click' AND (section = 'auto' OR section IS NULL)${hidden.sql}`,
      cutoff7d,
      ...hidden.params,
    ),
    phoneMaison7d: row(
      `SELECT COUNT(*) as c FROM events WHERE ts >= ? AND type = 'phone_click' AND section = 'maison'${hidden.sql}`,
      cutoff7d,
      ...hidden.params,
    ),
  };
}

export function getRecentVisits(limit = 20, offset = 0): Visit[] {
  const hidden = excludeHiddenClause();
  return db
    .prepare(
      `SELECT * FROM visits WHERE 1=1${hidden.sql} ORDER BY ts DESC LIMIT ? OFFSET ?`,
    )
    .all(...hidden.params, limit, offset) as Visit[];
}

export function countVisits(): number {
  const hidden = excludeHiddenClause();
  return (
    db
      .prepare(
        `SELECT COUNT(*) as c FROM visits WHERE 1=1${hidden.sql}`,
      )
      .get(...hidden.params) as { c: number }
  ).c;
}

export function getRecentEvents(limit = 20, offset = 0): Event[] {
  const hidden = excludeHiddenClause();
  return db
    .prepare(
      `SELECT * FROM events WHERE 1=1${hidden.sql} ORDER BY ts DESC LIMIT ? OFFSET ?`,
    )
    .all(...hidden.params, limit, offset) as Event[];
}

export function countEvents(): number {
  const hidden = excludeHiddenClause();
  return (
    db
      .prepare(
        `SELECT COUNT(*) as c FROM events WHERE 1=1${hidden.sql}`,
      )
      .get(...hidden.params) as { c: number }
  ).c;
}

export function getTopPaths(limit = 10) {
  const hidden = excludeHiddenClause();
  return db
    .prepare(
      `SELECT path, COUNT(*) as c
         FROM visits
        WHERE ts >= ?${hidden.sql}
        GROUP BY path
        ORDER BY c DESC
        LIMIT ?`,
    )
    .all(
      Date.now() - 30 * 24 * 60 * 60 * 1000,
      ...hidden.params,
      limit,
    ) as { path: string; c: number }[];
}

export function getTopReferers(limit = 10) {
  const hidden = excludeHiddenClause();
  return db
    .prepare(
      `SELECT referer, COUNT(*) as c
         FROM visits
        WHERE referer IS NOT NULL AND referer != ''
          AND ts >= ?${hidden.sql}
        GROUP BY referer
        ORDER BY c DESC
        LIMIT ?`,
    )
    .all(
      Date.now() - 30 * 24 * 60 * 60 * 1000,
      ...hidden.params,
      limit,
    ) as { referer: string; c: number }[];
}
