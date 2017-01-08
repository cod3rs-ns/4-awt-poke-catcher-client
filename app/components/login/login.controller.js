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
                        // var tokenPayload = jwtHelper.decodeToken(token);

                        if (!_.isUndefined(token)) {
                            $http.defaults.headers.common[CONFIG.AUTH_TOKEN] = token;

                            $log.info(token);
                            // $log.info(tokenPayload.sub);

                            $localStorage.token = token;
                            // $localStorage.user = tokenPayload.sub;

                            $location.path('/');
                        }
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };
    }
})();