// const util = require('util')
const UserModel = require('../../../model/user.js');
// const UserInfoModel = require('../../../model/userinfo')
const ErrCode = require('../../../err')
const logger = require('../../../logger')

module.exports = async (req, res) => {
  logger.debug('/api/admin/getuser:');
  let name = req.query.username
  UserModel.find({ username: name }).exec((err, results) => {
    if (err) {
      res.json({
        code: ErrCode.DB_QUERY_FAIL,
        data: {}
      })
    } else {
      res.json({
        code: 0,
        data: results[0]
      })
    }
  })
}