/**
 * 找得到，找不到都要返回 code = 0
 */

const util = require('util')
const logger = require('../logger')
const MsgtonModel = require('../model/msgton')
const ErrCode = require('../err')
const facili = require('../facility')
const umsc = require('../umsc')
const UserInfoModel = require('../model/userinfo')

module.exports = (smsid, mobile, status) => {

  let mMobile = facili.checkMobile(mobile)
  let mStatus = umsc.statusToNum(status)
  logger.debug('updateMsgton')
  logger.debug(smsid)
  logger.debug(mMobile)
  logger.debug(status)
  return new Promise((resolve, reject) => {
    MsgtonModel.findOne(
      {
        msg_id: smsid,
        mobile: mMobile
      },
      async (err, msgton) => {
        if (err) {
          logger.error('Can not find the document')
          resolve({ code: 0 })
          return;
        }
        if (msgton.status !== 1 && mStatus === 1) {
          // change user's Unused param
          let result = await minusUserInfo(msgton.username, 1);
          if (result.code !== 0) {
            logger.error('minus ununsed from userinfo failed');
            resolve({ code: 0 })
            return
          } else {
            logger.debug('update unused from userinfo OK')
          }
        }
        msgton.status = mStatus

        msgton.save((err) => {
          if (err) {
            logger.error('Update msgton failed')

          } else {
            logger.debug('Update msgton OK')
          }
          resolve({ code: 0 })
        })
      }
    );
  })
}

