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