angular
    .module('awt-client', [
        'ui.router',
        'ngStorage',
        'angular-jwt'
    ])
    .factory('_', ['$window',
        function ($window) {
            // place lodash include before Angular
            return $window._;
        }
    ])
    .constant(
        'CONFIG', {
            'SERVICE_URL': 'http://localhost:9000/api',
            'AUTH_TOKEN': 'X-Auth-Token'
        }
    )
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

        // For excluding exclamation from url
        $locationProvider.hashPrefix('');

        // For any unmatched url, redirect to /welcome
        $urlRouterProvider.otherwise("/welcome");

        // States setup
        $stateProvider
            .state('welcome', {
                url: "/welcome",
                data: {
                    pageTitle: 'Poké Cathcer | Home'
                },
                views: {
                    'content@': {
                        templateUrl: "app/components/welcome/welcome.html"
                    }
                }
            })
            .state('register', {
                url: "/signup",
                data: {
                    pageTitle: 'Poké Cathcer | Sign up'
                },
                views: {
                    'content@': {
                        templateUrl: "app/components/register/register.html",
                        controller: "RegisterController",
                        controllerAs: "registerVm"
                    }
                }
            })
            .state('login', {
                url: "/signin",
                data: {
                    pageTitle: 'Poké Cathcer | Sign in'
                },
                views: {
                    'content@': {
                        templateUrl: "app/components/login/login.html",
                        controller: "LoginController",
                        controllerAs: "loginVm"
                    }
                }
            });

        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', '_', function ($q, $location, $localStorage, _) {
            return {
                // Set Header to Request if user is logged
                'request': function (config) {
                    var token = $localStorage.token;

                    if (!_.isUndefined(token)) {
                        config.headers['X-Auth-Token'] = token;
                    }
                    return config;
                },

                // When try to get Unauthorized or Forbidden page
                'responseError': function (response) {
                    // If you get Unauthorized on login page you should just write message
                    if ("/login" !== $location.path()) {
                        if (response.status === 401 || response.status === 403) {
                            $location.path('/');
                        }

                        return $q.reject(response);
                    }
                    else {
                        return $q.resolve("Wrong credentials");
                    }
                }
            };
        }]);
    });