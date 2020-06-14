const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  msg_id: {
    type: String,
    required: false,
    index: true
  },
  batch_id: {
    type: String,
    required: true,
    index: true
  },
  x_id: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: Number,
    index: true,
    required: true
  },
  date: {
    type: Date,
    index: true,
    required: true
  },
  deliverdate: {
    type: Date,
    index: true,
    required: true
  },
  submitted: {
    type: Boolean,
    index: true,
    required: true
  },
  delivered: {
    type: Boolean,
    index: true,
    required: true
  },
  mobiles: {
    type: [String],
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

let MsgModel = mongoose.model('Msg', msgSchema);

module.exports = MsgModel;

