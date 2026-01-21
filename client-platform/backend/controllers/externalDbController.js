const mongoose = require('mongoose');
const { getUserConnection } = require('./userDb');

function requireUserDb(res) {
  const conn = getUserConnection();
  if (!conn) {
    res.status(503).json({
      message: 'External DB not configured. Set USER_MONGO_URI on the backend.',
    });
    return null;
  }
  return conn;
}

function isSafeCollectionName(name) {
  // conservative: allow common Mongo collection naming characters
  return typeof name === 'string' && /^[a-zA-Z0-9_.-]+$/.test(name);
}

function buildQueryFilter({ q }) {
  if (!q || typeof q !== 'string') return {};
  const text = q.trim();
  if (!text) return {};

  const re = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  // generic OR search across common keys
  return {
    $or: [
      { name: re },
      { email: re },
      { phone: re },
      { mobile: re },
      { title: re },
      { status: re },
    ],
  };
}

async function status(req, res) {
  const conn = getUserConnection();
  return res.json({
    enabled: !!conn,
    readyState: conn ? conn.readyState : 0,
    name: conn ? conn.name : null,
    host: conn ? conn.host : null,
  });
}

async function listCollections(req, res) {
  const conn = requireUserDb(res);
  if (!conn) return;

  const collections = await conn.db.listCollections().toArray();
  const names = collections
    .map((c) => c.name)
    .filter((n) => typeof n === 'string' && !n.startsWith('system.'))
    .sort((a, b) => a.localeCompare(b));
  return res.json({ collections: names });
}

async function listDocuments(req, res) {
  const conn = requireUserDb(res);
  if (!conn) return;

  const { collectionName } = req.params;
  if (!isSafeCollectionName(collectionName)) {
    return res.status(400).json({ message: 'Invalid collection name' });
  }

  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limitRaw = parseInt(req.query.limit) || 25;
  const limit = Math.min(Math.max(limitRaw, 1), 200);
  const skip = (page - 1) * limit;

  const sortField = typeof req.query.sortField === 'string' ? req.query.sortField : '_id';
  const sortDir = (String(req.query.sortDir || 'desc').toLowerCase() === 'asc') ? 1 : -1;

  const filter = buildQueryFilter({ q: req.query.q });

  const collection = conn.db.collection(collectionName);
  const [total, documents] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limit)
      .toArray(),
  ]);

  return res.json({
    collection: collectionName,
    page,
    limit,
    total,
    documents,
  });
}

async function getDocument(req, res) {
  const conn = requireUserDb(res);
  if (!conn) return;

  const { collectionName, id } = req.params;
  if (!isSafeCollectionName(collectionName)) {
    return res.status(400).json({ message: 'Invalid collection name' });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid document id' });
  }

  const collection = conn.db.collection(collectionName);
  const doc = await collection.findOne({ _id: new mongoose.Types.ObjectId(id) });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  return res.json({ document: doc });
}

module.exports = { status, listCollections, listDocuments, getDocument };
