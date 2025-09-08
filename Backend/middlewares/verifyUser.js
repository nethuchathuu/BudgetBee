const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET

const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data (id, role, etc.)
    console.log('User verified:', req.user);
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};


// Export the middleware functions
module.exports = {
  verifyUser
};
 
