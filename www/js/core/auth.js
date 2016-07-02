(function () {
    'use strict';

    angular.module('app.core').factory('auth', auth);
    auth.$inject = ['$http', '$localStorage', 'API', '$ionicHistory'];

    function auth($http, $localStorage, API, $ionicHistory) {
        return {
            signup: function (data, success, error) {
                $http.post(API.BASE_URL + '/signup', data).success(success).error(error)
            },
            login: function (data, success, error) {
                $http.post(API.BASE_URL + '/login', data).success(success).error(error)
            },
            logout: function (success) {
                delete $localStorage.token;
                $ionicHistory.clearCache();
                success();
            },
            getTokenClaims: function () {
                return getClaimsFromToken();
            }
        };

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                break;
                case 2:
                output += '==';
                break;
                case 3:
                output += '=';
                break;
                default:
                throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getClaimsFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }
    }

})();
