const util = require('util')
const logger = require('../../../logger')

const UserInfoModel = require('../../../model/userinfo')
const getUserInfo = require('../../../db/getUserInfo')
const umsc = require('../../../umsc/index')

module.exports = async (req, res) => {
  logger.debug('/api/user/send/single:')
  logger.debug(util.format('%o', req.body));

  let mobile = req.body.mobile;
  let content = req.body.text;

  if (!mobile || !content) {
    logger.error('Invalid input param')
    return res.json({
      code: ErrCode.USER_INVALID_PARAM,
      data: { message: 'Invalid input param' }
    })
  }
  // check user's unused number
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

  if (fb.data.unused <= 0) {
    logger.error('Not enough quota')
    return res.json({
      code: ErrCode.USER_QUOTA_FAIL,
      data: { message: 'Not enough quota' }
    })
  }

  // check phone number

  // check text length

  // send it out
  fb = await umsc.single(mobile, content)
  if (fb.code === 0) {
    // ok
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