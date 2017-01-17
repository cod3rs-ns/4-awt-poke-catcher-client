(function () {
    'use strict';

    angular
        .module('awt-client')
        .service('registerService', registerService);

    registerService.$inject = ['$http', 'CONFIG'];

    function registerService($http, CONFIG) {
        var service = {
            register: register,
            usernameExists: usernameExists,
            emailExists: emailExists
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

        function usernameExists(username) {
            return $http.get(CONFIG.SERVICE_URL + '/users/unique/username/' + username)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    throw 'cannot-check-username-existence';
                });
        };

        function emailExists(email) {
            return $http.get(CONFIG.SERVICE_URL + '/users/unique/email/' + email)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    throw 'cannot-check-email-existence';
                });
        };
    }
})();