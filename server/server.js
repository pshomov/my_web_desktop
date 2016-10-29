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


if (process.env.DEBUG){
    debug('Starting in DEV mode');
    var webpackDevServer = require('webpack-dev-server');
    var webpack = require('webpack');
    var config = require("../webpack.config.js");
    config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    var compiler = webpack(config);
    var devServer = new webpackDevServer(compiler, {
        hot: true,
        contentBase: 'src/',
        inline: true,
        noInfo: true,
        publicPath: "/app/",
        stats: {
            colors: true
        }  
    });
    compiler.plugin('compile', function() {
        debug('Bundling...');
    });
    compiler.plugin('done', function() {
        debug('Bundled.');
    });  
    devServer.listen(8080);

    var httpProxy = require('http-proxy');

    var proxy = httpProxy.createProxyServer({});
    app.all('/app/*', function (req, res) {
        proxy.web(req, res, {
            target: 'http://localhost:8080'
        });
    });
    proxy.on('error', function(e) {
        debug('Could not connect to proxy, please try again...');
    });
} else {
    app.use('/app', express.static(__dirname + '/../dist'));
}

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
