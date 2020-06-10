/**
 * 找得到，找不到都要返回 code = 0
 */

// const util = require('util')
const logger = require('../logger')
const MsgtonModel = require('../model/msgton')
const ErrCode = require('../err')
const facili = require('../facility')
const umsc = require('../umsc')
const minusUserInfo = require('./minusUserInfo')
// const UserInfoModel = require('../model/userinfo')

module.exports = (smsid, mobile, status) => {
  logger.debug('updateMsgton()')

  return new Promise((resolve) => {
    logger.debug(status)

    if (!mobile || !status) {
      logger.error('Invalid input params')
      resolve({
        code: ErrCode.USER_INVALID_PARAM,
        data: {}
      })
      return;
    }

    let mMobile = facili.checkMobile(mobile)
    let mStatus = umsc.statusToNum(status)
    logger.debug(smsid)
    logger.debug(mMobile)

    MsgtonModel.findOne(
      {
        msg_id: smsid,
        mobile: mMobile
      },
      async (err, msgton) => {
        if (err) {
          logger.error('Can not find the document')
          resolve({
            code: ErrCode.DB_QUERY_FAIL,
            data: err
          })
          return;
        }
        // only 3 means send msg is receivered
        if (msgton.status !== 3 && mStatus === 3) {
          // change user's Unused param
          let result = await minusUserInfo(msgton.username, 1);
          if (result.code !== 0) {
            logger.error('minus ununsed from userinfo failed');
            resolve({ code: ErrCode.DB_OP_FAIL, data: null })
            return
          } else {
            logger.debug('update unused from userinfo OK')
          }
        }
        //其它的状态也记录着，供查看
        msgton.status = mStatus

        msgton.save((err) => {
          if (err) {
            logger.error('Update msgton failed')

          } else {
            logger.debug('Update msgton OK')
          }
          resolve({ code: 0, data: null })
        })
      }
    );
  })
}

