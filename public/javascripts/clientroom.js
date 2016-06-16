//Javascript for loading the main chat board

var todatetime = function(ms){
  var ctime = new Date();
  var dt = new Date(ms);
  if(dt.toDateString() == ctime.toDateString()){
    return dt.toLocaleTimeString();
  }
  return dt.toDateString();
};


var app = {
  initialize: function(){
    this.currentroom = $('#room').val();
    this.user = $('#user').val();
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
      self.socket.send(JSON.stringify({type: 'pullmessages', room: self.currentroom}));
      if(self.user){
        self.socket.send(JSON.stringify({type: 'join', 'user': self.user, room: self.currentroom}));
      }
    };
    this.socket.onmessage = function(message){
      self.receive(message.data);
    };
    this.socket.onclose = function(){
      //
    }
  },

  disconnect: function(){
    if(this.user){
      this.socket.send(JSON.stringify({type: 'exit', 'user': this.user, room: this.currentroom}));
    }
    this.socket.close();
  },

  send: function(message, user){
    var self = this;
    var data = {
      poster: user,
      room: self.currentroom,
      text: message,
      time: new Date().getTime(),
      type: 'post'
    };
    this.socket.send(JSON.stringify(data));
  },

  receive: function(data){
    var self = this;
    if(data === '!update'){
      this.socket.send(JSON.stringify({type: 'getusers', room: self.currentroom}))
      return;
    }

    var message = JSON.parse(data);

    if(message.room !== self.currentroom){
      return;
    }

    if(message.type === 'users'){
      $('#activeusers').empty();
      for(var user in message){
        if(user !== 'type' && user !== 'room'){
          $('#activeusers').append('<a href="/users/' + user + '">' + user + '</a><br>');
        }
      }
      return;
    }

    var user = message.poster;
    var text = message.text;
    text = text.replace(/</g, '&lt');
    text = text.replace(/>/g, '&gt');

    if(message.type === 'post'){
      var html = '<div></p><div class="messagetime">' + todatetime(message.time) + '</div><p class="message"><strong>' +
        user + '</strong> ' + text + '</p></div>';
      $('#messagebox').append(html);
      $('#messagebox').scrollTop(10000);
    }
  }
};


$(function(){
  var user = $('#user').val();
  app.initialize();
  app.connect();

  if(typeof user !== 'undefined'){
    $('#messageform').submit(function(){
      var message = $("#messageinput").val();
      if(message.length > 0){
        app.send(message, user);
        $('#messageinput').val('');
      }
      return false;
    });
  }

  window.onbeforeunload = function(e){
    app.disconnect();
    return null;
  }
});
