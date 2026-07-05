#!/bin/sh
# Cron Dokploy — relances email des prospects (drip). Endpoint interne, clé
# lue depuis l'env du conteneur (META_POLL_SECRET) → jamais dans la commande.
curl -fsS "http://127.0.0.1:${PORT:-3000}/api/leads/drip?key=${META_POLL_SECRET}"
