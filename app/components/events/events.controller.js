(function() {
    'use strict';

    angular
        .module('awt-client')
        .controller('EventsController', EventsController);

    EventsController.$inject = ['$stateParams', '$log', '_', 'eventService'];

    function EventsController($stateParams, $log, _, eventService) {
        var eventsVm = this;

        // Variable binders
        eventsVm.all = [];
        eventsVm.events = [];

        // Methods
        eventsVm.groupByChanged = groupByChanged;
        eventsVm.getEvents = getEvents;

        activate();

        function activate() {
            eventsVm.getEvents($stateParams.applicationId);
        };

        function getEvents(appId) {
            eventService.getEventsByAppId(appId)
              .then(function(response) {
                  eventsVm.all = response.data;
                  groupByChanged();
              })
              .catch(function (error) {
                  $log.error(error);
              });
        };

        function groupByChanged() {
            var by;
            switch (eventsVm.groupBy) {
                case "versionNumber":
                  by = function(e) { return e.versionNumber; };
                  break;

                case "fragment":
                  by = function(e) { return e.fragment; };
                  break;
            }

            var groupedEvents = _.groupBy(eventsVm.all, by);
            eventsVm.eventGroups = _.keys(groupedEvents);
            eventsVm.events = groupedEvents;
        };

    }
})();