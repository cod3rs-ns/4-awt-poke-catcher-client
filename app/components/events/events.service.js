(function() {
    'use strict';

    angular
        .module('awt-client')
        .service('eventsService', eventsService);

    eventsService.$inject = ['$http', 'CONFIG'];

    function eventsService($http, CONFIG) {
        var service = {
          getEventsByAppId: getEventsByAppId
        };

        return service;

        function getEventsByAppId(appId) {
            return $http.get(CONFIG.SERVICE_URL + '/applications/' + appId + '/events')
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw 'cannot-retrieve-events';
              });
        };
    }
})();