# Mynote - Full Stack Application (Laravel + React + MySQL)

A modern, AI-powered note-taking application with the following features:

## Features

- **Rich Text Editor** - Create beautifully formatted notes
- **Dark Mode Support** - Easy on the eyes with automatic theme switching
- **Tags & Organization** - Organize notes with custom tags and categories
- **File Storage** - Attach files and documents to your notes
- **Voice Notes** - Record audio notes directly in the app
- **AI Features** - Automatic summarization and smart organization
- **Offline Support** - Work without internet, changes sync automatically
- **Multi-Device Sync** - Sync across all your devices
- **Security** - Biometric authentication support

## Tech Stack

### Backend
- **Framework**: Laravel 10
- **Database**: MySQL (via XAMPP)
- **Server**: Apache (via XAMPP) or Laravel Built-in Server
- **PHP**: 8.1+

### Frontend
- **Framework**: React 18
- **State Management**: React Context
- **Styling**: CSS
- **HTTP Client**: Axios
- **Local Database**: Dexie (IndexedDB)

### Development Tools
- **Composer** - PHP dependency manager
- **npm** - JavaScript package manager
- **XAMPP** - Local development environment

## Quick Start (5 minutes)

### Prerequisites
1. **XAMPP** - Download from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. **Composer** - Download from [https://getcomposer.org/](https://getcomposer.org/)
3. **Node.js** - Download from [https://nodejs.org/](https://nodejs.org/)

### Setup Steps

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Click "Start" for Apache
   - Click "Start" for MySQL

2. **Create Database**
   - Go to `http://localhost/phpmyadmin`
   - Click "New" and create database named `mynote`

3. **Install Backend Dependencies**
   ```bash
   cd Mynote
   composer install
   ```

4. **Configure Laravel**
   ```bash
   php artisan key:generate
   php artisan migrate
   ```

5. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

6. **Run the Application**

   **Terminal 1 - Start Laravel**
   ```bash
   php artisan serve
   ```
   Backend runs on `http://localhost:8000`

   **Terminal 2 - Start React**
   ```bash
   cd client && npm start
   ```
   Frontend runs on `http://localhost:3000`

7. **Create Your Account**
   - Open `http://localhost:3000` in your browser
   - Click "Register"
   - Fill in email, username, and password
   - Start creating notes!

## Detailed Setup Guide

See [LARAVEL_SETUP.md](LARAVEL_SETUP.md) for complete installation and troubleshooting guide.

## Project Structure

```
Mynote/
├── app/                          # Laravel application code
│   ├── Http/
│   │   ├── Controllers/          # API controllers for each feature
│   │   └── Middleware/           # HTTP middleware
│   ├── Models/                   # Eloquent models
│   ├── Console/                  # Console commands
│   └── Exceptions/               # Exception handling
├── database/
│   ├── migrations/               # Database table definitions
│   └── seeders/                  # Database seeders
├── routes/
│   └── api.php                   # API route definitions
├── config/
│   └── database.php              # Database configuration
├── public/
│   └── index.php                 # Laravel entry point
├── bootstrap/
│   └── app.php                   # Bootstrap file
├── client/                       # React frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service layer
│   │   ├── contexts/             # React contexts
│   │   ├── App.js                # Main app component
│   │   └── index.js              # Entry point
│   ├── public/                   # Static assets
│   └── package.json              # Frontend dependencies
├── .env                          # Environment variables
├── composer.json                 # PHP dependencies
├── LARAVEL_SETUP.md              # Detailed setup guide
├── ARCHITECTURE.md               # System architecture
├── FEATURES.md                   # Feature documentation
└── README.md                     # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user info
- `PUT /api/auth/preferences` - Update user preferences
- `POST /api/auth/biometric/*` - Biometric authentication

### Notes Management
- `GET /api/notes` - Get all notes for user
- `GET /api/notes/{id}` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note
- `GET /api/notes/search` - Search notes
- `GET /api/notes/tags` - Get notes by tag
- `GET /api/notes/pinned` - Get pinned notes
- `GET /api/notes/archived` - Get archived notes

### Sync & Devices
- `POST /api/sync` - Sync notes from device
- `GET /api/sync/status` - Get sync status
- `GET /api/sync/devices` - List all devices
- `POST /api/sync/device/register` - Register device
- `POST /api/sync/clipboard` - Sync clipboard content

### AI Features
- `POST /api/ai/summarize` - Generate note summary
- `POST /api/ai/auto-organize` - Auto-organize all notes
- `POST /api/ai/flashcards` - Generate flashcards
- `POST /api/ai/detect-reminders` - Detect reminders from content
- `POST /api/ai/extract-image-text` - Extract text from images (OCR)

### Email
- `POST /api/email/send` - Send note via email
- `POST /api/email/to-note` - Convert email to note
- `POST /api/email/subscribe` - Subscribe to notifications
- `POST /api/email/share` - Share note via email

## Database Schema

### Users Table
- id, email, username, password
- theme, default_view, ai_auto_organize, auto_sync
- is_email_verified, last_login
- timestamps

### Notes Table
- id, user_id, title, content, rich_content
- tags, ai_summary, ai_tags, ai_category
- is_pinned, is_archived, is_secure, color
- reminder fields, device_id, version
- timestamps, soft delete

### Supporting Tables
- attachments - File attachments for notes
- voice_notes - Voice recordings
- biometric_credentials - Biometric authentication data
- devices - User's devices for syncing
- clipboard_histories - Clipboard sync history

## Environment Variables

Key variables in `.env`:

```env
# Application
APP_NAME=Mynote
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (XAMPP defaults)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mynote
DB_USERNAME=root
DB_PASSWORD=

# Frontend
FRONTEND_URL=http://localhost:3000
```

## Development Commands

### Laravel
```bash
php artisan serve                 # Start development server
php artisan migrate               # Run migrations
php artisan db:seed               # Seed database
php artisan route:list            # View all routes
php artisan cache:clear           # Clear cache
php artisan tinker                # Interactive shell
```

### React
```bash
npm start                         # Start development server
npm run build                     # Build for production
npm test                          # Run tests
npm run eject                     # Eject configuration
```

## Troubleshooting

### Issue: Cannot connect to database
```bash
# Check MySQL is running in XAMPP
# Or check connection settings in .env
php artisan migrate --verbose
```

### Issue: Composer install fails
```bash
composer install --no-scripts
php artisan key:generate
```

### Issue: Port already in use
```bash
# Change port in Laravel
php artisan serve --port=8001

# Or change React port
PORT=3001 npm start
```

### Issue: CORS errors
The API is configured to allow requests from `http://localhost:3000`. Check the `CorsMiddleware.php` if using a different frontend URL.

## Support & Documentation

- **Laravel Docs**: https://laravel.com/docs
- **React Docs**: https://react.dev
- **XAMPP Docs**: https://www.apachefriends.org/
- **MySQL Docs**: https://dev.mysql.com/doc/

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Happy Note-Taking! 📝**
