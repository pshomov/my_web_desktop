var FeedSub = require('feedsub');
var twit = require('./../twitter_api_keys');
var cache = require('./cache');

var EVENT = 'theringer';

module.exports = function(client_api) {
    var rss_cache = cache(5);

    var reader = new FeedSub('https://theringer.com/feed', {
        emitOnStart: true,
        interval: 1
    });

    reader.on('item', function(item) {
        rss_cache.addItem(item);
        client_api.update(item, EVENT);
    });

    reader.on('error', function(err) {
    });

    reader.start();
    return {
        cache : rss_cache,
        event : EVENT
    }
};
