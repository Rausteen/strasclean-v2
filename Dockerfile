# ─────────────────────────────────────────────────────────────────────────
#  StrasClean — Dockerfile multi-stage
#
#  3 stages :
#   1) deps    : install des deps (avec build tools pour better-sqlite3)
#   2) builder : build de l'app Next.js (output standalone)
#   3) runner  : image finale minimale (node:20-slim + standalone build)
#
#  Image finale ~150-180 MB. Pas de node_modules superflu, pas de build
#  tools, pas de sources TS. Tout ce qui n'est pas nécessaire en prod est
#  laissé dans le stage builder.
# ─────────────────────────────────────────────────────────────────────────

# ─── Stage 1 — Deps + build natif (better-sqlite3) ──────────────────────
FROM node:20-slim AS deps
WORKDIR /app

# Outils nécessaires pour compiler les modules natifs (better-sqlite3 utilise
# node-gyp avec sqlite3.c). Une fois compilé, on n'en a plus besoin → on
# laissera tout ça dans le stage deps.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
# npm ci = install propre depuis le lock (reproductible). --omit=dev exclu
# car le builder a besoin des devDependencies (TypeScript, Tailwind…).
RUN npm ci --include=dev


# ─── Stage 2 — Build Next.js ────────────────────────────────────────────
FROM node:20-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Évite la télémétrie au build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# ⚠️ Les NEXT_PUBLIC_* sont inlinées au build. Si tu veux les passer en
# build-time, c'est ici via --build-arg + ARG. Pour l'instant on les passe
# au runtime côté next.config (mais si tu changes Analytics IDs, rebuild).
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_GOOGLE_ADS_AUTO_ID
ARG NEXT_PUBLIC_GOOGLE_ADS_AUTO_WA_LABEL
ARG NEXT_PUBLIC_GOOGLE_ADS_AUTO_PHONE_LABEL
ARG NEXT_PUBLIC_GOOGLE_ADS_MAISON_ID
ARG NEXT_PUBLIC_GOOGLE_ADS_MAISON_WA_LABEL
ARG NEXT_PUBLIC_GOOGLE_ADS_MAISON_PHONE_LABEL
ARG NEXT_PUBLIC_META_PIXEL_ID
ENV NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID}
ENV NEXT_PUBLIC_GOOGLE_ADS_AUTO_ID=${NEXT_PUBLIC_GOOGLE_ADS_AUTO_ID}
ENV NEXT_PUBLIC_GOOGLE_ADS_AUTO_WA_LABEL=${NEXT_PUBLIC_GOOGLE_ADS_AUTO_WA_LABEL}
ENV NEXT_PUBLIC_GOOGLE_ADS_AUTO_PHONE_LABEL=${NEXT_PUBLIC_GOOGLE_ADS_AUTO_PHONE_LABEL}
ENV NEXT_PUBLIC_GOOGLE_ADS_MAISON_ID=${NEXT_PUBLIC_GOOGLE_ADS_MAISON_ID}
ENV NEXT_PUBLIC_GOOGLE_ADS_MAISON_WA_LABEL=${NEXT_PUBLIC_GOOGLE_ADS_MAISON_WA_LABEL}
ENV NEXT_PUBLIC_GOOGLE_ADS_MAISON_PHONE_LABEL=${NEXT_PUBLIC_GOOGLE_ADS_MAISON_PHONE_LABEL}
ENV NEXT_PUBLIC_META_PIXEL_ID=${NEXT_PUBLIC_META_PIXEL_ID}

# Build de production. Génère .next/standalone + .next/static + public/.
RUN npm run build


# ─── Stage 3 — Runtime image minimal ────────────────────────────────────
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Le port d'écoute par défaut de Next standalone (override possible)
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Utilisateur non-root (best practice container)
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# 1) Le build standalone (server.js + node_modules nécessaires)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# 2) Les assets statiques générés par Next (chunks JS, CSS, images optimisées)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# 3) Le dossier public/ (favicon, photos, SVG)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Dossier data/ pour la DB SQLite — créé vide, monté en volume au runtime
RUN mkdir -p ./data && chown -R nextjs:nodejs ./data

USER nextjs

EXPOSE 3000

# Standalone expose un server.js minimal en racine
CMD ["node", "server.js"]
