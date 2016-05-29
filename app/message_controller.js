var Message = require('../app/models/message');
var Room = require('../app/models/room');

module.exports = function(app){
  app.get('/rooms/:id', function(req, res){
    Room.findOne({roomid: req.body.roomid}, function(err, message){
      res.render('room', {roomid: req.body.roomid});
    });
  });
}
