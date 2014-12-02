var piechart = function() {
    var chart = null;
    var seriesHeaders = [];
    var series = [];

    function draw(configuration, visualisationContainerID) {
       console.log("### INITIALIZE VISUALISATION - PIE CHART");

       var container = $('#' + visualisationContainerID);
           container.empty();

        if (!(configuration.dataModule && configuration.datasourceLocation
                && configuration.measure && configuration.slice)) {
            return $.Deferred().resolve().promise();
        }

        if (configuration.measure.length === 0 || configuration.slice.length === 0) {
            return $.Deferred().resolve().promise();
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;
        
        var selection = {
            dimension: configuration.measure,
            multidimension: configuration.slice,
            group: [],
            tooltip: configuration.tooltip
        };

        console.log("VISUALIZATION SELECTION FOR PIE CHART:");
        console.dir(selection);
        
        var svg = dimple.newSvg('#' + visualisationContainerID, container.width(), container.height());

        return dataModule.parse(location, selection).then(function(inputData) {
            seriesHeaders = inputData[0];
            series = rows(inputData);            
            console.log("GENERATE INPUT DATA FORMAT FOR PIE CHART");
            console.dir(series);
            
            var chart = new dimple.chart(svg, series);           
                chart.addMeasureAxis("p", seriesHeaders[0]);                                                
                chart.addSeries(seriesHeaders.slice(1), dimple.plot.pie);           
                chart.addLegend("10%", "5%", "80%", 20, "right");
                
                //tooltip
            if (selection.tooltip === false){
                chart.addSeries(series, dimple.plot.pie).addEventHandler("mouseover",function(){});
            }
                
                chart.draw();       
        });
    }

    function tune(config) {
        console.log("### TUNE PIE CHART");
        
    }

    function export_as_PNG() {
       return exportC3.export_PNG();
    }

    function export_as_SVG() {
       return exportC3.export_SVG();
    }
    
    function get_SVG(){
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
