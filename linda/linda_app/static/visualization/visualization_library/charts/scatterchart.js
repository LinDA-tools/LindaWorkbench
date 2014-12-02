var scatterchart = function() {
    var chart = null;
    var seriesHeaders = [];
    var series = [];

    function draw(configuration, visualisationContainerID) {
        console.log("### INITIALIZE VISUALISATION - SCATTER CHART");

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
            dimension: configuration.xAxis,
            multidimension: configuration.yAxis,
            group: configuration.group
        };

        console.log("VISUALIZATION SELECTION FOR SCATTER CHART:");
        console.dir(selection);

        return dataModule.parse(location, selection).then(function(inputData) {
            console.log("GENERATE INPUT DATA FORMAT FOR SCATTER CHART");
            console.dir(inputData);
            seriesHeaders = inputData[0];
            var pairs = {};

            for (var i = 0; i < seriesHeaders.length / 2; i++) {
                pairs[seriesHeaders[2 * i]] = seriesHeaders[2 * i + 1];
            }
            
            series = transpose(inputData);
            console.dir(pairs);
            console.dir(series);
            
            chart = c3.generate({
                bindto: '#' + visualisationContainerID,
              
                data: {
                    xs: pairs,
                    columns: series,
                    type: 'scatter'
                },
                axis: {
                    x: {
                        label: configuration.hLabel,
                        tick: {
                            fit: true,
                            count: configuration.ticks,
                            format: function(val) {
                                if (!val && val !== 0) {
                                    return '';
                                }
                                return val.toLocaleString([], {
                                    useGrouping: false,
                                    maximumFractionDigits: 2
                                });
                            }
                        }
                    },
                    y: {
                        label: configuration.vLabel
                    }
                },
                grid: {
                    x: {
                        show: configuration.gridlines,
                        lines: [{value: 0}]
                    },
                    y: {
                        show: configuration.gridlines,
                        lines: [{value: 0}]
                    }
                },
                tooltip: {
                    show: configuration.tooltip
                }
            });
        });
    }

    function tune(config) {
        console.log("### TUNE SCATTER CHART");
        console.dir(chart);

        var groups;
        if (config.style.id === "stacked") {
            groups = [seriesHeaders.slice(1)];
            console.dir(groups);
        } else {
            groups = [];
        }

        chart.groups(groups);

        chart.labels({
            x: config.hLabel,
            y: config.vLabel
        });
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