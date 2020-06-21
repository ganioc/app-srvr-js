const util = require('util')
const UserModel = require('../../../model/user.js');
// const UserInfoModel = require('../../../model/userinfo')
const ErrCode = require('../../../err')
const logger = require('../../../logger')
// const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
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
}