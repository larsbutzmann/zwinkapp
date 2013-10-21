var socket = io.connect();
socket.on('message', function (data) {
  addMessage(data);
});

function addMessage(data) {
  var message;
  if (data.userName !== $.cookie("userName")) {
    message = "<div class='bubbledLeft'><strong class='message-space'>" + data.userName + ":</strong>" + data.text + "</div>";
  } else {
    message = "<div class='bubbledRight'>" + data.text + "</div>";
  }
  $("#conversation").append(message);
}

$( document ).ready(function() {

  $(".chat-menu").click(function() {
    if (window.location.hash === "") {
      $(this).removeAttr('data-direction');
    } else {
      $(this).attr('data-direction','reverse');
    }
  });

  $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/chat/message",
      success: function (data) {
        for (var i = 0; i < data.length; i++) {
          addMessage(data[i]);
        }
      }
  });

  function sendMessage() {
    var msg = $("#input-message").val();
    if (msg !== "") {
      var data = {
        userName: $.cookie("userName"),
        userId: $.cookie("userId"),
        text: msg
      };
      socket.emit("message", data);
      $("#input-message").val("");
    }
  }

  $("#btn-send").click(function() {
    sendMessage();
  });

});