(function() {
  'use strict';
  angular.module('app').controller('RdfCtrl', function($scope, $http, Config, Rdb, Rdf, R2rs) {
    $scope.rdb = Rdb;
    $scope.template = '';
    $scope.templateColumns = [];
    $scope.column = '';
    $scope.property = '';
    return $scope.triples = [];
  });

}).call(this);

//# sourceMappingURL=rdf.js.map
