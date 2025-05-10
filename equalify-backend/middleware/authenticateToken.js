const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  let token = null;

  // 1. Check token in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2. Check token in Authorization header (Bearer <token>)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 3. If no token found
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  // 4. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info (like id) to request
    next(); // Continue to the next middleware/route
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
