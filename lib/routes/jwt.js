const jwt = require('jsonwebtoken');
const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT || 'keepsafe';
const ErrCode = require('../err')

const authJWT = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    console.log('authJWT no x-access-token');
    return res.status(401).json({ code: ErrCode.AUTH_NO_TOKEN });
  } else {
    console.log('authJWT pass')
  }
  jwt.verify(token, SECRET_KEY_JWT, (err, user) => {
    if (err) {
      console.log('authJWT fail x-access-token');
      return res.status(403).json({ code: ErrCode.AUTH_INVALID_TOKEN });
    }
    req.user = user;
    next();
  })
}


module.exports = authJWT