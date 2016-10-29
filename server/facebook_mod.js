var FeedSub = require('feedsub');
var twit = require('./../twitter_api_keys');
var cache = require('./cache');
var FB = require('fb'),
    fb = new FB.Facebook();

var EVENT = 'facebook';

module.exports = function (client_api) {
    var rss_cache = cache(5);

    FB.api('oauth/access_token',
        { client_id: '1024656954308435', client_secret: '8c83c6d0d70615874c42b00e603b17dd', redirect_uri: 'http://dir.bg', grant_type: 'client_credentials' }, 
        function(res){
            var token = res.access_token;

            // var token = 'EAAOj64nHN1MBAJNhbujmSOL0IZBrp7fzeniZB8m1cendQHHJl6IScQbI2SDMJybZCFvb7HXFpNoYOy3cn2OK3ESEQ7ZCd2bbZA4dl71xh6dCO6Q8cQvvyearVq9ZAdUzXq1aEkTEw9dtzuKOgZAEC1R';
            // token = 'EAACEdEose0cBAG0AHfyU7BtAuPBZB7QhkfX9j8zCkNE2HONPNezcvShDuj251Rf7WBT747SxZBXHVHe3FMpmSevjE3tMtE5Rtz3GjzT9Gv4odHEAiEYz3sXf7KZAGPUZBZAw1cwaoo0ymFAx1B3r9vRNKNNVuiZAvuDB2imKl0vQZDZD'
            FB.setAccessToken(token);
            // fb.setAccessToken(token);
            FB.api('me/feed', function (res) {
                return;
            })

        }
    )

    return {
        cache: rss_cache,
        event: EVENT
    }
};
