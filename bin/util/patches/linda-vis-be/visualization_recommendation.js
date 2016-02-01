var m = require("munkres-js");
var _ = require("lodash");
var Q = require('q');
var query_patterns = require('./visualization_modules/query_visualization_patterns.js');
var query_visualizations = require('./visualization_modules/query_visualizations.js');


var INVALID_MAPPING_WEIGHT = 1000;

// Cost function: 
// Defines how well dimensions and properties match according to their scales of measurement
function calculateCost(dimension, property) {
    if (property.dummy) {
        // Dummy properties are inserted to simulate leaving optional dimensions unassigned
        // and can only be assigned to their corresponding dimensions. 
        // Prefer a bad but valid match over leaving an optional dimension unassigned, 
        // but don't assign if the mapping would become invalid.
        if (property.dimension === dimension.optionName) {
            return 100;
        } else {
            return INVALID_MAPPING_WEIGHT;
        }
    }

    var propType = property.type;
    var scalePenalty = INVALID_MAPPING_WEIGHT;

    // A dimension may be able to handle more than one scale of measurement
    // => Take the minimum weight
    for (var i = 0; i < dimension.scalesOfMeasurement.length; i++) {
        var dimType = dimension.scalesOfMeasurement[i];
        if (propType === dimType) {
            scalePenalty = Math.min(0, scalePenalty);
        } else if (
                dimType === "Nominal" && propType === "Ordinal"
                || dimType === "Ordinal" && propType === "Interval"
                || dimType === "Interval" && propType === "Ratio"
                ) {
            scalePenalty = Math.min(30, scalePenalty);
        } else if (dimType === "Interval" && propType === "Ratio") {
            scalePenalty = Math.min(40, scalePenalty);
        }
    }

    var dimensionRole = getDimensionRole(dimension.dimensionRole);
    var propertyRole = property.role;

    var rolePenalty;
    if (dimensionRole && propertyRole) {
        if (dimensionRole === propertyRole) {
            rolePenalty = 0;
        } else {
            // Known false role -- probably pretty bad
            rolePenalty = INVALID_MAPPING_WEIGHT;
        }
    } else if (dimensionRole && !propertyRole) {
        // Dimension role defined but property role unknown 
        // Might or might not work -- some penalty, but less than for assigning property with worse SOM
        rolePenalty = 20;
    } else if (propertyRole && !dimensionRole) {
        // Property role known but dimension role not defined
        // May mean that either kind of data works, but prefer known-good assignments anyway
        rolePenalty = 5;
    } else {
        rolePenalty = 0;
    }

    var optionalPenalty;
    if (dimension.optional) {
        // Prefer mapping required dimensions over mapping optional dimensions,
        // (better to have a suboptimal mapping than to have an incomplete one)
        optionalPenalty = 50;
    } else {
        optionalPenalty = 0;
    }

    var weight = scalePenalty + rolePenalty + optionalPenalty;

    return weight;
}

function getDimensionRole(dimensionRoleURI) {
    switch (dimensionRoleURI) {
        case 'http://linda-project.eu/linda-visualization#Domain':
            return 'Domain';
        case 'http://linda-project.eu/linda-visualization#Range':
            return 'Range';
        default:
            if (dimensionRoleURI) {
                console.log("Unknown Role URI " + dimensionRoleURI);
            }
            return; // undefined
    }
}

// Calculates a cost matrix from two arrays and a cost function by applying
// the cost function for each combination of elements from the two arrays
function calculateCostMatrix(slots, values, costFunction) {
    var costs = [];
    for (var i = 0; i < slots.length; i++) {
        var row = [];
        for (var j = 0; j < values.length; j++) {
            var cost = costFunction(slots[i], values[j]);
            row.push(cost);
        }
        costs.push(row);
    }
    return costs;
}

