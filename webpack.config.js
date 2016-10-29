var path = require('path');

var DIST_PATH = path.resolve(__dirname, 'dist');
var SOURCE_PATH = path.resolve(__dirname, 'src');

module.exports = {
    entry: {app : [SOURCE_PATH + '/app/app.js']},
    output: {
        path: DIST_PATH,
        filename: 'app.dist.js',
        publicPath: '/app/'
    },
    plugins : [],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: [
                        'es2015',
                        'react',
                        'stage-2'
                    ]
                }
            },
            {
                test: /\.less$/,
                loader: "style!css!less"
            },
            { test: /\.png$/, loader: "url-loader?limit=100000" },
            { test: /\.jpg$/, loader: "file-loader" }
        ]
    }
};