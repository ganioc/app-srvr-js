const ErrCode = require('../err')


let verifyAdmin = (req, res, next) => {
  if (req.session.role !== 0) {
    return res.status(401).json({ code: ErrCode.AUTH_PERMISSION_FAIL, data: {} })
  } else {
    console.log('verifyAdmin pass')
    next();
  }
}


module.exports = {
  verifyAdmin: verifyAdmin
}