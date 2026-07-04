# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────────
#  StrasClean — build multi-stage.
#
#  Objectif : NE PLUS recompiler better-sqlite3 (module natif, ~plusieurs min)
#  à chaque déploiement. La couche `deps` (npm ci + compilation) n'est refaite
#  QUE si package.json / package-lock.json changent. Un changement de code ne
#  touche que la couche `build` → déploiements ~1-3 min au lieu de ~10.
#
#  Dans Dokploy : Build Type = "Dockerfile" (au lieu de Nixpacks).
#  Garde le volume persistant monté sur /data et DATA_DIR=/data.
# ─────────────────────────────────────────────────────────────────────────

FROM node:20-slim AS base
WORKDIR /app
# Outils natifs pour compiler better-sqlite3 (node-gyp).
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
ENV NEXT_TELEMETRY_DISABLED=1

# ── deps : couche cachée tant que le lockfile ne bouge pas ──
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

# ── build : compile Next (réutilise les deps déjà compilées) ──
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── runner : image finale de prod ──
FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.js ./next.config.js
EXPOSE 3000
CMD ["npm", "start"]
