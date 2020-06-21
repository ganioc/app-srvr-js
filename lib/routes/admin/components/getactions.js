const util = require('util')
const ActionModel = require('../../../model/action.js');
// const UserInfoModel = require('../../../model/userinfo')
const ErrCode = require('../../../err')
const logger = require('../../../logger')

module.exports = async (req, res) => {
  logger.debug('/api/admin/getactions:');
  logger.debug(util.format('%o', req.query))
  let curPage = parseInt(req.query.curpage);
  let numPage = parseInt(req.query.numpage);

  curPage = (curPage < 0) ? 0 : curPage;
  numPage = (numPage > 50) ? 10 : numPage;

  let amount = 0;
  ActionModel.countDocuments(
    {},
    (err, count) => {
      if (err) {
        logger.error('DB count failed')
        logger.error(util.format('%o', err))
        res.json({
          code: ErrCode.DB_OP_FAIL,
          data: {}
        })
        return
      }

      amount = count;

      ActionModel.find({})
        .sort({ date: 'desc' })
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
  )
}
