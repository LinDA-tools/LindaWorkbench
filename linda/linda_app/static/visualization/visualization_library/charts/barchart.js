google.load('visualization', '1', {packages: ['corechart']});

var barchart = function() {

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
    var data = null;

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

            // Create and populate the data table.
            data = google.visualization.arrayToDataTable(inputData);

            chart = new google.visualization.BarChart(document.getElementById(visualisationContainer));

            console.log("### DRAW VISUALISATION");

            chart.draw(data,
                    {width: 600, height: 400}
            );

            console.log("###########");


        });

        console.log("###########");
    }

    function tune(config) {
        console.log("### TUNE VISUALISATION");

        chart.draw(data,
                {title: config.title,
                    width: 600, height: 400,
                    vAxis: {title: config.axis.vLabel},
                    hAxis: {title: config.axis.hLabel,
                        logScale: (config.axis.scale.id === 'logarithmic') ? true : false,
                        gridlines: {
                            count: config.axis.grid
                        }
                    },
                    isStacked: (config.style.id === 'stacked') ? true : false,
                }
        );

        console.log("###########");
    }

    return {
        structureOptions: structureOptions,
        tuningOptions: tuningOptions,
        draw: draw,
        tune: tune
    };
}();