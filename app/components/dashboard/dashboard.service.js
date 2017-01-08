(function() {
    'use strict';

    angular
        .module('awt-client')
        .service('dashboardService', dashboardService);

    dashboardService.$inject = ['$http', 'CONFIG'];

    function dashboardService($http, CONFIG) {
        var service = {
          getMyApps: getMyApps,
          registerApp: registerApp
        };

        return service;

        function getMyApps(user) {
            return $http.get(CONFIG.SERVICE_URL + '/applications/users/' + user)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw 'cannot-retrieve-applications';
              });
        };

        function registerApp(app) {
            return $http.post(CONFIG.SERVICE_URL + '/applications', app)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw 'cannot-register-app';
              });
        };
    }
})();