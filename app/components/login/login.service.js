(function() {
    'use strict';

    angular
        .module('awt-client')
        .service('loginService', loginService);

    loginService.$inject = ['$http', 'CONFIG'];

    function loginService($http, CONFIG) {
        var service = {
          auth: auth
        };

        return service;

        function auth(username, password) {
            return $http.post(CONFIG.SERVICE_URL + '/users/authenticate?username=' + username + '&password=' + password)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  throw 'cannot-authenticate-user';
              });
        };
    }
})();