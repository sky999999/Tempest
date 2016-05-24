//Javascript for loading the main chat board

var app = {
  initialize: function(){
    this.currentroom = 'Main';
  },
  connect : function(){
    var constructSocket = function(){
      return new SockJS('/tempest');
    }
    this.socket = constructSocket();

    var socketopened = false;

    this.socket.onopen = function(){
      socketopened = true;
    };
    this.socket.onmessage = function(message){
      this.receive(message.data);
    };
    this.socket.onclose = function(){
      //
    }
  },

  send: function(data, room){
    this.socket.send(data);
  },

  receive: function(data){
    var message = JSON.parse(data);
    if(message.roomid !== this.currentroom){
      return;
    }

    if(message.type === 'post'){
      $('#messagebox').append('<p>' + message.text + '</p>');
      $('#messagebox').scrollTop(10000);
      console.log('message', message.text);
    }
  }
};

var sock = new SockJS('/tempest');
sock.onopen = function() {
  console.log('open');
};
sock.onmessage = function(e) {
  $('#messagebox').append('<p>' + e.data + '</p>');
  $('#messagebox').scrollTop(10000);
  console.log('message', e.data);
};
sock.onclose = function() {
  console.log('close');
};

$(function(){
  var user = $('#user').val();
  if(typeof user !== 'undefined'){
    $('#messageform').submit(function(){
      sock.send($('#messageinput').val());
      $('#messageinput').val('');
      return false;
    });
  }

});
