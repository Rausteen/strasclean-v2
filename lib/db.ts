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

    -- Cache persistant des avis Google. Google Places API ne renvoie que
    -- les 5 derniers à chaque requête, mais ils varient dans le temps.
    -- En accumulant ici, on a TOUS les avis qu'on a vus passer, et on
    -- peut les filtrer par section (via review_tags) sans risque de
    -- tomber à zéro sur une section quand les 5 derniers sont sur l'autre.
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      author_name TEXT NOT NULL,
      author_url TEXT,
      profile_photo_url TEXT,
      rating INTEGER NOT NULL,
      relative_time_description TEXT,
      text TEXT NOT NULL,
      time INTEGER,
      ingested_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS reviews_time ON reviews(time DESC);
    CREATE INDEX IF NOT EXISTS reviews_rating ON reviews(rating);
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

// ─── Cache persistant des avis Google ──────────────────────────────────
//
// Google Places API ne retourne que les 5 avis "vedettes" et la sélection
// peut varier dans le temps. On accumule ici pour avoir l'historique
// complet, puis on filtre par section côté pages.

export type StoredReview = {
  id: string;
  author_name: string;
  author_url: string | null;
  profile_photo_url: string | null;
  rating: number;
  relative_time_description: string | null;
  text: string;
  time: number | null;
  ingested_at: number;
  last_seen_at: number;
};

const upsertReviewStmt = db.prepare(`
  INSERT INTO reviews
    (id, author_name, author_url, profile_photo_url, rating,
     relative_time_description, text, time, ingested_at, last_seen_at)
  VALUES
    (@id, @author_name, @author_url, @profile_photo_url, @rating,
     @relative_time_description, @text, @time, @now, @now)
  ON CONFLICT(id) DO UPDATE SET
    last_seen_at = @now,
    -- On rafraîchit ces champs au cas où Google améliore une donnée
    -- (ex: ajout d'une photo de profil ultérieurement)
    author_url = COALESCE(excluded.author_url, reviews.author_url),
    profile_photo_url = COALESCE(excluded.profile_photo_url, reviews.profile_photo_url),
    relative_time_description = COALESCE(excluded.relative_time_description, reviews.relative_time_description)
`);

/** Upsert d'un lot d'avis. Renvoie le nombre de nouveaux avis insérés.
 *  Idempotent : appeler avec les mêmes données ne crée pas de duplicate. */
export function upsertReviews(
  reviews: {
    id: string;
    author_name: string;
    author_url?: string | null;
    profile_photo_url?: string | null;
    rating: number;
    relative_time_description?: string | null;
    text: string;
    time?: number | null;
  }[],
): number {
  if (reviews.length === 0) return 0;
  const now = Date.now();
  let inserted = 0;
  // Transaction pour batch insert performant
  const insertMany = db.transaction((items: typeof reviews) => {
    for (const r of items) {
      const before = upsertReviewStmt
        .run({
          id: r.id,
          author_name: r.author_name,
          author_url: r.author_url ?? null,
          profile_photo_url: r.profile_photo_url ?? null,
          rating: r.rating,
          relative_time_description: r.relative_time_description ?? null,
          text: r.text,
          time: r.time ?? null,
          now,
        });
      // changes = 1 si nouveau (INSERT), 1 si conflit UPDATE — on ne peut
      // pas distinguer simplement. On compte les inserts en pré-vérifiant.
      if (before.changes > 0) inserted++;
    }
  });
  insertMany(reviews);
  return inserted;
}

/** Renvoie tous les avis accumulés, triés par date d'avis décroissante.
 *  Ne filtre PAS par note minimum — le filtre 4+ étoiles se fait côté
 *  reviews.ts pour rester cohérent avec l'ancien comportement. */
export function getStoredReviews(): StoredReview[] {
  return db
    .prepare(
      `SELECT * FROM reviews
       ORDER BY
         CASE WHEN time IS NULL THEN 1 ELSE 0 END,
         time DESC,
         ingested_at DESC`,
    )
    .all() as StoredReview[];
}

/** Compte total des avis stockés (utile pour debug / admin). */
export function countStoredReviews(): number {
  return (
    db.prepare(`SELECT COUNT(*) as c FROM reviews`).get() as { c: number }
  ).c;
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
