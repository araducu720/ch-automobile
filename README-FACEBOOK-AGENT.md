# README-FACEBOOK-AGENT.md

# 🚗 C-H Automobile — Agent AI pentru Marketing Facebook

> **Limbă:** Română (ghid complet pentru utilizatorul final)  
> **Versiune:** 1.0 — Facebook only  
> **Alte canale:** Instagram, mobile.de, AutoScout24, OtoMoto — în PR-uri viitoare

---

## 1. Ce face agentul AI?

Agentul AI automatizează **complet** marketingul pe Facebook pentru showroom-ul **C-H Automobile**, fără costuri de abonamente sau API-uri externe plătite. Rulează direct pe serverul VPS, folosind **Ollama** (LLM local).

### Ce face concret:

| Funcție | Descriere |
|---------|-----------|
| 📢 **Post automat mașini noi** | Când adaugi o mașină și o publici, agentul generează text în română, germană, engleză, franceză și italiană și postează automat pe pagina Facebook |
| 🛒 **Facebook Marketplace / Catalog** | Sincronizează stocul cu catalogul Commerce (Vehicles) — apare automat în Marketplace |
| 👥 **Postare în grupuri** | Postează în grupuri de profil (auto second-hand, etc.) cu text adaptat fiecărui grup |
| 💬 **Răspuns automat Messenger** | Răspunde clienților în limba lor, caută mașini potrivite din stoc și creează lead-uri automat |
| 🗨️ **Răspuns la comentarii** | Gestionează comentariile de pe postări cu răspunsuri personalizate |
| 📅 **Calendar de conținut** | Zilnic generează un post de tip educațional / FAQ / behind-the-scenes |
| 🔄 **Repostare stoc vechi** | Săptămânal repostează mașinile nevândute cu un unghi nou ("încă disponibil") |
| 📊 **Analiză insights** | Zilnic la 23:00 analizează performanța paginii și generează recomandări |

**NOTĂ:** Agentul folosește exclusiv Facebook în această versiune. Instagram, mobile.de, AutoScout24, OtoMoto vor fi adăugate în PR-uri viitoare prin interfața `MarketingChannel`.

---

## 2. Cerințe hardware / VPS recomandat

| Server | Specs | Potrivit pentru |
|--------|-------|-----------------|
| **Hetzner CCX23** (minim) | 8 vCPU, 16 GB RAM, 240 GB SSD | Testare, până la ~200 mașini |
| **Hetzner CCX33** (recomandat) | 8 vCPU, 32 GB RAM, 360 GB SSD | Producție, model vision inclus |
| **Hetzner CCX43** | 16 vCPU, 64 GB RAM | Volumne mari, mai multe modele simultan |

> 💡 **De ce 32 GB RAM?** Modelul `qwen2.5:7b` necesită ~8 GB RAM. `nomic-embed-text` ~1 GB. `llama3.2-vision:11b` (opțional) ~16 GB. Cu 32 GB ești în siguranță.

---

## 3. Creare cont Meta & App Facebook (pas cu pas)

