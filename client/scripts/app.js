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

  var add_tweets = function(tweets, column) {
    var context;
    var tweet_html;
    var $tweet; 
    var $column = clear_tweets(column);
    var source = $("#tweet-template").html();
    var template = Handlebars.compile(source);

    for(var i = 0; i < tweets.length; i++){
      $tweet = $('<div id="tweet" style="clear: both;"></div>');
      context = {
        column_name: column
        ,user_name: tweets[i].user
        ,time: moment(tweets[i].created_at).fromNow()
        ,message: tweets[i].message
      };
      tweet_html = template(context);
      $tweet.html(tweet_html);
      $tweet.prependTo($column);
    }
  };
  
  setInterval(function(){
    var extractMessages = function(data){
      // console.dir(data);
      for(var i = 0; i <data.results.length; i++){
        $("#display").append(data.results[i].username + 
          " :" + data.results[i].text + "\n");
      }
    };

    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        extractMessages(data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to get new messages. ERR:' + data);
      }
    });
  }, 300);
});