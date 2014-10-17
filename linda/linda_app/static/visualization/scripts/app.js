App = Ember.Application.create({
    LOG_TRANSITIONS: true, 
    LOG_TRANSITIONS_INTERNAL: true
});

require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/views/*');
require('scripts/components/*');
require('scripts/router');
