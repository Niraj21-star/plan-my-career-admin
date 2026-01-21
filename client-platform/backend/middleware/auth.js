const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.debug('[AUTH] Missing Authorization header');
    return res.status(401).json({ message: 'No token' });
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    console.debug('[AUTH] Invalid Authorization header:', authHeader);
    return res.status(401).json({ message: 'Invalid auth header' });
  }
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    console.debug('[AUTH] token verified for user id=', decoded.id, 'role=', decoded.role);
    req.user = decoded;
    return next();
  } catch (err) {
    console.debug('[AUTH] Token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function checkRole(role) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

module.exports = { verifyToken, checkRole };
