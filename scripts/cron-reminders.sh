#!/bin/sh
# Cron Dokploy — rappels J-1 des réservations.
curl -fsS "http://127.0.0.1:${PORT:-3000}/api/reservation/reminders?key=${META_POLL_SECRET}"
