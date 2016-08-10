var express = require('express'),
    app = express(),
    debug = require('debug')('desktop');
server = require('http').createServer(app),
    rss = require('./rss_mod');
io = require('socket.io').listen(server, {
    log: false
});
var _ = require('underscore');

var update_clients = {
    update: function (data, event) {
        if (!(data instanceof Array)) data = [data];
        _(data).each(function (tweet) {
            debug(`sending ${JSON.stringify(tweet)} for ${event}`)
            io.sockets.emit(event, tweet);
        });
    }
}


app.use(express.static(__dirname + '/../app'));
// app.use(express.static(__dirname + '/../.tmp'));

server.listen(3001);
var twit = require('./../twitter_api_keys');

var modules = [
    require('./twitter_mod1')(update_clients),
    rss(update_clients, 'https://theringer.com/feed', 'theringer'),
    rss(update_clients, 'http://bleacherreport.com/articles/feed', 'bleachreport'),
    rss(update_clients, 'https://news.ycombinator.com/rss', 'hackernews'),
    require('./reddit_mod')('compsci', update_clients),
    rss(update_clients, twit.github_timeline_url, 'github', item => {
        item.mediathumbnail = item['media:thumbnail'];
        delete item['media:thumbnail'];
        return item;
    })
];

io.sockets.on('connection', function (socket) {

    function send_seed_items(data, event) {
        _(data).each(function (tweet) {
            socket.emit(event, tweet);
        })
    }

    _(modules).each(function (mod) {
        send_seed_items(mod.cache.getItems(), mod.event);
    });

});

// setInterval(function() {
//     new ps().cpu_percent(0.2, true, function(err, data) {
//         if (!err)
//             io.sockets.emit('cpu_percent', data);
//     });
// }, 2000);
