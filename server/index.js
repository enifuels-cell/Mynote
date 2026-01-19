const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
const notesRouter = require('./routes/notes');
const authRouter = require('./routes/auth');
const syncRouter = require('./routes/sync');
const aiRouter = require('./routes/ai');
const emailRouter = require('./routes/email');

app.use('/api/notes', notesRouter);
app.use('/api/auth', authRouter);
app.use('/api/sync', syncRouter);
app.use('/api/ai', aiRouter);
app.use('/api/email', emailRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mynote API is running' });
});

// MySQL connection
sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected successfully');
    console.log('Using existing database tables from Laravel migrations');
  })
  .catch((err) => console.error('MySQL connection error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
