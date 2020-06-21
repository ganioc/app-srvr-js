const util = require('util')
const UserModel = require('../../../model/user.js');
const UserInfoModel = require('../../../model/userinfo')
const ErrCode = require('../../../err')
const logger = require('../../../logger');
const ActionModel = require('../../../model/action.js');



module.exports = async (req, res) => {
  // router.post('/api/admin/deleteuser', authJWT, verifyAdmin, async (req, res) => {
  logger.debug('/api/admin/deleteuser')
  logger.debug(util.format('%o', req.body))

  let username = req.body.username

  if (username === undefined) {
    return res.json({
      code: ErrCode.USER_INVALID_PARAM,
      data: {
        message: "参数不全"
      }
    })
  }

  UserModel.findOneAndDelete({ username: username },
    (err) => {
      if (err) {
        logger.debug('delete user failed')
        logger.debug(util.format('%o', err))
        return res.json({
          code: ErrCode.DB_OP_FAIL,
          data: {
            message: "delete失败"
          }
        })
      }
      UserInfoModel.findOneAndDelete({ username: username },
        (err) => {
          if (err) {
            logger.debug('delete userinfo failed')
            logger.debug(util.format('%o', err))
            return res.json({
              code: ErrCode.DB_OP_FAIL,
              data: {
                message: "delete失败"
              }
            })
          }
          logger.debug('Delete succeed')
          ActionModel.create({
            action: 3,
            username: req.body.username,
            date: new Date(),
            content: "删除"
          }, (err) => {
            if (err) {
              logger.error('create action failed');
              logger.error(util.format('%o],err'))
            }
            logger.debug('create action succeed')
            return res.json({
              code: 0,
              data: {
                message: "删除成功"
              }
            })
          })

        })
    }

  )
}