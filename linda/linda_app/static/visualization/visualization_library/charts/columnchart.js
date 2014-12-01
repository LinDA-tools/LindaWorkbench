/*
 * DIMPLE CHART LIBRARY
 * DATA FORMAT: [{"column1":"value1", "column2":"value2", ...}, {"column1":"value3", "column2":"value4", ...}, ...]
 * 
 */

var columnchart = function() {
    var chart = null;
    var seriesHeaders = [];
    var series = [];

    function draw(configuration, visualisationContainerID) {
        console.log("### INITIALIZE VISUALISATION - COLUMN CHART");

        var container = $('#' + visualisationContainerID);
        container.empty();

        if (!(configuration.dataModule && configuration.datasourceLocation
                && configuration.xAxis && configuration.yAxis
                && configuration.group)) {
            return $.Deferred().resolve().promise();
        }

        if ((configuration.xAxis.length === 0) || (configuration.yAxis.length === 0)) {
            return $.Deferred().resolve().promise();
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;

        var selection = {
            dimension: configuration.yAxis, // measure
            multidimension: configuration.xAxis.concat(configuration.group).concat(configuration.stackedGroup), // categories
            group: [],
            gridlines: configuration.gridlines,
            hLabel: configuration.hLabel,
            vLabel: configuration.vLabel,
            
            tooltip: configuration.tooltip
        };

        console.log("VISUALIZATION SELECTION FOR COLUMN CHART:");
        console.dir(selection);

        var svg = dimple.newSvg('#' + visualisationContainerID, container.width(), container.height());

        return dataModule.parse(location, selection).then(function(inputData) {            
            seriesHeaders = inputData[0];
            series = rows(inputData);
            console.log("GENERATE INPUT DATA FORMAT FOR COLUMN CHART");
            console.dir(series);

            var chart = new dimple.chart(svg, series);
            
            var categoryAxis;
            var measureAxis;
            if(configuration.horizontal) {
                categoryAxis = "y";
                measureAxis = "x";
            } else {
                categoryAxis = "x";
                measureAxis = "y";
            }
            
            var dim1 = chart.addCategoryAxis(categoryAxis, seriesHeaders.slice(1, 1 + configuration.xAxis.length + configuration.group.length));  // x axis: more categories        
            var dim2 = chart.addMeasureAxis(measureAxis, seriesHeaders[0]);  // y axis: one measure (scale)                       

            if (configuration.group.length > 0) { // simple column groups 
                chart.addSeries(seriesHeaders[seriesHeaders.length - 1], dimple.plot.bar);
            } else if (configuration.stackedGroup.length > 0) { // stacked groups
                chart.addSeries(seriesHeaders[seriesHeaders.length - 1], dimple.plot.bar);
            } else {
                chart.addSeries(null, dimple.plot.bar);
            }
            chart.addLegend("10%", "5%", "80%", 20, "right");
            
            //gridlines tuning
            dim1.showGridlines = selection.gridlines;
            dim2.showGridlines = selection.gridlines;
            //titles
            if (selection.hLabel ===""){
                selection.hLabel = seriesHeaders[1]; 
            }
            if (selection.vLabel ===""){
                selection.vLabel = seriesHeaders[0];
            }
            dim1.title = selection.hLabel;
            dim2.title = selection.vLabel;

            //tooltip
            if (selection.tooltip === false){
                chart.addSeries(series, dimple.plot.bar).addEventHandler("mouseover",function(){});
            }
            
            chart.draw();
        });
    }

    function tune(config) {
        console.log("### TUNE COLUMN CHART");     
    }

    function export_as_PNG() {
        return exportC3.export_PNG();
    }

    function export_as_SVG() {
        return exportC3.export_SVG();
    }

    function get_SVG() {
        return exportC3.get_SVG();
    }

    return {
        export_as_PNG: export_as_PNG,
        export_as_SVG: export_as_SVG,
        get_SVG: get_SVG,
        draw: draw,
        tune: tune
    };
}();