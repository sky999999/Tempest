//Javascript for loading the main chat board

var app = {
  initialize: function(){
    this.currentroom = 'Main';
  },
  connect : function(){
    var self = this;
    var constructSocket = function(){
      return new SockJS('/tempest');
    }
    this.socket = constructSocket();

    var socketopened = false;

    this.socket.onopen = function(){
      socketopened = true;
    };
    this.socket.onmessage = function(message){
      self.receive(message.data);
    };
    this.socket.onclose = function(){
      //
    }
  },

  send: function(message, user){
    var data = {
      poster: user,
      room: this.currentroom,
      text: message,
      type: 'post'
    }
    this.socket.send(JSON.stringify(data));
  },

  receive: function(data){
    var message = JSON.parse(data);

    if(message.room !== this.currentroom){
      return;
    }
    var user = message.poster;

    if(message.type === 'post'){
      $('#messagebox').append('<p><strong>' + user + '</strong> ' + message.text + '</p>');
      $('#messagebox').scrollTop(10000);
      console.log('message', message.text);
    }
  }
};

app.initialize();
app.connect();

$(function(){
  var user = $('#user').val();

  if(typeof user !== 'undefined'){
    $('#messageform').submit(function(){
      app.send($('#messageinput').val(), user);
      $('#messageinput').val('');
      return false;
    });
  }

});
