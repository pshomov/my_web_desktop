var FeedSub = require('feedsub');
var twit = require('./../twitter_api_keys');


module.exports = function(client_api) {
    var rss_cache = {
        items: []
    };

    var reader = new FeedSub('http://www.reddit.com/r/compsci/.rss', {
        emitOnStart: true,
        interval: 1
    });

    reader.on('item', function(item) {
        rss_cache.items.push(item);
        client_api.update(item, 'visir');
    });

    reader.on('error', function(err) {
        console.log('Error in visir: ' + err);
    });

    reader.start();
    return {
        cache: rss_cache,
        event: 'visir'
    }
};