/*The visualization model represents the  initial visualization configuration retrieved from the backend. 
 *And describes the format used for storing the current visualization configuration in the backend.*/
App.Visualization = DS.Model.extend({
    visualizationName: DS.attr('string'),
    configurationName: DS.attr('string'), //SAVE function
    structureOptions: DS.attr(),
    layoutOptions: DS.attr(),
    visualizationThumbnail: DS.attr('string'),
    valid: DS.attr('boolean'),
    dataselection: DS.belongsTo('dataselection')
});
