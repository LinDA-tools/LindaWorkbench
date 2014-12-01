App.VisualizationOptionsView = Ember.ContainerView.extend({
    options: null, // structure or layout options
    config: null, // visualization configuration
    tagName: "ul",
    children: function() {
        this.clear();

        var options = this.get('options');
        var config = this.get('config');

        if ((config === null) || (options === null)) {
            return;
        }
        
        console.log("Creating visualization configuration view...");
        console.log('Structure options: ');
        console.dir(options);
        console.log('Visualization configuration: ');

        var optionNames = Object.getOwnPropertyNames(options);
        for (var i = 0; i < optionNames.length; i++) {
            
            var optionName = optionNames[i];          
            console.log('Option name: ');
            console.dir(optionName);
            
            var optionTemplate = options[optionName];
            console.log('Option template: ');
            console.dir(optionTemplate);
            console.dir(optionTemplate.value);
            
            var view = Ember.View.extend({
                tagName: "li",
                templateName: "vistemplates/" +
                        optionTemplate.template,
                name: optionName,
                label: optionTemplate.label,
                content: optionTemplate.value,
                metadata: optionTemplate.metadata.types,
                contentObserver: function() {
                    var content = this.get('content');                  
                    var name = this.get('name');
                    console.log("Changed option " + name + ":");
                    console.dir(content);

                    var configMap = config[0];
                    configMap[name] = content;
                    config.setObjects([configMap]);
                }.observes('content.@each').on('init')
            }).create();
            this.pushObject(view);
        }
    }.observes('options').on('init')
});