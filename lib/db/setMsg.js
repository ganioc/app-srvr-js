const util = require('util')
const logger = require('../logger')
const MsgModel = require('../model/msg')
const ErrCode = require('../err')

module.exports = (name, mSingle, mobile, content, data) => {
  logger.debug('setMsg()')
  return new Promise((resolve, reject) => {
    let strSmsId = data.data.smsid
    let code = data.result
    let strMessage = data.message
    let mDate = new Date()


    let msg = new MsgModel({
      username: name,
      msg_id: strSmsId,
      type: mSingle,
      date: mDate,
      deliverdate: null,
      submitted: (code === 0) ? true : false,
      delivered: false,
      mobiles: mobile,
      content: content
    });

    msg.save((err) => {
      if (err) {
        logger.error('setMsg failed')
        logger.error(util.format('%o', err))
        resolve({
          code: ErrCode.DB_SET_MSG_FAIL
        })
      } else {
        logger.info('setMsg OK')
        resolve({
          code: 0
        })
      }
    })
  })
}