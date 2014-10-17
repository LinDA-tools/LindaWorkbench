google.load('visualization', '1', {packages: ['corechart']});

var areachart = function() {

    var structureOptionsCSV = {
        axis: {label: "Axes", template: 'box', suboptions: {
                xAxis: {label: "Horizontal axis", template: 'dimension'},
                yAxis: {label: "Vertical axis", template: 'multidimension'}
            }
        }
    };
    
    var structureOptionsRDF= {
        axis: {label: "Axes", template: 'tabgroup', suboptions: {
                xAxis: {label: "Horizontal axis", template: 'dimension'},
                yAxis: {label: "Vertical axis", template: 'multidimensionGrouped'}
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
                    defaults:{id:"linear"}
                }
            }
        }, 
        color: {label: "Area colors", template: 'box', suboptions: {
                yAxisColors: {template: 'multiAxisColors', axis: 'yAxis'} // TODO
            }
        }
    };

    var chart = null;
    var data = null;

    function initialize(input, divId) {
        // Create and populate the data table.
        data = google.visualization.arrayToDataTable(input);
        console.log('INITIALIZE');
        console.dir(input);
        chart = new google.visualization.AreaChart(document.getElementById(divId));
    }

    function draw(config) {
        // Create and draw the skeleton of the visualization.
        var view = new google.visualization.DataView(data);
        var columns = [config.axis.xAxis.id];
        console.log('DRAW - config.axis.xAxis.id'+ config.axis.xAxis.id);
        var yAxes = config.axis.yAxis.multiAxis;
                console.dir(yAxes);

        for (var i = 0; i < yAxes.length; i++) {
            console.log('yAxis: '+yAxes[i].id);
            columns.push(yAxes[i].id);
        }
        
        view.setColumns(columns);

        chart.draw(view,
                {title: config.title,
                    width: 600, height: 400}
        );
    }

  function drawRDF() {
        chart.draw(data,
                { width: 600, height: 400 }
        );
    }

    function tune(config) {
        // Tune the visualization.
        chart.draw(data,
                {title: config.title,
                    width: 600, height: 400,
                    vAxis: {title: config.axis.vLabel,
                        logScale: (config.axis.scale.id === 'logarithmic') ? true : false,
                        gridlines: {
                            count: config.axis.grid
                        }
                    },
                    hAxis: {title: config.axis.hLabel},
                    isStacked: (config.style.id === 'stacked') ? true : false,
                }
        );
    }

    return {
        structureOptionsCSV: structureOptionsCSV,
        structureOptionsRDF: structureOptionsRDF,

        tuningOptions: tuningOptions,
        initialize: initialize,
        draw: draw,
        drawRDF: drawRDF,
        tune: tune
    };
}();