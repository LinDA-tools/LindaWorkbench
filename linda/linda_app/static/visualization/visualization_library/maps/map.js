var map = function() { // map/openstreetmap module (js module pattern)

    var structureOptions = {
        axis: {label: "Map options", template: 'treeView', suboptions: {
                label: {label: 'Set label', template: 'area'},
                lat: {label: 'Set latitude', template: 'area'},
                long: {label: 'Set longitude', template: 'area'},
                indicator: {label: 'Set indicator', template: 'area'}
            }
        }
    };
    var tuningOptions = {}


    var map = null;
    function draw(config, visualisationContainer) {
        // Remove if 'draw' was called before
        if (map) {
            $(visualisationContainer).empty();
            map.remove();
        }
        map = L.map(visualisationContainer)
        // create a map in the "visualization" div
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);
        console.log("### INITIALIZE VISUALISATION");
        var dataModule = config.dataModule;

        var labelPropertyInfo = config.axis.label[0];
        var latPropertyInfo = config.axis.lat[0];
        var longPropertyInfo = config.axis.long[0];
        var indicatorPropertyInfos = config.axis.indicator;

        var currColumn = 0;
        var latColumn = currColumn++;
        var longColumn = currColumn++;
        var labelColumn = -1;
        if (labelPropertyInfo) {
            labelColumn = currColumn++;
        }
        var indicatorColumns = _.range(3, 3 + indicatorPropertyInfos.length)

        console.log("lat, long, label, indicators:");
        console.dir(latPropertyInfo);
        console.dir(longPropertyInfo);
        console.dir(labelPropertyInfo);
        console.dir(indicatorPropertyInfos);
        console.log("VISUALISATION CONFIGURATION");
        console.dir(config);
        var selection = {};
        var dimensions = [];
        var indicators = [];
        var group = [];
        dimensions.push(latPropertyInfo);
        dimensions.push(longPropertyInfo);
        if (labelPropertyInfo) {
            dimensions.push(labelPropertyInfo);
        }
        for (var i = 0; i < indicatorPropertyInfos.length; i++) {
            console.dir(indicatorPropertyInfos[i]);
            if (indicatorPropertyInfos[i].groupBy) {
                group.push(indicatorPropertyInfos[i]);
            } else {
                indicators.push(indicatorPropertyInfos[i]);
            }
        }

        selection.dimension = dimensions;
        selection.multidimension = indicators;
        selection.group = group;
        console.log("SELECTION");
        console.dir(selection);
        var location = config.datasourceInfo.location;
        dataModule.parse(location, selection).then(function(data) {
            console.log("CONVERTED INPUT DATA");
            console.dir(data);
            var minLat = 90;
            var maxLat = -90;
            var minLong = 180;
            var maxLong = -180;
            var minHue = 120;
            var maxHue = 0;
            var maxIndicatorValues = [];
            for (var j = 0; j < indicatorColumns.length; j++) {
                var maxIndicatorValue = 0;
                for (var i = 1; i < data.length; ++i) {
                    var row = data[i];
                    var indicatorColumn = indicatorColumns[j]; // spaltenindex
                    var indicatorValue = row[indicatorColumn];
                    if (maxIndicatorValue < indicatorValue) {
                        maxIndicatorValue = indicatorValue;
                    }
                }
                maxIndicatorValues.push(maxIndicatorValue || 100);
            }


            for (var i = 1; i < data.length; ++i) {
                var row = data[i];
                var lat = parseFloat(row[latColumn]);
                var long = parseFloat(0.0 + row[longColumn]);
                if (!lat || !long) {
                    console.warn("No lat or long in row:");
                    console.dir(row);
                    continue;
                }
                minLat = Math.min(minLat, lat);
                maxLat = Math.max(maxLat, lat);
                minLong = Math.min(minLong, long);
                maxLong = Math.max(maxLong, long);
                var label = labelColumn >= 0 ? row[labelColumn] : '';
                console.log("LatLong: " + lat + ", " + long);
                var markeroptions = {
                    data: {
                    },
                    chartOptions: {
                    },
                    displayOptions: {
                    },
                    weight: 1,
                    color: '#000000'
                }


                for (var j = 0; j < indicatorColumns.length; j++) {
                    var indicatorColumn = indicatorColumns[j]; // spaltenindex
                    var indicatorValue = row[indicatorColumn];
                    var name = 'datapoint' + j;
                    console.log("indicator [j]: " + indicatorColumn + " name: " + name + " value: " + indicatorValue);
                    markeroptions.data[name] = indicatorValue;
                    markeroptions.chartOptions[name] = {
                        color: 'hsl(240,100%,55%)',
                        fillColor: 'hsl(240,80%,55%)',
                        minValue: 0,
                        maxValue: maxIndicatorValues[j],
                        maxHeight: 20,
                        title: label,
                        displayText: function(value) {
                            return value.toFixed(2);
                        }
                    };
                    markeroptions.displayOptions[name] = {
                        color: new L.HSLHueFunction(new L.Point(0, minHue), new L.Point(100, maxHue), {outputSaturation: '100%', outputLuminosity: '25%'}),
                        fillColor: new L.HSLHueFunction(new L.Point(0, minHue), new L.Point(100, maxHue), {outputSaturation: '100%', outputLuminosity: '50%'})
                    };
                }
                console.dir(markeroptions);
                var marker = new L.BarChartMarker(new L.LatLng(lat, long), markeroptions);
                //var marker = L.marker({lat: lat, lng: long}, {title: label});
                marker.addTo(map);
                console.log("Point: [" + lat + ", " + long + ", " + label + "]")
            }
            console.log("Bounds: [" + minLat + ", " + maxLat + "], [" + minLong + ", " + maxLong + "]")
            if (minLat !== null && minLong !== null && maxLat !== null && maxLong !== null) {
                map.fitBounds([
                    [minLat, minLong],
                    [maxLat, maxLong]
                ]);
            }
        });
    }



    function tune(config) {
    }


    return {
        structureOptions: structureOptions,
        tuningOptions: tuningOptions,
        draw: draw,
        tune: tune
    };
}();
