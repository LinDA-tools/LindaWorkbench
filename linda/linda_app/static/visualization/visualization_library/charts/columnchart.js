var columnchart = function() {
    var structureOptions = {
        axis: {label: "Axes", template: 'treeView', suboptions: {
                xAxis: {label: "Horizontal axis", template: 'area'},
                yAxis: {label: "Vertical axis", template: 'area'}
            }
        }
    };

    var tuningOptions = {
        title: {label: "Title", template: 'textField'},
        style: {label: "Style", template: 'selectField',
            values: [{label: "Normal", id: "normal"}, {label: "Stacked", id: "stacked"}]
        },
        axis: {label: "Axes", template: 'box', suboptions: {
                vLabel: {label: "Label (V)", template: 'textField'},
                hLabel: {label: "Label (H)", template: 'textField'},
                grid: {label: "Grid", template: 'textField'},
                scale: {label: "Scale", template: 'selectField',
                    values: [{label: "Linear", id: "linear"}, {label: "Logarithmic", id: "logarithmic"}],
                    defaults: {id: "linear"}
                }
            }
        },
        color: {label: "Horizontal axes colors", template: 'box', suboptions: {
                yAxisColors: {template: 'multiAxisColors', axis: 'yAxis'} // TODO
            }
        }
    };

    var chart = null;
    var seriesHeaders = [];
    var series = [];

    function draw(visualisationConfiguration, visualisationContainer) {
        console.log("### INITIALIZE VISUALISATION");

        var dataModule = visualisationConfiguration.dataModule;

        console.log("VISUALISATION CONFIGURATION");
        console.dir(visualisationConfiguration);

        var xAxis = visualisationConfiguration.axis.xAxis;
        console.log('xAxis');
        console.dir(xAxis);

        var yAxes = visualisationConfiguration.axis.yAxis;
        console.log('yAxes');
        console.dir(yAxes);

        var selection = {};
        var dimension = [];
        var multidimension = [];
        var group = [];

        dimension.push(xAxis[0]);

        for (var i = 0; i < yAxes.length; i++) {
            console.dir(yAxes[i]);
            if (yAxes[i].groupBy) {
                group.push(yAxes[i]);
            } else {
                multidimension.push(yAxes[i]);
            }
        }

        selection.dimension = dimension;
        selection.multidimension = multidimension;
        selection.group = group;

        console.log("SELECTION");
        console.dir(selection);

        var location = visualisationConfiguration.datasourceInfo.location;

        dataModule.parse(location, selection).then(function(inputData) {
            console.log("CONVERTED INPUT DATA");
            console.dir(inputData);
            
            seriesHeaders = inputData[0];
            series = transpose(inputData);
            chart = c3.generate({
                bindto: '#' + visualisationContainer,
                data: {
                    columns: series,
                    x: seriesHeaders[0],
                    type: 'bar'
                },
                axis: {
                    y: {
                        tick: {
                            format: function(val) {
                                if(!val && val !== 0) {
                                    return '';
                                }
                                return val.toLocaleString([], {
                                    useGrouping: false,
                                    maximumFractionDigits: 6
                                });
                            }
                        }
                    }
                },
                grid: {
                    y: {
                        lines: [{value: 0}]
                    }
                }
            });
        });

        console.log("###########");
    }

    function tune(config) {
        console.log("### TUNE VISUALISATION");
        console.dir(chart);
        
        var groups;
        if(config.style.id === "stacked") {
            groups = [seriesHeaders.slice(1)];
            console.dir(groups);
        } else {
            groups = [];
        }
        
        chart.groups(groups);

        chart.axis.labels({
                x: config.axis.hLabel,
                y: config.axis.vLabel
        });

        console.log("###########");
    }

    return {
        structureOptions: structureOptions,
        tuningOptions: tuningOptions,
        draw: draw,
        tune: tune
    };
}();