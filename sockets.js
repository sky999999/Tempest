'use strict';

let sockjs = require('sockjs');
let express = require('./app.js');

let config = {
  port: process.env.OPENSHIFT_NODEJS_PORT || 8080,
  address: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
}

exports.listen = (port, address) => {
  if(port !== undefined && !isNaN(port)){
    config.port = port;
  }
}

let app = require('http').createServer(express);

let clients = {};

let messages = [];

let server = sockjs.createServer({
  log: (severity, message) => {
    if(severity === 'error') console.log('Error: ' + message);
  },
  prefix: '/tempest'
});

server.on('connection', (conn) => {
  clients[conn.id] = conn;

  conn.on('data', (message) => {

    if(message.charAt(0) === '!'){
      switch(message){
        case '!pullmessages':
          for(let i = 0; i < messages.length; i++){
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

    for(let client in clients){
      clients[client].write(message);
    }
  });
  conn.on('close', () => {
    delete clients[conn.id];
  });

});

server.installHandlers(app);
app.listen(config.port, config.address);
