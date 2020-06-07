let mongoose = require('mongoose');
let UserModel = require('./model/user.js');
let UserInfoModel = require('./model/userinfo')
// const _ = require('lodash');
const bcrypt = require('bcrypt');
const getUser = require('./db/getUser')
const logger = require('./logger')
const util = require('util')

let dbIp = 'localhost';
let dbPort = '27017';
let dbName = 'test';

function DB(argObj) {
  logger.debug('DB object:')
  logger.debug(util.format('%o', argObj))

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

  logger.debug('uri: %s', uri);

  mongoose.connect(uri,
    { useNewUrlParser: true })
    .catch(error => {
      logger.error('Connection error')
      logger.error(util.format('%o', error))
      process.exit(1);
    })

  this.db = mongoose.connection;

  this.db.on('error', err => {
    console.log('err', err);
  });
  this.db.on('connected', () => {
    logger.debug('mongoose is connected with mongodb');
    logger.debug('%s %s %s', dbIp, dbPort, dbName);

  });

}
DB.prototype.close = function () {
  logger.debug('db closed');
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
  } else if (cmdname == 'create') {
    minArgLen = 2
  }

  if (args.length < minArgLen) {
    logger.debug('args.length:')
    logger.debug(args.length)
    err = 'wrong args num'
    return [err];
  }

  let cmd = args[0].toLowerCase();

  if (cmd === 'user') {
    model = UserModel;
  }
  else if (cmd === 'userinfo') {
    model = UserInfoModel;
  }
  else {
    logger.error('wrong cmd');
    err = 'wrong cmd no model'
    return [err];
  }

  // this is for command with extra args
  if (args.length > 1) {
    args.shift();
    logger.debug(util.format('%o', args));
    console.log(args)
    try {
      logger.debug('input args:')
      logger.debug(util.format('%o', args.join('')))
      modelObj = JSON.parse(args.join(''));
    } catch (e) {
      return ['wrong args JSON format']
    }
  }

  // modify modelObj
  logger.debug("modelObj:")
  logger.debug(util.format('%o', modelObj))

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
      logger.error(util.format('%o', err));
      cb('wrong find')
      return;
    }
    console.log(users);
    cb(null);
  });
};
DB.prototype.cmdAdd = function (args, cb) {
  logger.debug('add:')

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
        logger.error('Add failed');
        cb('op failed');
        return;
      }
      logger.debug(util.format('%o', instance));
      cb(null);
    });
}
DB.prototype.cmdDelete = function (args, cb) {
  logger.debug('delete');

  let arr = this.getModel('list', args);
  if (arr[0]) {
    cb(arr[0]);
    return;
  }
  let model = arr[1];
  let modelObj = arr[2];

  model.findOneAndDelete(
    modelObj,
    (err) => {
      if (err) {
        logger.error('Delete failed');
        cb('op failed');
        return;
      }
      logger.info("Deleted");
      cb(null);
    });
}

DB.prototype.cmdCreateUserinfo = async function (args, cb) {
  logger.debug('\ncreateUserinfo');
  let arr = this.getModel('create', args);
  if (arr[0]) {
    cb(arr[0]);
    return;
  }
  let model = arr[1];
  let modelObj = arr[2];

  let uname = modelObj.username;

  let fb = await getUser({ username: uname });
  if (fb.error) {
    logger.error('Can not find in User');
    cb(fb.error);
    return;
  } else {
    logger.debug('find in User')
    logger.debug(util.format('%o', fb.data))
  }
  modelObj.usertype = fb.data.usertype;
  modelObj.lastlogin = new Date();

  model.create(
    modelObj,
    (err, instance) => {
      if (err) {
        logger.error('create userinfo failed');
        cb(err);
        return;
      }
      logger.debug(util.format('%o', instance));
      logger.info('create userinfo succeed!')
      cb(null);
    }
  );
}

DB.prototype.cmdModify = () => {
  logger.debug('modify');


}

module.exports = DB;
