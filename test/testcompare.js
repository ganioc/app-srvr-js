
const bcrypt = require('bcrypt');
const saltRounds = 10;

let password = "$2b$10$hm4XAc/v84wg5PH6LT8Vw.Q3i1706LVDKp.wA5gmbhP1lqBQSijrq"

bcrypt.compare("123", password, function (err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log(result)
  }
})