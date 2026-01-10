# Mynote Architecture Documentation

## System Overview

Mynote is a full-stack note-taking application built with a modern MERN stack (MongoDB, Express, React, Node.js) with advanced features including AI integration, offline support, and cross-device synchronization.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├─────────────────────────────────────────────────────────────┤
│  React Application (Port 3000)                               │
│  ├── Pages (Login, Dashboard, Editor, Timeline, Focus)      │
│  ├── Components (Navbar, NoteCard, VoiceRecorder, etc.)     │
│  ├── Contexts (Auth, Theme)                                  │
│  ├── Services (API, Sync, IndexedDB)                         │
│  └── Styles (CSS Modules)                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Express.js Server (Port 5000)                               │
│  ├── REST API Endpoints                                      │
│  ├── CORS Configuration                                      │
│  ├── Request Validation                                      │
│  └── Error Handling                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
├─────────────────────────────────────────────────────────────┤
│  Route Controllers                                           │
│  ├── /api/notes - Note CRUD operations                      │
│  ├── /api/auth - Authentication & biometrics                │
│  ├── /api/sync - Cross-device synchronization               │
│  ├── /api/ai - AI features (summarization, organization)    │
│  └── /api/email - Email-to-notes integration                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                       │
├─────────────────────────────────────────────────────────────┤
│  MongoDB with Mongoose ODM                                   │
│  ├── Note Model (notes, tags, attachments)                  │
│  ├── User Model (auth, preferences, devices)                │
│  └── Indexes for performance                                 │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Create Note Flow
```
User Input → React Component → API Service → Express Route → 
MongoDB → Response → Update UI → Sync Service → IndexedDB
```

### 2. Offline Flow
```
User Input → React Component → IndexedDB (local storage) → 
Sync Queue → Auto-sync when online → Server → MongoDB
```

### 3. AI Organization Flow
```
User Request → AI API Route → Fetch Notes → Text Analysis → 
Generate Tags/Categories → Update Notes → Return Results
```

## Core Components

### Frontend (React)

#### Pages
- **Login/Register**: User authentication
- **Dashboard**: Main note listing with grid/list views
- **NoteEditor**: Rich text editing with voice notes
- **Timeline**: Chronological note visualization
- **FocusMode**: Flashcard study interface
- **Settings**: User preferences and configuration

#### Services
- **API Service**: Axios-based HTTP client
- **Sync Service**: Handles offline/online synchronization
- **DB Service**: Dexie wrapper for IndexedDB

#### Context Providers
- **AuthContext**: User authentication state
- **ThemeContext**: Dark/light mode management

### Backend (Node.js/Express)

#### Models
```javascript
Note {
  title: String
  content: String (HTML)
  richContent: Object
  tags: [String]
  attachments: [File]
  voiceNote: Audio
  aiSummary: String
  aiTags: [String]
  aiCategory: String
  reminder: Date
  userId: String
  isSecure: Boolean
  version: Number
}

User {
  email: String
  username: String
  passwordHash: String
  biometricCredentials: [Credential]
  preferences: Object
  devices: [Device]
  clipboardHistory: [Clipboard]
}
```

#### Routes
1. **Notes Routes** (`/api/notes`)
   - GET / - List all notes
   - GET /:id - Get single note
   - POST / - Create note
   - PUT /:id - Update note
   - DELETE /:id - Soft delete
   - GET /search/query - Search
   - GET /timeline/data - Timeline data

2. **Auth Routes** (`/api/auth`)
   - POST /register - User registration
   - POST /login - User login
   - POST /biometric/register-options - Biometric setup
   - PUT /preferences/:userId - Update preferences

3. **Sync Routes** (`/api/sync`)
   - POST /notes - Sync notes
   - GET /notes - Get updates
   - POST /clipboard - Sync clipboard
   - POST /device - Register device

4. **AI Routes** (`/api/ai`)
   - POST /summarize/:noteId - Generate summary
   - POST /organize/:userId - Auto-organize
   - POST /smart-reminder/:noteId - Create reminder
   - GET /insights/:userId - Get analytics

5. **Email Routes** (`/api/email`)
   - POST /webhook - Email-to-note conversion
   - POST /configure - Setup forwarding

## Key Features Implementation

### 1. Offline Support

**Technology**: IndexedDB via Dexie

**Implementation**:
- All notes stored locally in IndexedDB
- Sync queue tracks pending changes
- Auto-sync when connection restored
- Conflict resolution (server wins strategy)

```javascript
// Sync Service Architecture
class SyncService {
  - saveNoteOffline(note)
  - getNotesOffline(userId)
  - sync(userId)
  - startAutoSync(interval)
  - handleConflicts()
}
```

### 2. AI Features

**Implementation**: Built-in algorithms (extensible to external APIs)

**Features**:
- Text summarization (sentence extraction)
- Tag generation (keyword frequency)
- Category detection (keyword matching)
- Smart reminder detection (time reference parsing)

