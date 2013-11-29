var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, {
        log: false
    });
var _ = require('underscore');
var ps = require('psutil').PSUtil;

var update_clients = {
    update : function (data, event) {
        if (!(data instanceof Array)) data = [data];
        _(data).each(function(tweet) {
            io.sockets.emit(event, tweet);
        });
    }
}


app.use(express.static(__dirname + '/../app'));
app.use(express.static(__dirname + '/../.tmp'));

server.listen(3001);
var modules = [
    require('./twitter_mod')(update_clients), 
    require('./hackernews_mod')(update_clients), 
    require('./visir_mod')(update_clients), 
    require('./github_mod')(update_clients)
    ];

io.sockets.on('connection', function(socket) {

    function send_seed_items(data, event) {
        _(data).each(function(tweet) {
            socket.emit(event, tweet);
        })
    }

    _(modules).each(function(mod){
        send_seed_items(mod.cache.items, mod.event);
    });

});

setInterval(function() {
    new ps().cpu_percent(0.2, true, function(err, data) {
        if (!err)
            io.sockets.emit('cpu_percent', data);
    });
}, 2000);
