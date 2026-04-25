# MIGRATION-NOTES.md

# Migration Notes — backend/ → laravel-app/

This document tracks what has been ported from the original `backend/` Laravel application
to the new `laravel-app/` (the future production home of the API + admin panel + AI agent).

---

## ✅ What is NEW in `laravel-app/` (this PR)

| Feature | Location |
|---------|----------|
| AI agent — Ollama integration | `app/Services/Ollama/` |
| Facebook Graph API integration | `app/Services/Facebook/` |
| Facebook Jobs (9 background jobs) | `app/Jobs/Facebook/` |
| Facebook Webhook controller + middleware | `app/Http/Controllers/Webhooks/` |
| Admin dashboard (minimal) | `app/Http/Controllers/Admin/` |
| Data models: Car, CarPhoto, CarTranslation, FacebookPost, FacebookMessage, FacebookGroup, Lead | `app/Models/` |
| All database migrations | `database/migrations/` |
| AI prompt templates (Blade) | `resources/views/prompts/` |
| Config files: `ollama.php`, `facebook.php` | `config/` |
| Demo seeder (5 cars + 2 groups) | `database/seeders/DemoCarsSeeder.php` |
| Deployment artifacts | `deploy/` |
| Ollama installer | `ai-agent/ollama-setup.sh` |
| Romanian-language setup guide | `README-FACEBOOK-AGENT.md` |
| MarketingChannel interface (for future channels) | `app/Services/Facebook/Contracts/MarketingChannel.php` |

---

## 🔄 What EXISTS in `backend/` but NOT yet ported

| Feature | Status | Notes |
|---------|--------|-------|
| Filament admin panel | ⏳ Pending | `backend/app/Filament/` — full Filament v3 admin for vehicles, users, etc. |
| Vehicle / Blog models | ⏳ Pending | `backend/app/Models/Vehicle.php`, `BlogPost.php`, `Review.php`, etc. |
| REST API controllers | ⏳ Pending | `backend/app/Http/Controllers/Api/` — vehicle listings, reviews, etc. |
| Email notifications | ⏳ Pending | `backend/app/Notifications/` |
| Spatie Media Library integration | ⏳ Pending | For car photo management |
| Meilisearch integration | ⏳ Pending | `backend/` uses `laravel/scout` + Meilisearch |
| Spatie Settings | ⏳ Pending | Global app settings |
| Sitemap generation | ⏳ Pending | `spatie/laravel-sitemap` |
| Multi-language (translatable) setup | ⏳ Pending | `spatie/laravel-translatable` is installed but not wired |
| Authentication (Sanctum API tokens) | ⏳ Pending | `laravel/sanctum` present in `backend/` |
| User roles & permissions | ⏳ Pending | `spatie/laravel-permission` installed, migrations published |
| Frontend API compatibility | ⏳ Pending | `frontend/` (Next.js) calls the `backend/` API — needs migration |

---

## 📦 Packages in `backend/` that are already installed in `laravel-app/`

- `guzzlehttp/guzzle` ✅
- `laravel/horizon` ✅
- `spatie/laravel-medialibrary` ✅
- `spatie/laravel-permission` ✅
- `spatie/laravel-translatable` ✅
- `laravel/pint` ✅ (dev)

---

## 🗓️ Recommended migration order for future PRs

1. **PR #2** — Port Filament admin panel + Vehicle model + REST API controllers
2. **PR #3** — Port Auth (Sanctum), user roles, email notifications
3. **PR #4** — Instagram channel via `MarketingChannel` interface
4. **PR #5** — mobile.de / AutoScout24 marketplace integrations
5. **PR #6** — OtoMoto (Polish market) integration
6. **PR #7** — Full Meilisearch / search integration
7. **PR #8** — WhatsApp Business integration (separate from Messenger)

---

## 🚫 Intentionally NOT ported in this PR

- Instagram, TikTok, YouTube, LinkedIn
- mobile.de, AutoScout24, LeBonCoin, OtoMoto, Subito, Coches.net, Marktplaats, AutoTrader, Sauto.cz
- WhatsApp, Telegram bots
- Frontend UI redesign

---

## 📁 Existing files left untouched

- `backend/` — entire original Laravel application (reference, not deleted)
- `frontend/` — entire Next.js application (deployed on Vercel, not modified)
- `docker-compose.yml` — original Docker setup
- `vercel.json` — Vercel configuration for frontend
