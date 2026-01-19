# Mynote - Laravel Edition with XAMPP

A modern, AI-powered note-taking application built with Laravel and MySQL (using XAMPP).

## Prerequisites

- **PHP** 8.1 or higher (XAMPP includes PHP)
- **XAMPP** (Apache + MySQL + PHP)
- **Composer** - [Download](https://getcomposer.org/)
- **Node.js** (v14 or higher) - for the React frontend

## Installation Steps

### Step 1: Ensure XAMPP is Installed

Download and install XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)

### Step 2: Start XAMPP Services

1. Open XAMPP Control Panel
2. Start **Apache** (required for serving the backend)
3. Start **MySQL** (required for the database)

### Step 3: Create the Database

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click "New" in the left sidebar
3. Enter database name: `mynote`
4. Click "Create"

### Step 4: Install Laravel Dependencies

Navigate to the project directory and run:

```bash
cd Mynote
composer install
```

If you don't have Composer installed globally, you can download Composer and place it in your project root, then run:

```bash
php composer.phar install
```

### Step 5: Configure Environment Variables

The `.env` file is already configured for XAMPP:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mynote
DB_USERNAME=root
DB_PASSWORD=
```

If your MySQL requires a password, update the `DB_PASSWORD` value.

### Step 6: Generate Application Key

```bash
php artisan key:generate
```

### Step 7: Run Migrations

Create the database tables:

```bash
php artisan migrate
```

### Step 8: Install Frontend Dependencies

```bash
cd client
npm install
```

### Step 9: Start the Application

You can run both the Laravel backend and React frontend:

**Option A: Run Laravel Built-in Server (Recommended for Development)**

```bash
php artisan serve
```

This starts Laravel on `http://localhost:8000`

**Option B: Run Through XAMPP Apache**

1. Copy the `public` folder contents to `C:\xampp\htdocs\mynote`
2. Access at `http://localhost/mynote`

**In a separate terminal, start the React frontend:**

```bash
cd client
npm start
```

The frontend will run on `http://localhost:3000`

## First-Time Setup Checklist

- [ ] XAMPP installed and running (Apache + MySQL)
- [ ] Database `mynote` created in phpMyAdmin
- [ ] Composer dependencies installed (`composer install`)
- [ ] Environment variables configured in `.env`
- [ ] Application key generated (`php artisan key:generate`)
- [ ] Database migrations run (`php artisan migrate`)
- [ ] Frontend dependencies installed (`npm install` in client folder)
- [ ] Laravel server running (`php artisan serve`)
- [ ] React frontend running (`npm start` in client folder)

## API Endpoints

The API is available at `http://localhost:8000/api` (when using `php artisan serve`)

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/{id}` - Get a specific note
- `PUT /api/notes/{id}` - Update a note
- `DELETE /api/notes/{id}` - Delete a note
- `GET /api/notes/search` - Search notes

### Sync
- `POST /api/sync` - Sync notes from device
- `GET /api/sync/devices` - Get all devices

### AI Features
- `POST /api/ai/summarize` - Generate summary
- `POST /api/ai/auto-organize` - Auto-organize notes

### Email
- `POST /api/email/send` - Send note via email
- `POST /api/email/to-note` - Convert email to note

## Troubleshooting

### XAMPP MySQL Not Starting
- Check if port 3306 is already in use
- Try changing the MySQL port in XAMPP

### Composer Install Fails
```bash
composer install --no-scripts
php artisan key:generate
```

### Database Migration Errors
```bash
# Drop all tables and restart
php artisan migrate:refresh

# Or reset everything
php artisan migrate:reset
```

### Cannot access Laravel from browser
- Ensure `php artisan serve` is running or XAMPP Apache is started
- Check firewall settings
- Try accessing `http://localhost:8000` if using `php artisan serve`

### CORS Errors in Frontend
The API is configured to allow requests from `http://localhost:3000`. If you're running on a different port, update the CORS configuration in `app/Http/Middleware/Cors.php` or environment variables.

## Environment Variables

Key variables in `.env`:

```env
APP_NAME=Mynote           # Application name
APP_ENV=local             # Environment (local, staging, production)
APP_DEBUG=true            # Enable debug mode
APP_URL=http://localhost:8000  # Application URL

DB_CONNECTION=mysql       # Database driver
DB_HOST=127.0.0.1        # MySQL host (XAMPP default)
DB_PORT=3306             # MySQL port (XAMPP default)
DB_DATABASE=mynote       # Database name
DB_USERNAME=root         # MySQL username (XAMPP default)
DB_PASSWORD=             # MySQL password (empty by default in XAMPP)

FRONTEND_URL=http://localhost:3000  # React frontend URL
```

## Development Commands

```bash
# Start Laravel development server
php artisan serve

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Clear cache
php artisan cache:clear

# View application routes
php artisan route:list

# Start frontend development server
cd client && npm start

# Build frontend for production
cd client && npm run build
```

## Project Structure

```
Mynote/
├── app/
│   ├── Http/
│   │   └── Controllers/          # API controllers
│   └── Models/                   # Eloquent models
├── database/
│   ├── migrations/               # Database migrations
│   └── seeders/                  # Database seeders
├── routes/
│   └── api.php                   # API routes
├── public/
│   └── index.php                 # Entry point
├── client/                       # React frontend
├── .env                          # Environment variables
├── composer.json                 # PHP dependencies
└── README.md                     # This file
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Laravel documentation: [https://laravel.com/docs](https://laravel.com/docs)
3. Check XAMPP documentation: [https://www.apachefriends.org/](https://www.apachefriends.org/)
