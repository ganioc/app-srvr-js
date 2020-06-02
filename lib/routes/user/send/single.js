const UserInfoModel = require('../../../model/userinfo')
const getUserInfo = require('../../../db/getUserInfo')
const umsc = require('../../../umsc/index')

module.exports = async (req, res) => {
  console.log('/api/user/send/single:')
  console.log(req.body);

  let mobile = req.body.mobile;
  let content = req.body.text;

  if (!mobile || !content) {
    return res.json({
      code: ErrCode.USER_INVALID_PARAM,
      data: { message: 'Not enough quota' }
    })
  }
  // check user's unused number
  // if unused > 0
  let fb = await getUserInfo({ username: req.session.username });
  if (fb.error) {
    return res.json({
      code: ErrCode.DB_QUERY_FAIL,
      data: {}
    })
  }
  console.log(fb.data);

  if (fb.data.unused <= 0) {
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
    res.json({
      code: fb.code
    })
  }
}