(function() {
  'use strict';
  var app;

  app = angular.module('app');

  app.directive('popover', function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        return $(elem).popover({
          trigger: 'hover',
          html: true,
          content: attrs.popoverHtml,
          placement: attrs.popoverPlacement
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=popover.js.map
