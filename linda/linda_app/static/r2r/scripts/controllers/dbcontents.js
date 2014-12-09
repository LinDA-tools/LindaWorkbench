(function() {
  'use strict';
  angular.module('app').controller('DbContentsCtrl', function($scope, Rdb) {
    return $scope.rdb = Rdb;
  });

}).call(this);

//# sourceMappingURL=dbcontents.js.map
