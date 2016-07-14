var FeedSub = require('feedsub');
var twit = require('./../twitter_api_keys');
var cache = require('./cache');

var EVENT = 'github';

module.exports = function(client_api) {
    var rss_cache = cache(5);

    var reader = new FeedSub(twit.github_timeline_url, {
        emitOnStart: true,
        interval: 1
    });

    reader.on('item', function(item) {
        item.mediathumbnail = item['media:thumbnail'];
        delete item['media:thumbnail'];
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
