(function() {
    'use strict';

    angular
        .module('awt-client')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$log', 'registerService'];

    function RegisterController($log, registerService) {
        var registerVm = this;

        // Variable binders
        registerVm.user = {};

        // Methods
        registerVm.register = register;

        function register() {
            registerService.register(registerVm.user)
                .then(function(response) {
                    $log.info(response.data);
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };
    }
})();