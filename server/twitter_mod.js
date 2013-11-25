var twitterAPI = require('node-twitter-api');
var twit = require('./../twitter_api_keys');


module.exports = function (client_api){
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
                 client_api.update(tweets_cache.items, 'news');
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
                     client_api.update(data, 'news');
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
        cache : tweets_cache,
        event : 'news'
    };
};
