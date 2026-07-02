import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

// ─── Path : data/analytics.db ───────────────────────────────────────────
// En prod, on stocke la base sur un VOLUME PERSISTANT (sinon elle est
// recréée vide à chaque rebuild/redeploy, le conteneur étant éphémère).
// → définir DATA_DIR=/data côté hébergeur + monter un volume sur /data.
// En dev (DATA_DIR absent), on retombe sur data/ à la racine du projet.
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "analytics.db");

// ─── Connexion partagée (Singleton) ─────────────────────────────────────
type GlobalWithDb = typeof globalThis & { __strascleanDb?: Database.Database };
const g = globalThis as GlobalWithDb;

// Ouvre la base sur disque. Si le chemin n'est pas inscriptible (volume non
// monté pendant le build, mauvaises permissions du volume au runtime, FS en
// lecture seule…), on NE DOIT PAS planter tout le site : on bascule sur une
// base en mémoire. Les analytics ne persistent pas dans ce process, mais les
// pages rendent normalement au lieu de renvoyer une erreur serveur.
function openOnDiskOrMemory(): Database.Database {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    return new Database(DB_PATH);
  } catch (err) {
    console.error(
      `[db] Impossible d'ouvrir ${DB_PATH} (${(err as Error).message}). ` +
        `Bascule sur une base EN MÉMOIRE (non persistée). Vérifie DATA_DIR ` +
        `et les permissions du volume monté.`,
    );
    return new Database(":memory:");
  }
}

