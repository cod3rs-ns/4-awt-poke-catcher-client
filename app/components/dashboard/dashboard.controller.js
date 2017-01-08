(function() {
    'use strict';

    angular
        .module('awt-client')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$log', '_', 'dashboardService'];

    function DashboardController($log, _, dashboardService) {
        var dashboardVm = this;

        // Variable binders
        dashboardVm.apps = [];

        // Methods
        dashboardVm.getRegistredApplications = getRegistredApplications;

        activate();

        function activate() {
            dashboardVm.getRegistredApplications();
        }

        function getRegistredApplications() {
            dashboardService.getMyApps()
              .then(function(response) {
                  dashboardVm.apps = response.data;
              })
              .catch(function (error) {
                  $log.error(error);
              });
        };
    }
})();