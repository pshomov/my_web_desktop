'use strict';

angular.module('myWebDesktopApp')
    .config(['$sceDelegateProvider',
        function ($sceDelegateProvider) {
            $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://cloud.feedly.com/**', 'http://cloud.feedly.com/**']);
        }
    ])
    .controller('MainCtrl', function ($scope, $interval) {
        function init() {
            $scope.items = [];
            $scope.theringer = [];
            $scope.bleachreport = [];
            $scope.hackernews = [];
            $scope.github = [];
            $scope.visir = [];
            $scope.rss = [];
            $scope.cpu = [];
        }

        function bindEvents(socket, $scope) {
            socket.on('connect', function () {
                console.log('connected');
                init();
            });
            socket.on('reconnect', function () {
                console.log('reconnected');
            });
            socket.on('reconnect_failed', function () {
                console.log('reconnect FAILED!!!');
            });
            socket.on('twitter', function (data) {
                $scope.$apply(function () {
                    $scope.items.unshift(data);
                    $scope.items.splice(5);
                });
            });
            socket.on('cpu_percent', function (data) {
                $scope.$apply(function () {
                    $scope.cpu = data;
                });
            });
            socket.on('rss', function (data) {
                $scope.$apply(function () {
                    data.media = data['media:thumbnail'];
                    $scope.rss.unshift(data);
                    $scope.rss.splice(5);
                });
            });
            socket.on('hackernews', function (data) {
                $scope.$apply(function () {
                    $scope.hackernews.unshift(data);
                    $scope.hackernews.splice(5);
                });
            });
            socket.on('reddit.compsci', function (data) {
                $scope.$apply(function () {
                    $scope.visir.unshift(data);
                    $scope.visir.splice(5);
                });
            });
            socket.on('theringer', function (data) {
                $scope.$apply(function () {
                    $scope.theringer.unshift(data);
                    $scope.theringer.splice(5);
                });
            });
            socket.on('bleachreport', function (data) {
                $scope.$apply(function () {
                    $scope.bleachreport.unshift(data);
                    $scope.bleachreport.splice(5);
                });
            });
            socket.on('github', function (data) {
                $scope.$apply(function () {
                    var item = data;
                    if (item.mediathumbnail && item.mediathumbnail.url) item.mediathumbnail.url = item.mediathumbnail.url.replace(/s=30$/, 's=88');
                    $scope.github.unshift(data);
                    $scope.github.splice(5);
                });
            });
            socket.on('disconnect', function () {
                console.log('disconnected');
            });
        }

        var socket = io.connect('http://localhost:3001', {
            'max reconnection attempts': Infinity
        });
        bindEvents(socket, $scope);
        $scope.onDrop = function($event, $data, l) {
            debugger;
        }
        $interval(function () {
            $scope.now = new Date();
        }, 1000);
    });