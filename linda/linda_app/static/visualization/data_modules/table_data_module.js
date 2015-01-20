var table_data = function() {
    var list = [];
    function getContent(selection, datasource) {
        var _location = datasource.location;
        var _graph = datasource.graph;
        var _format = datasource.format;
        var data_module = getDataModule(_format);

        console.log('TABLE DATA MODULE - SELECTION:');
        console.dir(selection);

        return data_module.queryInstances(_location, _graph, selection);
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

    return {
        list: list,
        getContent: getContent,
        getColumns: getColumns
    };
}();