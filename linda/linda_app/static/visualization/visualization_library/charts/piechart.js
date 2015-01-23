var piechart = function() {
    var chart = null;
    var seriesHeaders = [];
    var series = [];

    function draw(configuration, visualisationContainerID) {
       console.log("### INITIALIZE VISUALISATION - PIE CHART");

       var container = $('#' + visualisationContainerID);
           container.empty();
           
        var measure = configuration['Measure'];
        var slice = configuration['Slices'];

        if (!(configuration.dataModule && configuration.datasourceLocation
                && measure && slice)) {
            return $.Deferred().resolve().promise();
        }

        if (measure.length === 0 || slice.length === 0) {
            return $.Deferred().resolve().promise();
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;
        var graph = configuration.datasourceGraph;
        
        var selection = {
            dimension: measure,
            multidimension: slice,
            group: []
        };

        console.log("VISUALIZATION SELECTION FOR PIE CHART:");
        console.dir(selection);
        
        var svg = dimple.newSvg('#' + visualisationContainerID, container.width(), container.height());

        return dataModule.parse(location, graph, selection).then(function(inputData) {
            seriesHeaders = inputData[0];
            series = rows(inputData);            
            console.log("GENERATE INPUT DATA FORMAT FOR PIE CHART");
            console.dir(series);
            
            var chart = new dimple.chart(svg, series);           
                chart.addMeasureAxis("p", seriesHeaders[0]);                                                
                chart.addSeries(seriesHeaders.slice(1), dimple.plot.pie);           
                chart.addLegend("10%", "5%", "80%", 20, "right");
                
                //tooltip
            if (configuration['Tooltip'] === false){
                chart.addSeries(series, dimple.plot.pie).addEventHandler("mouseover",function(){});
            }
                
                chart.draw();       
        });
    }

    function tune(config) {
        console.log("### TUNE PIE CHART");
        
    }

    function export_as_PNG() {
       return exportVis.export_PNG();
    }

    function export_as_SVG() {
       return exportVis.export_SVG();
    }
    
    function get_SVG(){
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
