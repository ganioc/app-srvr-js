const util = require('util')
const logger = require('../../../logger')
const ErrCode = require('../../../err')

// const UserInfoModel = require('../../../model/userinfo')
const getUserInfo = require('../../../db/getUserInfo')
const umsc = require('../../../umsc/index')
// const setMsg = require('../../../db/setMsg')
const bullmq = require('../../../bullmq')

module.exports = async (req, res) => {
  logger.debug('/api/user/send/multi:')
  logger.debug(util.format('%o', req.body));

  let mobileArr = req.body.mobiles;
  let content = req.body.text;

  if (!mobileArr || !content) {
    logger.error('Invalid input param')
    return res.json({
      code: ErrCode.USER_INVALID_PARAM,
      data: { message: 'Invalid input params' }
    })
  }

  // if unused > 0
  let fb = await getUserInfo({ username: req.session.username });
  if (fb.error) {
    logger.error('Can not find the userInfo:%s', req.session.username)
    return res.json({
      code: ErrCode.DB_QUERY_FAIL,
      data: { message: 'Not find userInfo' }
    })
  }
  console.log(fb.data);

  if (fb.data.unused <= mobileArr.length) {
    logger.error('Not enough quota ' + fb.data.unused + ' to ' + mobileArr.length)
    return res.json({
      code: ErrCode.USER_QUOTA_FAIL,
      data: { message: 'Not enough quota ' + fb.data.unused }
    })
  }

  // send it out
  fb = await umsc.multi(mobileArr, content);

  setTimeout(async () => {
    let result = await bullmq.sendMultiMsg({
      username: req.session.username,
      mobiles: mobileArr,
      content: content,
      data: fb.data
    })
    if (result.id) {
      logger.info('sendMultiMsg Job succeed ' + result.id)
    } else {
      logger.error('sendMultiMsg failed')
    }
  }, bullmq.SEND_DELAY)

  if (fb.code === 0) {
    logger.debug(util.format('%o', fb.data))

    res.json({
      code: 0,
      data: { message: 'OK' }
    })

  } else {
    logger.error('submit fail')
    res.json({
      code: fb.code,
      data: { message: 'submit fail' }
    })
  }
}