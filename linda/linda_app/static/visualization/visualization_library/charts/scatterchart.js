/*
 * DIMPLE CHART LIBRARY
 * DATA FORMAT: [{"column1":"value1", "column2":"value2", ...}, {"column1":"value3", "column2":"value4", ...}, ...]
 * 
 */

var scatterchart = function() {
    var chart = null;
    var seriesHeaders = [];
    var data = [];

    function draw(configuration, visualisationContainerID) {
        console.log("### INITIALIZE VISUALISATION - COLUMN CHART");

        var container = $('#' + visualisationContainerID);
        container.empty();

        var xAxis = configuration['Horizontal Axis'];
        var yAxis = configuration['Vertical Axis'];
        var group = configuration['Groups'];


        if (!(configuration.dataModule && configuration.datasourceLocation
                && xAxis && yAxis)) {
            return $.Deferred().resolve().promise();
        }

        if ((xAxis.length === 0) || (yAxis.length === 0)) {
            return $.Deferred().resolve().promise();
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;
        var graph = configuration.datasourceGraph;

        var selection = {
            dimension: [],
            multidimension: xAxis.concat(yAxis).concat(group),
            group: []
        };

        console.log("VISUALIZATION SELECTION FOR COLUMN CHART:");
        console.dir(selection);

        var svg = dimple.newSvg('#' + visualisationContainerID, container.width(), container.height());

        return dataModule.parse(location, graph, selection).then(function(inputData) {
            console.log("GENERATE INPUT DATA FORMAT FOR COLUMN CHART - INPUT DATA");
            console.dir(inputData);
            seriesHeaders = inputData[0];
            data = rows(inputData);
            for(var i = 0; i < data.length; i++){
               data[i]["id"] = "id"+i;
            }
            
            console.log("GENERATE INPUT DATA FORMAT FOR COLUMN CHART - OUTPUT DATA");
            console.dir(data);

            var chart = new dimple.chart(svg, data);

            var xAxisName = seriesHeaders[0];
            var yAxisName = seriesHeaders[1];

            var groupAxisName;
            if (group.length > 0) {
                groupAxisName = seriesHeaders[2];
            }

            chart.addMeasureAxis("x", xAxisName);
            chart.addMeasureAxis("y", yAxisName);

            var series = ["id"];

            if (groupAxisName) {
                series.push(groupAxisName);
            }
            
            console.log("SERIES:");
            console.dir(series);

            chart.addSeries(series, dimple.plot.bubble);
            chart.addLegend("50%", "10%", 500, 20, "right");
            chart.draw();
        });
    }

    function tune(config) {
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