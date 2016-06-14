var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport){
  passport.serializeUser(function(user, done){
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done){
      User.findOne({'email': username}, function(err, user){
        if(err){
          return done(err);
        }
        if(!user){
          return done(null, false, req.flash('message', 'Incorrect username'));
        }
        if(!user.validPassword(password)){
          return done(null, false, req.flash('message', 'Incorrect password'));
        }
        return done(null, user);
      });
    }
  ));

  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done){
      process.nextTick(function(){
        var lcusername = req.body.username.toLowerCase();
        if(!lcusername.match(/^[0-9a-z]+$/)){
          return done(null, false, req.flash('message', 'Username contains illegal characters'));
        }
        if(password.length < 7){
          return done(null, false, req.flash('message', 'Your password is too short'));
        }
        if(username.prototype.indexOf('@') < 0){
          return done(null, false, req.flash('message', 'Email field was filled incorrectly'));
        }
        User.findOne({'email': username}, function(err, user){
          if(err){
            return done(err);
          }
          if(user){
            return done(null, false, req.flash('message', 'Email already in use'));
          }

          User.findOne({'username': lcusername}, function(err, user){
            if(err){
              return done(err);
            }
            if(user){
              return done(null, false, req.flash('message', 'Username already in use'));
            }

            var newUser = new User();
            newUser.username = lcusername;
            newUser.password = newUser.generateHash(password);
            newUser.email = username;
            newUser.firstname = req.body.firstname;
            newUser.lastname = req.body.lastname;
            newUser.privileges = 'None';

            newUser.save(function(err){
              if(err){
                return done(null, false, req.flash('message', 'Required parameters missing'));
              }
              return done(null, newUser);
            });
          });
        });
      });
    }
  ));
}
