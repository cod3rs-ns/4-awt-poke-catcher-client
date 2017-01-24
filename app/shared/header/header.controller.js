(function() {
    'use strict';

    angular
        .module('awt-client')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$localStorage', '$location'];

    function HeaderController($localStorage, $location) {
        var headerVm = this;

        headerVm.title = "Poké Catcher";
        headerVm.$storage = $localStorage;

        headerVm.logout = logout;

        function logout() {
            $localStorage.$reset();
            $location.path('/signin');
        }
    }
})();