(function() {
  'use strict';
  var app;

  app = angular.module('r2rDesignerApp');

  app.directive('popover', function($popover) {
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
      contentTemplate: 'partials/rdfbadge.html',
      link: function(scope, elem, attrs) {
        return $popover(elem, {
          trigger: 'hover',
          html: true,
          placement: 'bottom'
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=popover.js.map
