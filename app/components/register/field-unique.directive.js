angular
    .module('awt-client')
    .directive('fieldUnique', fieldUnique);

fieldUnique.$inject = ['$http', '$log', 'CONFIG', 'registerService']

function fieldUnique($http, $log, CONFIG, registerService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            function customValidator(ngModelValue) {
                attrName = element.attr("name");

                if (!element.val()) {
                    ctrl.$setValidity('unique', true);
                    return ngModelValue;
                }

                if (attrName == 'username') {
                    return registerService.usernameExists(element.val())
                        .then(function (response) {
                            ctrl.$setValidity('unique', response.data);
                            return ngModelValue;
                        })
                        .catch(function (error) {
                            $log.error(error);
                        });
                }
                else if (attrName == 'email') {
                    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(ngModelValue)) {
                        ctrl.$setValidity('emailValidator', true);
                    } else {
                        ctrl.$setValidity('emailValidator', false);
                    }

                    return registerService.emailExists(element.val())
                        .then(function (response) {
                            ctrl.$setValidity('unique', response.data);
                            return ngModelValue;
                        })
                        .catch(function (error) {
                            $log.error(error);
                        });
                }
            }
            ctrl.$parsers.push(customValidator);
        }
    };
}