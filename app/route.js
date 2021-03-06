var User = require('../app/models/user');
var messageController = require('../app/message_controller.js');
var requireLogin = messageController.requireLogin;
var requireOffline = messageController.requireOffline;

module.exports = function(app, passport){

  app.get('/', function(req, res){
    res.render('index', {user: req.user});
  });

  app.get('/login', requireOffline, function(req, res){
    res.render('login', {message: req.flash('message'), user: req.user});
  });

  app.get('/signup', requireOffline, function(req, res){
    res.render('signup', {message: req.flash('message'), user: req.user});
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/users/:id', function(req, res, next){
    User.findOne({username: req.params.id}, function(err, profile){
      if(err){
        next(err);
      }
      if(profile){
        res.render('user', {user: req.user, profile: profile});
      }else{
        next();
      }
    });
  });

  app.post('/users/edit', function(req, res, next){
    if(req.body.firstname.length <= 0 || req.body.lastname.length <= 0){
      res.redirect('/users/' + req.body.username);
    }else{
      User.findById(req.body.id, function(err, profile){
        if(err){
          next(err);
        }
        if(profile){
          profile.firstname = req.body.firstname;
          profile.lastname = req.body.lastname;
          profile.description = req.body.description;
          profile.save();
        }
        res.redirect('/users/' + req.body.username);
      });
    }
  });

  app.get('/settings', requireLogin, function(req, res){
    res.render('settings', {user: req.user});
  });

  app.post('/settings', function(req, res){
    User.findOne({username: req.user.id}, function(err, profile){
      if(err){
        next(err);
      }
      profile.firstname = req.body.firstname;
      profile.lastname = req.body.lastname;
      profile.description = req.body.description;
      profile.save(function(err){
        if(err){
          next(err);
        }
        res.render('/settings', {user: req.user});
      });
    });
  });

  app.delete('/users/:id', function(req, res){
    User.remove({username: req.params.id}, function(err){
      if(err){
        next(err);
      }
      res.redirect('/');
    });
  });

  app.get('/notifications', requireLogin, function(req, res){
    res.render('notify', {user: req.user});
  });

  messageController.roomController(app);

};
