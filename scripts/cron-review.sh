#!/bin/sh
# Cron Dokploy — relances avis Google (J+3 / J+6).
curl -fsS "http://127.0.0.1:${PORT:-3000}/api/reservation/review-drip?key=${META_POLL_SECRET}"
