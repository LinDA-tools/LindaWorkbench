/*
 * DIMPLE CHART LIBRARY
 * DATA FORMAT: [{"column1":"value1", "column2":"value2", ...}, {"column1":"value3", "column2":"value4", ...}, ...]
 * 
 */

var areachart = function () {

    function draw(configuration, visualisationContainerID) {
        console.log("### INITIALIZE VISUALISATION - AREA CHART");

        var container = $('#' + visualisationContainerID);
        container.empty();

        var xAxis = configuration['Horizontal Axis'];
        var yAxis = configuration['Vertical Axis'];
        var group = configuration['Series'];

        if (!(configuration.dataModule && configuration.datasourceLocation
                && xAxis && yAxis && group)) {
            return $.Deferred().resolve().promise();
        }

        if ((xAxis.length === 0) || (yAxis.length === 0)) {
            return $.Deferred().resolve().promise();
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;
        var graph = configuration.datasourceGraph;

        var selection = {
            dimension: yAxis, // measure
            multidimension: xAxis.concat(group),
            group: []
        };

        console.log("VISUALISATION SELECTION FOR AREA CHART:");
        console.dir(selection);

        var svg = dimple.newSvg('#' + visualisationContainerID, container.width(), container.height());

        return dataModule.parse(location, graph, selection).then(function (inputData) {
            var columnsHeaders = inputData[0];
            var data = rows(inputData);
            console.log("GENERATE INPUT DATA FORMAT FOR AREA CHART");
            console.dir(data);

            var chart = new dimple.chart(svg, data);

            var x = chart.addCategoryAxis("x", columnsHeaders[1]); // x axis: ordinal values
            var y = chart.addMeasureAxis("y", columnsHeaders[0]); // y axis: one measure (scale)  

            var series = null;

            if (group.length > 0) {
                series = columnsHeaders.slice(2);
            }

            chart.addSeries(series, dimple.plot.area);
            chart.addLegend("10%", "5%", "80%", 20, "right");

            //gridlines tuning
            x.showGridlines = selection.gridlines;
            y.showGridlines = selection.gridlines;
            //titles
            if (selection.hLabel === "") {
                selection.hLabel = columnsHeaders[1];
            }
            if (selection.vLabel === "") {
                selection.vLabel = columnsHeaders[0];
            }
            x.title = selection.hLabel;
            y.title = selection.vLabel;
            //ticks
            x.ticks = selection.ticks;
            y.ticks = selection.ticks;
            //tooltip
            if (selection.tooltip === false) {
                chart.addSeries(series, dimple.plot.area).addEventHandler("mouseover", function () {
                });
            }

            chart.draw();
        });
    }

    function tune(config) {
        console.log("### TUNE AREA CHART");
    }

    function export_as_PNG() {
        return exportVis.export_PNG();
    }

    function export_as_SVG() {
        return exportVis.export_SVG();
    }

    function get_SVG() {
        return exportVis.get_SVG();
    }

    return {
        export_as_PNG: export_as_PNG,
        export_as_SVG: export_as_SVG,
        get_SVG: get_SVG,
        draw: draw,
        tune: tune
    };
}();