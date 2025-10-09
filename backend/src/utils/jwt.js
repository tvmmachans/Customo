const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('Missing JWT_SECRET');
  return s;
}

function signToken(payload, options) {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, options || { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

function verifyToken(token) {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
}

module.exports = {
  signToken,
  verifyToken
};
