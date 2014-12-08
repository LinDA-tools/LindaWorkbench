(function() {
  'use strict';
  angular.module('app').controller('CsvReconcileCtrl', function($scope, _, Oracle, Csv, Rdf) {
    $scope.csv = Csv;
    $scope.rdf = Rdf;
    $scope.loading = false;
    $scope.subjectTag = {};
    $scope.columnTags = {};
    return $scope.ask = function(subject, columns) {
      $scope.loading = true;
      return Oracle.ask(subjects, $scope.subjectTag, columns, $scope.columnTags).then(function(promise) {
        $scope.loading = false;
        return $scope.rdf.suggestions[filename] = promise;
      });
    };
  });

}).call(this);

//# sourceMappingURL=csvreconile.js.map
