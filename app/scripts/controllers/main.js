'use strict';

angular.module('myWebDesktopApp')
    .controller('MainCtrl', function($scope, $interval) {
        var socket = io.connect('http://localhost:3001');
        $scope.items = [];
        socket.on('news', function(data) {
        	$scope.$apply(function(){
        		$scope.items.unshift(data);
                $scope.items.splice(5);
        	})
        });

        $interval(function(){
            $scope.now = new Date();
        }, 1000);
    });