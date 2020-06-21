// const util = require('util')
const UserModel = require('../../../model/user.js');
// const UserInfoModel = require('../../../model/userinfo')
const ErrCode = require('../../../err')
const logger = require('../../../logger')
// const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
  logger.debug('/api/admin/users:');

  UserModel.find({ role: 1 }).exec((err, results) => {
    if (err) {
      res.json({
        code: ErrCode.DB_QUERY_FAIL,
        data: {}
      })
    } else {
      res.json({
        code: 0,
        data: {
          num: results.length
        }
      })
    }
  })
}

