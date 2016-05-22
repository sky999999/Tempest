//Javascript for loading the main chat board
$(function(){
  console.log($('#user').val());

  var sock = new SockJS('http://localhost:3000/tempest');
  sock.onopen = function() {
    console.log('open');
  };
  sock.onmessage = function(e) {
    console.log('message', e.data);
  };
  sock.onclose = function() {
    console.log('close');
  };

  $('#send').click(function(){
    sock.send('Hello');
  });

});
