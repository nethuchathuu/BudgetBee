const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data (id, role, etc.)
    console.log('User verified:', req.user);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('JWT verification error: Token expired');
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};


// Export the middleware functions
module.exports = {
  verifyUser
};
 
