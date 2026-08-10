# Deploy: Yandex Cloud (API)

Agent-ready pieces live in this repo (`Dockerfile`, `deploy/`, `.github/workflows/deploy-api.yml`).
Cloud resources and DNS are created in the [Yandex Cloud console](https://console.yandex.cloud) (no local `yc` CLI).

## Your checklist (console / DNS / Reg.ru)

### Phase 0 — access
- [ ] Billing + folder OK
- [ ] SSH key on laptop (`ssh-keygen -t ed25519`)
- [ ] Service account `studio-deploy` with `container-registry.images.pusher` + `puller`
- [ ] Download SA JSON key → GitHub Secret `YC_SA_JSON` (never commit)
- [ ] Use **existing** default VPC / subnet (same zone for API VM + StoreDoc)

### Phase 1 — StoreDoc
- [ ] Check DB size on Reg.ru: `mongosh studio --eval 'db.stats()'`
- [ ] Create `studio-stage-mongo` (7.0, small class, **no public access**, DB `studio`)
- [ ] Create `studio-prod-mongo` (`s2.micro`, backups on, **no public access**)
- [ ] Save connection URIs (port **27018**) for GitHub Secrets `DBURL`

### Phase 2 — VMs + Registry
- [ ] Create Container Registry `studio` → note `YCR_ID`
- [ ] Create VMs (Ubuntu 24.04, existing network):
  - `studio-stage-api` — 2 vCPU / 50% / 2 GB / 20 GB SSD + public IP
  - `studio-stage-fe` — 2 vCPU / 50% / 2–4 GB / 30 GB SSD + public IP
  - `studio-prod-api` — 2 vCPU / **100%** / **4 GB** / 30 GB SSD + public IP
  - `studio-prod-fe` — 2 vCPU / **100%** / **4 GB** / 40 GB SSD + public IP
- [ ] On each VM: install Docker Engine + Compose plugin; `sudo usermod -aG docker $USER`
- [ ] `sudo mkdir -p /opt/studio-api` (API) or `/opt/studio-fe` (FE); `chown` to deploy user
- [ ] On API VMs: install `mongodb-database-tools` + `mongosh`
- [ ] From API VM: `mongosh "<StoreDoc URI>" --eval 'db.runCommand({ ping: 1 })'`

### Phase 2b — GitHub
Create Environments **`stage`** and **`prod`**.

**Secrets** (только ключи доступа; Environment → Secrets):

| Secret | Purpose |
|--------|---------|
| `YC_SA_JSON` | SA key JSON |
| `SSH_KEY` | private deploy SSH key |

**Variables** (Environment → Variables) — удобнее править, берутся workflow’ом в `.env` на VM. Список как в `.env.deploy.template` / `.env.example`, плюс:

| Variable | Example stage / prod |
|----------|----------------------|
| `YCR_ID` | `crpdhqf0ql8be99eu4km` |
| `SSH_HOST` | stage-api / prod-api public IP |
| `SSH_USER` | `strn` |
| `DBURL` | StoreDoc URI (`!` → `%21`) |
| `FRONTEND_URL` | `https://studio-stage.pnhd.ru` / `https://studio.pnhd.ru` |
| `PUBLIC_API_URL` | `https://api-stage.pnhd.ru` / `https://api.pnhd.ru` |
| `COOKIE_DOMAIN` | `.pnhd.ru` |
| `COOKIE_CROSS_SITE` | `false` |
| `JWT_SECRET`, `MAIL_*`, `PAYMENT_AUTH`, `CDEK_*`, `YANDEX_S3_*`, … | из текущего `.env` |

Variables видны тем, у кого есть доступ к репо/environment — не публикуйте репо.

Deploy triggers:
- push to `stage` → environment **stage**
- push to `main` → environment **prod**
- Actions → **Deploy API** → `workflow_dispatch` → выбрать `stage` / `prod`

### Phase 1b — stage data
```bash
# on Reg.ru
mongodump --uri="..." --db=studio --gzip --archive=/tmp/studio-stage.archive.gz
scp /tmp/studio-stage.archive.gz ubuntu@STAGE_API:/tmp/
# on stage-api
mongorestore --uri="<stage StoreDoc URI>" --gzip --archive=/tmp/studio-stage.archive.gz --drop
```

### Phase 3 — DNS (stage first)
| Name | Type | Value |
|------|------|-------|
| `api-stage` | A | stage-api IP |
| `studio-stage` | A | stage-fe IP (`103.76.55.184`) |

Lower TTL to 300 before cutover. Do **not** move `api` / `studio` until phase 5.

### Phase 5 — cutover
1. Maintenance on Reg.ru API (no writes)
2. Final `mongodump` → `mongorestore` to **prod** StoreDoc
3. DNS: `api` → prod-api IP; `studio` → prod-fe IP; redirect `pnhdstudioapi.ru` → `api.pnhd.ru`
4. Smoke test + YooKassa webhooks
5. Keep Reg.ru read-only / off

## Database migrations

Schema/data changes go only through versioned files in `src/migrations/` (`001_*.ts`, `002_*.ts`, …). Applied ids are stored in Mongo collection `schema_migrations`.

Deploy API runs migrations automatically on the API VM after `compose up` (StoreDoc is not reachable from GitHub Actions):

```bash
docker compose exec -T api node dist/migrations/cli.js up
```

Locally (with `DBURL` in `.env`):

```bash
npm run migrate:status
npm run migrate:up
```

Forward-only (`up`). Do not put one-off data changes in `src/scripts/` for new work — add a migration instead.

## Local image smoke test
```bash
docker build -t studio-api:local .
docker run --rm -p 8000:8000 --env-file .env studio-api:local
curl -s http://127.0.0.1:8000/health
```
