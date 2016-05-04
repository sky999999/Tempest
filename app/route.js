module.exports = function(app, passport){

  app.get('/', function(req, res){
    if(isLoggedIn(req)){
      res.render('index', {signedin: true, user: req.user});
    }else{
      res.render('index', {signedin: false});
    }
  });

  app.get('/login', function(req, res){
    if(isLoggedIn(req)){
      res.redirect('/');
    }else{
      res.render('login', {message: req.flash('message'), signedin: false, user: req.user});
    }
  });

  app.get('/signup', function(req, res){
    if(isLoggedIn(req)){
      res.redirect('/');
    }else{
      res.render('signup', {message: req.flash('message'), signedin: false, user: req.user});
    }
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

};

function isLoggedIn(req){
  return req.isAuthenticated();
}
