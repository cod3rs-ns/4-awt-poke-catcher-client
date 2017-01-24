(function() {
    'use strict';

    angular
        .module('awt-client')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$http', '$location', '$localStorage', '$log', 'jwtHelper', '_', 'loginService', 'CONFIG'];

    function LoginController($http, $location, $localStorage, $log, jwtHelper, _, loginService, CONFIG) {
        var loginVm = this;

        // Variable binders
        loginVm.credentials = {};

        // Methods
        loginVm.auth = auth;

        function auth() {
            loginService.auth(loginVm.credentials.username, loginVm.credentials.password)
                .then(function(response) {
                    var token = response.data.token;

                    if (!_.isUndefined(token)) {
                        loginVm.wrongLogin = false;

                        var tokenPayload = jwtHelper.decodeToken(token);
                        $http.defaults.headers.common[CONFIG.AUTH_TOKEN] = token;

                        $localStorage.token = token;
                        $localStorage.user = tokenPayload.mail;

                        $location.path('/dashboard');
                    }
                    else {
                        loginVm.wrongLogin = true;
                        loginVm.message = response.data.message;
                    }
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };
    }
})();