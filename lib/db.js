let mongoose = require('mongoose');
let UserModel = require('./model/user.js');
const _ = require('lodash');

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
DB.prototype.cmdList = function (args, cb) {
  console.log('list:')

  if (args.length === 0 || args[0] === undefined) {
    cb('Wrong args');
    return;
  }
  let cmd = args[0].toLowerCase();

  if (cmd === 'user') {
    UserModel.find({}, function (err, users) {
      if (err) {
        console.log(err);
        cb('wrong find')
        return;
      }
      console.log(users);
      cb(null);
    });
  } else {
    console.error('wrong cmd');
    cb('wrong cmd')
    return;
  }
};
DB.prototype.cmdAdd = function (args, cb) {
  console.log('add:')

  if (args.length < 2) {
    cb('wrong args');
    return;
  }

  let model = null;
  if (args[0] === 'user') {
    model = UserModel;
  } else {
    cb('wrong model name');
    return;
  }

  // 
  args.shift();
  console.log(args);
  let modelObj = null;
  try {
    console.log('input args:')
    console.log(args.join(''))
    modelObj = JSON.parse(args.join(''));
  } catch (e) {
    cb('wrong args format');
    return;
  }
  model.create(
    modelObj,
    (err, instance) => {
      if (err) {
        console.log('Add failed');
        cb('op failed');
        return;
      }
      console.log(instance);
      cb(null);
    });
}
DB.prototype.cmdDelete = function (args) {
  console.log('delete');
}

module.exports = DB;
