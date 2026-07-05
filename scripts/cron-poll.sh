#!/bin/sh
# Cron Dokploy — récupération des leads Meta Ads.
curl -fsS "http://127.0.0.1:${PORT:-3000}/api/meta-leads/poll?key=${META_POLL_SECRET}"
