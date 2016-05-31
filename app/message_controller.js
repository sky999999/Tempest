var User = require('../app/models/user')
var Message = require('../app/models/message');
var Room = require('../app/models/room');

var requireLogin =  function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

var requireOffline = function(req, res, next){
  if(req.isAuthenticated()){
    res.redirect('/login');
  }else{
    return next();
  }
}

exports.roomController = function(app){
  app.get('/rooms/:roomid', function(req, res, next){
    Room.findOne({roomid: req.params.roomid}, function(err, room){
      if(err){
        next(err);
      }
      if(room){
        /*todo: Check if the user is banned*/
        res.render('rooms/room', {roomid: req.params.roomid, user: req.user, exists: true});
      }else{
        res.render('rooms/room', {roomid: 'Error', user: req.user, exists: false});
      }
    });
  });

  app.get('/random', function(req, res){
    var roomid = '/';
    res.redirect(roomid);
  });

  app.get('/new', requireLogin, function(req, res){
    res.render('new', {message: req.flash('message')});
  });

  app.post('/new', requireLogin, function(req, res, next){
    Room.findOne({roomid: req.body.roomid}, function(err, room){
      if(err){
        next(err);
      }
      if(room){
        res.locals.message = req.flash('This room already exists. Please use another name');
        res.redirect('/new');
      }else{
        var newroom = new Room();
        newroom.roomid = req.body.roomid;
        newroom.access = req.body.access;
        newroom.description = req.body.description;
        newroom.save(function(err){
          if(err){
            res.locals.message = req.flash('Required parameters are missing');
            res.redirect('/new');
          }else{
            res.redirect('/rooms/' + req.body.roomid);
          }
        });
      }
    });
  });
};

exports.requireLogin = requireLogin;
exports.requireOffline = requireOffline;
