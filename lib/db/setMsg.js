const util = require('util')
const logger = require('../logger')
const MsgModel = require('../model/msg')
const ErrCode = require('../err')

function checkMobiles(mobiles) {
  let outarr = []
  for (let i = 0; i < mobiles.length; i++) {
    let out = mobiles[i];
    if (out.length > 11) {
      out = out.slice(out.length - 11)
    }
    outarr.push(out)
  }
  return outarr;
}

function setSingleMsg(name, mobiles, content, data, xid) {
  logger.debug('setSingleMsg()')
  return new Promise((resolve) => {
    let strSmsId = data.data.smsid
    let code = data.result  // msg send OK or NOT
    // let strMessage = data.message
    let mDate = new Date()

    // check if msg exist?
    MsgModel.countDocuments({
      username: name,
      msg_id: strSmsId
    }, (err, count) => {
      if (err) {
        logger.error('DB count failed')
        logger.error(util.format('%o', err))
        resolve({
          code: ErrCode.DB_OP_FAIL,
          data: {}
        })
        return
      }
      if (count > 0) {
        logger.info('Msg already exists')

        resolve({
          code: 0,
          data: {}
        })
        return
      }
      // count === 0
      let msg = new MsgModel({
        username: name,
        msg_id: strSmsId,
        batch_id: '',
        x_id: xid,
        type: 1,
        date: mDate,
        deliverdate: new Date(0),
        submitted: (code === 0) ? true : false,
        delivered: false,
        mobiles: checkMobiles(mobiles),
        content: content
      });

      msg.save((err) => {
        if (err) {
          logger.error('setMsg failed')
          logger.error(util.format('%o', err))
          resolve({
            code: ErrCode.DB_SET_MSG_FAIL,
            data: null
          })
        } else {
          logger.info('setSingleMsg OK')
          resolve({
            code: 0,
            data: null
          })
        }
      })
    })
  })
}
function setMultiMsg(name, mobiles, content, data, xid) {
  logger.debug('setMultiMsg()')
  return new Promise((resolve) => {
    let strBatchId = data.data.batchid
    let code = data.result  // msg send OK or NOT
    // let strMessage = data.message
    let mDate = new Date()

    // check if msg exist?
    MsgModel.countDocuments({
      username: name,
      batch_id: strBatchId
    }, (err, count) => {
      if (err) {
        logger.error('DB count failed')
        logger.error(util.format('%o', err))
        resolve({
          code: ErrCode.DB_OP_FAIL,
          data: {}
        })
        return
      }
      if (count > 0) {
        logger.info('Msg already exists')

        resolve({
          code: 0,
          data: {}
        })
        return
      }
      // count === 0
      let msg = new MsgModel({
        username: name,
        msg_id: '',
        batch_id: strBatchId,
        x_id: xid,
        type: 2,
        date: mDate,
        deliverdate: new Date(0),
        submitted: (code === 0) ? true : false,
        delivered: false,
        mobiles: checkMobiles(mobiles),
        content: content
      });

      msg.save((err) => {
        if (err) {
          logger.error('setMsg failed')
          logger.error(util.format('%o', err))
          resolve({
            code: ErrCode.DB_SET_MSG_FAIL,
            data: null
          })
        } else {
          logger.info('setMultiMsg OK')
          resolve({
            code: 0,
            data: null
          })
        }
      })
    })
  })
}
/**
 * 
 * name: username
 * mSingle: 1 - single, 2 - multiple message
 * mobiles: []
 * content: content of the message
 * data: feedback of the send single/multi
 */
module.exports = (name, mSingle, mobile, content, data, xid) => {
  if (mSingle === 1) {
    return setSingleMsg(name, mobile, content, data, xid)
  } else if (mSingle === 2) {
    return setMultiMsg(name, mobile, content, data, xid)
  } else {
    logger.error('unrecognized mSingle ' + mSingle)
    return new Promise((resolve) => {
      resolve({
        code: ErrCode.DB_UNKNOWN_PARAM,
        data: {}
      })
    })
  }
}