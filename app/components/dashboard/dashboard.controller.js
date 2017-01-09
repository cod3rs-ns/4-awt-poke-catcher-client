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

        // FIXME For each application
        dashboardVm.isCollapsed = true;

        // Methods
        dashboardVm.getRegistredApplications = getRegistredApplications;
        dashboardVm.registerApplication = registerApplication;
        dashboardVm.addUser = addUser;

        activate();

        function activate() {
            dashboardVm.getRegistredApplications();
        }

        function getRegistredApplications() {
            dashboardService.getMyApps($localStorage.user)
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
                    dashboardService.registerApp(app)
                      .then(function(response) {
                          dashboardVm.apps.push(response.data);
                      })
                      .catch(function (error) {
                          $log.error(error);
                      });
                }, function () {
                    $log.info('Modal dismissed at: ' + _.now());
                });
        };

        function addUser(application) {
            application.users.push(dashboardVm.user);

            dashboardService.updateApp(application)
              .then(function(response) {
                  dashboardVm.user = "";
                  $log.info(response.data);
              })
              .catch(function (error) {
                  $log.error(error);
              });
        };
    }
})();