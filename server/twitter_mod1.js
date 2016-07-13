var twitterAPI = require('twit');
var twit = require('./../twitter_api_keys');
var debug = require('debug')('desktop');
var cache = require('./cache');
var _ = require('underscore');


module.exports = function (client_api){
    var tweets_cache = cache(5);


    var twitter = new twitterAPI({
         consumer_key: twit.consumer_key,
         consumer_secret: twit.consumer_secret,
         access_token: twit.access_token_key,
         access_token_secret: twit.access_token_secret,
         callback: 'http://yoururl.tld/something'
     });
     twitter.get("statuses/home_timeline", 
         function(error, data) {
             if (error) {
                 console.log(error);
             } else {
                 data.reverse();
                 _(data).each(i => tweets_cache.addItem(i));
                 debug(`getting timeline data: ${JSON.stringify(tweets_cache.getItems())}`);
                 client_api.update(tweets_cache.getItems(), 'twitter');
             }
         }
     );

     var T = twitter.stream('user');
     T.on('tweet', function(data){
         tweets_cache.addItem(data);
         debug(`streaming tweet: ${data}`);
         client_api.update(data, 'twitter');
     });
     T.on('disconnect', function(disconnectMessage){console.log("Disconnected: "+disconnectMessage)});
     T.on('connect', function(request){console.log("Connect: "+request)});
     T.on('reconnect', function (request, response, connectInterval) {
            console.log("Reconnecting: "+connectInterval);
        })


    return {
        cache : tweets_cache,
        event : 'twitter'
    };
};
