
const logger = require('../logger')
// const util = require('util')
const ErrCode = require('../err')

let UserInfoModel = require('../model/userinfo')

module.exports = (name, num) => {
  logger.debug('plusUserInfo()')

  return new Promise((resolve) => {
    UserInfoModel.findOne(
      { username: name },
      (err, userinfo) => {
        if (err) {
          logger.warning('findOne failed')
          resolve({
            error: ErrCode.DB_QUERY_FAIL,
            data: err
          })
          return
        }
        // find it
        logger.debug(userinfo.unused)

        // update it
        userinfo.unused = userinfo.unused + num
        logger.debug(userinfo.unused)
        userinfo.save(
          (err) => {
            if (err) {
              resolve({
                error: ErrCode.DB_SAVE_FAIL,
                data: err
              })
              return
            }
            logger.debug('userinf saved')
            resolve({
              error: 0,
              data: null
            })
          }
        )
      }

    )
  })

}