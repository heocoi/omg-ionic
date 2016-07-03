(function () {
    'use strict';

    var core = angular.module('app.core');
    core.config(routeConfig);
    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    core.config(requestInterceptor);
    requestInterceptor.$inject = ['$httpProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('login', {
            url: '/',
            cache: false,
            templateUrl: 'templates/starter/login.html'
        })
        .state('signup', {
            url: '/signup',
            cache: false,
            templateUrl: 'templates/starter/signup.html'
        })

        // setup an abstract state for the tabs directive
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })

        // Each tab has its own nav history stack:

        .state('tab.map', {
            url: '/map',
            cache: false,
            views: {
                'tab-map': {
                    templateUrl: 'templates/map.html',
                }
            }
        })

        .state('tab.chats', {
            url: '/chats',
            cache: false,
            views: {
                'tab-chats': {
                    templateUrl: 'templates/chats/threads.html',
                }
            }
        })
        .state('tab.chat-detail', {
            url: '/chats/:chatId',
            cache: false,
            views: {
                'tab-chats': {
                    templateUrl: 'templates/chats/messages.html'
                }
            }
        })

        .state('tab.contacts', {
            url: '/contacts',
            cache: false,
            views: {
                'tab-chats': {
                    templateUrl: 'templates/contacts.html',
                }
            }
        })

        .state('tab.forum', {
            url: '/forum',
            cache: false,
            views: {
                'tab-forum': {
                    templateUrl: 'templates/forum/posts.html',
                }
            }
        })

        .state('tab.request', {
            url: '/request/:requestId',
            cache: false,
            views: {
                'tab-forum': {
                    templateUrl: 'templates/forum/request.html',
                }
            }
        })

        .state('tab.myAccount', {
            url: '/myAccount',
            cache: false,
            views: {
                'myAccount': {
                    templateUrl: 'templates/myAccount/myAccount.html'
                }
            }
        })

        .state('tab.showProfile', {
            url: '/showProfile',
            cache: false,
            views: {
                'myAccount': {
                    templateUrl: 'templates/myAccount/showProfile.html'
                }
            }
        })

        .state('tab.editProfile', {
            url: '/editProfile',
            views: {
                'myAccount': {
                    templateUrl: 'templates/myAccount/editProfile.html'
                }
            }
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');
    }

    function requestInterceptor($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    return config;
                },
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        }]);
    }

    // toastrConfig
    core.config(function (toastrConfig) {
        angular.extend(toastrConfig, {
            timeOut: 50000,
            positionClass: 'toast-top-center'
        });
    });

})();
