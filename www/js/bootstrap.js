(function () {
    'use strict';

    angular.module('app').run(bootstrap);
    bootstrap.$inject = ['$ionicPlatform', '$rootScope', '$localStorage', '$location'];

    function bootstrap($ionicPlatform, $rootScope, $localStorage, $location) {
        // XXX $ionicPlatform.ready() not working correctly (plugins was not initialized) on iPhone
        // $ionicPlatform.ready(function() {
        document.addEventListener("deviceready", function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

        }, false);

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            // reset configs when stateprovider was changed
            $rootScope.hideTabs = false;
        });
    }
})();
