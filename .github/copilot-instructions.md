# MyNote - AI Copilot Instructions

## Architecture Overview

MyNote is a **dual-stack** application that maintains both Laravel/MySQL and Node.js/MongoDB implementations:

- **Laravel Backend** ([app/](../app/), [routes/api.php](../routes/api.php)): Uses Eloquent ORM with MySQL via XAMPP
- **Node.js Backend** ([server/](../server/)): Uses Mongoose ODM with MongoDB
- **React Frontend** ([client/](../client/)): Single-page app proxying to backend on port 5000/8000

The frontend communicates with either backend through unified API endpoints. Backend choice depends on deployment target.

## Critical Patterns

### Offline-First Architecture
Notes are stored locally in **IndexedDB** (Dexie) and synced to server:
- Local changes queue in `syncQueue` table ([client/src/services/db.js](../client/src/services/db.js))
- Sync service reconciles with server using version numbers and timestamps
- Conflicts resolved by comparing `version` (server priority) and `lastModified` (client priority)
- See [server/routes/sync.js](../server/routes/sync.js) for conflict resolution logic

### Dual Model System
Each entity exists in both stacks:
- **Laravel**: Eloquent models in [app/Models/](../app/Models/) with migrations in [database/migrations/](../database/migrations/)
- **Node.js**: Mongoose schemas in [server/models/](../server/models/)
- Keep models synchronized when adding fields - update both model files AND frontend API service

### API Service Pattern
Frontend uses modular API services ([client/src/services/api.js](../client/src/services/api.js)):
```javascript
export const notesAPI = { getAll, create, update, delete, search };
export const syncAPI = { syncNotes, getNotes, syncClipboard };
export const aiAPI = { summarize, organize, smartReminder };
```
Always add new endpoints to the corresponding service export.

## Essential Commands

### Development Setup
```bash
# Automated installation (Windows)
install.bat

# Manual Laravel setup (requires XAMPP MySQL running)
composer install
php artisan key:generate
php artisan migrate
php artisan serve  # Port 8000

# Node.js backend (alternative)
npm install && cd client && npm install
npm run dev  # Runs server (port 5000) + client (port 3000)
```

### Database Operations
```bash
# Laravel migrations
php artisan migrate              # Run new migrations
php artisan migrate:refresh      # Reset database
php artisan tinker              # Interactive REPL

# View routes
php artisan route:list
```

### Testing
Run frontend dev server against either backend:
- **Laravel**: `php artisan serve` → React proxies to `localhost:8000`
- **Node.js**: `npm run server` → React proxies to `localhost:5000`

Change proxy in [client/package.json](../client/package.json) (`"proxy": "http://localhost:5000"`)

## Key Integration Points

### AI Features (Mock Implementation)
AI routes ([server/routes/ai.js](../server/routes/ai.js)) use simplified text analysis:
- Summarization: First 2 sentences
- Tag generation: Top 5 frequent words (4+ chars)
- Categorization: Keyword matching (meeting/todo/ideas/project)

**Production**: Replace with OpenAI API calls (OpenAI SDK already in dependencies)

### Biometric Authentication
Uses WebAuthn via SimpleWebAuthn library:
- Backend: `@simplewebauthn/server` generates challenges
- Frontend: `@simplewebauthn/browser` handles browser APIs
- Credentials stored in `biometric_credentials` table
- See [routes/api.php](../routes/api.php) lines 20-23 for endpoints

### File Attachments
Uses Multer middleware for multipart uploads:
- Stored in [storage/app/](../storage/app/) directory
- Associated with notes via `attachments` table/model
- Max 50MB per request (configured in [server/index.js](../server/index.js) line 12)

## Project-Specific Conventions

1. **Soft Deletes**: Notes use `isDeleted` flag, not hard deletion
2. **Versioning**: Every note update increments `version` field for sync conflict detection
3. **Device Tracking**: `deviceId` field tracks which device last modified each note
4. **Rich Content**: Notes store both `content` (HTML string) and `richContent` (JSON) for different renderers

## Common Gotchas

- **Dual backend sync**: When modifying API contracts, update BOTH Laravel controllers AND Node.js routes
- **Migration conflicts**: Laravel migrations are timestamped - don't reuse old timestamps
- **Proxy configuration**: React proxy in package.json must match running backend port
- **MongoDB vs MySQL**: Query syntax differs - use Eloquent methods for Laravel, Mongoose for Node.js
