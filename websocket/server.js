var server = require('http').createServer();
var io = require('socket.io')(server);

const Message = require('../model/MessageModel')

var clients = {};

io.on('connection', function(client){
    client.on("join", function(name){
        console.log("Joined: " + name);
        clients[client.id] = name;
        client.emit("update", "You have connected to the server.");
        client.broadcast.emit("update", name + " has joined the chat.")
    });

    client.on("send", function(msg){
        console.log(msg);
        Message.create(msg, (err, message) => {
            // TODO: Implement Error.
        })

        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function(){
        console.log("Disconnect");
        io.emit("update", clients[client.id] + " has left the chat.");
        delete clients[client.id];
    });
});

server.listen(3000, function() {
    console.log('Socket-Server running on port 3000')
});