'use strict';

angular.module('myWebDesktopApp')
    .config(['$sceDelegateProvider',
        function($sceDelegateProvider) {
            $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://cloud.feedly.com/**', 'http://cloud.feedly.com/**']);
        }
    ])
    .controller('MainCtrl', function($scope, $interval, $resource) {
        var retry;

        function bind_events(socket, $scope){
            $scope.items = [];
            $scope.rss = [];
            $scope.cpu = [];
            socket.on('news', function(data) {
                $scope.$apply(function() {
                    $scope.items.unshift(data);
                    $scope.items.splice(5);
                })
            });
            socket.on('cpu_percent', function(data) {
                $scope.$apply(function() {
                    $scope.cpu = data;
                })
            });
            socket.on('rss', function(data) {
                $scope.$apply(function() {
                    data.media = data['media:thumbnail'];
                    $scope.rss.unshift(data);
                })
            });

        }

        function connect() {
            var socket = io.connect('http://localhost:3001');
            if (socket.socket.connected) {
                if (retry) {
                    $interval.cancel(retry);
                    retry = undefined;
                }
            } else {
                if (!retry) {
                    retry = $interval(connect, 2000);
                }
                return;
            }

            bind_events(socket, $scope);

            socket.on('disconnect', function() {
                if (!retry) 
                    retry = $interval(connect, 2000);
            });
        }
        connect();

        $interval(function() {
            $scope.now = new Date();
        }, 1000);
    });