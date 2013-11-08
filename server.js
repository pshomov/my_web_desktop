var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/app'));

server.listen(3001);

io.sockets.on('connection', function(socket) {
    socket.emit('news', {
        hello: 'world'
    });
    setTimeout(function() {
        socket.emit('news', {
            hello: 'world'
        });
    }, 2000);
});