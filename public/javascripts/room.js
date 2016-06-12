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
      self.socket.send('!pullmessages');
    };
    this.socket.onmessage = function(message){
      self.receive(message.data);
    };
    this.socket.onclose = function(){
      //
    }
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
    var message = JSON.parse(data);

    if(message.room !== this.currentroom){
      return;
    }

    var user = message.poster;
    var text = message.text;
    text = text.replace(/</g, '&lt');
    text = text.replace(/>/g, '&gt');

    if(message.type === 'post'){
      var html = '<div></p><div class="messagetime">' + todatetime(message.time) + '</div><div class="message"><strong>' +
        user + '</strong> ' + text + '</div></div>';
      $('#messagebox').append(html);
      $('#messagebox').scrollTop(10000);
    }
  }
};

app.connect();

$(function(){
  app.initialize();

  var user = $('#user').val();

  for(var i = 0; i < 5; ++i){
    $('#popular').append('<a><strong>New room</strong></a><br><p>Description.txt</p>');
  }

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

});
