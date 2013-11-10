var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
var _ = require('underscore');
var twitterAPI = require('node-twitter-api');

var twit = require('./twitter_api_keys');


app.use(express.static(__dirname + '/app'));

server.listen(3001);

io.sockets.on('connection', function(socket) {
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
                _(data).each(function(tweet) {
                    socket.emit('news', {
                        tweet: tweet
                    });
                })
            }
        }
    );

    twitter.getStream('user', {},
        twit.access_token_key,
        twit.access_token_secret,
        function(error, data, response) {
            if (error) {
                console.log(error);
                console.log('response is: ' + response);
            } else {
                if (data.text !== undefined)
                    socket.emit('news', {
                        tweet: data
                    });
            }
        },
        function() {
            console.log('End of stream');
        }
    );

});