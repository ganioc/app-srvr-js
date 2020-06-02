const UserInfoModel = require('../../../model/userinfo')
const getUserInfo = require('../../../db/getUserInfo')


module.exports = async (req, res) => {
  console.log('/api/user/send/single:')
  console.log(req.body);
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
  

  // ok
  res.json({
    code: 0,
    data: { message: 'OK' }
  })

  // fail


}