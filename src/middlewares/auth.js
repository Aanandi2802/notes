const jwt = require('jsonwebtoken');

// Middleware to authenticate the user using JWT
const authenticateUser = (req, res, next) => {
  // Check if there is a token in the request headers
  const authHeader = req.header('Authorization');

  // Ensure the token is present and has the correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      // Handle token verification errors
      if (err) {
        console.error(err); // Log the error for debugging
        return res.sendStatus(403);
      }

      console.log('Decoded User:', user); // Log the decoded user for debugging

      // Attach the user information to the request for further use in the route handlers
      req.user = user;

      // Continue to the next middleware or route handler
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticateUser;
