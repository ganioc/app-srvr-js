let UserModel = require('../../model/user.js');
let UserInfo = require('../../model/userinfo')
const authJWT = require('../jwt')
const ErrCode = require('../../err')


let func = (router) => {
  router.get('/api/user/info', authJWT, (req, res) => {
    // When a user is created, userInfo is created
  })
}

module.exports = func;