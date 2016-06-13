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
  creator: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  moderators: {
    type: [String]
  },
  banned: {
    type: [String]
  }
});

module.exports = mongoose.model('Room', schema);
