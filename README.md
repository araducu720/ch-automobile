# C-H Automobile & Exclusive Cars

Full-stack car dealership web application for **C-H Automobile & Exclusive Cars**, Straßheimer Str. 67-69, 61169 Friedberg (Hessen), Germany.

## Tech Stack

| Layer    | Technology                                       |
|----------|--------------------------------------------------|
| Backend  | Laravel 11, Filament 3 (admin panel), MySQL 8    |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| i18n     | next-intl v4.1 — 24 European languages           |
| Testing  | PHPUnit (backend), Vitest + Testing Library (frontend) |

## Project Structure

```
├── backend/              # Laravel API + Filament admin
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/   # REST API controllers
│   │   │   ├── Requests/          # Form Request validation
│   │   │   ├── Resources/         # API Resource transformers
│   │   │   └── Middleware/        # SecurityHeaders, etc.
│   │   ├── Models/                # Eloquent models
│   │   ├── Filament/              # Admin panel resources
│   │   └── Notifications/         # Email notifications
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── routes/api.php
│   └── tests/Feature/
│
└── frontend/             # Next.js application
    ├── src/
    │   ├── app/[locale]/          # i18n pages (App Router)
    │   ├── components/            # React components
    │   │   ├── forms/             # Contact, Review, Reservation, etc.
    │   │   ├── vehicles/          # VehicleCard, VehicleGallery
    │   │   └── ui/                # Base UI components
    │   ├── lib/                   # API client, utils, validations
    │   ├── types/                 # TypeScript type definitions
    │   └── __tests__/             # Vitest test suites
    ├── messages/                  # i18n translation JSON files (24 locales)
    └── public/
```

## Getting Started

### Prerequisites

- PHP 8.2+ with extensions: `pdo_mysql`, `mbstring`, `openssl`, `gd`, `fileinfo`
- Composer 2.x
- Node.js 20+ and npm
- MySQL 8.0+

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env      # or use .env.production as template
php artisan key:generate
php artisan migrate --seed
php artisan make:filament-user
php artisan serve --port=8000
```

Admin panel: `http://localhost:8000/admin`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
npm run dev
```

Site: `http://localhost:3000`

## Features

- **Vehicle Management** — Full CRUD with media gallery, specs, pricing, status workflow
- **Customer Inquiries** — Contact forms, test drive scheduling, financing requests
- **Vehicle Reservations** — Bank transfer deposits with auto-generated payment references
- **Trade-In Valuations** — Vehicle appraisal requests with photo uploads
- **Blog / CMS** — Multilingual blog with categories and SEO
- **Customer Reviews** — Star rating & review system with admin moderation
- **Cookie Consent** — GDPR-compliant cookie banner
- **Dark/Light Mode** — System-aware theme switching
- **Multi-language** — All 24 EU official languages via next-intl
- **SEO** — Dynamic meta tags per page
- **Error Handling** — Custom 404 and 500 error pages

## API Endpoints

### Vehicles
| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| GET    | `/api/v1/vehicles`          | List vehicles (filterable, paginated)|
| GET    | `/api/v1/vehicles/featured` | Featured vehicles                    |
| GET    | `/api/v1/vehicles/brands`   | Available brands                     |
| GET    | `/api/v1/vehicles/{slug}`   | Vehicle detail (increments views)    |

### Inquiries
| Method | Endpoint            | Description     |
|--------|---------------------|-----------------|
| POST   | `/api/v1/inquiries` | Submit inquiry  |
| POST   | `/api/v1/trade-in`  | Submit trade-in |

### Reservations
| Method | Endpoint               | Description       |
|--------|------------------------|-------------------|
| POST   | `/api/v1/reservations` | Reserve a vehicle |

### Reviews
| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| GET    | `/api/v1/reviews` | List approved reviews |
| POST   | `/api/v1/reviews` | Submit a review       |

### Blog
| Method | Endpoint                     | Description      |
|--------|------------------------------|------------------|
| GET    | `/api/v1/blog/posts`         | List blog posts  |
| GET    | `/api/v1/blog/posts/{slug}`  | Blog post detail |
| GET    | `/api/v1/blog/categories`    | Blog categories  |

### Settings & Newsletter
| Method | Endpoint                                 | Description       |
|--------|------------------------------------------|--------------------|
| GET    | `/api/v1/settings`                       | Company settings   |
| GET    | `/api/v1/legal/{type}`                   | Legal content      |
| POST   | `/api/v1/newsletter/subscribe`           | Subscribe          |
| GET    | `/api/v1/newsletter/confirm/{token}`     | Confirm email      |
| POST   | `/api/v1/newsletter/unsubscribe/{email}` | Unsubscribe        |

All endpoints accept `?locale=xx` for translated content.

## Testing

### Backend (PHPUnit)

```bash
cd backend
php artisan test
# 48 tests, 175 assertions
```

Covers: vehicles, inquiries, reservations, reviews, newsletter, settings.

### Frontend (Vitest)

```bash
cd frontend
npm test
# 83 tests across 4 suites
```

Covers: utility functions, Zod validation schemas, VehicleCard, CookieConsent.

## i18n — Supported Languages

bg, cs, da, **de** (default), el, en, es, et, fi, fr, ga, hr, hu, it, lt, lv, mt, nl, pl, pt, ro, sk, sl, sv

Default locale (`de`) has no URL prefix. Others use a prefix: `/en/fahrzeuge`, `/fr/fahrzeuge`, etc.

## Email Notifications

| Event            | Admin | Customer                         |
|------------------|-------|----------------------------------|
| New inquiry      | ✓     | ✓ Confirmation with ref. number  |
| New reservation  | ✓     | ✓ Bank details + payment ref.    |
| New review       | ✓     | —                                |
| Newsletter signup| —     | ✓ Confirmation link              |

Configure SMTP in `.env` (`MAIL_*` variables). Emails are queued via `ShouldQueue`.

## Security

- **CORS**: Restricted to `FRONTEND_URL` + `*.vercel.app`
- **Rate Limiting**: 60 req/min (default), 5/min for newsletter
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, HSTS (production)
- **Honeypot**: Spam protection on inquiry, trade-in, and review forms
- **Form Requests**: All input validated server-side via dedicated classes
- **Encrypted Sessions**: Secure cookies in production

## Production Deployment

### Backend

```bash
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan queue:work --daemon
```

### Frontend

```bash
npm ci
npm run build
npm start
# Or deploy to Vercel (set root directory to frontend/)
```

## License

Proprietary — C-H Automobile & Exclusive Cars. All rights reserved.
