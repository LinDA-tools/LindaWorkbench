var table_data = function() {

    var list = [];

    function getContent(list) {
        var propertyPaths = [];
        var _class = null;
        var _location = null;
        var _format = null;

        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var parent = item.data.parent;
            var path = parent.slice(1, parent.length);
            if (path.length > 0) {
                propertyPaths.push(path);
                _class = parent[0];
                _location = item.data.location;
                _format = item.data.format;
            }
        }

        if (propertyPaths.length === 0) {
            return [];
        }

        var data_module = getDataModule(_format);

        return data_module.queryInstances(_location, _class, propertyPaths).then(function(results) {
            var values = {}

            var numRows = 0;

            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var p = Object.keys(result)[0];

                if (!values[p]) {
                    values[p] = [];
                }
                values[p].push(simplifyURI(result[p].value));
                numRows = Math.max(numRows, values[p].length);

            }
            
            var table = [];
            for (var i = 0; i < numRows; i++) {
                var row = [];
                for (var key in values) {
                    var value = values[key]
                    var item = value[i];
                    if (item)
                        row.push(item);
                    else
                        row.push('/');
                }
                table.push(row);
            }

            return table;
        });
    }

    function getColumns(list) {
        var columns = [];
        for (var i = 0; i < list.length; i++) {
            columns.push({
                title: list[i].label
            });
        }
        
        return columns;
    }

    function getDataModule(format) {
        switch (format) {
            case 'csv':
                return csv_data_module;
            case 'rdf':
                return sparql_data_module;
        }
        console.error("Unknown data format '" + format + "'");
        return null;
    }


    function simplifyURI(uri) {
        var splits = uri.split(/[#/:]/);
        return splits[splits.length - 1];
    }
    
    return {
        list: list,
        getContent: getContent,
        getColumns: getColumns
    };

}();

