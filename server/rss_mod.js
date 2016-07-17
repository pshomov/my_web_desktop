var FeedSub = require('feedsub');
var cache = require('./cache');

module.exports = function(client_api, feed, eventName, processItem) {
    var rss_cache = cache(5);

    var reader = new FeedSub(feed, {
        emitOnStart: true,
        interval: 1
    });

    reader.on('item', function(item) {
        if (processItem) item = processItem(item);
        rss_cache.addItem(item);
        client_api.update(item, eventName);
    });

    reader.on('error', function(err) {
    });

    reader.start();
    return {
        cache : rss_cache,
        event : eventName
    }
};
