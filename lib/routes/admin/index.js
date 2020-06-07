let UserModel = require('../../model/user.js');
const authJWT = require('../jwt')
const ErrCode = require('../../err')
const verifyAdmin = require('../permission').verifyAdmin
const logger = require('../../logger')
const util = require('util')
const getBalance = require('../../umsc').getBalance

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


}


module.exports = func;