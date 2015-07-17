(function() {
  'use strict';
  angular.module('r2rDesignerApp').controller('CsvConfigCtrl', function($scope, Csv) {
    $scope.csv = Csv;
    $scope.file = '';
    $scope.progress = {
      value: 0,
      submitting: false
    };
    $scope.success = false;
    $scope.submitted = false;
    $scope.onFileSelect = function($files) {
      return $scope.file = $files[0];
    };
    return $scope.submit = function() {
      return $scope.csv.submitCsvFile($scope.file, $scope.progress).success(function() {
        $scope.csv.getCsvData();
        $scope.submitted = true;
        $scope.success = true;
        return $scope.progress.submitting = false;
      }).error(function() {
        $scope.submitted = true;
        $scope.success = false;
        return $scope.progress.submitting = false;
      });
    };
  });

}).call(this);

//# sourceMappingURL=config.js.map