**Future**: Integration with OpenAI/GPT-4 for advanced features

### 3. Rich Text Editing

**Technology**: React Quill

**Features**:
- Headers, lists, formatting
- Colors and backgrounds
- Links and images
- Code blocks
- Custom toolbar

### 4. Voice Notes

**Technology**: MediaRecorder API

**Implementation**:
- Record audio in WebM format
- Store as blob with metadata
- Optional transcription placeholder
- Playback functionality

### 5. Biometric Authentication

**Technology**: Web Authentication API (WebAuthn)

**Implementation**:
- Platform authenticator support
- Fingerprint/Face ID on supported devices
- Credential storage in user model
- Challenge-response authentication

### 6. Cross-Device Sync

**Implementation**:
- Device ID generation and registration
- Timestamp-based conflict resolution
- Clipboard history (last 50 items)
- Auto-sync every 30 seconds

### 7. Timeline View

**Implementation**:
- MongoDB aggregation pipeline
- Group notes by date
- Sort chronologically
- Visual timeline display

### 8. Focus Mode

**Implementation**:
- Auto-generate flashcards from notes
- Title = Question, Content = Answer
- Card navigation (prev/next)
- Flip animation

## Database Schema

### Collections

#### notes
```
{
  _id: ObjectId
  title: String
  content: String (HTML)
  richContent: Object
  tags: Array<String>
  attachments: Array<Attachment>
  voiceNote: VoiceNote
  aiSummary: String
  aiTags: Array<String>
  aiCategory: String
  isPinned: Boolean
  isArchived: Boolean
  isSecure: Boolean
  color: String
  reminder: Reminder
  userId: String (indexed)
  lastModified: Date (indexed)
  lastSynced: Date
  deviceId: String
  version: Number
  isDeleted: Boolean
  createdAt: Date
  updatedAt: Date
}
```

#### users
```
{
  _id: ObjectId
  email: String (unique)
  username: String (unique)
  passwordHash: String
  biometricCredentials: Array<Credential>
  preferences: Preferences
  devices: Array<Device>
  clipboardHistory: Array<Clipboard>
  isEmailVerified: Boolean
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}
```

### Indexes
- notes: { userId: 1, createdAt: -1 }
- notes: { userId: 1, tags: 1 }
- notes: { userId: 1, isDeleted: 1 }
- notes: { 'reminder.date': 1 }

## Security Considerations

### Current Implementation
- Basic password hashing (Base64 - demo only)
- CORS enabled
- Input validation
- Soft deletes
- Biometric support

### Production Requirements
- Use bcrypt for password hashing
- Implement JWT authentication
- Add rate limiting
- Enable HTTPS
- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens

## Performance Optimizations

### Frontend
- Code splitting by route
- Lazy loading components
- Debounced search
- Virtual scrolling for large lists
- Memoization for expensive computations

### Backend
- MongoDB indexes
- Pagination for large datasets
- Caching strategies
- Query optimization
- Connection pooling

### Offline
- IndexedDB for fast local access
- Background sync
- Service Worker for caching

## Scalability

### Current Architecture
- Single server deployment
- Direct MongoDB connection
- In-memory session

### Scaling Strategy
1. **Horizontal Scaling**
   - Load balancer (Nginx)
   - Multiple server instances
   - Session store (Redis)

2. **Database Scaling**
   - MongoDB replica set
   - Read replicas
   - Sharding for large datasets

3. **Caching**
   - Redis for session and frequently accessed data
   - CDN for static assets

4. **File Storage**
   - Move to cloud storage (S3)
   - Separate service for attachments

## Future Enhancements

### Phase 1
- Real-time collaboration (Socket.io)
- Advanced OCR (Tesseract.js)
- Export functionality (PDF, Markdown)

### Phase 2
- Mobile apps (React Native)
- Browser extension
- Calendar integration

### Phase 3
- Advanced AI (GPT-4 integration)
- Team workspaces
- Analytics dashboard

## Development Guidelines

### Code Style
- ES6+ JavaScript
- Functional components (React)
- Async/await for promises
- Error boundaries
- PropTypes validation

### Testing Strategy
- Unit tests (Jest)
- Integration tests (Supertest)
- E2E tests (Cypress)
- Component tests (React Testing Library)

### Deployment
1. Build frontend: `npm run build`
2. Set environment variables
3. Start server: `npm start`
4. Monitor logs
5. Setup SSL certificate

## Monitoring & Logging

### Recommendations
- Application logs (Winston)
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- User analytics (Google Analytics)

## Support & Maintenance

### Backup Strategy
- Daily MongoDB backups
- User data export feature
- Disaster recovery plan

### Update Strategy
- Semantic versioning
- Change logs
- Migration scripts
- Backward compatibility

---

This architecture is designed to be modular, scalable, and maintainable while providing a rich user experience with modern web technologies.
