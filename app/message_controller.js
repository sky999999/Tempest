var Message = require('../app/models/message');
var Board = require('../app/models/board');

module.exports = function(app){
  app.post('/message', function(req, res){
    var message = Message();
    message.boady = req.body.board;
    message.user = req.user.username;
    message.text = req.body.text;
    message.save();
  });

  app.put('/message', function(req, res){
    Message.findOne({board: req.body.board}).sort({time: -1}).exec(function(err, message){
      res.send(message);
    });
  });
}
