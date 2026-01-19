@echo off
REM Mynote Installation Script for Windows with XAMPP
REM This script automates the setup process

echo.
echo ============================================
echo Mynote - Laravel Installation Script
echo ============================================
echo.

REM Check if PHP is installed
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PHP is not installed or not in PATH
    echo Please install XAMPP and ensure PHP is in your system PATH
    echo Visit: https://www.apachefriends.org/
    pause
    exit /b 1
)

echo [1/7] Checking PHP installation... OK
echo PHP Version:
php --version

REM Check if Composer is installed
composer --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Composer is not installed or not in PATH
    echo Please install Composer: https://getcomposer.org/
    pause
    exit /b 1
)

echo [2/7] Checking Composer... OK
composer --version

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo [3/7] Checking Node.js... OK
node --version

REM Install PHP dependencies
echo.
echo [4/7] Installing PHP dependencies...
call composer install
if %errorlevel% neq 0 (
    echo ERROR: Composer install failed
    pause
    exit /b 1
)

REM Generate application key
echo.
echo [5/7] Generating application key...
call php artisan key:generate
if %errorlevel% neq 0 (
    echo ERROR: Application key generation failed
    pause
    exit /b 1
)

REM Run migrations
echo.
echo [6/7] Setting up database...
call php artisan migrate --force
if %errorlevel% neq 0 (
    echo WARNING: Migration had issues. Ensure MySQL is running in XAMPP.
    echo.
)

REM Install frontend dependencies
echo.
echo [7/7] Installing frontend dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ============================================
echo Installation Complete!
echo ============================================
echo.
echo Next steps:
echo.
echo 1. Ensure XAMPP is running:
echo    - Open XAMPP Control Panel
echo    - Click "Start" for Apache
echo    - Click "Start" for MySQL
echo.
echo 2. Create the database (if not exists):
echo    - Go to http://localhost/phpmyadmin
echo    - Click "New" and create database "mynote"
echo.
echo 3. Start the Laravel backend:
echo    - Run: php artisan serve
echo    - Backend will run on http://localhost:8000
echo.
echo 4. In a new terminal, start the React frontend:
echo    - Run: cd client ^&^& npm start
echo    - Frontend will run on http://localhost:3000
echo.
echo 5. Open http://localhost:3000 and register/login
echo.
echo For more information, see LARAVEL_SETUP.md
echo.
pause
