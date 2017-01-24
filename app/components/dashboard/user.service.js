(function() {
    'use strict';

    angular
        .module('awt-client')
        .service('userService', userService);

    userService.$inject = ['$http', 'CONFIG'];

    function userService($http, CONFIG) {
        var service = {
          getUser: getUser,
          getUserId: getUserId
        };

        return service;

        /**
         * Retrieves User information.
         *
         * @param {string} email    email of the user
         * @returns response
         */
        function getUser(email) {
            return $http.get(CONFIG.SERVICE_URL + '/users/' + email)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw 'cannot-retrieve-user';
              });
        };

        function getUserId(id) {
            return $http.get(CONFIG.SERVICE_URL + '/users/id/' + id)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw 'cannot-retrieve-user';
              });
        };
    }
})();