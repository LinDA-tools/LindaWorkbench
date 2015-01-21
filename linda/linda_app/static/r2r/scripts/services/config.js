(function() {
  'use strict';
  angular.module('r2rDesignerApp').factory('Config', function() {
    return {
      backend: 'http://' + window.location.hostname + ':3000'
    };
  });

}).call(this);

//# sourceMappingURL=config.js.map
