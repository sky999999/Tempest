var mongoose = require('mongoose');

var schema = mongoose.Schema({
  board: {type: String, ref: 'Person'},
  user: String,
  text: String,
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', schema);
