var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, { log: false });
var _ = require('underscore');
var twitterAPI = require('node-twitter-api');

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

    socket.on('disconnect', function () {
        tw.socket.destroy();
    });    

});