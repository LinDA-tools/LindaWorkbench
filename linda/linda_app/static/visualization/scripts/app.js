App = Ember.Application.create({
    LOG_TRANSITIONS: true, 
    LOG_TRANSITIONS_INTERNAL: true,
    onerror: function(error) {
        console.dir(error);
    }
});
Ember.RSVP.on('error', function(error) {
  Ember.Logger.assert(false, error);
});
Ember.run.backburner.DEBUG = true;

require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/views/*');
require('scripts/components/*');
require('scripts/router');
