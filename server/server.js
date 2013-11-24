var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, {
        log: false
    });
var _ = require('underscore');
var twitterAPI = require('node-twitter-api');
var ps = require('psutil').PSUtil;
var FeedSub = require('feedsub');

var twit = require('./../twitter_api_keys');


app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/.tmp'));

server.listen(3001);

io.sockets.on('connection', function(socket) {

    function send_seed_items(data, event) {
        _(data).each(function(tweet) {
            socket.emit(event, tweet);
        })
    }

    send_seed_items(twitter_cache.cache.items, 'news');
    send_seed_items(d.cache.items, 'rss');

});

setInterval(function() {
    new ps().cpu_percent(0.2, true, function(err, data) {
        if (!err)
            io.sockets.emit('cpu_percent', data);
    });
}, 2000);

function send_tweets(data, event) {
    if (!(data instanceof Array)) data = [data];
    _(data).each(function(tweet) {
        io.sockets.emit(event, tweet);
    })
}

var twitter_cache = function () {
   var tweets_cache = {items : []};

   var twitter = new twitterAPI({
        consumerKey: twit.consumer_key,
        consumerSecret: twit.consumer_secret,
        callback: 'http://yoururl.tld/something'
    });
    twitter.getTimeline("home", {},
        twit.access_token_key,
        twit.access_token_secret,
        function(error, data, response) {
            if (error) {
                console.log(error);
            } else {
                console.log('getting timeline data: ');
                // console.dir(data);
                data.reverse();
                data.slice(5);
                tweets_cache.items = data;
                send_tweets(tweets_cache.items, 'news');
            }
        }
    );
    var tw = twitter.getStream('user', {},
        twit.access_token_key,
        twit.access_token_secret,
        function(error, data, response) {
            if (error) {
                console.log(error);
                console.log('response is: ' + response);
            } else {
                if (data.text !== undefined) {
                    console.log('getting stream data');
                    tweets_cache.items.push(data);
                    tweets_cache.items.slice(0, -5);
                    send_tweets(data, 'news');
                }
            }
        },
        function() {
            console.log('End of stream');
        }
    );
    tw.addListener('error', function(res) {
        console.log('twitter stream');
        console.dir(res);
    });

    return {
        cache : tweets_cache
    }
}();

var d = function (){
    var rss_cache = { items : []};

    var reader = new FeedSub(twit.github_timeline_url, {
        emitOnStart: true,
        interval: 1 // check feed every 10 minutes
    });

    reader.on('item', function(item) {
        console.log('rss');
        rss_cache.items.push(item);
        send_tweets(item, 'rss');
    });

    reader.on('error', function(err) {
        console.log('Error reading the feed: ' + err);
    });

    reader.start();
    return {
        cache : rss_cache
    }
}();