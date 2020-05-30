const mongoose = require('mongoose');

const msgtonSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    index: true,
  },
  msg_id: {
    type: Number,
    required: true,
    index: true
  },
  date: {
    type: Date,
    index: true,
    required: true
  }
});

let MsgtonModel = mongoose.model('Msgton', msgtonSchema);

module.exports = MsgtonModel;

