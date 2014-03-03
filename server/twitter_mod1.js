var twitterAPI = require('twit');
var twit = require('./../twitter_api_keys');


module.exports = function (client_api){
    var tweets_cache = {items : []};


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
                 console.log('getting timeline data: ');
                 data.reverse();
                 data.slice(5);
                 tweets_cache.items = data;
                 client_api.update(tweets_cache.items, 'news');
             }
         }
     );

     var T = twitter.stream('user');
     T.on('tweet', function(data){
         tweets_cache.items.push(data);
         tweets_cache.items.slice(0, -5);
         client_api.update(data, 'news');
     });
     T.on('disconnect', function(disconnectMessage){console.log("Disconnected: "+disconnectMessage)});
     T.on('connect', function(request){console.log("Connect: "+request)});
     T.on('reconnect', function (request, response, connectInterval) {
            console.log("Reconnecting: "+connectInterval);
        })


    return {
        cache : tweets_cache,
        event : 'news'
    };
};
