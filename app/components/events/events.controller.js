(function() {
    'use strict';

    angular
        .module('awt-client')
        .controller('EventsController', EventsController);

    EventsController.$inject = ['$stateParams', '$log', '_', 'eventsService'];

    function EventsController($stateParams, $log, _, eventsService) {
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
            eventsService.getEventsByAppId(appId)
              .then(function(response) {
                  eventsVm.events = response.data;
              })
              .catch(function (error) {
                  $log.error(error);
              });
        };
    }
})();