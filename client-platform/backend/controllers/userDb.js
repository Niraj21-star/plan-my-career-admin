const mongoose = require('mongoose');

let userConnection = null;

async function connectUserDB() {
  const uri = process.env.USER_MONGO_URI;
  if (!uri) {
    console.warn('USER_MONGO_URI not set; external DB browsing is disabled.');
    return null;
  }

  if (userConnection) return userConnection;

  const conn = mongoose.createConnection(uri, {
    serverSelectionTimeoutMS:
      parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 10000,
  });

  try {
    // Mongoose v7: wait until connected
    await conn.asPromise();
    console.log('User MongoDB connected');
    userConnection = conn;
    return userConnection;
  } catch (err) {
    console.error('Failed to connect USER_MONGO_URI', err);
    throw err;
  }
}

function getUserConnection() {
  return userConnection;
}

module.exports = { connectUserDB, getUserConnection };
