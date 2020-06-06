
let UserInfoModel = require('../model/userinfo')
const ErrCode = require('../err')

module.exports = (objQuery) => {

  return new Promise((resolve, reject) => {
    UserInfoModel.find(objQuery)
      .exec((err, results) => {
        if (err) {
          resolve({
            code: ErrCode.DB_QUERY_FAIL,
            data: null
          })
          return;
        }
        if (results[0]) {
          resolve({
            code: 0,
            data: results[0]
          })
        } else {
          resolve({
            code: ErrCode.DB_FIND_NONE,
            data: null
          })
        }
      })
  });

}