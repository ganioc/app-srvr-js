let UserModel = require('../../model/user.js');
const authJWT = require('../jwt')
const ErrCode = require('../../err')

let fun = (router) => {
  router.get('/api/admin/users', authJWT, (req, res) => {
    console.log('/api/admin/users:');

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

    // res.json({
    //   code: 0, data: {
    //     num: 123
    //   }
    // })
  });


}


module.exports = fun;