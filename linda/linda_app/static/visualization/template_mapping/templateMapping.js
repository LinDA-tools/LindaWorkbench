function templateMapping(editObject) {
    //the input object might be the result of the recommendation algorithm
    //or the JSON with changed template data, i.e. {layoutOptions:{height:500}}
    console.log('CREATING TEMPLATE MAPPING ...');

    var resultMapping = {
        layoutOptions: {},
        structureOptions: {}
    };

    if (editObject) {
        //retrieving the fields
        var layoutOptions = editObject.get("layoutOptions");
        var structureOptions = editObject.get("structureOptions");

        //invoking an appropriate template for a dimension parameter
        resultMapping["layoutOptions"] = mapping(layoutOptions);

        //invoking an appropriate template for a tuning parameter
        resultMapping["structureOptions"] = mapping(structureOptions);
    }

    return resultMapping;
}

function mapping(options) {
    var result = {};

    //Assuming there is a baseofmappings {option: template}
    var mapDB = {
        "dimension": "dimension-area",
        "color": "tuning-bgc",
        "string": "textField",
        "boolean": "tuning-check",
        "number": "tuning-numinput",
        "nonNegativeInteger": "tuning-numinput",
        "integer": "tuning-numinput"
    };

    if (options !== null) {
        for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
                var option = options[prop];
                result[prop] = {
                    template: mapDB[option.type],
                    value: option.value,
                    label: option.optionName,
                    metadata: option.metadata,
                    minCardinality: option.minCardinality,
                    maxCardinality: option.maxCardinality
                };
            }
        }
    }

    console.log('TEMPLATE MAPPING RESULT');
    console.dir(result);

    return result;
}

