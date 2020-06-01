
let UserInfoModel = require('../model/userinfo')
let UserModel = require('../model/user.js');


module.exports = (objQuery) => {
  return new Promise((resolve, reject) => {
    UserModel.find(objQuery)
      .exec((err, results) => {
        if (err) {
          resolve({
            error: err,
            data: null
          })
          return;
        }
        if (results[0]) {
          resolve({
            error: null,
            data: results[0]
          })
        } else {
          resolve({
            error: 'none',
            data: null
          })
        }
      })
  });
}