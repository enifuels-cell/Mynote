# Manual Setup Steps for Mynote (Windows PowerShell)

## Prerequisites Check ✓
- PHP 8.2.12 ✓
- Composer (required)
- Node.js (required)
- MySQL (via XAMPP)

## Step-by-Step Setup

### Step 1: Navigate to Project Directory
```powershell
cd C:\Users\Administrator\Downloads\MyNote\Mynote
```

### Step 2: Install PHP Dependencies
```powershell
composer install
```
⏳ This will take 2-5 minutes. Wait for completion.

### Step 3: Generate Application Key
```powershell
php artisan key:generate
```

### Step 4: Ensure XAMPP is Running
1. Open XAMPP Control Panel
2. Click "Start" for Apache
3. Click "Start" for MySQL

### Step 5: Create Database
1. Open http://localhost/phpmyadmin in your browser
2. Click "New" in the left sidebar
3. Enter database name: `mynote`
4. Click "Create"

### Step 6: Run Database Migrations
```powershell
php artisan migrate
```

### Step 7: Install Frontend Dependencies
```powershell
cd client
npm install
cd ..
```

### Step 8: Start the Backend Server
**In PowerShell Terminal 1:**
```powershell
php artisan serve
```
You should see: "Started Laravel development server on http://127.0.0.1:8000"

### Step 9: Start the Frontend Server
**In PowerShell Terminal 2:**
```powershell
cd client
npm start
```
This will open http://localhost:3000 in your browser.

### Step 10: Create Your Account
1. The React app should open at http://localhost:3000
2. Click "Register"
3. Fill in:
   - Email (e.g., test@example.com)
   - Username (e.g., testuser)
   - Password (min 6 characters)
4. Click "Create Account"
5. Start creating notes!

## Verify Everything is Working

- [ ] Backend running at http://localhost:8000
- [ ] Frontend running at http://localhost:3000
- [ ] Can access http://localhost:8000/api/health
- [ ] Database `mynote` created
- [ ] Can register an account
- [ ] Can create a note

## If Something Goes Wrong

### "Port 8000 already in use"
```powershell
php artisan serve --port=8001
```

### "PHP not found"
- XAMPP not installed or PHP not in PATH
- Download XAMPP: https://www.apachefriends.org/

### "Composer not found"
- Composer not installed or not in PATH
- Download Composer: https://getcomposer.org/

### "MySQL connection error"
```powershell
# Check if MySQL is running in XAMPP
# If password is set, update .env:
# DB_PASSWORD=your_password
```

### "npm: command not found"
- Node.js not installed
- Download Node.js: https://nodejs.org/

## Useful Commands

```powershell
# Clear Laravel cache
php artisan cache:clear

# Reset database (WARNING: deletes all data!)
php artisan migrate:refresh

# View all API routes
php artisan route:list

# Interactive shell
php artisan tinker
```

## Troubleshooting Database Issues

If you get database errors, try:

```powershell
# Drop all tables and restart
php artisan migrate:refresh

# Or check current migrations
php artisan migrate:status
```

## Need Help?

- See LARAVEL_SETUP.md for detailed guide
- See IMPLEMENTATION_SUMMARY.md for complete overview
- See QUICK_START.md for quick reference

## Next Steps After Setup

Once everything is running:

1. Create multiple notes
2. Test search functionality
3. Try adding tags
4. Test the sync features
5. Explore AI features (summarize, organize)
6. Test attachment uploads

Enjoy your Mynote application! 🚀
