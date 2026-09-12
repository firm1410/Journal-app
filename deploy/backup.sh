#!/bin/sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 /path/to/encrypted-backup-directory" >&2
  exit 1
fi
backup_dir=$1
mkdir -p "$backup_dir"
backup_dir=$(cd "$backup_dir" && pwd)
stamp=$(date -u +%Y%m%dT%H%M%SZ)
archive="$backup_dir/journal-$stamp.tar.gz"

docker compose -f docker-compose.yml -f compose.journal.yml down
trap 'docker compose -f docker-compose.yml -f compose.journal.yml up -d' 0
docker run --rm -v supabase_db-config:/data:ro -v "$backup_dir:/backup" alpine:3.21 \
  tar czf "/backup/db-config-$stamp.tar.gz" -C /data .
tar czf "$archive" .env .supabase-version volumes compose.journal.yml journal-edge.Caddyfile
echo "Backed up $archive and $backup_dir/db-config-$stamp.tar.gz"
