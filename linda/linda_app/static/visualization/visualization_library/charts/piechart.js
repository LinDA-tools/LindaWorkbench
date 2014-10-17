google.load('visualization', '1', {packages: ['corechart']});

var piechart = function() { 

    var structureOptions = [
        {name: 'xAxis', template: 'dimension'},
        {name: 'yAxis', template: 'multidimension'},
        {name: 'title', template: 'textField'}
    ];

    var tuningOptions = [
        {name: 'title', template: 'textField'},
        {name: 'vAxisTitle', template: 'textField'},
        {name: 'hAxisTitle', template: 'textField'}
    ];

    var chart = null;
    var data = null;

    function initialize(input,divId) {
        // Create and populate the data table.
        data = google.visualization.arrayToDataTable(input);
        chart = new google.visualization.PieChart(document.getElementById(divId));
    }

    function draw(config) {
        

        chart.draw(data,
                {title: config["title"],
                    width: 600, height: 400}
        );
    }

    function tune(config) {
        // Tune the visualization.
        chart.draw(data,
                {title: config["title"],
                    width: 600, height: 400,
                    vAxis: {title: config["vAxisTitle"]},
                    hAxis: {title: config["hAxisTitle"]}}
        );
    }

    return {
        structureOptions: structureOptions,
        tuningOptions: tuningOptions,
        initialize: initialize,
        draw: draw,
        tune: tune
    };
}();