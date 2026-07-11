import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const STATE_FILE = resolve(ROOT, "scripts/.ombelia-clients-state.json");

async function loadEnvFile(path) {
  try {
    const contents = await readFile(path, "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]]) continue;
      let value = match[2];
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      } else {
        value = value.replace(/\s+#.*$/, "").trim();
      }
      process.env[match[1]] = value;
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

await loadEnvFile(resolve(ROOT, ".env.local"));

const API_URL = process.env.OMBELIA_CLIENTS_URL
  || "https://ombelia.com/api/clients?key=szpdQVybZc3QolUqhSo96MP5HU839A8R";
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = "1237179463";
const POLL_MS = Number(process.env.OMBELIA_POLL_SECONDS || 60) * 1_000;

if (!TG_TOKEN) {
  console.error("Variable Telegram manquante: TELEGRAM_BOT_TOKEN");
  process.exit(1);
}

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

function clientKey(client) {
  const stableValue = client.sellappInvoiceId || `${client.email || ""}|${client.telephone || ""}|${client.createdAt || ""}`;
  return createHash("sha256").update(stableValue).digest("hex");
}

async function readSeen() {
  try {
    const state = JSON.parse(await readFile(STATE_FILE, "utf8"));
    return new Set(Array.isArray(state.seen) ? state.seen : []);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function saveSeen(seen) {
  await writeFile(STATE_FILE, `${JSON.stringify({ seen: [...seen] }, null, 2)}\n`);
}

async function sendTelegram(client) {
  const location = [client.adresse, client.codePostal, client.ville].filter(Boolean).join(", ");
  const amount = Number.isFinite(client.amountCents)
    ? `${(client.amountCents / 100).toFixed(2)} ${client.currency || "EUR"}`
    : null;
  const lines = [
    "<b>🆕 Nouveau client Ombelia</b>",
    "",
    client.nom && `<b>Nom :</b> ${escapeHtml(client.nom)}`,
    client.email && `<b>Email :</b> ${escapeHtml(client.email)}`,
    client.telephone && `<b>Téléphone :</b> ${escapeHtml(client.telephone)}`,
    location && `<b>Adresse :</b> ${escapeHtml(location)}`,
    amount && `<b>Montant :</b> ${escapeHtml(amount)}`,
    client.status && `<b>Statut :</b> ${escapeHtml(client.status)}`,
  ].filter(Boolean);

  const response = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TG_CHAT, text: lines.join("\n"), parse_mode: "HTML" }),
  });
  if (!response.ok) throw new Error(`Telegram HTTP ${response.status}`);
}

async function poll() {
  const response = await fetch(API_URL, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Ombelia HTTP ${response.status}`);
  const payload = await response.json();
  if (!Array.isArray(payload.clients)) throw new Error("Réponse Ombelia invalide: clients absent");

  const seen = await readSeen();
  if (seen === null) {
    await saveSeen(new Set(payload.clients.map(clientKey)));
    console.log(`[${new Date().toISOString()}] Initialisé avec ${payload.clients.length} client(s), aucune notification historique.`);
    return;
  }

  const newClients = payload.clients.filter((client) => !seen.has(clientKey(client)));
  for (const client of newClients) {
    await sendTelegram(client);
    seen.add(clientKey(client));
    await saveSeen(seen);
  }
  console.log(`[${new Date().toISOString()}] ${payload.clients.length} client(s), ${newClients.length} nouveau(x).`);
}

const once = process.argv.includes("--once");

if (once) {
  try {
    await poll();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ${error.message}`);
    process.exitCode = 1;
  }
} else {
  console.log(`Surveillance Ombelia démarrée (toutes les ${POLL_MS / 1_000}s). Ctrl+C pour arrêter.`);
  await poll().catch((error) => console.error(`[${new Date().toISOString()}] ${error.message}`));
  setInterval(() => poll().catch((error) => console.error(`[${new Date().toISOString()}] ${error.message}`)), POLL_MS);
}