function openDb(): Database.Database {
  const db = openOnDiskOrMemory();
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

    -- Demandes de RDV reçues via le formulaire /reserver-maison.
    -- Stocke tout ce dont on a besoin pour rappeler / planifier le créneau.
    CREATE TABLE IF NOT EXISTS booking_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL,
      section TEXT NOT NULL DEFAULT 'maison',
      service_slug TEXT NOT NULL,
      service_label TEXT NOT NULL,
      variant TEXT,
      first_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      postal_code TEXT,
      address_note TEXT,
      preferred_day TEXT,
      preferred_slot TEXT,
      notes TEXT,
      ip TEXT,
      user_agent TEXT,
      status TEXT NOT NULL DEFAULT 'new'
    );
    CREATE INDEX IF NOT EXISTS booking_requests_ts ON booking_requests(ts DESC);
    CREATE INDEX IF NOT EXISTS booking_requests_status ON booking_requests(status);

    -- Carnet de jobs pour l'équipe de nettoyeurs (app mobile /equipe).
    -- Remplace le Google Sheet : 1 ligne = 1 intervention. Les devis du site
    -- y sont auto-insérés (source 'Site web'), et les jobs pris par téléphone
    -- sont ajoutés à la main.
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL,                       -- Date du job
      phone TEXT,                                -- Téléphone
      prestation TEXT,                           -- Prestation
      vehicle_type TEXT,                         -- Type de véhicule
      price INTEGER NOT NULL DEFAULT 0,          -- Prix (€)
      supplements INTEGER NOT NULL DEFAULT 0,    -- Suppléments (€)
      total INTEGER NOT NULL DEFAULT 0,          -- Total (€)
      collected INTEGER NOT NULL DEFAULT 0,      -- Encaissé (0/1)
      payment TEXT,                              -- Paiement (espèces / CB / virement)
      source TEXT,                               -- Source du lead
      status TEXT NOT NULL DEFAULT 'a_faire',    -- Statut
      notes TEXT,
      booking_id INTEGER,                        -- lien vers booking_requests si auto
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS jobs_ts ON jobs(ts DESC);

    -- Prospects (leads) reçus des pubs Meta Lead Ads (et autres sources).
    -- Stockés pour le suivi CRM (statut) et les relances. Dédup via
    -- meta_lead_id (INSERT OR IGNORE) — SQLite autorise plusieurs NULL, donc
    -- les leads du site (meta_lead_id NULL) ne sont pas bloqués.
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL,                       -- Date de réception
      source TEXT,                               -- 'meta_ads' | 'site' | ...
      meta_lead_id TEXT,                         -- leadgen_id Meta (dédup)
      form_id TEXT,
      ad_id TEXT,
      full_name TEXT,
      phone TEXT,
      email TEXT,
      raw TEXT,                                  -- JSON brut des field_data
      status TEXT NOT NULL DEFAULT 'nouveau',    -- nouveau|qualifie|perdu|converti
      notes TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS leads_ts ON leads(ts DESC);
    CREATE INDEX IF NOT EXISTS leads_status ON leads(status);
    CREATE UNIQUE INDEX IF NOT EXISTS leads_meta_id ON leads(meta_lead_id);

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

  // Nettoyage : les pages internes (app équipe, dashboard admin) ne polluent
  // pas les statistiques. On purge celles déjà enregistrées (idempotent —
  // /api/track ne les enregistre plus). Devient un no-op une fois nettoyé.
  db.exec(`
    DELETE FROM visits WHERE path LIKE '/equipe%' OR path LIKE '/admin%';
    DELETE FROM events WHERE path LIKE '/equipe%' OR path LIKE '/admin%';
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

/** Une entrée `hidden_ips` peut être :
 *   - une IP complète (IPv4 "162.158.1.2" ou IPv6) → match exact ;
 *   - un préfixe ("162.158", "162.158.", "162.158.*") → masque toutes les IPs
 *     qui commencent par ce préfixe (utile pour exclure une plage entière,
 *     ex. les IPs Cloudflare/bots en 162.158.x.x).
 *  Renvoie le préfixe normalisé (sans le "*" final) pour un LIKE 'prefix%',
 *  ou null si l'entrée est une IP complète. */
function ipPrefixPattern(value: string): string | null {
  let v = value.trim();
  if (!v) return null;
  if (v.endsWith("*")) v = v.slice(0, -1); // wildcard explicite "162.158.*"
  const isFullIpv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(v);
  const isIpv6 = v.includes(":");
  if (isFullIpv4 || isIpv6) return null; // IP complète → match exact
  return v; // motif partiel → préfixe
}

/** Renvoie la clause SQL excluant les IPs cachées (match exact + préfixes)
 *  + les params à passer. Vide si aucune IP cachée. */
function excludeHiddenClause(): { sql: string; params: string[] } {
  const rows = db.prepare(`SELECT ip FROM hidden_ips`).all() as { ip: string }[];
  if (rows.length === 0) return { sql: "", params: [] };

  const exact: string[] = [];
  const prefixes: string[] = [];
  for (const { ip } of rows) {
    const prefix = ipPrefixPattern(ip);
    if (prefix !== null) prefixes.push(prefix);
    else exact.push(ip);
  }

  let sql = "";
  const params: string[] = [];
  if (exact.length > 0) {
    sql += ` AND ip NOT IN (${exact.map(() => "?").join(",")})`;
    params.push(...exact);
  }
  for (const prefix of prefixes) {
    // LIKE 'prefix%' : les IPs (sous forme texte) ne contiennent ni '%' ni '_',
    // pas besoin d'échapper. Une ip NULL est exclue (comportement déjà en place
    // avec NOT IN).
    sql += ` AND ip NOT LIKE ?`;
    params.push(`${prefix}%`);
  }
  return { sql, params };
}

// ─── Queries pour le dashboard ──────────────────────────────────────────
export function getKpis() {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const cutoff24h = now - dayMs;
  const cutoff48h = now - 2 * dayMs;
  const cutoff7d = now - 7 * dayMs;
  const cutoff14d = now - 14 * dayMs;
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
    // Trafic référé par les assistants IA (ChatGPT, Perplexity, Claude…) —
    // indicateur de visibilité GEO.
    visitsAi7d: row(
      `SELECT COUNT(*) as c FROM visits WHERE ts >= ? AND source = 'ai'${hidden.sql}`,
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

    // Demandes de RDV (leads) — non filtrées par IP cachée (un lead reste
    // un lead même s'il vient d'une IP qu'on exclut des stats de trafic).
    leads24h: row(`SELECT COUNT(*) as c FROM booking_requests WHERE ts >= ?`, cutoff24h),
    leads7d: row(`SELECT COUNT(*) as c FROM booking_requests WHERE ts >= ?`, cutoff7d),
    leads30d: row(`SELECT COUNT(*) as c FROM booking_requests WHERE ts >= ?`, cutoff30d),
    leadsTotal: row(`SELECT COUNT(*) as c FROM booking_requests`),

    // ── Comparaison période précédente (pour les variations ↑/↓) ──────────
    // Fenêtre N-1 : même durée, juste avant la fenêtre courante.
    visitsPrev24h: row(
      `SELECT COUNT(*) as c FROM visits WHERE ts >= ? AND ts < ?${hidden.sql}`,
      cutoff48h,
      cutoff24h,
      ...hidden.params,
    ),
    visitsPrev7d: row(
      `SELECT COUNT(*) as c FROM visits WHERE ts >= ? AND ts < ?${hidden.sql}`,
      cutoff14d,
      cutoff7d,
      ...hidden.params,
    ),
    whatsappPrev7d: row(
      `SELECT COUNT(*) as c FROM events WHERE ts >= ? AND ts < ? AND type = 'whatsapp_click'${hidden.sql}`,
      cutoff14d,
      cutoff7d,
      ...hidden.params,
    ),
    phonePrev7d: row(
      `SELECT COUNT(*) as c FROM events WHERE ts >= ? AND ts < ? AND type = 'phone_click'${hidden.sql}`,
      cutoff14d,
      cutoff7d,
      ...hidden.params,
    ),
    leadsPrev7d: row(
      `SELECT COUNT(*) as c FROM booking_requests WHERE ts >= ? AND ts < ?`,
      cutoff14d,
      cutoff7d,
    ),
  };
}

// ─── Série quotidienne pour les graphiques de tendance ──────────────────
// Renvoie un point par jour (fuseau Europe/Paris) sur les `days` derniers
// jours, du plus ancien au plus récent. On agrège en JS pour gérer
// proprement le fuseau/DST (SQLite n'a pas de support tz natif fiable).
const PARIS_DAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export type DailyPoint = {
  /** Clé ISO du jour, ex "2026-06-19". */
  day: string;
  /** Libellé court fr pour l'axe, ex "19/06". */
  label: string;
  visits: number;
  whatsapp: number;
  phone: number;
  leads: number;
};

export function getDailySeries(days = 30): DailyPoint[] {
  const dayMs = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const since = now - days * dayMs;
  const hidden = excludeHiddenClause();

  const visitRows = db
    .prepare(`SELECT ts FROM visits WHERE ts >= ?${hidden.sql}`)
    .all(since, ...hidden.params) as { ts: number }[];
  const eventRows = db
    .prepare(`SELECT ts, type FROM events WHERE ts >= ?${hidden.sql}`)
    .all(since, ...hidden.params) as { ts: number; type: string }[];
  const bookingRows = db
    .prepare(`SELECT ts FROM booking_requests WHERE ts >= ?`)
    .all(since) as { ts: number }[];

  // Pré-remplit chaque jour de la fenêtre (même ceux sans donnée → 0).
  const buckets = new Map<string, DailyPoint>();
  const order: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = PARIS_DAY.format(now - i * dayMs);
    if (!buckets.has(key)) {
      buckets.set(key, {
        day: key,
        label: `${key.slice(8, 10)}/${key.slice(5, 7)}`,
        visits: 0,
        whatsapp: 0,
        phone: 0,
        leads: 0,
      });
      order.push(key);
    }
  }

  for (const v of visitRows) {
    const b = buckets.get(PARIS_DAY.format(v.ts));
    if (b) b.visits++;
  }
  for (const e of eventRows) {
    const b = buckets.get(PARIS_DAY.format(e.ts));
    if (!b) continue;
    if (e.type === "whatsapp_click") b.whatsapp++;
    else if (e.type === "phone_click") b.phone++;
  }
  for (const r of bookingRows) {
    const b = buckets.get(PARIS_DAY.format(r.ts));
    if (b) b.leads++;
  }

  return order.map((k) => buckets.get(k)!);
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

// ─── Demandes de RDV (formulaire /reserver-maison) ──────────────────────
export type BookingRequest = {
  id: number;
  ts: number;
  section: string;
  service_slug: string;
  service_label: string;
  variant: string | null;
  first_name: string;
  email: string;
  phone: string;
  postal_code: string | null;
  address_note: string | null;
  preferred_day: string | null;
  preferred_slot: string | null;
  notes: string | null;
  ip: string | null;
  user_agent: string | null;
  status: string;
};

const insertBookingStmt = db.prepare(`
  INSERT INTO booking_requests
    (ts, section, service_slug, service_label, variant,
     first_name, email, phone, postal_code, address_note,
     preferred_day, preferred_slot, notes, ip, user_agent, status)
  VALUES
    (@ts, @section, @service_slug, @service_label, @variant,
     @first_name, @email, @phone, @postal_code, @address_note,
     @preferred_day, @preferred_slot, @notes, @ip, @user_agent, 'new')
`);

export function insertBookingRequest(
  b: Omit<BookingRequest, "id" | "status">,
): number {
  const r = insertBookingStmt.run(b);
  return r.lastInsertRowid as number;
}

export function getRecentBookingRequests(limit = 50): BookingRequest[] {
  return db
    .prepare(
      `SELECT * FROM booking_requests ORDER BY ts DESC LIMIT ?`,
    )
    .all(limit) as BookingRequest[];
}

export function countBookingRequests(): number {
  return (
    db
      .prepare(`SELECT COUNT(*) as c FROM booking_requests`)
      .get() as { c: number }
  ).c;
}

// ─── Jobs (carnet de l'équipe — app /equipe) ─────────────────────────────
export type JobStatus = "a_faire" | "en_route" | "termine";

export type Job = {
  id: number;
  ts: number;
  phone: string | null;
  prestation: string | null;
  vehicle_type: string | null;
  price: number;
  supplements: number;
  total: number;
  collected: number; // 0/1
  payment: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  booking_id: number | null;
  created_at: number;
};

/** Champs modifiables par l'app (le reste est géré en interne). */
export type JobInput = {
  ts: number;
  phone: string | null;
  prestation: string | null;
  vehicle_type: string | null;
  price: number;
  supplements: number;
  total: number;
  collected: number;
  payment: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  booking_id?: number | null;
};

const insertJobStmt = db.prepare(`
  INSERT INTO jobs
    (ts, phone, prestation, vehicle_type, price, supplements, total,
     collected, payment, source, status, notes, booking_id, created_at)
  VALUES
    (@ts, @phone, @prestation, @vehicle_type, @price, @supplements, @total,
     @collected, @payment, @source, @status, @notes, @booking_id, @created_at)
`);

export function insertJob(j: JobInput): number {
  const r = insertJobStmt.run({
    booking_id: null,
    ...j,
    created_at: Date.now(),
  });
  return r.lastInsertRowid as number;
}

export function listJobs(limit = 300): Job[] {
  return db
    .prepare(`SELECT * FROM jobs ORDER BY ts DESC, id DESC LIMIT ?`)
    .all(limit) as Job[];
}

export function getJob(id: number): Job | null {
  return (db.prepare(`SELECT * FROM jobs WHERE id = ?`).get(id) as Job) ?? null;
}

/** Met à jour les champs fournis d'un job (whitelist stricte). */
export function updateJob(id: number, fields: Partial<JobInput>): void {
  const allowed: (keyof JobInput)[] = [
    "ts",
    "phone",
    "prestation",
    "vehicle_type",
    "price",
    "supplements",
    "total",
    "collected",
    "payment",
    "source",
    "status",
    "notes",
  ];
  const sets: string[] = [];
  const params: Record<string, unknown> = { id };
  for (const key of allowed) {
    if (key in fields) {
      sets.push(`${key} = @${key}`);
      params[key] = (fields as Record<string, unknown>)[key];
    }
  }
  if (sets.length === 0) return;
  db.prepare(`UPDATE jobs SET ${sets.join(", ")} WHERE id = @id`).run(params);
}

export function deleteJob(id: number): void {
  db.prepare(`DELETE FROM jobs WHERE id = ?`).run(id);
}

// ─── Prospects (leads) ────────────────────────────────────────────────────
export type LeadStatus = "nouveau" | "a_relancer" | "converti" | "perdu";

export type Lead = {
  id: number;
  ts: number;
  source: string | null;
  meta_lead_id: string | null;
  form_id: string | null;
  ad_id: string | null;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  raw: string | null;
  status: string;
  notes: string | null;
  created_at: number;
};

export type LeadInput = {
  ts?: number;
  source?: string | null;
  meta_lead_id?: string | null;
  form_id?: string | null;
  ad_id?: string | null;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  raw?: string | null;
  status?: string;
  notes?: string | null;
};

const insertLeadStmt = db.prepare(`
  INSERT OR IGNORE INTO leads
    (ts, source, meta_lead_id, form_id, ad_id, full_name, phone, email,
     raw, status, notes, created_at)
  VALUES
    (@ts, @source, @meta_lead_id, @form_id, @ad_id, @full_name, @phone, @email,
     @raw, @status, @notes, @created_at)
`);

/** Enregistre un lead. Dédup sur meta_lead_id (INSERT OR IGNORE) : un webhook
 *  rejoué pour le même lead ne crée pas de doublon. Renvoie l'id inséré, ou 0
 *  si ignoré (doublon). Best-effort — ne doit jamais casser la réception. */
export function insertLead(l: LeadInput): number {
  const now = Date.now();
  const r = insertLeadStmt.run({
    ts: l.ts ?? now,
    source: l.source ?? null,
    meta_lead_id: l.meta_lead_id ?? null,
    form_id: l.form_id ?? null,
    ad_id: l.ad_id ?? null,
    full_name: l.full_name ?? null,
    phone: l.phone ?? null,
    email: l.email ?? null,
    raw: l.raw ?? null,
    status: l.status ?? "nouveau",
    notes: l.notes ?? null,
    created_at: now,
  });
  return r.changes > 0 ? (r.lastInsertRowid as number) : 0;
}

export function listLeads(limit = 300): Lead[] {
  return db
    .prepare(`SELECT * FROM leads ORDER BY ts DESC, id DESC LIMIT ?`)
    .all(limit) as Lead[];
}

export function getLead(id: number): Lead | null {
  return (
    (db.prepare(`SELECT * FROM leads WHERE id = ?`).get(id) as Lead) ?? null
  );
}

/** Met à jour le statut et/ou les notes d'un lead (whitelist stricte). */
export function updateLead(
  id: number,
  fields: Partial<Pick<LeadInput, "status" | "notes">>,
): void {
  const sets: string[] = [];
  const params: Record<string, unknown> = { id };
  if ("status" in fields) {
    sets.push("status = @status");
    params.status = fields.status;
  }
  if ("notes" in fields) {
    sets.push("notes = @notes");
    params.notes = fields.notes;
  }
  if (sets.length === 0) return;
  db.prepare(`UPDATE leads SET ${sets.join(", ")} WHERE id = @id`).run(params);
}
