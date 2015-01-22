(function() {
  'use strict';
  var app;

  app = angular.module('r2rDesignerApp');

  app.directive('rdfBadge', function($timeout, $popover) {
    return {
      restrict: 'A',
      scope: {
        uri: '@',
        label: '@',
        local: '@',
        prefixed: '@',
        definition: '@',
        vocabUri: '@',
        vocabTitle: '@',
        vocabDescr: '@',
        score: '@'
      },
      templateUrl: 'partials/rdfbadge.html',
      controller: function($scope) {
        var definition, vocabDescr, vocabulary;
        definition = $scope.definition && !(_.isEmpty($scope.definition)) ? "<span>" + $scope.definition + "</span>\n<hr />" : "<span class=\"nodefinition\">No definition available!</span>\n<hr />";
        vocabDescr = ($scope.vocabDescr != null) && !(_.isEmpty($scope.vocabDescr)) ? "<span>" + $scope.vocabDescr + "</span>" : "";
        vocabulary = ($scope.vocabTitle != null) && !(_.isEmpty($scope.vocabTitle)) ? "<h4>\n  <sup>2</sup>" + $scope.vocabTitle + "\n</h4>\n<span>\n  &rarr;&nbsp;<a href=\"" + $scope.vocabUri + "\">" + $scope.vocabUri + "</a>\n</span><br /><br />\n<span>\n  " + $scope.vocabDescr + "\n</span>\n<hr />" : "<h5>\n  <sup>2</sup>&rarr;&nbsp;<a href=\"" + $scope.vocabUri + "\">" + $scope.vocabUri + "</a>\n</h5>\n" + vocabDescr + "\n<hr />";
        return $scope.tmpl = "<h4><sup>1</sup>" + ($scope.label || $scope.local) + "</h4>\n<span>&rarr;&nbsp;<a href=\"" + $scope.uri + "\">" + $scope.uri + "</a></span><br /><br />\n" + definition + "\n" + vocabulary + "\n<span class=\"score\">score: " + $scope.score + "</span>";
      },
      link: function(scope, elem, attrs) {
        elem.bind('mouseenter', function() {
          return scope.$emit('changeSidetip', scope.tmpl);
        });
        return $popover(elem, {
          content: scope.tmpl,
          container: 'body',
          trigger: 'hover',
          html: true,
          placement: 'bottom'
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=rdfbadge.js.map
