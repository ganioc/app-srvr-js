let mongoose = require('mongoose');
let UserModel = require('./model/user.js');

let dbName = 'test';
let dbIp = 'localhost';
let dbPort = '27017';

function DB(argObj) {
  console.log('DB object:')
  console.log(argObj)

  this.db = null;

  mongoose.connect('mongodb://'
    + argObj.mongo_user
    + ':'
    + argObj.mongo_passwd
    + '@'
    + dbIp
    + ':'
    + dbPort
    + '/' + dbName,
    { useNewUrlParser: true },
    () => {
      console.log('Connection been made');
      console.log(dbIp, dbPort, dbName);
      this.db = mongoose.connection;

      this.db.on('error', err =>{
		console.log('err',err);
		});
	  this.db.on('connected', (err, res) =>{
		console.log('mongoose is connected');
	  });


    }).catch(err => {
      console.error('mongoose starting error:', err.stack);
      process.exit(1);
    });

}
DB.prototype.close = function () {
  console.log('db closed');
  this.db.close();
}
DB.prototype.cmdList = async function (args) {
  console.log('list:')
  await new Promise((resolve, reject) => {
	UserModel.find({}, function(err, users){
		if(err){
			console.log(err);
			return;
		}
		console.log(users);
	});
  });
};
DB.prototype.cmdAdd = function (args) {
  console.log('add')
	await new Promise((resolve, reject) => {


	});
}
DB.prototype.cmdDelete = function (args) {
  console.log('delete');
}

module.exports = DB;
