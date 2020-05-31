let UserModel = require('../../model/user.js');
const authJWT = require('../jwt')

let fun = (router) => {
  router.get('/api/admin/users', authJWT, (req, res) => {
    console.log('/api/admin/users:');

    res.json({
      code: 0, data: {
        num: 123
      }
    })
  });


}


module.exports = fun;