(function() {
  'use strict';
  angular.module('r2rDesignerApp').factory('Transform', function($http, _, Config) {
    var transformApi;
    transformApi = Config.backend + '/api/v1/transform';
    return {
      dumpdb: function(mapping) {
        if (mapping != null) {
          return $http.post(transformApi + '/dump-db', {
            mapping: mapping
          }).then(function(res) {
            return transformApi + res.data;
          });
        }
      },
      dumpcsv: function(mapping) {
        if (mapping != null) {
          return $http.post(transformApi + '/dump-csv', {
            mapping: mapping
          }).then(function(res) {
            return transformApi + res.data;
          });
        }
      },
      publish: function(to, datasource, mapping) {
        var api;
        if ((to != null) && (datasource != null) && (mapping != null)) {
          api = transformApi + '/publish/' + to;
          return $http.post(api, {
            datasource: datasource,
            mapping: mapping
          });
        }
      }
    };
  });

}).call(this);

//# sourceMappingURL=transform.js.map
