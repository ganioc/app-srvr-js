const mongoose = require('mongoose');

const msgtonSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  mobile: {
    type: String,
    required: true,
    index: true,
  },
  msg_id: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    index: true,
    required: true
  },
  status: {
    type: Number,
    index: true,

  }
});

let MsgtonModel = mongoose.model('Msgton', msgtonSchema);

module.exports = MsgtonModel;

