var api = require("./api.js");

module.exports = function (io) {

  io.sockets.on('connection', function (socket) {

    socket.on('message', function (data) {
      api.writeMessages(data);
      io.sockets.emit("message", data);
    });
  });

};