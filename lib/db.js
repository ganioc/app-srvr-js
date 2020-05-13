let mongoose = require('mongoose');
let UserModel = require('./model/user.js');


let dbIp = 'localhost';
let dbPort = '27017';
let dbName = 'test';

function DB(argObj) {
  console.log('DB object:')
  console.log(argObj)

  this.db = null;

  let header = '';
  if (process.env.NODE_ENV === 'local') {
    header = '';
  } else {
    header = argObj.mongo_user + ':'
      + encodeURIComponent(argObj.mongo_passwd) + '@';
  }

  let uri = 'mongodb://'
    + header
    + dbIp
    + ':'
    + dbPort
    + '/' + dbName;

  console.log('uri:');
  console.log(uri);

  mongoose.connect(uri,
    { useNewUrlParser: true })
    .catch(error => {
      console.log('Connection error')
      console.log(error);
      process.exit(1);
    })

  this.db = mongoose.connection;

  this.db.on('error', err => {
    console.log('err', err);
  });
  this.db.on('connected', (err, res) => {
    console.log('mongoose is connected');
    console.log('Connection been made');
    console.log(dbIp, dbPort, dbName);

  });

}
DB.prototype.close = function () {
  console.log('db closed');
  this.db.close();
}
DB.prototype.cmdList = async function (args) {
  console.log('list:')
  await new Promise((resolve, reject) => {
    UserModel.find({}, function (err, users) {
      if (err) {
        console.log(err);
        reject();
      }
      console.log(users);
      resolve();
    });
  });
};
DB.prototype.cmdAdd = async function (args) {
  console.log('add')
  await new Promise((resolve, reject) => {
    UserModel.create({
      username: 'xiaoming',
      email: 'xm@mail.com',
      password: 'xoy123',
      role: 1
    }, (err, instance) => {
      if (err) {
        console.log('Add failed');
        reject('error');
        return;
      }
      console.log(instance);
      resolve();
    });

  });
}
DB.prototype.cmdDelete = function (args) {
  console.log('delete');
}

module.exports = DB;
