(function() {
  'use strict';
  var app;

  app = angular.module('app');

  app.directive('rdfBadge', function($timeout) {
    return {
      restrict: 'A',
      replace: true,
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
      templateUrl: '/static/r2r/partials/rdfbadge.html',
      controller: function($scope) {
        var definition, vocabDescr, vocabulary;
        definition = $scope.definition && !(_.isEmpty($scope.definition)) ? "<span style=\"margin-left:1em\">\n  " + $scope.definition + "\n</span>\n<hr />" : "<span style=\"margin-left:1em;font-style:italic;color:#dddddd\">\n  No definition available!\n</span>\n<hr />";
        vocabDescr = ($scope.vocabDescr != null) && !(_.isEmpty($scope.vocabDescr)) ? "<span style=\"margin-left:1em\">\n  " + $scope.vocabDescr + "\n</span>" : "";
        vocabulary = ($scope.vocabTitle != null) && !(_.isEmpty($scope.vocabTitle)) ? "<h4>\n  <sup>2</sup>" + $scope.vocabTitle + "\n</h4>\n<span>\n  &rarr;&nbsp;<a href=\"" + $scope.vocabUri + "\">" + $scope.vocabUri + "</a>\n</span><br /><br />\n<span style=\"margin-left:1em\">\n  " + $scope.vocabDescr + "\n</span>\n<hr />" : "<h5>\n  <sup>2</sup>&rarr;&nbsp;<a href=\"" + $scope.vocabUri + "\">" + $scope.vocabUri + "</a>\n</h5>\n" + vocabDescr + "\n<hr />";
        return $scope.tmpl = "<h4><sup>1</sup>" + ($scope.label || $scope.local) + "</h4>\n<span>&rarr;&nbsp;<a href=\"" + $scope.uri + "\">" + $scope.uri + "</a></span><br /><br />\n" + definition + "\n" + vocabulary + "\n<span class=\"score\">score: " + $scope.score + "</span>";
      },
      link: function(scope, element, attrs) {
        element.bind('mouseenter', function() {
          return scope.$emit('changeSidetip', scope.tmpl);
        });
        return element.bind('mouseleave', function() {
          return scope.$emit('changeSidetip', '');
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=rdfbadge.js.map
