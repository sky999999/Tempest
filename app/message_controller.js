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
        res.render('room', {roomid: req.params.roomid, description: room.description, user: req.user, exists: true});
      }else{
        res.render('room', {roomid: 'Error', description: '', user: req.user, exists: false});
      }
    });
  });

  app.get('/random', function(req, res){
    var roomid = '/';
    res.redirect(roomid);
  });

  app.get('/search/:roomid', function(req, res){
    var query = req.params.roomid.toLowerCase();
    Room.find({roomid: new RegExp(query)}, function(err, docs){
      if(err){
        res.send(null);
      }else if(docs){
        var rooms = {};
        for(var i = 0; i < 4 && i < docs.length; ++i){
          rooms['_' + i] = docs[i];
        }
        res.json(rooms);
      }else{
        console.log('No such room found');
        res.json(null);
      }
    });
  });

  app.get('/new', requireLogin, function(req, res){
    res.render('new', {message: req.flash('message')});
  });

  app.post('/new', requireLogin, function(req, res, next){
    var roomid = req.body.roomid.toLowerCase();
    Room.findOne({roomid: roomid}, function(err, room){
      if(err){
        next(err);
      }
      if(room){
        res.locals.message = req.flash('This room already exists. Please use another name');
        res.redirect('/new');
      }else{
        var newroom = new Room();
        newroom.roomid = roomid;
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
