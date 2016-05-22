//Javascript for loading the main chat board
var sock = new SockJS('/tempest');
sock.onopen = function() {
  console.log('open');
};
sock.onmessage = function(e) {
  $('#messagebox').append('<p>' + e.data + '</p>');
  console.log('message', e.data);
};
sock.onclose = function() {
  console.log('close');
};

$(function(){
  console.log($('#user').val());
  $('#messageform').submit(function(){
    sock.send($('#messageinput').val());
    $('#messageinput').val('');
    return false;
  });

});
