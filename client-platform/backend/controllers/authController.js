const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Counsellor = require('../models/Counsellor');

function signToken(payload){
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
}

async function login(req, res){
  const { email, password } = req.body;
  const incomingEmail = email || '';
  const normalizedEmail = incomingEmail.trim().toLowerCase();
  console.log(`[AUTH] login attempt: email=${incomingEmail} normalized=${normalizedEmail} ip=${req.ip}`); // debug log
  if (!normalizedEmail || !password) return res.status(400).json({ message: 'email and password required' });

  // try Admin
  let user = await Admin.findOne({ email: normalizedEmail });
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken({ id: user._id, role: 'admin' });
    return res.json({ token, role: 'admin' });
  }

  // try Counsellor
  user = await Counsellor.findOne({ email: normalizedEmail });
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken({ id: user._id, role: 'counsellor' });
    return res.json({ token, role: 'counsellor' });
  }

  return res.status(404).json({ message: 'User not found' });
}

module.exports = { login };
