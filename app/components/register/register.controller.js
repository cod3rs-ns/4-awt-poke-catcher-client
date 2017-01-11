(function() {
    'use strict';

    angular
        .module('awt-client')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope', '$log', 'registerService'];

    function RegisterController($scope, $log, registerService) {
        var registerVm = this;

        // Variable binders
        registerVm.user = {};

        // Methods
        registerVm.register = register;

        function register() {
            registerVm.user.mail = registerVm.user.mail.$$state.value;
            registerVm.user.username = registerVm.user.username.$$state.value;

            var user = angular.copy(registerVm.user);

            $scope.registrationForm.$setPristine();
            $scope.registrationForm.$setDirty();

            registerService.register(registerVm.user)
                .then(function(response) {
                    registerVm.user = {};
                    $log.info(response.data);
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };
    }
})();