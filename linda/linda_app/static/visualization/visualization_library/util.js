function transpose(table) {
    var columnHeaders = table[0];
    var columns = [];
    for (var i = 0; i < columnHeaders.length; i++) {
        var column = [];
        for (var j = 0; j < table.length; j++) {
            column.push(table[j][i]);
        }
        columns.push(column);
    }
    return columns;
}

function rows(table) {
    var rows = [];
    var columnHeaders = table[0];

    for (var i = 1; i < table.length; i++) {
        var columns = {};
        var row = table[i];
        for (var j = 0; j < row.length; j++) {
            var name = columnHeaders[j];
            columns[name] = row[j];
        }
        rows.push(columns);
    }
    return rows;
}


var floatPattern = /^-?[0-9]+\.[0-9]+$/;
var intPattern = /^-?[0-9]+$/;
function toScalar(value) {
    if (floatPattern.test(value)) {
        var float = parseFloat(value);
        if (isNaN(float)) {
            return value;
        } else {
            return float;
        }
    } else if (intPattern.test(value)) {
        var integer = parseInt(value);
        if (isNaN(integer)) {
            return value;
        } else {
            return integer;
        }
    } else {
        var date = Date.parse(value);
        if (isNaN(date)) {
            return value;
        } else {
            return new Date(date).toISOString();
        }
    }
}

function predictValueSOM(value) {
    var jsType = typeof (value);
    switch (jsType) {
        case "number":
            return "Quantitative";
        case "object":
            var asString = Object.prototype.toString.call(value)
            switch (asString) {
                case '[object Date]':
                case '[invalid Date]':
                    return 'Interval'
                    break;
            }
            break;
    }

    return "Categorical";
}