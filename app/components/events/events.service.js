(function() {
    'use strict';

    angular
        .module('awt-client')
        .service('eventsService', eventsService);

    eventsService.$inject = ['$http', 'CONFIG'];

    function eventsService($http, CONFIG) {
        var service = {
          getEventsByName: getEventsByName
        };

        return service;

        function getEventsByName(applicationName) {
            // FIXME - Change to Events for Application instead of ALL Events
            return $http.get(CONFIG.SERVICE_URL + '/events')
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw 'cannot-retrieve-events';
              });
        };
    }
})();