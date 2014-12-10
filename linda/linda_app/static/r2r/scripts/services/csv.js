(function() {
  'use strict';
  angular.module('app').factory('Csv', function($http, $upload, _, Config) {
    var csvAdapter, csvData, selectedColumns, selectedTables, tableColumns, tables, uploads;
    csvAdapter = Config.backend + '/api/v1/csv';
    csvData = [];
    uploads = 0;
    tables = ['data.csv'];
    tableColumns = {
      'data.csv': []
    };
    selectedTables = ['data.csv'];
    selectedColumns = {
      'data.csv': ['TIME', 'UNIT', 'Value']
    };
    return {
      csvFile: {
        name: 'data.csv'
      },
      uploads: function() {
        return uploads;
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
      data: function() {
        return _.drop(csvData, 1);
      },
      isSelectedColumn: function(table, column) {
        return _.contains(selectedColumns[table], column);
      },
      toggleSelectedColumn: function(table, column) {
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
      submitCsvFile: function(file, progress) {
        progress.submitting = true;
        return $upload.upload({
          url: csvAdapter + '/upload',
          method: 'POST',
          file: file,
          fileName: file.name
        }).progress(function(evt) {
          progress.value = parseInt(100.0 * evt.loaded / evt.total);
          if (evt.loaded === evt.total) {
            progress.submitting = false;
            return uploads++;
          }
        });
      },
      getColumns: function() {
        return _.first(csvData);
      },
      getCsvData: function() {
        return $http.get(csvAdapter + '/data').then(function(res) {
          return csvData = res.data;
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=csv.js.map
