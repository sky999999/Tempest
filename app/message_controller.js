var Message = require('../app/models/message');
var Room = require('../app/models/room');

module.exports = function(app){
  app.get('/rooms/:roomid', function(req, res, next){
    Room.findOne({roomid: req.params.roomid}, function(err, room){
      if(err){
        next(err);
      }
      if(room){
        //Check if the user is banned
        res.render('room', {roomid: req.params.roomid, user: req.user, exists: true});
      }else{
        res.render('room', {roomid: 'Error', user: req.user, exists: false});
      }
    });
  });

  app.get('/new', function(req, res){
    res.render('new');
  });

  app.post('/new', function(req, res, next){
    Room.findOne({roomid: req.body.roomid}, function(err, room){
      if(err){
        next(err);
      }
      if(room){
        res.render('new', {message: 'Room already exists'});
      }else{
        res.redirect('/rooms/' + req.body.roomid);
      }
    });
  });
}
