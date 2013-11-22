var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, { log: false });
var _ = require('underscore');
var twitterAPI = require('node-twitter-api');
var ps = require('psutil').PSUtil;
var FeedSub = require('feedsub');

var twit = require('./twitter_api_keys');


app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/.tmp'));

server.listen(3001);

var tweets_cache;
io.sockets.on('connection', function(socket) {
    var twitter = new twitterAPI({
        consumerKey: twit.consumer_key,
        consumerSecret: twit.consumer_secret,
        callback: 'http://yoururl.tld/something'
    });

    function send_tweets(data) {
        _(data).each(function(tweet) {
            socket.emit('news', {
                tweet: tweet
            });
        })
    }

    if (tweets_cache == undefined)
        twitter.getTimeline("home", {},
            twit.access_token_key,
            twit.access_token_secret,
            function(error, data, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('getting timeline data');
                    data.reverse();
                    data.slice(5);
                    tweets_cache = data;
                    send_tweets(tweets_cache);                     
                }
            }
        );
    else 
        send_tweets(tweets_cache);

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
                    tweets_cache.push(data);
                    tweets_cache.slice(0,-5);
                    socket.emit('news', {
                        tweet: data
                    });
                }
            }
        },
        function() {
            console.log('End of stream');
        }
    );
    tw.addListener('error', function (res) {
        console.log('twitter stream');
        console.dir(res);
    });


    setInterval(function() {new ps().cpu_percent(0.2, true, function(err, data){
        // console.log(data);
        if (!err)
            io.sockets.emit('cpu_percent', data);
    });}, 2000);

    var reader = new FeedSub(twit.github_timeline_url, {
        emitOnStart : true,
        interval: 1 // check feed every 10 minutes
    });

    reader.on('item', function(item) {
        socket.emit('rss', item);
    });

    reader.on('error', function (err) {
        console.log('Error reading the feed: ' + err);
        // body...
    });

    reader.start();    

    socket.on('disconnect', function () {
        tw.socket.destroy();
    });
});