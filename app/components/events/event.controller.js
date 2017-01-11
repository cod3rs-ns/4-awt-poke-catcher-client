(function() {
'use strict';

    angular
        .module('awt-client')
        .controller('EventController', EventController);

    EventController.inject = ['$stateParams', '$log', '_', 'eventsService', 'dashboardService'];
    function EventController($stateParams, $log, _, eventsService, dashboardService) {
        var eventVm = this;
        eventVm.event = {};
        eventVm.app = {};
        
        eventVm.getEvent = getEvent;

        activate();

        ////////////////

        function activate() {
            eventVm.getEvent($stateParams.eventId);
        };

        function getEvent(eventId) {
            eventsService.getEvent(eventId)
                .then(function(response) {
                    eventVm.event = response.data;
                    getApp();
                    console.log(eventVm.event);
                })
                .catch(function(error) {
                    $log.warn(error);
                });
        };

        function getApp() {
            dashboardService.getApp(eventVm.event.applicationId)
                .then(function(response) {
                    eventVm.app = response.data; 
                    console.log(eventVm.app);
                })
                .catch(function(error) {
                    $log.warn(error);
                });
        };
        
    }
})();