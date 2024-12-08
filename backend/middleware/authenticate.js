const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    // Verify token and extract userId
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    req.userId = decoded.userId;  // Add userId to request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
