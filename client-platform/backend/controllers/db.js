const mongoose = require('mongoose');

/**
 * Connect to MongoDB. If MONGO_URI is not set, start an in-memory MongoDB instance
 * using mongodb-memory-server. This allows local development and CI to start
 * the app without an external MongoDB.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (uri) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 10000,
      });
      console.log('MongoDB connected');
      return;
    } catch (err) {
      const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
      const allowFallback = (process.env.MONGO_ALLOW_INMEMORY_FALLBACK || 'true').toLowerCase() !== 'false';
      if (isProd || !allowFallback) throw err;

      console.warn('Failed to connect to MONGO_URI; falling back to in-memory MongoDB for development.');
      console.warn(err?.message || err);
      // continue to in-memory fallback below
    }
  }

  // Fallback: start an in-memory MongoDB for local development
  console.warn('Starting in-memory MongoDB for development');
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  const memUri = mongod.getUri();

  await mongoose.connect(memUri);
  console.log('MongoDB (in-memory) connected');

  // Ensure clean shutdown of the in-memory server when the process exits
  const cleanup = async () => {
    try {
      await mongoose.disconnect();
      await mongod.stop();
    } catch (err) {
      // ignore
    }
    process.exit(0);
  };

  process.once('SIGINT', cleanup);
  process.once('SIGTERM', cleanup);
}

module.exports = connectDB;
