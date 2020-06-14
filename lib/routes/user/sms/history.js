const util = require('util')
const logger = require('../../../logger')
const ErrCode = require('../../../err')

const MsgModel = require('../../../model/msg')

module.exports = async (req, res) => {
  logger.debug('/api/user/sms/history:')
  logger.debug(util.format('%o', req.query))

  let curPage = parseInt(req.query.curpage);
  let numPage = parseInt(req.query.numpage)

  curPage = (curPage < 0) ? 0 : curPage;
  numPage = (numPage > 50) ? 10 : numPage;

  let amount = 0;

  MsgModel.countDocuments(
    { username: req.session.username },
    (err, count) => {
      if (err) {
        res.json({
          code: ErrCode.DB_QUERY_FAIL,
          data: {}
        })
      } else {
        amount = count;
        logger.info('amount:' + amount)

        MsgModel.find({ username: req.session.username })
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
    })
}