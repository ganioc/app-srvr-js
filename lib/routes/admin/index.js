// const util = require('util')
// const bcrypt = require('bcrypt');
// let UserModel = require('../../model/user.js');
// const UserInfoModel = require('../../model/userinfo')
const authJWT = require('../jwt')
// const ErrCode = require('../../err')
const verifyAdmin = require('../permission').verifyAdmin
// const logger = require('../../logger')
// const getBalance = require('../../umsc').getBalance
const deleteuser = require('./components/deleteuser')
const createUser = require('./components/createuser')
const setUser = require('./components/setuser')
const smsHistory = require('./sms/history')
const smsMsgton = require('./sms/getmsgton')
const msgInfo = require('./components/msginfo')
const getUsers = require('./components/getusers')
const getUser = require('./components/getuser')
const users = require('./components/users')
const infolib = require('./components/info.js')
const getactions = require('./components/getactions')

let func = (router) => {
  router.get('/api/admin/users', authJWT, verifyAdmin, users);

  // get balance 
  router.get('/api/admin/info', authJWT, verifyAdmin, infolib);

  // getUsers 
  router.get('/api/admin/getusers', authJWT, verifyAdmin, getUsers)

  // get user
  router.get('/api/admin/getuser', authJWT, verifyAdmin, getUser);

  // create new user
  router.post('/api/admin/createuser', authJWT, verifyAdmin, createUser)

  // set  user
  router.post('/api/admin/setuser', authJWT, verifyAdmin, setUser)

  // hook deleteuser 
  // deleteuser(router);
  router.post('/api/admin/deleteuser', authJWT, verifyAdmin, deleteuser)

  router.get('/api/admin/sms/history', authJWT, verifyAdmin, smsHistory)
  router.get('/api/admin/sms/msgton', authJWT, verifyAdmin, smsMsgton)
  router.get('/api/admin/msginfo', authJWT, verifyAdmin, msgInfo)

  router.get('/api/admin/getactions', authJWT, verifyAdmin, getactions)
}


module.exports = func;