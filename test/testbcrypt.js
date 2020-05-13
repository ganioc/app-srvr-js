const bcrypt = require('bcrypt');
const saltRounds = 10;


let passwd="123";

bcrypt.hash(passwd, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    // });
    console.log('hash:', hash);
    console.log('hash len:', hash.length);


	bcrypt.compare(passwd+'1', hash, function(err, result) {
    // result == true
  	console.log('compare result:', result);

	});
     
});
