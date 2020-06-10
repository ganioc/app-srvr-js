
const util = require('util')
const logger = require('../logger')
const MsgtonModel = require('../model/msgton')
const ErrCode = require('../err')

function checkMobile(mobile) {
  let out = mobile;
  if (out.length > 11) {
    out = out.slice(out.length - 11)
  }
  return out;
}

module.exports = (name, mobiles, data) => {
  logger.debug('setMsgton()')
  return new Promise((resolve) => {
    let mobile = mobiles[0];
    let msgId = data.data.smsid;

    if (msgId === undefined) {
      resolve({
        code: ErrCode.USER_INVALID_PARAM,
        data: { message: "Undefined msgid" }
      })
      return
    }

    // if mobiles = 861223233, remove 86
    mobile = checkMobile(mobile);

    MsgtonModel.countDocuments({
      mobile: mobile,
      msg_id: msgId
    }, (err, count) => {
      if (err) {
        logger.error('Msgton count failed')
        logger.error(util.format('%o', err))
        resolve({
          code: ErrCode.DB_QUERY_FAIL,
          data: {}
        })
        return;
      }
      if (count > 0) {
        logger.info('Msgton already exists')
        resolve({
          code: 0,
          data: {}
        })
        return;
      }
      // count == 0
      let obj = {
        username: name,
        mobile: mobile,
        msg_id: msgId,
        date: new Date(),
        status: 0
      }
      logger.debug(util.format('%o', obj))

      let msgton = MsgtonModel(obj)

      msgton.save((err) => {
        if (err) {
          logger.error('setMsgton failed')
          logger.error(util.format('%o', err));
          resolve({
            code: 0,
            data: null
          })
        } else {
          logger.info('setMsgton OK')
          resolve({
            code: 0,
            data: null
          })
        }
      })
    })
  })

}