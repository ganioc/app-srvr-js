const util = require('util')
// const bcrypt = require('bcrypt');
let UserModel = require('../../model/user.js');
// const UserInfoModel = require('../../model/userinfo')
const authJWT = require('../jwt')
const ErrCode = require('../../err')
const verifyAdmin = require('../permission').verifyAdmin
const logger = require('../../logger')
const getBalance = require('../../umsc').getBalance
const deleteuser = require('./components/deleteuser')
const createUser = require('./components/createuser')
const setUser = require('./components/setuser')
const smsHistory = require('./sms/history')
const smsMsgton = require('./sms/getmsgton')
const msgInfo = require('./components/msginfo')

let func = (router) => {
  router.get('/api/admin/users', authJWT, verifyAdmin, (req, res) => {
    logger.debug('/api/admin/users:');

    UserModel.find({ role: 1 }).exec((err, results) => {
      if (err) {
        res.json({
          code: ErrCode.DB_QUERY_FAIL,
          data: {}
        })
      } else {
        res.json({
          code: 0,
          data: {
            num: results.length
          }
        })
      }
    })
  });

  // get balance 
  router.get('/api/admin/info', authJWT, verifyAdmin, async (req, res) => {
    logger.debug('/api/admin/info:');

    // 直接从网上获得这个信息
    let result = await getBalance();
    if (result.code !== 0) {
      res.json({
        code: result.code,
        data: {}
      }
      )
    } else {
      logger.debug(util.format('%o', result.data))
      let mAmount = result.data.data.amount;
      console.log(result.data)
      console.log(result.data.amount)
      logger.debug(typeof mAmount)

      res.json({
        code: 0,
        data: {
          amount: (typeof mAmount === 'number') ? mAmount : 0
        }
      })
    }

  });

  // getUsers 
  router.get('/api/admin/getusers', authJWT, verifyAdmin, async (req, res) => {
    logger.debug('/api/admin/getusers:');
    logger.debug(util.format('%o', req.query))
    let curPage = parseInt(req.query.curpage);
    let numPage = parseInt(req.query.numpage);

    curPage = (curPage < 0) ? 0 : curPage;
    numPage = (numPage > 50) ? 10 : numPage;

    let amount = 0;
    UserModel.find({ role: 1 }).exec((err, results) => {
      if (err) {
        res.json({
          code: ErrCode.DB_QUERY_FAIL,
          data: {}
        })
      } else {
        amount = results.length;

        UserModel.find({ role: 1 })
          .sort({ createdate: 'desc' })
          .limit(numPage)
          .skip((curPage - 1) * numPage)
          .then((results) => {
            return res.json({
              code: 0,
              data: {
                amount: amount,
                numpage: numPage,
                curpage: curPage,
                data: results
              }
            })
          })
          .catch(err => {
            return res.json({
              code: ErrCode.DB_OP_FAIL,
              data: { err }
            })
          })
      }
    })
  });
  // get user
  router.get('/api/admin/getuser', authJWT, verifyAdmin, async (req, res) => {
    logger.debug('/api/admin/getuser:');
    let name = req.query.username
    UserModel.find({ username: name }).exec((err, results) => {
      if (err) {
        res.json({
          code: ErrCode.DB_QUERY_FAIL,
          data: {}
        })
      } else {
        res.json({
          code: 0,
          data: results[0]
        })
      }
    })
  });

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
}


module.exports = func;