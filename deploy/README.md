# Journal backend on a Mac

This deployment runs the official Supabase self-hosted Docker stack, the Go
transcription API, Caddy as an internal route filter, and Cloudflare Tunnel.
The pinned Supabase release is self-hosted/v0.8.1. Native Expo builds are
installed on phones; no web app is served here.

## Prerequisites

- Docker Desktop with Compose 2.24.4 or newer, Git, and an Apple Silicon Mac.
- A domain in Cloudflare and a remotely managed Cloudflare Tunnel.
- The Journal-app and Journal-api directories next to each other.
- An OpenAI API key. Keep it only in the server-side secret file.

## Install

From the parent directory containing the two Journal directories:

~~~sh
git clone --depth 1 --branch self-hosted/v0.8.1 https://github.com/supabase/supabase supabase-source
mkdir journal-supabase
cp -R supabase-source/docker/. journal-supabase/
printf 'ref=self-hosted/v0.8.1\n' > journal-supabase/.supabase-version
cp journal-supabase/.env.example journal-supabase/.env
cp Journal-app/deploy/compose.journal.yml journal-supabase/
cp Journal-app/deploy/journal-edge.Caddyfile journal-supabase/
mkdir -p journal-supabase/secrets
cd journal-supabase
sh utils/generate-keys.sh --update-env > /dev/null
sh utils/add-new-auth-keys.sh --update-env > /dev/null
rm -f .env.old
chmod 600 .env
~~~

Edit journal-supabase/.env before starting:

~~~dotenv
SUPABASE_PUBLIC_URL=https://db.YOUR_DOMAIN
API_EXTERNAL_URL=https://db.YOUR_DOMAIN/auth/v1
SITE_URL=https://db.YOUR_DOMAIN
DISABLE_SIGNUP=true
ENABLE_EMAIL_SIGNUP=true
~~~

Review all generated secrets in .env; never use the example values. Put the
OpenAI key in journal-supabase/secrets/openai-api-key and your remotely
managed Tunnel token in journal-supabase/secrets/cloudflare-tunnel-token.
Keep both files out of version control. Then start:

~~~sh
docker compose -f docker-compose.yml -f compose.journal.yml up -d --wait
docker compose -f docker-compose.yml -f compose.journal.yml ps
~~~

The Supabase dashboard is available only on this Mac at
http://127.0.0.1:8000. The database has no published port. The journal
route filter exposes only /auth/v1/* and /rest/v1/* on its Supabase
hostname, and only /transcribe on its Go API hostname.

## Apply the database migration and create the account

Run the migration once from journal-supabase:

~~~sh
docker compose -f docker-compose.yml -f compose.journal.yml exec -T db \
  psql -v ON_ERROR_STOP=1 -U postgres -d postgres \
  < ../Journal-app/supabase/migrations/20260912000000_journal_entries.sql
~~~

Create the single user locally with the Supabase service-role key. Supply the
password through your shell environment; do not put it in a command argument
or commit it. From Journal-app:

~~~sh
SERVICE_ROLE_KEY=... JOURNAL_USER_EMAIL=... JOURNAL_USER_PASSWORD=... \
  node deploy/create-user.mjs
~~~

The key is in journal-supabase/.env. The script talks to the local gateway
and confirms this account without sending email. Public signup remains
disabled. Password recovery through email is not configured; an admin must
reset this personal account locally.

Copy Journal-app/.env.example to .env.local and replace the three values
with your domain and the generated publishable key. Never put the
service-role key or OpenAI key into EXPO_PUBLIC_* variables. Restart Expo
after changing .env.local; rebuild native releases after URL changes.

To verify journal CRUD, two independent sessions, and owner-only policies,
run from Journal-app with the local gateway reachable:

~~~sh
node --env-file=../journal-supabase/.env deploy/verify-db.mjs
~~~

The script creates and removes two temporary users and a test entry.

## Cloudflare Tunnel

In Cloudflare Zero Trust, create a remotely managed Tunnel for this Mac and
add two published application routes:

| Public hostname | Origin service URL |
| --- | --- |
| db.YOUR_DOMAIN | http://journal-edge:8080 |
| api.YOUR_DOMAIN | http://journal-edge:8081 |

No inbound router ports are required. The tunnel container and services
share a private Compose network. Do not add a route to api-gw, studio,
db, or supavisor directly. Check that the public dashboard returns 404
and that an unauthenticated POST /transcribe returns 401.

## Backup and restore

The scripts in Journal-app/deploy are cold backups: they briefly stop the
stack to copy Postgres data, configuration, and the pgsodium key volume
together. Copy them into journal-supabase before use. Store backup archives
on an encrypted drive outside this Mac; they include private entries,
Auth data, and database secrets. Cloudflare and OpenAI secret files are
intentionally excluded and must be recreated separately.

~~~sh
cp ../Journal-app/deploy/backup.sh ../Journal-app/deploy/restore.sh .
sh backup.sh /Volumes/EncryptedJournalBackups
sh restore.sh /Volumes/EncryptedJournalBackups/journal-TIMESTAMP.tar.gz \
  /Volumes/EncryptedJournalBackups/db-config-TIMESTAMP.tar.gz
~~~

Run a restore on a spare copy of the deployment and verify sign-in and entry
listing before relying on backups. The scripts assume the same Supabase
release and Compose project name (supabase) on restore. Restart Docker
Desktop and keep the Mac awake for continuous access.
