var sockjs = require('sockjs');
var express = require('./app.js');

var config = {
  port: process.env.OPENSHIFT_NODEJS_PORT || 8080,
  address: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
}

exports.listen = function(port, address){
  if(port !== undefined && !isNaN(port)){
    config.port = port;
  }
}

var app = require('http').createServer(express);

var clients = {};
var messages = [];

var server = sockjs.createServer({
  log: function(severity, message){
    if(severity === 'error') console.log('Error: ' + message);
  },
  prefix: '/tempest'
});

server.on('connection', function(conn){
  clients[conn.id] = conn;

  conn.on('data', function(message){

    if(message.charAt(0) === '!'){
      switch(message){
        case '!pullmessages':
          for(var i = 0; i < messages.length; i++){
            conn.write(messages[i]);
          }
          break;
        default:
          break;
      }
      return;
    }

    if(messages.length > 500){
      messages.shift();
    }
    messages.push(message);

    for(var client in clients){
      clients[client].write(message);
    }
  });
  conn.on('close', function(){
    delete clients[conn.id];
  });

});

server.installHandlers(app);
app.listen(config.port, config.address);
