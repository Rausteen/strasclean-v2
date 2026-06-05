# Déploiement Docker — StrasClean

Setup container-ready pour ton VPS. Une seule commande pour build + run,
volumes persistants pour la DB SQLite et les photos uploadées.

---

## TL;DR — premier déploiement

```bash
# 1. Cloner sur le VPS
git clone https://github.com/Rausteen/strasclean-v2.git
cd strasclean-v2
git checkout claude/strasclean-website-vu9YU  # ou main

# 2. Créer .env avec tes IDs Analytics + secret session admin
cp .env.example .env
nano .env  # → remplir les valeurs (cf. §3 plus bas)

# 3. Build + start
docker compose up -d --build

# 4. Vérifier
docker compose logs -f strasclean
# (Ctrl-C pour quitter les logs, le container continue de tourner)
```

→ Site dispo sur `http://localhost:3000` (ou `IP_DU_VPS:3000`).

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Container "strasclean" (node:20-slim)          │
│  ├─ /app/server.js          (Next standalone)   │
│  ├─ /app/.next/static       (chunks JS / CSS)   │
│  ├─ /app/public             (assets statiques)  │
│  │   ├─ avant-apres/    ◄── volume hôte         │
│  │   └─ maison/         ◄── volume hôte         │
│  └─ /app/data           ◄── volume hôte (DB)    │
└─────────────────────────────────────────────────┘
       │ port 3000
       ▼
   Hôte VPS  →  Reverse proxy (nginx/caddy)  →  HTTPS
```

---

## Fichiers livrés

| Fichier | Rôle |
|---|---|
| `Dockerfile` | Build multi-stage (deps → builder → runner). Image finale ~180 MB. |
| `.dockerignore` | Exclut node_modules, .env, .git, etc. du contexte de build. |
| `docker-compose.yml` | Orchestration : ports, env, volumes, healthcheck, restart policy. |
| `next.config.js` | `output: "standalone"` activé. |

---

## 1. Build de l'image

```bash
docker compose build
```

Premier build = 3-5 min (download node:20-slim, install deps avec
compilation native de better-sqlite3, build Next). Les rebuilds
ultérieurs sont rapides grâce au cache de couches Docker (~30 s si seul
le code source change).

---

## 2. Lancer le container

```bash
docker compose up -d
```

Le container tourne en arrière-plan. Pour suivre les logs :

```bash
docker compose logs -f strasclean
```

Pour le stopper :

```bash
docker compose down
# (Les volumes ./data et ./public/* sont préservés.)
```

---

## 3. Variables d'environnement

Crée un fichier `.env` à la racine (gitignored). Exemple minimal :

```env
# ── Secret de session admin (OBLIGATOIRE en prod) ───────────────────
# Génère avec : openssl rand -base64 48
SESSION_SECRET=ton_secret_aleatoire_long_minimum_32_caracteres

# ── Google Places (pour récupérer les avis Google) ──────────────────
GOOGLE_PLACES_API_KEY=AIzaSyXXXXXXXXXXXXXXX
GOOGLE_PLACE_ID=ChIJxxxxxxxxxxxxxxxxxx

# ── Analytics + Ads (NEXT_PUBLIC_* sont inlinés au build) ───────────
NEXT_PUBLIC_GA_ID=G-XXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_AUTO_ID=AW-1111111111
NEXT_PUBLIC_GOOGLE_ADS_AUTO_WA_LABEL=AW-1111111111/aaaa
NEXT_PUBLIC_GOOGLE_ADS_AUTO_PHONE_LABEL=AW-1111111111/bbbb
NEXT_PUBLIC_GOOGLE_ADS_MAISON_ID=AW-2222222222
NEXT_PUBLIC_GOOGLE_ADS_MAISON_WA_LABEL=AW-2222222222/cccc
NEXT_PUBLIC_GOOGLE_ADS_MAISON_PHONE_LABEL=AW-2222222222/dddd

