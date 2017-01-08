(function() {
    'use strict';

    angular
        .module('awt-client')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$uibModal', '$localStorage', '$log', '_', 'dashboardService'];

    function DashboardController($uibModal, $localStorage, $log, _, dashboardService) {
        var dashboardVm = this;

        // Variable binders
        dashboardVm.apps = [];

        // Methods
        dashboardVm.getRegistredApplications = getRegistredApplications;
        dashboardVm.registerApplication = registerApplication;

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

        function registerApplication(size, parentSelector) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/dashboard/create-application-form.html',
                controller: 'CreateApplicationController',
                controllerAs: 'createAppVm',
                size: size,
                resolve: {
                    user: function () {
                        return $localStorage.user;
                    }
                }
            });

            modalInstance.result
                .then(function(app) {
                    $log.info(app);
                    dashboardService.registerApp(app)
                      .then(function(response) {
                          $log.info(response.data);
                          dashboardVm.apps.push(response.data);
                      })
                      .catch(function (error) {
                          $log.error(error);
                      });
                }, function () {
                    $log.info('Modal dismissed at: ' + _.now());
                });
        }
    }
})();