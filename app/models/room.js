var mongoose = require('mongoose');

var schema = mongoose.Schema({
  roomid: {
    type: String,
    required: true
  },
  access: {
    type: String,
    default: 'public',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', schema);
