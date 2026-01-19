# Quick Reference - Mynote Installation

## 📋 Pre-Installation Checklist
- [ ] XAMPP downloaded and installed
- [ ] Composer installed
- [ ] Node.js installed
- [ ] Git cloned (already done ✓)

## 🚀 Installation (Pick One)

### Option A: Automated (Recommended)
```bash
# Windows
install.bat

# macOS/Linux
chmod +x install.sh
./install.sh
```

### Option B: Manual
```bash
# 1. Install backend
composer install
php artisan key:generate
php artisan migrate

# 2. Install frontend
cd client
npm install

# 3. Start backend
php artisan serve

# 4. Start frontend (new terminal)
cd client && npm start
```

## 🔌 Configuration

### XAMPP Setup
1. Open XAMPP Control Panel
2. Click "Start" for Apache
3. Click "Start" for MySQL

### Database Setup
1. Go to http://localhost/phpmyadmin
2. Click "New"
3. Create database: `mynote`

### Environment Setup
- Edit `.env` if MySQL password is set
- Default: root user, no password

## 🌐 Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **phpMyAdmin**: http://localhost/phpmyadmin
- **Laravel Routes**: http://localhost:8000/routes

## 📁 Project Structure
```
Mynote/
├── app/              → Laravel code (Models, Controllers)
├── database/         → Migrations
├── routes/           → API routes
├── client/           → React frontend
├── .env              → Configuration
└── README.md         → Full documentation
```

## 🛠️ Common Commands

### Backend
```bash
php artisan migrate              # Run migrations
php artisan migrate:refresh      # Reset database
php artisan route:list           # View routes
php artisan tinker               # Interactive shell
php artisan serve                # Start server
```

### Frontend
```bash
npm start                        # Start dev server
npm run build                    # Build for production
npm install                      # Install dependencies
```

## 📚 API Endpoints (31 Total)

### Auth (8)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/user`
- `PUT /api/auth/preferences`
- Plus 4 biometric endpoints

### Notes (10)
- `GET/POST /api/notes`
- `GET/PUT/DELETE /api/notes/{id}`
- `GET /api/notes/search`
- `GET /api/notes/tags`
- `GET /api/notes/pinned`
- `GET /api/notes/archived`

### Sync (5)
- `POST /api/sync`
- `GET /api/sync/status`
- `GET /api/sync/devices`
- Plus device & clipboard endpoints

### AI (5)
- `POST /api/ai/summarize`
- `POST /api/ai/auto-organize`
- `POST /api/ai/flashcards`
- `POST /api/ai/detect-reminders`
- `POST /api/ai/extract-image-text`

### Email (4)
- `POST /api/email/send`
- `POST /api/email/to-note`
- `POST /api/email/subscribe`
- `POST /api/email/share`

## 🔐 Database Tables (8)
1. users
2. notes
3. attachments
4. voice_notes
5. biometric_credentials
6. devices
7. clipboard_histories
8. migrations (Laravel)

## ⚙️ Environment Variables
```env
APP_NAME=Mynote
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mynote
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:3000
```

## ❌ Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8000 in use | `php artisan serve --port=8001` |
| MySQL won't connect | Check MySQL in XAMPP, verify password in .env |
| Database not found | Create `mynote` in phpMyAdmin |
| CORS errors | Check frontend URL in CORS middleware |
| Node modules error | Delete `package-lock.json`, run `npm install` |
| PHP not found | Add PHP to PATH or use full path |

## 📞 Getting Help

1. Check [LARAVEL_SETUP.md](LARAVEL_SETUP.md) for detailed guide
2. See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for complete overview
3. Review [COMPLETE_README.md](COMPLETE_README.md) for full documentation
4. Check Laravel docs: https://laravel.com/docs/10.x

## ✅ What's Implemented

✅ Full Laravel backend with MySQL  
✅ 31 complete API endpoints  
✅ 8 database tables with relationships  
✅ 5 feature-rich controllers  
✅ React frontend ready to use  
✅ User authentication system  
✅ Sync and multi-device support  
✅ AI features (placeholder ready)  
✅ CORS configured  
✅ Automated installers  

## 🎯 After Installation

1. Open http://localhost:3000
2. Click "Register"
3. Enter email, username, password
4. Start creating notes!

---

**Ready to go! Follow the Installation steps above.** 🚀
