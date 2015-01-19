App.VisualizationOptionsView = Ember.ContainerView.extend({
    options: null, // structure or layout options
    config: null, // visualization configuration
    tagName: "ul",
    children: function() {
        this.clear();

        var options = this.get('options');
        var configArray = this.get('config');

        if ((configArray === null) || (options === null)) {
            return;
        }

        console.log("VISUALIZATION OPTIONS VIEW - CREATING CONFIGURATION VIEWS ...");

        // Ensures that config changes are only propagated when endPropertyChanges is called, i.e. after the for loop
        configArray.beginPropertyChanges();

        try {
            var optionNames = Object.getOwnPropertyNames(options);
            for (var i = 0; i < optionNames.length; i++) {

                var optionName = optionNames[i];
                var optionTemplate = options[optionName];

                var view = Ember.View.extend({
                    tagName: "li",
                    templateName: "vistemplates/" +
                            optionTemplate.template,
                    name: optionName,
                    label: optionTemplate.label,
                    content: optionTemplate.value,
                    metadata: optionTemplate.metadata ? optionTemplate.metadata.types : "",
                    maxCardinality: optionTemplate.maxCardinality,
                    contentObserver: function() {
                        var content = this.get('content');
                        var name = this.get('name');
                        var configMap = configArray[0];
                        configMap[name] = content;
                        configArray.setObjects([configMap]);
                        optionTemplate.value = content;
                    }.observes('content.@each').on('init')
                }).create();

                this.pushObject(view);
            }
        } finally {
            console.log('VISUALIZATION OPTIONS VIEW - CREATED CONFIGURATION ARRAY');
            console.dir(configArray);
            
            // Inside finally block to make sure that this is executed even if the for loop crashes
            configArray.endPropertyChanges();
        }
    }.observes('options').on('init')
});