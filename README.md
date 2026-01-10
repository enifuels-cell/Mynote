# Mynote 📝

A modern, AI-powered note-taking application with advanced features for productivity and organization.

## 🌟 Features

### Core Note-Taking
- **Rich Text Editor** - Create beautifully formatted notes with full text editing capabilities
- **Dark Mode** - Easy on the eyes with automatic theme switching
- **Tags & Organization** - Organize notes with custom tags and categories
- **File Storage** - Attach files and documents to your notes
- **Voice Notes** - Record audio notes directly in the app
- **OCR/PDF Search** - Search through PDF documents and images

### AI-Powered Features
- **AI Summarization** - Automatically generate summaries of your notes
- **Smart Timeline** - Visualize your notes chronologically
- **Auto AI Organization** - Let AI automatically categorize and tag your notes
- **Smart Reminders** - AI detects time references and creates reminders

### Collaboration & Sharing
- **Note Sharing** - Share notes with others easily
- **Email-to-Notes** - Forward emails to create notes automatically
- **Cross-Device Clipboard Sync** - Sync clipboard content across all your devices

### Productivity Tools
- **Focus Mode with Flashcards** - Study your notes with auto-generated flashcards
- **Universal Importer** - Import notes from various formats
- **Smart Search** - Find notes quickly with powerful search

### Offline & Sync
- **Offline Editing** - Work without internet, changes sync automatically
- **Auto-Sync** - Seamless synchronization across all devices
- **Conflict Resolution** - Smart handling of sync conflicts

### Security
- **Secure Biometric Vault** - Lock sensitive notes with fingerprint/face ID
- **Encrypted Storage** - Your data is always secure

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/enifuels-cell/Mynote.git
cd Mynote
```

2. Install dependencies
```bash
npm run install-all
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB
```bash
# Make sure MongoDB is running on your system
mongod
```

5. Run the application
```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## 📖 Usage

### Creating Your First Note
1. Register for an account or login
2. Click "New Note" button
3. Add a title and start writing
4. Use the rich text editor toolbar for formatting
5. Add tags to organize your note
6. Click "Save" to store your note

### Using AI Features
- **Generate Summary**: Click "🤖 Generate Summary" in the note editor
- **Auto-Organize**: Click "🤖 AI Organize" on the dashboard to categorize all notes
- **Smart Reminders**: The system detects time references in your notes

### Voice Notes
1. Open a note
2. Click "🎤 Voice Note"
3. Allow microphone access
4. Click "Start Recording"
5. Speak your note
6. Click "Stop Recording" when done

### Timeline View
- Click "Timeline" in the navigation
- View all your notes organized by date
- See how many notes you created each day

### Focus Mode
- Click "Focus Mode" in the navigation
- Study your notes as flashcards
- Use Previous/Next to navigate
- Click "Show Answer" to reveal the content

### Settings
- **Dark Mode**: Toggle theme
- **Email-to-Notes**: Set up email forwarding
- **Clipboard Sync**: Enable cross-device clipboard
- **AI Organization**: Toggle automatic organization
- **Biometric Lock**: Set up fingerprint/face ID

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Server**: Express.js REST API
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Basic auth with biometric support
- **AI Integration**: Built-in AI services for summarization and organization

### Frontend (React)
- **UI Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Context API
- **Offline Storage**: Dexie (IndexedDB)
- **Rich Text**: React Quill
- **Styling**: Custom CSS with theme support

### Key Technologies
- **Offline Support**: Service Workers + IndexedDB
- **Sync**: Custom sync service with conflict resolution
- **Biometric**: Web Authentication API
- **Voice**: MediaRecorder API
- **Real-time**: WebSocket-ready architecture

## 📁 Project Structure

```
Mynote/
├── server/                 # Backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── utils/             # Utility functions
│   └── index.js           # Server entry point
├── client/                # Frontend
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # Page components
│       ├── contexts/      # React contexts
│       ├── services/      # API & sync services
│       ├── styles/        # CSS files
│       └── App.js         # Main app component
└── package.json           # Root dependencies
```

## 🔧 API Endpoints

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/search/query` - Search notes
- `GET /api/notes/timeline/data` - Get timeline data

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `PUT /api/auth/preferences/:userId` - Update preferences
- `POST /api/auth/biometric/register-options` - Get biometric options
- `POST /api/auth/biometric/register-verify` - Verify biometric

### Sync
- `POST /api/sync/notes` - Sync notes
- `GET /api/sync/notes` - Get synced notes
- `POST /api/sync/clipboard` - Sync clipboard
- `GET /api/sync/clipboard/:userId` - Get clipboard history
- `POST /api/sync/device` - Register device

### AI
- `POST /api/ai/summarize/:noteId` - Generate summary
- `POST /api/ai/organize/:userId` - Auto-organize notes
- `POST /api/ai/smart-reminder/:noteId` - Create smart reminder
- `GET /api/ai/insights/:userId` - Get AI insights

### Email
- `POST /api/email/webhook` - Email to note webhook
- `POST /api/email/configure` - Configure email forwarding

## 🛡️ Security

- Password hashing (should use bcrypt in production)
- Biometric authentication via Web Authentication API
- Encrypted local storage
- HTTPS recommended for production
- CORS configuration
- Input validation and sanitization

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Set environment to production
export NODE_ENV=production

# Start server
npm run server
```

### Environment Variables
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mynote
NODE_ENV=production
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [ ] Real-time collaboration
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced OCR with Tesseract.js
- [ ] Integration with more AI models (GPT-4, Claude)
- [ ] Export to multiple formats (PDF, Markdown, etc.)
- [ ] Calendar integration
- [ ] Browser extension
- [ ] Templates system
- [ ] Advanced analytics dashboard

## 💡 Tips

- Use keyboard shortcuts for faster note-taking
- Tag notes consistently for better organization
- Use voice notes when typing isn't convenient
- Enable auto-sync to never lose your work
- Try focus mode to study your notes effectively
- Use dark mode to reduce eye strain

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Offline Sync Not Working
- Check browser IndexedDB support
- Clear browser cache and try again
- Ensure service worker is registered

### Voice Recording Issues
- Grant microphone permissions
- Check browser compatibility
- Use HTTPS in production

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for better note-taking