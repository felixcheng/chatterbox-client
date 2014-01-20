
var addMessages = function(data, display) {
  // debugger;
  var context;
  var messages = data.results;
  var message_html;
  var $message; 
  // var $display = clear_messages(display);
  var source = $("#message-template").html();
  var template = Handlebars.compile(source);

  for(var i = 0; i < messages.length; i++){
    $message = $('<div id="messageBox" style="clear: both;"></div>');
    context = {
      // display_name: display,
      user_name: messages[i].username,
      time: messages[i].updatedAt,
      message: messages[i].text
    };
    message_html = template(context);
    $message.html(message_html);
    $message.prependTo($('#display'));
  }
};

$(document).ready(function(){

  $("#submitButton").on('click', function(){
    var message = $("#message").val();
    if(message === "") return;
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  });
  
  setInterval(function(){
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: {sortid: '-updatedAt'},
      contentType: 'application/json',
      success: function (data) {
        addMessages(data, $('#display'));
      },
      error: function (data) {
        console.error('chatterbox: Failed to get new messages. ERR:' + data);
      }
    });
  }, 300);
});


// var extractMessages = function(data){
//   // console.dir(data);
//   for(var i = 0; i <data.results.length; i++){
//     $("#display").append(data.results[i].username + 
//       " :" + data.results[i].text + "\n");
//   }
// };
