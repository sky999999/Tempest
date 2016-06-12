//All

var todatetime = function(ms){
  var ctime = new Date();
  var dt = new Date(ms);
  if(dt.toDateString() == ctime.toDateString()){
    return dt.toLocaleTimeString();
  }
  return dt.toDateString();
};

$(function(){

  var user = $('#user').val();

  $('#results').hide();
  $('#search').on('change keyup paste', function(){
    var text = $('#search').val();
    if(text === ''){
      $('#results').empty();
      $('#results').hide();
    }else{
      $.get('/search/' + text, function(matches){
        $('#results').empty();
        if(matches){
          for(var k in matches){
            var match = matches[k];
            var description = match.description;
            if(description.length > 40){
              description = description.substr(0, 37) + '...';
            }
            $('#results').append('<a class="result" href="/rooms/' + match.roomid + '"><strong>' + match.roomid + '</strong><br><small>' + description + '</small></a>');
          }
        }
        $('#results').append('<div class="separator"></div>');
        $('#results').append('<a class="prompt" href="">Search for ' + text + '</a>');$
        $('#results').show();
      });
    }
  });

});
