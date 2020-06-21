const util = require('util')
const UserModel = require('../../../model/user.js');
// const UserInfoModel = require('../../../model/userinfo')
const ErrCode = require('../../../err')
const logger = require('../../../logger')

module.exports = async (req, res) => {
  logger.debug('/api/admin/setuser')
  logger.debug(util.format('%o', req.body))

  UserModel.findOne(
    { username: req.body.username },
    function (err, user) {
      if (!err) {
        user.status = req.body.status
        user.unused = req.body.unused
        user.email = req.body.email
        user.phone = req.body.phone
        user.address = req.body.address
        user.extra = req.body.extra

        user.save((err) => {
          if (err) {
            return res.json(
              {
                code: ErrCode.DB_SAVE_FAIL,
                data: { message: 'save user failed' }
              }
            )
          } else {
            return res.json({
              code: 0,
              data: {}
            })
          }
        })
      } else {
        return res.json({
          code: ErrCode.DB_FIND_NONE,
          data: { message: 'Can not find user by' + req.body.username }
        })
      }
    }
  )

}