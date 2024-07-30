const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
