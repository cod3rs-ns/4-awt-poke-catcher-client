(function() {
    'use strict';

    angular
        .module('awt-client')
        .controller('CreateApplicationController', CreateApplicationController);

    CreateApplicationController.$inject = ['$log', '$uibModalInstance', 'user'];

    function CreateApplicationController($log, $uibModalInstance, user) {

        var createAppVm = this;

        createAppVm.application = {
          "creator": user
        };

        createAppVm.ok = function() {
            $uibModalInstance.close(createAppVm.application);
        };

        createAppVm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();