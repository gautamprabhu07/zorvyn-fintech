const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ id: userId, role }, jwtSecret, { expiresIn: '1d' });
};

module.exports = generateToken;