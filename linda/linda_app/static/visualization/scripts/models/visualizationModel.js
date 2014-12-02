/*The visualization model represents the  initial visualization configuration retrieved from the backend. 
 *And describes the format used for storing the current visualization configuration in the backend.*/
App.Visualization = DS.Model.extend({
    name: DS.attr('string'),
    structureOptions: DS.attr(),
    layoutOptions: DS.attr(),
    datasource: DS.attr(),
    thumbnail: DS.attr('string')
});
