(function () {
    'use strict';

    angular
        .module('awt-client')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$uibModal', '$localStorage', '$log', '_', 'dashboardService'];

    function DashboardController($scope, $uibModal, $localStorage, $log, _, dashboardService) {
        var dashboardVm = this;

        // Variable binders
        dashboardVm.apps = [];
        dashboardVm.includedApps = [];
        dashboardVm.userForms = {};

        // Methods
        dashboardVm.getRegistredApplications = getRegistredApplications;
        dashboardVm.getIncludedApplications = getIncludedApplications;
        dashboardVm.registerApplication = registerApplication;
        dashboardVm.addUser = addUser;
        dashboardVm.setUserForm = setUserForm;

        activate();

        function activate() {
            dashboardVm.getRegistredApplications();
            dashboardVm.getIncludedApplications();
        }

        function getRegistredApplications() {
            dashboardService.getMyApps($localStorage.user)
                .then(function (response) {
                    dashboardVm.apps = response.data;
                    dashboardVm.isCollapsedRegistered = [];
                    dashboardVm.users = [];
                    _.forEach(dashboardVm.apps, function (app) {
                        dashboardVm.isCollapsedRegistered.push(true);
                        dashboardVm.users[app._id] = "";
                    });
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };

        function getIncludedApplications() {
            dashboardService.getMyIncludedApps($localStorage.user)
                .then(function (response) {
                    dashboardVm.includedApps = response.data;
                    dashboardVm.isCollapsedIncluded = [];
                    _.forEach(dashboardVm.includedApps, function (app) {
                        dashboardVm.isCollapsedIncluded.push(true);
                    });
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
                .then(function (app) {
                    app.name = app.name.$$state.value;
                    app.dsn = app.dsn.$$state.value;

                    dashboardService.registerApp(app)
                        .then(function (response) {
                            dashboardVm.apps.push(response.data);
                        })
                        .catch(function (error) {
                            $log.error(error);
                        });
                }, function () {
                    $log.info('Modal dismissed at: ' + _.now());
                });
        };

        function setUserForm(form, appId) {
            dashboardVm.userForms[appId] = form;
        }

        function addUser(application) {
            dashboardVm.users[application._id] = dashboardVm.users[application._id].$$state.value;
            var user = angular.copy(dashboardVm.users[application._id]);

            // Refresh form
            dashboardVm.userForms[application._id].$setPristine();
            dashboardVm.userForms[application._id].$setDirty();

            application.users.push(dashboardVm.users[application._id]);

            dashboardService.updateApp(application)
                .then(function (response) {
                    dashboardVm.users[application._id] = "";
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };
    }
})();