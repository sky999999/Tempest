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
var rooms = {};
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
    var object = JSON.parse(message);
    if(object.type === 'pullmessages'){
      for(var i = 0; i < messages.length; i++){
        conn.write(messages[i]);
      }
    }else if(object.type === 'getusers'){
      var active = {};
      var i = 0;
      for(var user in rooms[object.room]){
        active[user] = 1;
        i++;
      }
      active.room = object.room;
      active.type = 'users';
      conn.write(JSON.stringify(active));
    }else if(object.type === 'join'){
      if(!rooms[object.room]){
        rooms[object.room] = {};
      }
      rooms[object.room][object.user] = conn;
      for(var user in rooms[object.room]){
        rooms[object.room][user].write('!update');
      }
    }else if(object.type === 'exit'){
      if(rooms[object.room]){
        delete rooms[object.room][object.user];
      }
      for(var user in rooms[object.room]){
        rooms[object.room][user].write('!update');
      }
    }else if(object.type === 'post'){
      if(messages.length > 500){
        messages.shift();
      }
      messages.push(message);

      for(var client in clients){
        clients[client].write(message);
      }
    }
  });
  conn.on('close', function(){
    delete clients[conn.id];
  });

});

server.installHandlers(app);
app.listen(config.port, config.address);
