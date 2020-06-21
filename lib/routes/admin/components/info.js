const util = require('util')
// const UserModel = require('../../../model/user.js');
// const UserInfoModel = require('../../../model/userinfo')
// const ErrCode = require('../../../err')
const logger = require('../../../logger')
// const bcrypt = require('bcrypt');
const getBalance = require('../../../umsc').getBalance

module.exports = async (req, res) => {
  logger.debug('/api/admin/info:');

  // 直接从网上获得这个信息
  let result = await getBalance();
  if (result.code !== 0) {
    res.json({
      code: result.code,
      data: {}
    })
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
}
