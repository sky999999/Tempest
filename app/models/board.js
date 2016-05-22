var mongoose = require('mongoose');

var schema = mongoose.Schema({
  name: String,
  access: {type: String, default: 'Public'},
  date_created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Board', schema);
