visualizationRegistry = {
    getVisualization: function(widgetName) {
        switch (widgetName) {           
            case 'BarChart':
                return columnchart;
            case 'LineChart':
                return linechart;
            case 'AreaChart':
                return areachart;
            case 'PieChart':
                return piechart;
            case 'BubbleChart':
                return bubblechart;
            case 'ScatterChart':
                return scatterchart;
            case 'MapChart':
                return mapchart;
            case 'Map':
                return map;
        }
        return null;
    }
}