(function() {
  'use strict';
  angular.module('app').controller('CsvContentsCtrl', function($scope, Csv) {
    $scope.csv = Csv;
    $scope.table = '';
    $scope.$watch('csv.csvFile', function(val) {
      if (val != null) {
        return $scope.table = val.name;
      }
    });
    return $scope.$watch('csv.uploads()', function(val) {
      return $scope.csv.getCsvData();
    });
  });

}).call(this);

//# sourceMappingURL=csvcontents.js.map
