var User = require('../app/models/user');

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

  app.get('/users', function(req, res){
    res.render('/users/user');
  });

  app.get('/users/:id', function(req, res){
    User.findOne({username: req.params.id}, function(err, profile){
      if(err){
        next(err);
      }
      res.render('user', {user: req.user, profile: profile});
    });
  });

  app.get('/settings', requireLogin, function(req, res){
    res.render('/settings', {user: req.user});
  });

  app.post('/account', function(req, res){
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
        res.render('/users/:id');
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

};

function requireLogin(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function requireOffline(req, res, next){
  if(req.isAuthenticated()){
    res.redirect('/');
  }else{
    return next();
  }
}
