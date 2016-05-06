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

  app.get('/users/:id', function(req, res){
    var profile = User.findById(req.params.id);
    res.render('user', {user: req.user, profile: profile});
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
