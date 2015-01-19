// TODO: UNDER CONSTRUCTION
var csv_data_module = function() {

// order: order of columns specified by the user
// subset: dummy; needed in case of RDF for the selected class(es)
// location: location of the input dataset  

    function parse(location, selection) {
        console.log('CSV DATA MODULE - ');
        var dimension = selection.dimension;
        var multidimension = selection.multidimension;
        var group = selection.group;

        if (group.length > 0) {
            //CASE 1: dimension and grouped multidimension -> 1 dim; 1 mdim; just 1 group value; 
            var dimension_ = dimension.concat(multidimension).concat(group);

            return query(location, dimension_).then(function(result) {
                return group_by(result, dimension, multidimension, group);
            });
        } else {
            //CASES 2: dimension and/or multidimension -> 1 dim; 1..n mdim; 
            var dimension_ = dimension.concat(multidimension);
            return query(location, dimension_);
        }
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
    
    function query(location, dimensions) {
        return  $.get(location).then(function(data) {
            return $.csv.toArrays(data, {onParseValue: toScalar});
        }).then(function(dataArray) {
            return convert(dataArray, dimensions);
        });
    }

    function queryData(location, _class, _properties) {
        var dfd = new jQuery.Deferred();

        if (!_class) {
            dfd.resolve([{
                    label: "Columns",
                    id: "Columns"
                }]);
            return dfd.promise();
        } else if (_properties.length > 0) {
            dfd.resolve([]);
            return dfd.promise();
        } else {
            return  $.get(location).then(function(data) {
                return $.csv.toArrays(data, {onParseValue: toScalar, start: 0, end: 2});
            }).then(function(dataArray) {
                var names = dataArray[0];
                var values = dataArray[1];
                var columns = [];

                for (var i = 0; i < names.length; i++) {
                    columns.push({
                        id: i,
                        label: names[i],
                        datatype: predictValueSOM(values[i])
                    });
                }

                return columns;
            });
        }
    }

    function convert(arrayData, columnsOrder) {
        var result = [];
        var row = [];

        for (var i = 0; i < arrayData.length; i++) {
            var record = [];
            row = arrayData[i];
            for (var j = 0; j < columnsOrder.length; j++) {
                var order = columnsOrder[j].id;
                record.push(row[order]);
            }
            result.push(record);
        }
        return result;
    }

    return {
        queryData: queryData,
        parse: parse
    };
}();