var socket = io.connect();
socket.on('message', function (data) {
  addMessage(data);
});

function addMessage(data) {
  var message = "<p><strong>" + data.userName + "</strong>:" + data.text + "</p>";
  $("#conversation").append(message);
}

$( document ).ready(function() {

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