function templateMapping(editObject) {
    //the input object might be the result of the recommendation algorithm
    //or the JSON with changed template data, i.e. {layoutOptions:{height:500}}
   console.log('Creating template mapping...');
   
   
   var layoutOptions = null;
   var structureOptions = null;
   var resultMapping = {
            layoutOptions: {},
            structureOptions: {},
            configuration: []
        };
    
        //Assuming there is a baseofmappings {option: template}
        var mapDB = {
            "dimensions": "dimension-area",
            "background_color": "tuning-bgc",
            "hLabel":"textField",
            "vLabel":"textField",
            "gridlines":"tuning-check",
            "tooltip":"tuning-check",
            "horizontal":"tuning-check",
            "ticks":"tuning-numinput",
            "widthPx":"tuning-numinput",
            "widthRatio":"tuning-numinput"
        };
        var chooseTemplate = function(value){
            var choice;
            switch(typeof(value)){
                case "number":
                    choice = "tuning-numinput";
                    break;
                case "string":
                    choice = "textField";
                    break;
                case "boolean":
                    choice = "tuning-check";
                    break;
                case "object":
                    choice = "dimension-area";
                    break;
                default:
                    choice = "dimension-area";
                    break;
            }
            return choice;
        };

        //retrieving the fields
       // if (editObject.hasOwnProperty("layoutOptions")) {
            layoutOptions = editObject.get("layoutOptions");
        //}

        //if (editObject.hasOwnProperty("structureOptions")) {
            structureOptions = editObject.get("structureOptions");
        //}

        //invoking an appropriate template for a tuning parameter
        if (layoutOptions !== null) {
            for (var prop in layoutOptions) {
                if (layoutOptions.hasOwnProperty(prop)) {
                    if (prop !== 'axis') {                     
                        resultMapping.layoutOptions[prop]={
                            template: chooseTemplate(layoutOptions[prop].value),
                            value: layoutOptions[prop].value,
                            label: layoutOptions[prop].label,
                            metadata: layoutOptions[prop].metadata
                        };
                    } else {
                        var axisOptions = layoutOptions[prop];
                        for (var axisprop in axisOptions) {                           
                            resultMapping.layoutOptions[axisprop]={
                            template: chooseTemplate(axisOptions[axisprop].value),
                            value: axisOptions[axisprop].value,
                            label: axisOptions[axisprop].label,
                            metadata: axisOptions[axisprop].metadata
                            };
                        }
                    }
                }
            }
        }
    
        var configurationObject = {};
        //invoking an appropriate template for a dimension parameter
        if (structureOptions !== null) {
	        var dimensions = structureOptions['dimensions'];
        
	        /*building the configuration object
	         * { xAxis : [],
	         *   yAxis:  []
	         * }  
	         */
	        for (var dimensionName in dimensions) {
	            configurationObject[dimensionName]=dimensions[dimensionName].value;

	            resultMapping.structureOptions[dimensionName] = dimensions[dimensionName];
	            resultMapping.structureOptions[dimensionName].template = "dimension-area";
	            
	        }
	        resultMapping.configuration.push(configurationObject);
	    }
            
             console.log('Template mapping result');
             console.dir(resultMapping);
           
    
        return resultMapping;

};
