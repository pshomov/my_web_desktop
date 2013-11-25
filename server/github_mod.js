var FeedSub = require('feedsub');
var twit = require('./../twitter_api_keys');

module.exports = function(client_api) {
    var rss_cache = { items : []};

    var reader = new FeedSub(twit.github_timeline_url, {
        emitOnStart: true,
        interval: 1
    });

    reader.on('item', function(item) {
        rss_cache.items.push(item);
        client_api.update(item, 'rss');
    });

    reader.on('error', function(err) {
        console.log('Error reading the feed: ' + err);
    });

    reader.start();
    return {
        cache : rss_cache,
        event : 'rss'
    }
};
