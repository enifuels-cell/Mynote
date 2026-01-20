# MySQL Setup Guide for MyNote

This guide provides step-by-step instructions to configure MyNote with MySQL database.

## Prerequisites

- MySQL Server installed and running
- PHP 8.x+ with MySQL extensions
- Node.js 14+ and npm
- Composer

## Quick Setup

### 1. Start MySQL Service

```bash
# Linux/Ubuntu
sudo service mysql start

# macOS
brew services start mysql

# Windows (XAMPP)
# Open XAMPP Control Panel and click "Start" for MySQL
```

### 2. Create Database

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE IF NOT EXISTS mynote;
exit;
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and update the following (if needed):

```env
# Laravel Application Configuration
APP_NAME=MyNote
APP_ENV=local
APP_KEY=                    # Will be generated in next step
APP_DEBUG=true
APP_URL=http://localhost:8000

# Node.js Backend Configuration
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mynote
DB_USERNAME=root
DB_PASSWORD=                # Your MySQL root password (empty if no password)

# API Configuration
API_URL=http://localhost:5000/api

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Run Database Migrations

```bash
php artisan migrate
```

This will create the following tables:
- users
- notes
- attachments
- voice_notes
- biometric_credentials
- devices
- clipboard_histories

### 6. Create Test User

You can create a test user using Laravel Tinker:

```bash
php artisan tinker
```

Then execute:

```php
$user = new App\Models\User();
$user->email = 'test@example.com';
$user->username = 'testuser';
$user->password = bcrypt('password123');
$user->save();
exit;
```

**Default Test Credentials:**
- Email: `test@example.com`
- Username: `testuser`
- Password: `password123`

### 7. Install Dependencies

```bash
# Backend dependencies (if not already installed)
composer install
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

### 8. Start the Application

#### Option A: Using Dual Backend (Recommended)

Start Laravel backend (port 8000):
```bash
php artisan serve
```

In a new terminal, start Node.js backend (port 5000):
```bash
npm run server
```

In another terminal, start React frontend (port 3000):
```bash
cd client
npm start
```

#### Option B: Using Node.js Backend Only

Start both server and client:
```bash
npm run dev
```

## Verification

### Test Database Connection

```bash
# Laravel
php artisan tinker
# Then: DB::connection()->getPdo(); exit;

# Node.js
node -e "const { sequelize } = require('./server/config/database'); sequelize.authenticate().then(() => console.log('Connected!')).catch(err => console.error(err));"
```

### Test API Endpoints

```bash
# Health check (Laravel)
curl http://localhost:8000/api/health

# Health check (Node.js)
curl http://localhost:5000/api/health
```

## Troubleshooting

### MySQL Connection Errors

1. **Access denied for user 'root'@'localhost'**
   - Update `DB_PASSWORD` in `.env` with your MySQL root password
   - Or reset MySQL root password

2. **Database 'mynote' doesn't exist**
   - Run: `mysql -u root -p -e "CREATE DATABASE mynote;"`

3. **SQLSTATE[HY000] [2002] Connection refused**
   - Ensure MySQL service is running
   - Check MySQL is listening on correct port (default: 3306)

### Laravel Errors

1. **No application encryption key has been specified**
   - Run: `php artisan key:generate`

2. **Migration errors**
   - Reset and re-run: `php artisan migrate:fresh`

### Node.js Backend Errors

1. **Cannot connect to database**
   - Verify `.env` file exists in project root
   - Check DB credentials match MySQL configuration

2. **Port already in use**
   - Change PORT in `.env`
   - Or stop the process using the port

## API Backend Selection

The frontend can connect to either backend:

### Using Laravel Backend (Port 8000)
Edit `client/package.json`:
```json
"proxy": "http://localhost:8000"
```

### Using Node.js Backend (Port 5000)
Edit `client/package.json`:
```json
"proxy": "http://localhost:5000"
```

## Database Schema

The application creates the following tables:

### users
- Authentication and user preferences
- Columns: id, email, username, password, theme, default_view, etc.

### notes
- Core note storage
- Columns: id, user_id, title, content, rich_content, tags, ai_summary, etc.
- Supports: soft deletes, versioning, sync

### attachments
- File attachments for notes
- Columns: id, note_id, file_name, file_path, file_size, mime_type

### voice_notes
- Audio note recordings
- Columns: id, note_id, file_path, duration, transcription

### biometric_credentials
- WebAuthn credentials for biometric authentication
- Columns: id, user_id, credential_id, public_key

### devices
- Device registration for sync
- Columns: id, user_id, device_id, device_name, last_sync

### clipboard_histories
- Cross-device clipboard sync
- Columns: id, user_id, content, device_id

## Next Steps

1. Access the application at http://localhost:3000
2. Register a new account or login with test credentials
3. Start creating notes!

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs/10.x)
- [Sequelize Documentation](https://sequelize.org/)
- [React Documentation](https://react.dev/)

---

For more detailed information, see:
- `QUICK_START.md` - Quick reference guide
- `LARAVEL_SETUP.md` - Laravel-specific setup
- `COMPLETE_README.md` - Full documentation
