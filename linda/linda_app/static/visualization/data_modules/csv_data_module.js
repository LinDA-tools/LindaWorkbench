// TODO: UNDER CONSTRUCTION
var csv_data_module = function() {

// order: order of columns specified by the user
// subset: dummy; needed in case of RDF for the selected class(es)
// location: location of the input dataset  

    function parse(location, graph, selection) {
        console.log('CSV DATA MODULE');
        var dimension = selection.dimension;
        var multidimension = selection.multidimension;
        var group = selection.group;

        if (group.length > 0) {
            //CASE 1: dimension and grouped multidimension -> 1 dim; 1 mdim; just 1 group value; 
            var dimension_ = dimension.concat(multidimension).concat(group);
            return queryInstances(location, null, dimension_).then(function(result) {
                return group_by(result, dimension, multidimension, group);
            });
        } else {
            //CASES 2: dimension and/or multidimension -> 1 dim; 1..n mdim; 
            var dimension_ = dimension.concat(multidimension);
            return queryInstances(location, null, dimension_);
        }
    }

    function queryInstances(location, dummy, selection) {
        console.log('QUERY INSTANCES');
        //console.dir(selection);
        
        return  $.get(location).then(function(data) {
            return $.csv.toArrays(data, {onParseValue: toScalar});
        }).then(function(dataArray) {
            var columns = [];
            for (var i = 0; i < selection.length; i++) {
                var column = _.rest(selection[i].parent);
                columns.push(column[0]);
            }
            return convert(dataArray, columns);
        });
    }

    function queryClasses(dummy1, dummy2) {
        console.log('QUERY CLASSES');

        var dfd = new jQuery.Deferred();
        var dataInfo = {
            id: "Columns",
            label: "Columns",
            type: "Class",
            grandchildren: true
        };
        dfd.resolve([dataInfo]);
        return dfd.promise();
    }

    function queryProperties(location, dummy1, dummy2, _properties) {
        console.log('QUERY PTOPERTIES');

        var dfd = new jQuery.Deferred();

        if (_properties.length > 0) {
            dfd.resolve([]);
            return dfd.promise();
        } else {
            return $.get(location).then(function(data) {
                return $.csv.toArrays(data, {onParseValue: toScalar, start: 0, end: 2});
            }).then(function(dataArray) {
                var names = dataArray[0];
                var values = dataArray[1];
                var columns = [];

                for (var i = 0; i < names.length; i++) {
                    var dataInfo = {
                        id: i.toString(),
                        label: names[i],
                        grandchildren: false,
                        role: null,
                        special: false,
                        type: predictValueSOM(values[i])
                    };
                    columns.push(dataInfo);
                }
                return columns;
            });
        }
    }

    function convert(arrayData, columnsOrder) {
        console.log('CONVERT');
        
        var result = [];
        var row = [];

        for (var i = 0; i < arrayData.length; i++) {
            var record = [];
            row = arrayData[i];
            for (var j = 0; j < columnsOrder.length; j++) {
                var order = parseInt(columnsOrder[j].id);
                record.push(row[order]);
            }
            result.push(record);
        }
        return result;
    }

    function group_by(result, dimension, multidimension, group) {
        var group_ = [];
        var multidimension_ = [];
        var dimension_ = [];

        // columns order convention
        var dim_id = 0;
        var mdim_id = 1;
        var gr_id = 2;

        for (var i = 0; i < result.length; i++) {
            var record = result[i];

            multidimension_.push(record[mdim_id]);

            if (!_.contains(group_, record[gr_id])) {
                group_.push(record[gr_id]);
            }

            if (!_.contains(dimension_, record[dim_id])) {
                dimension_.push(record[dim_id]);
            }
        }

        var columns = [];
        columns.push(dimension_[0]);

        for (var i = 1; i < group_.length; i++) {
            columns.push(group_[i]);
        }

        var result = [];
        result.push(columns);

        var multidimension__ = multidimension_.reverse();
        var record = multidimension__.pop();
        var dim_counter = 1;

        while (multidimension__.length > 0) {
            var row = [];
            row.push(dimension_[dim_counter]);

            if (dim_counter === dimension_) {
                dim_counter = 1;
            } else {
                dim_counter++;
            }

            for (var i = 1; i < columns.length; i++) {
                record = multidimension__.pop();
                row.push(record);
            }
            result.push(row);
        }
        return result;
    }

    return {
        queryClasses: queryClasses,
        queryProperties: queryProperties,
        queryInstances: queryInstances,
        parse: parse
    };
}();