(function() {
  'use strict';
  angular.module('r2rDesignerApp').controller('RdbConfigCtrl', function($scope, Rdb) {
    $scope.rdb = Rdb;
    $scope.checking = false;
    $scope.checked = false;
    $scope.success = false;
    $scope.$watch('rdb.datasource.host', function() {
      return $scope.checked = false;
    });
    $scope.$watch('rdb.datasource.driver', function() {
      return $scope.checked = false;
    });
    $scope.$watch('rdb.datasource.name', function() {
      return $scope.checked = false;
    });
    $scope.$watch('rdb.datasource.username', function() {
      return $scope.checked = false;
    });
    $scope.$watch('rdb.datasource.password', function() {
      return $scope.checked = false;
    });
    $scope.test = function() {
      $scope.checking = true;
      return $scope.rdb.checkDatabase($scope.rdb.datasource).success(function(data) {
        $scope.checking = false;
        $scope.checked = true;
        return $scope.success = data === "true";
      }).error(function(data) {
        $scope.checking = false;
        $scope.checked = true;
        return $scope.success = data === "false";
      });
    };
    return $scope.apply = function() {
      $scope.checked = false;
      $scope.checking = true;
      return $scope.rdb.checkDatabase($scope.rdb.datasource).success(function(data) {
        $scope.checking = false;
        $scope.checked = true;
        $scope.success = data === "true";
        return $scope.rdb.registerDatabase($scope.rdb.datasource).success(function() {
          $scope.rdb.getTables();
          return $scope.rdb.getTableColumns();
        }).error(function() {
          return console.log('error: could not connect to server');
        });
      }).error(function(data) {
        $scope.checking = false;
        $scope.checked = true;
        return $scope.success = data === "false";
      });
    };
  });

}).call(this);

//# sourceMappingURL=config.js.map
