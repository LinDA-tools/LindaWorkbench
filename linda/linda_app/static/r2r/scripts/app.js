(function() {
  'use strict';
  var app;

  app = angular.module('r2rDesignerApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'ui.bootstrap', 'duScroll', 'underscore', 'angularFileUpload', 'mgcrea.ngStrap']);

  app.config(function($routeProvider) {
    return $routeProvider.when('/csv', {
      templateUrl: 'partials/main.html',
      controller: 'CsvCtrl'
    }).when('/rdb', {
      templateUrl: 'partials/main.html',
      controller: 'RdbCtrl'
    }).otherwise({
      redirectTo: '/csv'
    });
  });

}).call(this);

//# sourceMappingURL=app.js.map
