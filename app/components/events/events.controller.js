(function() {
    'use strict';

    angular
        .module('awt-client')
        .controller('EventsController', EventsController);

    EventsController.$inject = ['$stateParams', '$log', '_', 'eventService'];

    function EventsController($stateParams, $log, _, eventService) {
        var eventsVm = this;

        // Variable binders
        eventsVm.events = [];

        // Methods
        eventsVm.getEvents = getEvents;

        activate();

        function activate() {
            eventsVm.getEvents($stateParams.applicationId);
        }

        function getEvents(appId) {
            eventService.getEventsByAppId(appId)
              .then(function(response) {
                  eventsVm.events = response.data;
              })
              .catch(function (error) {
                  $log.error(error);
              });
        };
    }
})();