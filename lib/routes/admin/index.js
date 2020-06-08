const util = require('util')
const bcrypt = require('bcrypt');
let UserModel = require('../../model/user.js');
const UserInfoModel = require('../../model/userinfo')
const authJWT = require('../jwt')
const ErrCode = require('../../err')
const verifyAdmin = require('../permission').verifyAdmin
const logger = require('../../logger')
const getBalance = require('../../umsc').getBalance
const deleteuser = require('./components/deleteuser')

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
  router.post('/api/admin/createuser', authJWT, verifyAdmin, async (req, res) => {
    logger.debug('/api/admin/createuser')
    logger.debug(util.format('%o', req.body))
    // 生成user
    if (!req.body.username || !req.body.password) {
      return res.json({
        code: ErrCode.USER_INVALID_PARAM,
        message: '参数不全'
      })
    }

    let userObj = {
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      role: 1,
      usertype: 'external',
      unused: (req.body.unused === undefined) ? 0 : parseInt(req.body.unused),
      status: (req.body.status === undefined) ? 'invalid' : req.body.status,
      email: (!req.body.email) ? '' : req.body.email,
      createdate: new Date(),
      phone: (!req.body.phone) ? '' : req.body.phone,
      address: (!req.body.address) ? '' : req.body.address,
      extra: (!req.body.extra) ? '' : req.body.extra
    }
    UserModel.create(
      userObj,
      (err) => {
        if (err) {
          logger.error('createuser failed');
          logger.error(util.format('%o', err))
          return res.json({
            code: ErrCode.DB_SAVE_FAIL,
            data: {
              username: req.body.username,
              message: '生成user失败:' + req.body.username
            }
          })
        }
        // 生成UserInfoModel
        UserInfoModel.create({
          username: req.body.username,
          usertype: 'external',
          lastlogin: new Date(),
          undelivered: 0,
          delivered: 0,
          submitted: 0
        },
          (err) => {
            if (err) {
              logger.error('createuser userinfo failed')
              logger.error(util.format('%o', err))
            }
            logger.debug('createuser succeed')
            return res.json({
              code: 0,
              data: {
                username: req.body.username
              }
            })
          })
      })
    // 生成userinfo
  });

  // set  user
  router.post('/api/admin/setuser', authJWT, verifyAdmin, async (req, res) => {
    logger.debug('/api/admin/setuser')
    logger.debug(util.format('%o', req.body))

    UserModel.findOne(
      { username: req.body.username },
      function (err, user) {
        if (!err) {
          user.status = req.body.status
          user.unused = req.body.unused
          user.email = req.body.email
          user.phone = req.body.phone
          user.address = req.body.address
          user.extra = req.body.extra

          user.save((err) => {
            if (err) {
              return res.json(
                {
                  code: ErrCode.DB_SAVE_FAIL,
                  data: { message: 'save user failed' }
                }
              )
            } else {
              return res.json({
                code: 0,
                data: {}
              })
            }
          })
        } else {
          return res.json({
            code: ErrCode.DB_FIND_NONE,
            data: { message: 'Can not find user by' + req.body.username }
          })
        }
      }
    )
  })
  // hook deleteuser 
  deleteuser(router);
}


module.exports = func;