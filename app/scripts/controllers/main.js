'use strict';

angular.module('myWebDesktopApp')
    .controller('MainCtrl', function($scope) {
        var socket = io.connect('http://localhost:3001');
        $scope.items = [];
        socket.on('news', function(data) {
        	$scope.$apply(function(){
        		// console.log(data);
        		$scope.items.unshift(data);
                $scope.items.splice(5);
        	})
        });
    });