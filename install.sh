#!/bin/bash

# Mynote Installation Script for macOS/Linux
# This script automates the setup process

echo ""
echo "============================================"
echo "Mynote - Laravel Installation Script"
echo "============================================"
echo ""

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "ERROR: PHP is not installed"
    echo "Please install PHP 8.1 or higher"
    echo ""
    echo "macOS: brew install php"
    echo "Ubuntu/Debian: sudo apt-get install php php-mysql php-xml php-mbstring php-curl"
    exit 1
fi

echo "[1/7] Checking PHP installation... OK"
php --version

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo ""
    echo "ERROR: Composer is not installed"
    echo "Visit https://getcomposer.org/download/"
    exit 1
fi

echo "[2/7] Checking Composer... OK"
composer --version

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo ""
    echo "ERROR: Node.js is not installed"
    echo "Visit https://nodejs.org/"
    exit 1
fi

echo "[3/7] Checking Node.js... OK"
node --version

# Install PHP dependencies
echo ""
echo "[4/7] Installing PHP dependencies..."
composer install
if [ $? -ne 0 ]; then
    echo "ERROR: Composer install failed"
    exit 1
fi

# Generate application key
echo ""
echo "[5/7] Generating application key..."
php artisan key:generate
if [ $? -ne 0 ]; then
    echo "ERROR: Application key generation failed"
    exit 1
fi

# Run migrations
echo ""
echo "[6/7] Setting up database..."
php artisan migrate
if [ $? -ne 0 ]; then
    echo "WARNING: Migration had issues. Ensure MySQL/SQLite is configured."
    echo ""
fi

# Install frontend dependencies
echo ""
echo "[7/7] Installing frontend dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: npm install failed"
    cd ..
    exit 1
fi
cd ..

echo ""
echo "============================================"
echo "Installation Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure the database:"
echo "   - Edit .env with your database credentials"
echo "   - Or use SQLite: DB_CONNECTION=sqlite"
echo ""
echo "2. Start the Laravel backend:"
echo "   - Run: php artisan serve"
echo "   - Backend will run on http://localhost:8000"
echo ""
echo "3. In a new terminal, start the React frontend:"
echo "   - Run: cd client && npm start"
echo "   - Frontend will run on http://localhost:3000"
echo ""
echo "4. Open http://localhost:3000 and register/login"
echo ""
echo "For more information, see LARAVEL_SETUP.md"
echo ""
