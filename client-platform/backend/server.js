require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./controllers/db');
const { connectUserDB, getUserConnection } = require('./controllers/userDb');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const counsellorRoutes = require('./routes/counsellorRoutes');
const externalDbRoutes = require('./routes/externalDbRoutes');
const { verifyToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/counsellor', counsellorRoutes);
app.use('/api/external-db', externalDbRoutes);

// Health
app.get('/api/health', (req, res) => {
  const conn = mongoose.connection;
  const userConn = getUserConnection();
  res.json({
    ok: true,
    env: process.env.NODE_ENV || 'development',
    db: {
      readyState: conn.readyState,
      name: conn.name,
      host: conn.host,
    },
    userDb: userConn
      ? {
          enabled: true,
          readyState: userConn.readyState,
          name: userConn.name,
          host: userConn.host,
        }
      : { enabled: false },
  });
});

// debug token endpoint (admin only) - requires a valid token to see decoded payload
app.get('/api/debug/token', verifyToken, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// Debug endpoint (quick connectivity check)
app.get('/api/debug', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

Promise.all([connectDB(), connectUserDB()])
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect DB', err);
    process.exit(1);
  });
