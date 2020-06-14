const util = require('util')
const logger = require('../../../logger')
const ErrCode = require('../../../err')

// const UserInfoModel = require('../../../model/userinfo')
const getUserInfo = require('../../../db/getUserInfo')
const umsc = require('../../../umsc/index')
// const setMsg = require('../../../db/setMsg')
const bullmq = require('../../../bullmq')

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

  // send it out， using umsc API
  fb = await umsc.single(mobile, content)

  // 失败的话，再做一次。对于客户来说实际上是发送出去了
  // 这里是不能够失败的，在后台可以反复查询结果
  // 无论成功失败，都会把这条消息记录下来
  // let result = await setMsg(
  //   req.session.username,
  //   1,
  //   [mobile],
  //   content,
  //   fb.data);
  setTimeout(async () => {
    let result = await bullmq.sendSingleMsg({
      username: req.session.username,
      mobiles: [mobile],
      content: content,
      data: fb.data  // 格式见umsc/funcsingle
    })
    if (result.id) {
      logger.info('sendSingMsg Job succeed ' + result.id)
    } else {
      logger.error('sendSingleMsg failed!')
    }
  }, bullmq.SEND_DELAY)


  if (fb.code === 0) {
    // ok
    logger.debug(util.format('%o', fb.data))
    // input, mobile, content
    // input, feedback
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