### Pasul 1 — Creare cont personal Facebook
1. Mergi la [facebook.com/signup](https://facebook.com/signup)
2. Completează datele personale
3. Verifică numărul de telefon

### Pasul 2 — Creare Pagină de business "C-H Automobile"
1. Din contul personal → click pe **Creează** → **Pagină**
2. Categorie: **Dealer Auto**
3. Completează toate informațiile (adresă, telefon, website)
4. Adaugă logo și foto de copertă

### Pasul 3 — Creare Business Manager
1. Mergi la [business.facebook.com](https://business.facebook.com)
2. Click **Creare cont** → completează numele business-ului
3. Adaugă pagina creată anterior la business

### Pasul 4 — Creare App la Meta for Developers
1. Mergi la [developers.facebook.com](https://developers.facebook.com)
2. Click **My Apps** → **Create App**
3. Tip aplicație: **Business**
4. Nume: `CH Automobile Agent`
5. Email de contact: emailul tău
6. Business Manager: selectează cel creat anterior

### Pasul 5 — Adaugă produse în App
În dashboard-ul aplicației, adaugă:
- ✅ **Facebook Login**
- ✅ **Webhooks**
- ✅ **Messenger**
- ✅ **Marketing API**
- ✅ **Commerce** (pentru catalog Vehicles)

### Pasul 6 — Generare Long-Lived Page Access Token

**Pasul 6a — Obține un User Access Token:**
```
https://www.facebook.com/v21.0/dialog/oauth?
  client_id={FB_APP_ID}
  &redirect_uri=https://ch-automobile.eu/callback
  &scope=pages_manage_posts,pages_manage_engagement,pages_read_engagement,pages_messaging,pages_show_list,business_management,catalog_management
```

**Pasul 6b — Schimbă cu un Long-Lived Token (valabil 60 zile):**
```bash
curl -X GET "https://graph.facebook.com/v21.0/oauth/access_token" \
  -d "grant_type=fb_exchange_token" \
  -d "client_id={FB_APP_ID}" \
  -d "client_secret={FB_APP_SECRET}" \
  -d "fb_exchange_token={SHORT_LIVED_TOKEN}"
```

**Pasul 6c — Obține Page Access Token (nu expiră niciodată):**
```bash
curl -X GET "https://graph.facebook.com/v21.0/me/accounts" \
  -d "access_token={LONG_LIVED_USER_TOKEN}"
```
Copiază `access_token` al paginii tale — acesta este `FB_PAGE_ACCESS_TOKEN`.

### Pasul 7 — Creare Commerce Catalog (Vehicles)
1. Mergi la [business.facebook.com/commerce](https://business.facebook.com/commerce)
2. Click **Add Catalog** → tipul: **Vehicles**
3. Notează `catalog_id` din URL sau Settings

### Pasul 8 — Permisiuni necesare pentru App Review
Solicită în **App Review** următoarele permisiuni:
- `pages_manage_posts`
- `pages_manage_engagement`
- `pages_read_engagement`
- `pages_messaging`
- `pages_show_list`
- `business_management`
- `catalog_management`
- `commerce_account_manage_orders`

> ⚠️ **Notă:** Până la aprobarea App Review, poți testa cu cont-uri de test în modul Development.

---

## 4. Setup pe Laravel Forge (pas cu pas)

### Pasul 1 — Provizionare server Hetzner în Forge
1. Intră în [forge.laravel.com](https://forge.laravel.com)
2. **New Server** → selectează **Hetzner** → **CCX33** (32 GB RAM)
3. Regiune: **Hetzner Falkenstein (EU)** sau **Helsinki**
4. Așteaptă provizionarea (~5 minute)

### Pasul 2 — Adaugă site
1. În Forge → serverul tău → **New Site**
2. Domain: `ch-automobile.eu`
3. **Web Directory**: `/laravel-app/public`
4. PHP Version: 8.3

### Pasul 3 — Instalare repository
1. **Install Repository** → conectează GitHub → `araducu720/ch-automobile`
2. Branch: `main`

### Pasul 4 — Deploy Script
Mergi la **Deploy Script** și înlocuiește cu conținutul din `deploy/forge-deploy.sh`:

```bash
cd $FORGE_SITE_PATH/laravel-app
git pull origin $FORGE_SITE_BRANCH
$FORGE_COMPOSER install --no-dev --no-interaction --prefer-dist --optimize-autoloader
( flock -w 10 9 || exit 1
    echo 'Restarting FPM...'; sudo -S service $FORGE_PHP_FPM reload ) 9>/tmp/fpmlock
$FORGE_PHP artisan migrate --force
$FORGE_PHP artisan config:cache
$FORGE_PHP artisan route:cache
$FORGE_PHP artisan view:cache
$FORGE_PHP artisan event:cache
$FORGE_PHP artisan horizon:terminate
$FORGE_PHP artisan queue:restart
```

### Pasul 5 — Instalare Ollama pe VPS
SSH pe server și rulează:
```bash
bash /home/forge/ch-automobile.eu/ai-agent/ollama-setup.sh
```
Scriptul:
- Instalează Ollama
- Configurează binding pe 127.0.0.1 (nu e accesibil din exterior)
- Blochează portul 11434 în ufw
- Descarcă modelele `qwen2.5:7b` și `nomic-embed-text` (~5-8 GB)

### Pasul 6 — Adaugă Daemon Horizon
Forge → **Daemons** → **New Daemon**:
```
Command: php /home/forge/ch-automobile.eu/laravel-app/artisan horizon
User: forge
Auto Restart: Yes
```

### Pasul 7 — Activează Scheduler
Forge → **Scheduler** → **New Job**:
```
Command: php /home/forge/ch-automobile.eu/laravel-app/artisan schedule:run
Frequency: Every Minute
User: forge
```

### Pasul 8 — Configurare Environment
Forge → **Environment** → copiază conținutul din `deploy/forge-env-template.env` și completează toate valorile:

```env
APP_KEY=                    # Generează cu: php artisan key:generate
DB_PASSWORD=                # Parola MySQL din Forge

FB_APP_ID=                  # Din developers.facebook.com
FB_APP_SECRET=              # Din developers.facebook.com
FB_PAGE_ACCESS_TOKEN=       # Long-lived Page Token (Pasul 6c)
FB_PAGE_ID=                 # ID-ul numeric al paginii
FB_BUSINESS_ID=             # ID-ul Business Manager
FB_CATALOG_ID=              # ID-ul catalogului Vehicles
FB_WEBHOOK_VERIFY_TOKEN=    # Un string aleator ales de tine (ex: "ch-auto-webhook-2024")
```

### Pasul 9 — SSL
Forge → **SSL** → **Let's Encrypt** → generează certificat pentru `ch-automobile.eu`

### Pasul 10 — Configurare Webhook în Meta App
1. Mergi la [developers.facebook.com](https://developers.facebook.com) → App-ul tău
2. **Webhooks** → **Add Subscription** → **Page**
3. Callback URL: `https://ch-automobile.eu/webhooks/facebook`
4. Verify Token: valoarea pusă în `FB_WEBHOOK_VERIFY_TOKEN`
5. Subscrie la câmpurile: `feed`, `messages`, `messaging_postbacks`, `mention`

### Pasul 11 — Deploy inițial
```bash
# SSH pe server
cd /home/forge/ch-automobile.eu/laravel-app
php artisan key:generate
php artisan migrate --seed
```

---

## 5. Cum adaugi o mașină și o postezi automat

### Via Tinker (pentru testare):
```bash
php artisan tinker
```
```php
$car = \App\Models\Car::create([
    'brand'          => 'BMW',
    'model'          => '320d',
    'year'           => 2021,
    'km'             => 45000,
    'fuel'           => 'diesel',
    'transmission'   => 'automatic',
    'hp'             => 190,
    'price'          => 2790000, // 27 900 EUR în cenți
    'currency'       => 'EUR',
    'location_city'  => 'București',
    'status'         => 'published', // ← declanșează postarea
    'target_locales' => ['ro', 'de', 'en'],
]);

// Dispatch manual (dacă nu ai eveniment configurat):
\App\Jobs\Facebook\PostNewListingJob::dispatch($car);
```

### Urmărire în timp real:
```bash
php artisan horizon
# Deschide în browser: https://ch-automobile.eu/horizon
```

---

## 6. Depanare (Troubleshooting)

### ❌ Token Facebook expirat (eroare 190)
```bash
# Regenerează long-lived token (vezi Pasul 6b și 6c din secțiunea 3)
# Actualizează FB_PAGE_ACCESS_TOKEN în Forge Environment
php artisan config:cache
```

### ❌ Model Ollama out of memory
```bash
# Verifică RAM disponibil:
free -h

# Repornește Ollama:
sudo systemctl restart ollama

# Verifică că modelul e descărcat:
ollama list

# Testează manual:
curl http://127.0.0.1:11434/api/generate \
  -d '{"model":"qwen2.5:7b","prompt":"Hello!","stream":false}'
```

### ❌ Webhook signature mismatch
```bash
# Verifică că FB_APP_SECRET din .env corespunde cu cel din Meta App
# Verifică că CSRF este exclus pentru /webhooks/*

# Testează manual:
php artisan tinker
>>> config('facebook.app_secret')
```

### ❌ Horizon nu pornește
```bash
sudo supervisorctl status horizon
sudo supervisorctl start horizon
# sau via Forge → Daemons → Restart
```

### ❌ Jobs în queue nu se procesează
```bash
php artisan queue:work --queue=facebook --tries=3
# sau restartează Horizon:
php artisan horizon:terminate
```

### 📋 Log-uri utile
```bash
tail -f storage/logs/laravel.log
tail -f storage/logs/ollama.log
php artisan horizon:list
```

---

## 7. Note de conformitate

### GDPR
- Toate datele clienților (PSID Messenger, mesaje) sunt stocate local pe VPS-ul tău în România/EU
- Adaugă un banner de cookie pe site-ul tău (obligatoriu pentru utilizatori UE)
- Permite utilizatorilor să solicite ștergerea datelor (dreptul la uitare — GDPR Art. 17)

### EU AI Act
- Recomandăm adăugarea unui disclaimer vizibil că răspunsurile sunt generate de AI
- Exemplu: *"Acest răspuns a fost generat automat de un asistent AI. Pentru informații exacte, contactați dealershipul."*

### Politici Meta
- Nu folosi fraze interzise: "garantat", "cel mai ieftin", "fără probleme", "100% verificat"
- Respectă politica de publicitate Meta pentru vehicule
- Nu colecta informații personale sensibile prin Messenger fără consimțământ explicit

---

## 8. Arhitectură tehnică (scurt)

```
VPS Hetzner (CCX33)
├── Laravel 11 (laravel-app/)
│   ├── Jobs/Facebook/        ← logica de business AI
│   ├── Services/Facebook/    ← apeluri Graph API
│   ├── Services/Ollama/      ← client LLM local
│   └── resources/views/prompts/ ← template-uri Blade pentru AI
├── Redis                     ← queue + cache + session
├── MySQL 8                   ← baza de date
├── Laravel Horizon           ← worker queue
└── Ollama (127.0.0.1:11434)  ← LLM local, fără costuri externe
    ├── qwen2.5:7b            ← generare text multilingv
    ├── nomic-embed-text      ← embeddings pentru RAG
    └── llama3.2-vision:11b   ← analiză poze (opțional)
```

---

*Generat pentru C-H Automobile — v1.0 — Facebook only*  
*Canale viitoare: Instagram, AutoScout24, mobile.de, OtoMoto — via interfața `MarketingChannel`*
