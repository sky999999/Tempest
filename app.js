var express = require('express');
var sockjs = require('sockjs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var helpers = require('express-helpers')
var partials = require('express-partials');
var flash = require('connect-flash');
var dbConfig = require('./config/db.js');
var mongoose = require('mongoose');

var routes = require('./app/route');
var passportConfig = require('./config/passport');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
helpers(app);
app.use(partials());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(dbConfig.url, err => {
  require('child_process').exec('mongod');
  mongoose.connect(dbConfig.url);
});

passportConfig(passport);
app.use(session({secret: 'secretKey', resave: true, saveUninitialized: true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var server = sockjs.createServer({
  log: (severity, message) => {
    if(severity === 'error') console.log('Error: ' + message);
	},
  prefix: '/tempest',
});
server.on('connection', conn => {
  conn.on('data', message => {
    conn.write(message);
  });
  conn.on('close', () => {});
});

var httpServer = require('http').createServer(app);
server.installHandlers(httpServer);
httpServer.listen(port);

module.exports = app;
