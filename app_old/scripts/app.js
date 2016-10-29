'use strict';

angular.module('myWebDesktopApp', ['ngRoute','ngAnimate', 'ngResource','ang-drag-drop'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
