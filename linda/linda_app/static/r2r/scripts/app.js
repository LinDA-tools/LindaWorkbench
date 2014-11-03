(function() {
  'use strict';
  var app;

  app = angular.module('app', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'ui.bootstrap', 'duScroll', 'underscore']);

  app.config(function($routeProvider) {
    return $routeProvider.when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    }).otherwise({
      redirectTo: '/'
    });
  });

}).call(this);

//# sourceMappingURL=app.js.map
