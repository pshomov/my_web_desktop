var FeedSub = require('feedsub');
var twit = require('./../twitter_api_keys');

module.exports = function(client_api) {
    var rss_cache = { items : []};

    var reader = new FeedSub('http://www.visir.is/section/FRONTPAGE&Template=rss&mime=xml', {
        emitOnStart: true,
        interval: 1
    });

    reader.on('item', function(item) {
        rss_cache.items.push(item);
        client_api.update(item, 'visir');
    });

    reader.on('error', function(err) {
    });

    reader.start();
    return {
        cache : rss_cache,
        event : 'visir'
    }
};
