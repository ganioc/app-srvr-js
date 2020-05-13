let mongoose = require('mongoose');

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
    }).catch(err => {
      console.error('mongoose starting error:', err.stack);
      process.exit(1);
    });

}
DB.prototype.close = function () {
  console.log('db closed');
  this.db.close();
}
DB.prototype.cmdList = function (args) {
  console.log('list:')
};
DB.prototype.cmdAdd = function (args) {
  console.log('add')
}
DB.prototype.cmdDelete = function (args) {
  console.log('delete');
}

module.exports = DB;
