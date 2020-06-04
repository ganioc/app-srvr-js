const ErrCode = require('../err')
const logger = require('../logger')

let verifyAdmin = (req, res, next) => {
  if (req.session.role !== 0) {
    return res.status(401).json({ code: ErrCode.AUTH_PERMISSION_FAIL, data: {} })
  } else {
    logger.info('verifyAdmin pass')
    next();
  }
}

module.exports = {
  verifyAdmin: verifyAdmin
}