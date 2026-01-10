# Quick Setup Guide for Mynote

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**

## Step-by-Step Setup

### 1. Install MongoDB

**Option A: Local Installation**
```bash
# macOS
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Windows
# Download and install from MongoDB website
```

**Option B: MongoDB Atlas (Cloud)**
- Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get connection string
- Use in .env file

### 2. Clone the Repository

```bash
git clone https://github.com/enifuels-cell/Mynote.git
cd Mynote
```

### 3. Install Dependencies

```bash
# Install all dependencies (root + client)
npm run install-all

# Or install separately
npm install           # Backend dependencies
cd client && npm install  # Frontend dependencies
```

### 4. Environment Configuration

```bash
# Create .env file from example
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

**.env Configuration**:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mynote
NODE_ENV=development
```

For MongoDB Atlas, use your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mynote
```

### 5. Start MongoDB (Local Only)

```bash
# macOS/Linux
mongod

# Windows
# MongoDB should start as a service automatically
# Or run: "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe"
```

### 6. Run the Application

**Option A: Run Everything (Recommended for Development)**
```bash
npm run dev
```
This starts both backend (port 5000) and frontend (port 3000)

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

The backend API will be available at:
```
http://localhost:5000
```

## First-Time Usage

### Create Your Account

1. Click "Register" on the login page
2. Fill in:
   - Email address
   - Username
   - Password (min 6 characters)
3. Click "Create Account"
4. You'll be automatically logged in

### Create Your First Note

1. Click "✏️ New Note" button
2. Add a title
3. Write your content using the rich text editor
4. Add tags (optional)
5. Click "💾 Save"

### Explore Features

- **Dashboard**: View all your notes
- **Timeline**: See notes by date
- **Focus Mode**: Study with flashcards
- **Settings**: Configure preferences

## Common Issues & Solutions

### Issue: Cannot connect to MongoDB

**Solution**:
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod

# Or check MongoDB service status
brew services list | grep mongodb  # macOS
systemctl status mongodb           # Linux
```

### Issue: Port 3000 or 5000 already in use

**Solution**:
```bash
# Find process using the port
lsof -i :3000  # or :5000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=5001  # for backend
```

### Issue: npm install fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Module not found errors

**Solution**:
```bash
# Reinstall dependencies
npm run install-all

# Make sure you're in the correct directory
pwd  # Should show /path/to/Mynote
```

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Changes automatically reload
- Backend: Uses nodemon for auto-restart

### Database Management

View your data:
```bash
# Using MongoDB shell
mongo
use mynote
db.notes.find()
db.users.find()
```

Using MongoDB Compass (GUI):
- Download: https://www.mongodb.com/products/compass
- Connect to: mongodb://localhost:27017
- Browse mynote database

### Clear Database

```bash
mongo mynote --eval "db.dropDatabase()"
```

## Production Deployment

### Build Frontend

```bash
cd client
npm run build
```

### Set Production Environment

```bash
export NODE_ENV=production
export MONGODB_URI=your_production_mongodb_uri
export PORT=80  # or your preferred port
```

### Start Server

```bash
npm start
```

### Using Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server/index.js --name mynote

# Monitor
pm2 monit

# View logs
pm2 logs mynote
```

## Docker Setup (Optional)

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
  
  app:
    build: .
    ports:
      - "3000:3000"
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/mynote
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

Run with Docker:
```bash
docker-compose up
```

## Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## Getting Help

- **Documentation**: See README.md, ARCHITECTURE.md, FEATURES.md
- **Issues**: Open an issue on GitHub
- **API Documentation**: Check individual route files in `server/routes/`

## Next Steps

After successful setup:

1. ✅ Explore all features
2. ✅ Enable dark mode
3. ✅ Create multiple notes
4. ✅ Try AI organization
5. ✅ Test offline mode (disconnect internet)
6. ✅ Use focus mode for studying
7. ✅ Record a voice note
8. ✅ Check timeline view

Enjoy using Mynote! 🎉
