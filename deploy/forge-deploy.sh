#!/usr/bin/env bash
# =============================================================================
# C-H Automobile — Laravel Forge Deploy Script
# Paste this into Forge → Site → Deploy Script
# =============================================================================
set -e

cd "$FORGE_SITE_PATH/laravel-app"

echo "▶ Pulling latest code..."
git pull origin "$FORGE_SITE_BRANCH"

echo "▶ Installing Composer dependencies..."
"$FORGE_COMPOSER" install --no-dev --no-interaction --prefer-dist --optimize-autoloader

echo "▶ Restarting PHP-FPM..."
( flock -w 10 9 || exit 1
    echo 'Restarting FPM...'; sudo -S service "$FORGE_PHP_FPM" reload ) 9>/tmp/fpmlock

echo "▶ Running migrations..."
"$FORGE_PHP" artisan migrate --force

echo "▶ Caching config/routes/views/events..."
"$FORGE_PHP" artisan config:cache
"$FORGE_PHP" artisan route:cache
"$FORGE_PHP" artisan view:cache
"$FORGE_PHP" artisan event:cache

echo "▶ Restarting Horizon & queue workers..."
"$FORGE_PHP" artisan horizon:terminate
"$FORGE_PHP" artisan queue:restart

echo "✅ Deploy complete."
