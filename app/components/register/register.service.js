(function() {
    'use strict';

    angular
        .module('awt-client')
        .service('registerService', registerService);

    registerService.$inject = ['$http', 'CONFIG'];

    function registerService($http, CONFIG) {
        var service = {
          register: register
        };

        return service;

        function register(user) {
            return $http.post(CONFIG.SERVICE_URL + '/users', user)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw 'cannot-register-user';
              });
        };
    }
})();