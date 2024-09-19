const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).redirect('/login'); // 401 Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey', (err, decoded) => {
    if (err) {
      return res.status(401).redirect('/login'); // 401 Unauthorized
    }
    req.userId = decoded.userId;
    next();
  });
}

module.exports = isAuthenticated;
