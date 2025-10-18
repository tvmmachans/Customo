const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('Missing JWT_SECRET');
  return s;
}

function signToken(payload, options) {
  const secret = getJwtSecret();
  const defaultOptions = { expiresIn: process.env.JWT_EXPIRES_IN || '7d' };
  const opts = Object.assign({}, defaultOptions, options || {});
  return jwt.sign(payload, secret, opts);
}

function verifyToken(token) {
  if (!token) throw new Error('Missing token');
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret);
  } catch (err) {
    if (err && err.name === 'TokenExpiredError') {
      const e = new Error('Token expired');
      e.code = 'TOKEN_EXPIRED';
      throw e;
    }
    const e = new Error('Invalid token');
    e.code = 'INVALID_TOKEN';
    throw e;
  }
}

// new helper: normalize Authorization header values
function extractTokenFromHeader(authHeader) {
  if (!authHeader) return null;
  if (typeof authHeader !== 'string') return null;
  const prefix = 'Bearer ';
  if (authHeader.startsWith(prefix)) return authHeader.slice(prefix.length).trim();
  return authHeader.trim();
}

module.exports = {
  signToken,
  verifyToken,
  extractTokenFromHeader
};
