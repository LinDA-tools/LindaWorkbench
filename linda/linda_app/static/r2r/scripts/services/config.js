(function() {
  'use strict';
  angular.module('app').factory('Config', function() {
    return {
      backend: 'http://' + window.location.hostname + ':3000'
    };
  });

}).call(this);

//# sourceMappingURL=config.js.map
