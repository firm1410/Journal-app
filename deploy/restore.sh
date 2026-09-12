#!/bin/sh
set -eu

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 journal-YYYYMMDDTHHMMSSZ.tar.gz db-config-YYYYMMDDTHHMMSSZ.tar.gz" >&2
  exit 1
fi
echo "This replaces the current Supabase database and configuration. Type RESTORE to continue:"
read -r answer
[ "$answer" = RESTORE ] || exit 1

tar tzf "$1" >/dev/null
tar tzf "$2" >/dev/null
docker compose -f docker-compose.yml -f compose.journal.yml down
rm -rf volumes/db/data
tar xzf "$1" -C .
docker run --rm -v supabase_db-config:/data -v "$(cd "$(dirname "$2")" && pwd):/backup:ro" alpine:3.21 \
  sh -c 'rm -rf /data/* && tar xzf "/backup/$1" -C /data' sh "$(basename "$2")"
docker compose -f docker-compose.yml -f compose.journal.yml up -d --wait
echo "Restore complete; verify sign-in and journal entries before deleting the archive."
