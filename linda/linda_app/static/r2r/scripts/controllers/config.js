(function() {
  'use strict';
  angular.module('app').controller('ConfigCtrl', function($scope, Rdb) {
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
      return $scope.rdb.registerDatabase($scope.rdb.datasource).then(function() {
        $scope.rdb.getTables();
        return $scope.rdb.getTableColumns();
      });
    };
  });

}).call(this);

//# sourceMappingURL=config.js.map
