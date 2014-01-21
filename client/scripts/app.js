var roomname = "";
var roomList = {};

var displayMessages = function(messages, display, roomname) {
  var context;
  var message_html;
  var $message; 
  // var $display = clear_messages(display);
  var source = $("#message-template").html();
  var template = Handlebars.compile(source);

  display.html("");

  for(var i = 0; i < messages.length; i++){
    $message = $('<div id="messageBox"></div>');
    if(messages[i].text && messages[i].text.length > 5000 ||
       (messages[i].roomname !== roomname && roomname)){
      continue;
    }
    context = {
      // display_name: display,
      user_name: messages[i].username,
      time: messages[i].updatedAt,
      message: encodeHTML(messages[i].text)
    };
    message_html = template(context);
    $message.html(message_html);
    $message.appendTo($('#messages'));
  }
};

function encodeHTML(string) {
  string =  string || "";
  return string.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&rt;')
               .replace(/"/g, '&quot;');
};

// TODO: clear out roomList periodically
var buildRoomList = function(data, roomListModel, $roomListView){
  _.each(data, function(value){
    if (!roomListModel[value.roomname]){
      roomListModel[value.roomname] = true;
      $roomListView.append('<ul class="room">'+value.roomname+"</ul>");
    }
  })
};

var updateRoomname = function(roomname){
  $('h3').text("You are in room: " + roomname);
  if(roomname === 'all'){
    roomname = undefined;
  }
};

$(document).ready(function(){

  var url = document.URL;
  var regex = new RegExp(/username=([^&]+)/g);
  // debugger;
  var userName = regex.exec(url)[1];

  $("body").on("click", '.user', function(){
    console.log("user clicked");
  });

  $('body').on("click", '.room', function(){
    updateRoomname(this.textContent);
    console.log("TEST!!");
  });

  $("#createRoomButton").on('click', function(){
    updateRoomname($('#newRoomInput').val());
  });

  $("#submitButton").on('click', function(){
    var message = $("#userInput").val();
    if(message === "") return;
    // debugger;
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify({username: userName,
                            text: message,
                            roomname: "testicles"}),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        debugger;
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  });

  setInterval(function(){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      //to apply restriction on data received (eg. sort, limit), 
      //pls create an object under data.
      data: {order:'-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        var messages = data.results
        displayMessages(messages, $('#messages'), roomname);
        buildRoomList(messages, roomList, $('#rooms'));
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
