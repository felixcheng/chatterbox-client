
var ChatBox = Backbone.Model.extend({
  initialize: function(){
    var regex = new RegExp(/username=([^&]+)/g);
    var url = document.URL;
    this.set({roomname: "all",
              roomList: {},
              friends: {},
              messageList: [],
              userName: regex.exec(url)[1]
            });
  },
  submit: function(message){
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify({username: this.get('userName'),
                            text: message,
                            roomname: roomname}),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  getMessage: function(options){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      //to apply restriction on data received (eg. sort, limit), 
      //pls create an object under data.
      data: {order:'-createdAt'},
      contentType: 'application/json',
      success: options.success,
      error: function (data) {
        console.error('chatterbox: Failed to get new messages. ERR:' + data);
      }
    });
  }
});

// TODO: clear out roomList periodically
// $(document).ready(function(){
var ChatBoxView = Backbone.View.extend({
  initialize: function(){
    $("body").on("click", '#user', function(){
      friends[this.textContent] = !friends[this.textContent];
    });
    var updateRoomname = function(room){
      $('h3').text("You are in room: " + room);
      roomname = room;
    };
    $('body').on("click", '.room', function(){
      updateRoomname(this.textContent);
    });
    $("#createRoomButton").on('click', function(){
      updateRoomname($('#newRoomInput').val());
    });
    $("#submitButton").on('click', function(){
      var message = $("#userInput").val();
      if(message === "") return;
      submit(userName, message);
    });
    var options = {
      model: this.model,
      success:function (data) {
                var messages = data.results
                $('#messages').html("");
                this.displayMessages(messages);
                this.buildRoomList(messages, roomList, $('#rooms'));
              }.bind(this),
      failure: function(data){console.log("Failed to get messages")}
            };
    setInterval(this.model.getMessage.bind(this.model,options), 300);
  },
  displayMessages: function(messages) {
    var context;
    var message_html;
    var $messageBox; 
    var room = this.model.get('roomname');
    var source = $("#message-template").html();
    var template = Handlebars.compile(source);
    for(var i = 0; i < messages.length; i++){
      $messageBox = $('<div id="messageBox"></div>');
      if(messages[i].text && messages[i].text.length > 5000 ||
         (messages[i].roomname !== room && room !== "all")){
        continue;
      }
      context = {
        user_name: messages[i].username,
        time: messages[i].updatedAt,
        message: messages[i].text
      };
      message_html = template(context);
      $messageBox.html(message_html);
      if(this.model.get('friends')[messages[i].username]){
        $messageBox.addClass('friend');
      }
      $messageBox.appendTo($('#messages'));
    }
  },
  buildRoomList: function(data, roomListModel, $roomListView){
    debugger;
    _.each(data, function(value){
      if (!roomListModel[value.roomname]){
        roomListModel[value.roomname] = true;
        var $roomnameView = $('<ul class="room"></ul>');
        $roomnameView.text(value.roomname);
        $roomListView.append($roomnameView);
      }
    })
  }
});

var chatBox = new ChatBox();
var chatBoxView = new ChatBoxView({model:chatBox});

$('body').append(chatBoxView.render());