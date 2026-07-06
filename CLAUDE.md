# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Headless CMS API for the public website of the Observatorio de las Violencias de Género "Ahora Que Sí Nos Ven". It is a customized **Strapi 3.0.1** app backed by **PostgreSQL** (via the `bookshelf`/`knex` connector). Content is authored in the Spanish-language admin console; the site consumes the generated REST API.

## Development

Everything runs through Docker Compose — no host-side Node needed.

```bash
docker-compose up          # builds first time; strapi + postgres
```

- Admin console: http://localhost:1337/admin
- REST API: http://localhost:1337
- Postgres is exposed on `5432`; DB data persists in `./.db`, uploaded files in `./.uploads` (both gitignored).
- `docker-compose.yml` hardcodes dev DB credentials and sets `NODE_ENV=development`.

Source dirs (`api/`, `config/`, `extensions/`, `package.json`) are bind-mounted into the container, so edits are picked up by `strapi develop`'s hot reload without rebuilding.

There is **no test suite and no CI lint step**. ESLint config exists (`.eslintrc`, extends `eslint:recommended`, single quotes, 2-space indent, semicolons, `strapi` global) but there is no `lint` npm script — run `npx eslint api config extensions` inside the container if needed.

## Architecture

### Content types live under `api/<type>/`

Each content type follows Strapi 3's convention:
- `models/<Name>.settings.json` — **the schema**. Defines `kind` (`collectionType` or `singleType`), attributes, relations, and which fields are `required`/`unique`. This is what you edit (or edit via the admin Content-Type Builder) to change the data model.
- `models/<Name>.js` — lifecycle callbacks (all currently empty stubs).
- `controllers/<name>.js`, `services/<name>.js` — empty (`module.exports = {}`) → Strapi supplies default CRUD.
- `config/routes.json` — standard REST routes (`find`, `count`, `findOne`, `create`, `update`, `delete`).

Content types: `article`, `activity`, `campaign`, `report`, `media-presence`, `team-member`, `home-image` (collections), their `*-category` taxonomies, and `about-us` (singleType). Note filename casing is inconsistent (`Activity.js`/`Report.js`/`Campaign.js` are PascalCase; the rest kebab-case) — match the existing file when editing a given type; don't rename.

Images/files are modeled as relations to the upload plugin's `file` model (`plugin: "upload"`, `via: "related"`), which Strapi stores polymorphically in the `upload_file` / `upload_file_morph` tables.

### `featured-content` is the one real custom endpoint

`api/featured-content/` has **no model/table** — it's a virtual read-only endpoint (`GET /featured-content`) whose controller (`controllers/featured-content.js`) drops to raw `knex` (`strapi.connections.default`). It `UNION`s the `activities`, `media_presences`, `reports`, `campaigns`, and `articles` tables into a unified feed, each mapped to a common shape (`title`, `summary`, `slug`, `kind`, `mainDate`) using each type's own date column, left-joins `upload_file_morph`/`upload_file` to pull the `mainImage`, orders by date desc, and honors `?_limit` (default 10).

**Consequence:** when adding a new content type that should appear in the homepage feed, register it in the `featuredContentTypes` array (table name, `kind`, and its main-date column) — the join assumes the image field is named `mainImage`.

### Config & extensions

- `config/database.js`, `config/server.js` — read all connection/host settings from env vars. `server.js` disables Strapi's cron (`cron.enabled: false`); `config/functions/cron.js` and `bootstrap.js` are empty stubs.
- `extensions/upload/config/settings.js` — **local disk in dev, Google Cloud Storage in production** (switches on `NODE_ENV`). GCS is configured entirely from `GCS_*` env vars.
- `extensions/users-permissions/config/jwt.js` — JWT secret from `JWT_SECRET` (has an insecure hardcoded fallback for dev).

## Deployment

`cloudbuild.yaml` (Google Cloud Build): builds the production `Dockerfile` (Node 12, `NODE_ENV=production`, runs `npm run build` to compile the admin), pushes to GCR, and deploys to **Cloud Run** (`us-central1`, unauthenticated). All runtime config — Cloud SQL socket host, DB creds, GCS settings — is passed via `--set-env-vars` substitutions. Production Postgres is reached over a Cloud SQL unix socket (`/cloudsql/...`).
