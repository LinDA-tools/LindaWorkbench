(function() {
  'use strict';
  angular.module('r2rDesignerApp').factory('Rdb', function($http, _, Config) {
    var dbAdapter, selectedColumns, selectedTables, tableColumns, tables;
    dbAdapter = Config.backend + '/api/v1/db';
    tables = [];
    tableColumns = {};
    selectedTables = [];
    selectedColumns = {};
    return {
      datasource: {
        host: 'localhost',
        driver: 'org.postgresql.ds.PGSimpleDataSource',
        name: 'mydb',
        username: 'postgres',
        password: ''
      },
      tables: function() {
        return tables;
      },
      tableColumns: function() {
        return tableColumns;
      },
      selectedTables: function() {
        return selectedTables;
      },
      selectedColumns: function() {
        return selectedColumns;
      },
      isSelectedTable: function(table) {
        return _.contains(selectedTables, table);
      },
      isSelectedColumn: function(table, column) {
        return _.contains(selectedColumns[table], column);
      },
      toggleSelectTable: function(table) {
        if (_.contains(selectedTables, table)) {
          return selectedTables = _.without(selectedTables, table);
        } else {
          return selectedTables.push(table);
        }
      },
      toggleSelectColumn: function(table, column) {
        if (tableColumns[table] != null) {
          if (_.contains(selectedColumns[table], column)) {
            return selectedColumns[table] = _.without(selectedColumns[table], column);
          } else {
            if (selectedColumns[table] != null) {
              return selectedColumns[table].push(column);
            } else {
              return selectedColumns[table] = [column];
            }
          }
        }
      },
      checkDatabase: function(dbSpec) {
        return $http.post(dbAdapter + '/test', {}, {
          params: {
            driver: dbSpec.driver,
            host: dbSpec.host,
            name: dbSpec.name,
            username: dbSpec.username,
            password: dbSpec.password
          }
        });
      },
      registerDatabase: function(dbSpec) {
        return $http.post(dbAdapter + '/register', {}, {
          params: {
            driver: dbSpec.driver,
            host: dbSpec.host,
            name: dbSpec.name,
            username: dbSpec.username,
            password: dbSpec.password
          }
        });
      },
      getTables: function() {
        return $http.get(dbAdapter + '/tables').success(function(data) {
          return tables = data;
        }).error(function() {
          return console.log('error: could not connect to server');
        });
      },
      getTableColumns: function() {
        return $http.get(dbAdapter + '/table-columns').success(function(data) {
          return tableColumns = data;
        }).error(function() {
          return console.log('error: could not connect to server');
        });
      },
      getColumn: function(table, column) {
        return $http.get(dbAdapter + '/column', {
          params: {
            table: table,
            name: column
          }
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=rdb.js.map
