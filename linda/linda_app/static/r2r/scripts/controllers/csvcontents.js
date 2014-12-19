(function() {
  'use strict';
  angular.module('app').controller('CsvContentsCtrl', function($scope, Csv) {
    $scope.csv = Csv;
    $scope.table = '';
    return $scope.$watch('csv.csvFile()', function(val) {
      if (val != null) {
        return $scope.table = val.name;
      }
    });
  });

}).call(this);

//# sourceMappingURL=csvcontents.js.map
