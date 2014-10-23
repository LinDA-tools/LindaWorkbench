google.load('visualization', '1', {packages: ['corechart']});

var bubblechart = function() { // bubble chart module (js module pattern)

    var structureOptions = {
        axis: {label: "Axes", template: 'treeView', suboptions: {
                label: {label: "Label", template: 'area'},
                xAxis: {label: "X Axis", template: 'area'},
                yAxis: {label: "Y Axis", template: 'area'},
                color: {label: "Gradient/category", template: 'area'},
                radius: {label: "Radius", template: 'area'}
            }
        }
    };

    var tuningOptions = {
        title: {label: "Chart title", template: 'textField'},
        axes: {label: "Axes", template: 'box',
            suboptions: {
                vLabel: {label: "Title (V)", template: 'textField'},
                hLabel: {label: "Title (H)", template: 'textField'},
                vGrid: {label: "Grid (V)", template: 'textField'},
                hGrid: {label: "Grid (H)", template: 'textField'}
                /*, color: {label: "Color", template: 'textField'}*/
            }
        }
    };

    var chart = null;
    var data = null;


    function draw(config, visualisationContainer) {
        console.log("### INITIALIZE VISUALISATION");
        var dataModule = config.dataModule;
        var columns = [config.axis.label[0], config.axis.xAxis[0], config.axis.yAxis[0]]
        if (config.axis.color.length > 0) {
            columns.push(config.axis.color[0]);
        }
        if (config.axis.radius.length > 0) {
            columns.push(config.axis.radius[0]);
        }

        var selection = {
            dimension: [],
            multidimension: columns,
            group: []
        };
        var location = config.datasourceInfo.location;
        dataModule.parse(location, selection).then(function(input) {

            // Create and populate the data table.
            data = google.visualization.arrayToDataTable(input);
            chart = new google.visualization.BubbleChart(document.getElementById(visualisationContainer));

            // Create and draw the skeleton of the visualization.
//        var view = new google.visualization.DataView(data);
//        var columns = [config.axis.label.id, config.axis.xAxis.id, config.axis.yAxis.id]
//        if (config.axis.color) {
//            columns.push(config.axis.color.id);
//        }
//        if (config.axis.radius) {
//            columns.push(config.axis.radius.id);
//        }
//        ;
//        view.setColumns(columns);

            chart.draw(data,
                    {title: config.title,
                        width: 600, height: 400}
            );
        });
    }

    function tune(config) {
        // Tune the visualization.
        chart.draw(data,
                {title: config["title"],
                    width: 600, height: 400,
                    vAxis: {title: config.axes.vLabel,
                        gridlines: {
                            count: config.axes.vGrid
                        }
                    },
                    hAxis: {title: config.axes.hLabel,
                        gridlines: {
                            count: config.axes.hGrid
                        }
                    },
                    bubble: {textStyle: {fontSize: 11}}
                }

        );
    }

    return {
        structureOptions: structureOptions,
        tuningOptions: tuningOptions,
        draw: draw,
        tune: tune
    };
}();