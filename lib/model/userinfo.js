const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    dropDups: true,
    unique: true,
    index: true
  },
  usertype: {
    type: String,
    required: true,
    index: true
  },
  lastlogin: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true,
    index: true
  },
  tag: {
    type: String,

  },
  undelivered: {
    type: Number,
    min: 0,
  },
  delivered: {
    type: Number,
    min: 0,
  },
  submitted: {
    type: Number,
    min: 0
  },
  unused: {
    type: Number,
    min: 0
  }
});

let UserInfoModel = mongoose.model('UserInfo', userInfoSchema);

module.exports = UserInfoModel;