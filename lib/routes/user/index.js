let UserModel = require('../../model/user.js');
let UserInfo = require('../../model/userinfo')
const authJWT = require('../jwt')
const ErrCode = require('../../err')

const getUserInfo = require('../../db/getUserInfo');
const sendSingle = require('./send/single')

let func = (router) => {
  router.get('/api/user/info', authJWT, async (req, res) => {
    // When a user is created, userInfo is created
    if (!req.session.username) {
      res.json({
        code: ErrCode.DB_QUERY_FAIL,
        data: {}
      })
      return;
    }
    let fb = await getUserInfo({ username: req.session.username });
    if (fb.error) {
      return res.json({
        code: ErrCode.DB_QUERY_FAIL,
        data: {}
      })
    }


    res.json({
      code: 0,
      data: fb.data
    })
  })

  router.post('/api/user/send/single', authJWT, sendSingle);
}

module.exports = func;