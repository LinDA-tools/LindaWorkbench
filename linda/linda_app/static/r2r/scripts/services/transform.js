(function() {
  'use strict';
  angular.module('app').factory('Transform', function($http, _, Config) {
    var transformApi;
    transformApi = Config.backend + '/api/v1/transform';
    return {
      dump: function(mapping) {
        if (mapping != null) {
          return $http.post(transformApi + '/dump', {
            mapping: mapping
          }).then(function(res) {
            console.log(res);
            return transformApi + res.data;
          });
        }
      },
      publish: function(to, mapping) {
        var api;
        if ((to != null) && (mapping != null)) {
          api = transformApi + '/publish/' + to;
          return $http.post(api, {
            mapping: mapping
          });
        }
      }
    };
  });

}).call(this);

//# sourceMappingURL=transform.js.map