# ── (Optionnel) Meta Pixel ──────────────────────────────────────────
NEXT_PUBLIC_META_PIXEL_ID=
```

⚠️ **Quand tu changes une variable `NEXT_PUBLIC_*`** : rebuild obligatoire.
Le code Next.js inline ces vars dans le bundle JS au build (pas au runtime).

```bash
docker compose up -d --build
```

---

## 4. Persistance des données

3 volumes bind-mount sont déclarés dans `docker-compose.yml` :

| Volume | Contenu | Pourquoi |
|---|---|---|
| `./data` | SQLite DB (analytics, demandes RDV, avis cachés, tags) | Survie aux rebuilds |
| `./public/avant-apres` | Photos Auto | Tu uploades via SCP sans rebuild |
| `./public/maison/before-after` + `/hero` | Photos Maison | Idem |

→ **Pour uploader des photos sur le VPS** :

```bash
# Depuis ton poste local :
scp ma-photo.webp user@vps:~/strasclean-v2/public/avant-apres/siegeavant.webp
# Pas besoin de rebuild — le container voit le fichier immédiatement.
```

---

## 5. Reverse proxy HTTPS (production)

Tu ne veux pas exposer le port 3000 directement. Mets nginx ou Caddy
devant.

### Option A — Caddy (le + simple, HTTPS auto)

```caddyfile
# /etc/caddy/Caddyfile
strasclean.fr {
    reverse_proxy localhost:3000

    encode gzip zstd

    # Cache long pour les assets Next
    @static path /_next/static/*
    header @static Cache-Control "public, max-age=31536000, immutable"
}

www.strasclean.fr {
    redir https://strasclean.fr{uri} permanent
}
```

Puis :

```bash
sudo systemctl restart caddy
```

### Option B — nginx avec certbot

```nginx
# /etc/nginx/sites-available/strasclean
server {
    listen 80;
    server_name strasclean.fr www.strasclean.fr;
    return 301 https://strasclean.fr$request_uri;
}

server {
    listen 443 ssl http2;
    server_name strasclean.fr;

    # ssl_certificate + ssl_certificate_key — généré par certbot

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Puis :

```bash
sudo certbot --nginx -d strasclean.fr -d www.strasclean.fr
sudo systemctl reload nginx
```

### Sécuriser le port (avec reverse proxy)

Dans `docker-compose.yml`, change :

```yaml
ports:
  - "127.0.0.1:3000:3000"   # ← bind seulement sur loopback, pas 0.0.0.0
```

→ Port 3000 inaccessible depuis l'extérieur, seulement via nginx/caddy.

---

## 6. Workflow déploiement (après le 1er setup)

```bash
# Sur le VPS, à chaque déploiement :
cd ~/strasclean-v2
git pull origin claude/strasclean-website-vu9YU

# Si tu as touché package.json OU NEXT_PUBLIC_* OU le code → rebuild
docker compose up -d --build

# Si tu as juste uploadé des photos → rien à faire (volume monté)

# Health check
docker compose ps
curl -I http://localhost:3000  # → HTTP/1.1 200 OK
```

---

## 7. Migration depuis pm2

Si tu tournes déjà avec pm2 :

```bash
# Stop pm2
pm2 stop strasclean
pm2 delete strasclean
pm2 save

# Copier ta DB existante vers le volume
cp -r ~/strasclean-v2/data ~/strasclean-v2/data.backup-pm2
# (le mount Docker utilisera ./data, c'est déjà au bon endroit)

# Démarrer Docker
docker compose up -d --build
```

---

## 8. Commandes utiles

```bash
# Logs en direct
docker compose logs -f strasclean

# Shell dans le container (debug)
docker compose exec strasclean sh

# Voir l'usage mémoire / CPU
docker stats strasclean

# Restart sans rebuild (ex: après changement .env)
docker compose restart

# Reset complet (⚠️ supprime aussi les volumes anonymes)
docker compose down -v

# Inspect du healthcheck
docker inspect strasclean | grep -A 5 Health
```

---

## 9. Troubleshooting

### "Cannot find module 'better-sqlite3'"
→ Le build de better-sqlite3 a échoué dans le stage `deps`. Rebuild :

```bash
docker compose build --no-cache strasclean
```

### Port 3000 déjà utilisé
```bash
# Trouve le process qui squatte le port
sudo lsof -i :3000
# Change le port dans docker-compose.yml :
# ports: - "3001:3000"
```

### Photos pas mises à jour après upload
Vérifie le volume :
```bash
docker compose exec strasclean ls -la /app/public/avant-apres/
# Si vide, le bind mount n'est pas pris en compte → docker compose down + up
```

### DB corrompue après crash
La DB SQLite est en WAL mode. En cas de crash brutal :
```bash
docker compose exec strasclean sqlite3 /app/data/analytics.db "PRAGMA integrity_check;"
```

---

## 10. Roadmap futur (optionnel)

- [ ] **CI/CD** : auto-deploy sur push via GitHub Actions + webhook VPS
- [ ] **Backup auto DB** : cron qui copie `./data/analytics.db` vers S3 quotidien
- [ ] **Monitoring** : Uptime Kuma en sidecar pour surveiller le healthcheck
- [ ] **Image registry privée** : push vers ghcr.io et pull au lieu de build sur le VPS
