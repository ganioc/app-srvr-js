
const logger = require('../logger')
const util = require('util')

let UserInfoModel = require('../model/userinfo')

module.exports = (name, num) => {
  logger.debug('minusUserInfo()')

  return new Promise((resolve, reject) => {
    UserInfoModel.findOne(
      { username: name },
      (err, userinfo) => {
        if (err) {
          logger.warning('findOne failed')
          reject({
            error: err,
            data: null
          })
          return
        }
        // find it
        logger.debug(userinfo.unused)

        // update it
        userinfo.unused = userinfo.unused - num
        logger.debug(userinfo.unused)
        userinfo.save(
          (err, userinf) => {
            logger.debug('userinf saved')
            resolve({
              error: null,
              data: null
            })
          }
        )
      }

    )
  })
}