// Matches an array of properties to the dimensions described by a map of
// visualization patterns and writes the calculated assignments into the 
// visualization description passed
function addRecommendation(visualizationPattern, properties, visualizationDescription) {
    var dimensions = [];
    var propertiesAndDummies = _.clone(properties);
    for (var dimensionName in visualizationPattern) {
        var dimension = visualizationPattern[dimensionName];
        var descDimension = visualizationDescription.structureOptions[dimensionName];
        if (!descDimension.minCardinality) {
            // console.log("optional: " + dimensionName);
            dimension.optional = true;

            var dummy = {
                label: "No " + dimensionName,
                id: "DUMMY",
                dummy: true,
                dimension: dimensionName
            }
            propertiesAndDummies.push(dummy)
        }
        dimensions.push(dimension);
    }

    var costs = calculateCostMatrix(dimensions, propertiesAndDummies, calculateCost);
    var mk = new m.Munkres();
    var solution = mk.compute(costs);

    console.log(JSON.stringify(dimensions.map(function (d) {
        return d.optionName;
    })));
    console.log(JSON.stringify(properties.map(function (p) {
        return p.key;
    })));
    console.log(JSON.stringify(costs));
    console.log(JSON.stringify(solution));

    var result = {
        pattern: visualizationPattern,
        description: visualizationDescription,
        numAssignments: 0,
        cost: 0
    };

    visualizationDescription.valid = (solution.length > 0);

    for (var i = 0; i < solution.length; i++) {
        var dimension_index = solution[i][0];
        var property_index = solution[i][1];

        var dimension = dimensions[dimension_index];
        var property = properties[property_index];

        // Check if property is dummy
        if (property) {
            var cost = costs[dimension_index][property_index];
            result.numAssignments++;

            result.cost += cost;
            if (cost >= INVALID_MAPPING_WEIGHT) {
                //  console.log('Bad match: ' + dimension.optionName + " -> " + property.label);
                visualizationDescription.valid = false;
            }

            if (!visualizationDescription.structureOptions[dimension.optionName].value) {
                visualizationDescription.structureOptions[dimension.optionName].value = [];
            }

            visualizationDescription.structureOptions[dimension.optionName].value.push(property);
        } else {
            console.log("Didn't assign dummy property for optional dimension " + dimension.optionName)
        }
    }

    for (var dimensionName in visualizationPattern) {
        var dimension = visualizationDescription.structureOptions[dimensionName];
        if (dimension.value.length < dimension.minCardinality) {
            // console.log('Missing assignment: ' + dimensionName);
            visualizationDescription.valid = false;
        }
    }

    if (!visualizationDescription.valid) {
        for (var dimensionName in visualizationPattern) {
            var dimension = visualizationDescription.structureOptions[dimensionName];
            dimension.value.splice(0, dimension.value.length);
        }
    }

    console.log("Valid: " + result.description.valid);
    console.log("Num. assignments: " + result.numAssignments);
    console.log("Cost: " + result.cost);

    return result;
}

function ranking(visualizationPatternMap, properties, visualizationDescriptions) {
    var results = [];
    for (var visualizationName in visualizationPatternMap) {
        var visualizationPattern = visualizationPatternMap[visualizationName];
        var visualizationDescription = visualizationDescriptions[visualizationName];
        if (!visualizationDescription) {
            continue;
        }

        console.log("\n" + visualizationName + ":");
        var result = addRecommendation(visualizationPattern, properties, visualizationDescription);
        results.push(result);
    }

    // comparator function for sort()
    function compare(a, b) {
        // All valid results first
        if (a.description.valid && !b.description.valid) {
            return -1;
        } else if (b.description.valid && !a.description.valid) {
            return 1;
        }

        // Prefer configurations with more assignment
        var comparison = b.numAssignments - a.numAssignments;
        if (comparison !== 0) {
            return comparison;
        }

        // For configurations with same number of assignments, prefer less cost
        return a.cost - b.cost;
    }

    // rank allocations
    results.sort(compare);
    return _.map(results, 'description');
}

function recommend(dataselection, endpoint, ontology_graph) {
    console.log('RECOMMENDATION FOR SELECTION:');
    console.log(JSON.stringify(dataselection));

    var visualizationPatternMap;
    return query_patterns.query(ontology_graph, endpoint).then(function (patterns) {
        visualizationPatternMap = patterns;
        return query_visualizations.query(ontology_graph, endpoint);
    }).then(function (visualizationDescriptions) {
        var recommendations = ranking(visualizationPatternMap, dataselection.propertyInfos, visualizationDescriptions);
        for (var i = 0; i < recommendations.length; i++) {
            recommendations[i].dataselection = dataselection.id;
        }
        return recommendations;
    });
}


exports.recommendForDataselection = recommend;