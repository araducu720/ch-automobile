#!/bin/bash
set -e

echo "========================================="
echo "  KYC Multi-Platform — Setup Script"
echo "========================================="
echo ""

# === BACKEND SETUP ===
echo "📦 Setting up Backend (Laravel + Filament)..."
cd backend

if [ ! -f "vendor/autoload.php" ]; then
  composer install
fi

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example"
  echo "   ⚠️  Update database and Pusher credentials in .env"
fi

php artisan key:generate --ansi 2>/dev/null || true

echo "🗄️  Running migrations..."
php artisan migrate --force 2>/dev/null || echo "   ⚠️  Check your database connection in .env"

echo "🌱 Seeding brands..."
php artisan db:seed --class=BrandSeeder 2>/dev/null || echo "   ⚠️  Seeder may have already run"

echo "🔗 Creating storage link..."
php artisan storage:link 2>/dev/null || true

echo "✅ Backend setup complete!"
echo ""

# === FRONTEND SETUP ===
echo "🎨 Setting up Frontend (Next.js)..."
cd ../frontend

if [ ! -d "node_modules" ]; then
  npm install
fi

if [ ! -f ".env.local" ]; then
  cp .env.local.example .env.local
  echo "✅ Created .env.local from .env.local.example"
  echo "   ⚠️  Update API URL and Pusher credentials in .env.local"
fi

echo "✅ Frontend setup complete!"
echo ""

# === DONE ===
echo "========================================="
echo "  ✅ Setup Complete!"
echo "========================================="
echo ""
echo "  To start the backend:"
echo "    cd backend && php artisan serve"
echo ""
echo "  To start the frontend:"
echo "    cd frontend && npm run dev"
echo ""
echo "  Admin Panel: http://localhost:8000/admin"
echo "  Frontend:    http://localhost:3000"
echo ""
echo "  Brand Pages:"
echo "    Walmart: http://localhost:3000/walmart/kyc"
echo "    Amazon:  http://localhost:3000/amazon/kyc"
echo "    DPD:     http://localhost:3000/dpd/kyc"
echo "    DHL:     http://localhost:3000/dhl/kyc"
echo "========================================="
