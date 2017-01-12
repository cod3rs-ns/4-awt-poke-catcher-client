(function() {
    'use strict';

    angular
        .module('awt-client')
        .service('dashboardService', dashboardService);

    dashboardService.$inject = ['$http', 'CONFIG'];

    function dashboardService($http, CONFIG) {
        var service = {
          getMyApps: getMyApps,
          getMyIncludedApps: getMyIncludedApps,
          registerApp: registerApp,
          updateApp: updateApp,
          getApp: getApp,
          nameExists: nameExists,
          dsnExists:dsnExists,
          userExists: userExists
        };

        return service;

        function getMyApps(user) {
            return $http.get(CONFIG.SERVICE_URL + '/applications/user/' + user)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw 'cannot-retrieve-my-applications';
              });
        };

        function getMyIncludedApps(email) {
            return $http.get(CONFIG.SERVICE_URL + '/applications/users/' + email)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw 'cannot-retrieve-applications-i-am-included-at';
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

        function updateApp(app) {
            return $http.put(CONFIG.SERVICE_URL + '/applications/' + app._id, app)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw 'cannot-update-app';
              });
        };

        
        /**
         * Retrieves Application.
         * 
         * @param {any} appId   ID of the application
         * @returns response
         */
        function getApp(appId) {
            return $http.get(CONFIG.SERVICE_URL + '/applications/' + appId)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw 'cannot-retrieve-app';
              });
        };

        function nameExists(name) {
            return $http.get(CONFIG.SERVICE_URL + '/applications/unique/name/' + name)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    throw 'cannot-check-app-name-existence';
                });
        };

        function dsnExists(dsn) {
            return $http.get(CONFIG.SERVICE_URL + '/applications/unique/dsn/' + dsn)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    throw 'cannot-check-dsn-existence';
                });
        };

        function userExists(email) {
            return $http.get(CONFIG.SERVICE_URL + '/applications/unique/user/' + email)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    throw 'cannot-check-app-user-existence';
                });
        };
    }
})();