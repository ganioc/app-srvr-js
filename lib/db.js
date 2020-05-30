let mongoose = require('mongoose');
let UserModel = require('./model/user.js');
const _ = require('lodash');
const bcrypt = require('bcrypt');


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
DB.prototype.getModel = function (cmdname, args) {
  let model = null;
  let modelObj = null;
  let err = '';
  let minArgLen = 0;

  if (args.length === 0 || args[0] === undefined) {
    err = 'Wrong args length'
    return [err, model];
  }

  if (cmdname === 'list') {
    minArgLen = 1;
  } else if (cmdname === 'add') {
    minArgLen = 2;
  } else if (cmdname === 'delete') {
    minArgLen = 2;
  }

  if (args.length < minArgLen) {
    err = 'wrong args num'
    return [err];
  }

  let cmd = args[0].toLowerCase();

  if (cmd === 'user') {
    model = UserModel;
  } else {
    console.error('wrong cmd');
    err = 'wrong cmd no model'
    return [err];
  }

  // this is for command with extra args
  if (args.length > 1) {
    args.shift();
    console.log(args);
    try {
      console.log('input args:')
      console.log(args.join(''))
      modelObj = JSON.parse(args.join(''));
    } catch (e) {
      return ['wrong args format']
    }
  }

  // modify modelObj
  console.log("modelObj:")
  console.log(modelObj)

  return ['', model, modelObj];
}
DB.prototype.cmdList = function (args, cb) {
  console.log('list:')

  let arr = this.getModel('list', args);

  if (arr[0]) {
    cb(arr[0]);
    return;
  }
  let model = arr[1];

  model.find({}, function (err, users) {
    if (err) {
      console.log(err);
      cb('wrong find')
      return;
    }
    console.log(users);
    cb(null);
  });
};
DB.prototype.cmdAdd = function (args, cb) {
  console.log('add:')

  let arr = this.getModel('list', args);
  if (arr[0]) {
    cb(arr[0]);
    return;
  }
  let model = arr[1];
  let modelObj = arr[2];
  // modify modelObj
  if (!modelObj.password) {
    cb('No password');
    return;
  }
  else {
    modelObj.password = bcrypt.hashSync(modelObj.password, 10);
  }
  modelObj.createdate = new Date();
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
DB.prototype.cmdDelete = function (args, cb) {
  console.log('delete');

  let arr = this.getModel('list', args);
  if (arr[0]) {
    cb(arr[0]);
    return;
  }
  let model = arr[1];
  let modelObj = arr[2];

  model.findOneAndDelete(
    modelObj,
    (err, instance) => {
      if (err) {
        console.log('Delete failed');
        cb('op failed');
        return;
      }
      console.log("Deleted");
      cb(null);
    });
}

DB.prototype.cmdModify = function (args, cb) {
  console.log('modify');

}

module.exports = DB;
