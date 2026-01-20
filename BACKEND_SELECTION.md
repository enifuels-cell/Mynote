# Backend Selection Guide

## Overview

MyNote supports two backend implementations:
1. **Node.js + Sequelize + MySQL** (✅ Recommended)
2. **Laravel + Eloquent + MySQL** (⚠️ Needs additional configuration)

## Recommended: Node.js Backend

The Node.js backend is fully configured and tested with MySQL.

### Starting the Node.js Backend

```bash
# Start only the backend (port 5000)
npm run server

# Or start both backend and frontend
npm run dev
```

### Verified Functionality

✅ MySQL connection working  
✅ User authentication tested  
✅ Note creation tested  
✅ Note retrieval tested  
✅ All API endpoints functional  

### Test Credentials

- **Email:** test@example.com
- **Username:** testuser  
- **Password:** password123

### API Base URL

```
http://localhost:5000/api
```

### Testing the Backend

```bash
# Health check
curl http://localhost:5000/api/health

# Login (note: password must be base64 encoded)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","passwordHash":"'$(echo -n 'password123' | base64)'"}'

# Create a note (use userId from login response)
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"title":"My Note","content":"Note content","tags":["test"]}'

# Get all notes
curl "http://localhost:5000/api/notes?userId=1"
```

## Laravel Backend (Not Currently Recommended)

The Laravel backend requires additional configuration to work properly.

### Known Issues

- Missing view paths configuration
- Exception handler needs adjustment
- Requires additional Laravel setup steps

### If You Need to Use Laravel

1. Check the `config/view.php` file exists and is properly configured
2. Verify `resources/views` directory exists
3. Run `php artisan config:cache`
4. Run `php artisan view:clear`

The Laravel backend would run on port 8000:
```bash
php artisan serve
```

## Frontend Configuration

The React frontend is configured to proxy to the Node.js backend by default.

### Current Configuration

In `client/package.json`:
```json
"proxy": "http://localhost:5000"
```

### To Switch to Laravel (after fixing it)

Change to:
```json
"proxy": "http://localhost:8000"
```

## Summary

✅ **Use Node.js Backend** - Fully tested and working  
⚠️ **Laravel Backend** - Needs additional fixes

For production deployment or if you specifically need Laravel features, additional configuration work will be required on the Laravel backend.
