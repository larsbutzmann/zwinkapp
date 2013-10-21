var MessageModel = require('./model/message.js');

exports.writeMessages = function(data) {
    var message = new MessageModel({
        userName: data.userName,
        userId: data.userId.split("\"")[1],
        text: data.text
    });
    message.save(function(err) {
        if(!err) {
            return console.log('created');
        } else {
            return console.log(err);
        }
    });
};

exports.getMessages = function(request, response) {
    return MessageModel.find(function(err, data) {
        if (!err) {
            return response.send(data);
        } else {
            return console.log(err);
        }
    });
};

exports.postMessage = function(request, response) {
    console.log(request.body);
    console.log(request.user);
    var message = new MessageModel({
        userName: request.user.username,
        userId: request.user._id,
        text: request.body.text
    });
    message.save(function(err) {
        if(!err) {
            return console.log('created');
        } else {
            return console.log(err);
        }
    });
    return response.send(message);
};