(function () {
    'use strict';

    angular.module('app.myAccount').controller('MyAccountCtrl', MyAccountCtrl);
    MyAccountCtrl.$inject = ['$scope', '$state', 'auth', '$ionicHistory', '$http', 'API'];

    function MyAccountCtrl($scope, $state, auth, $ionicHistory, $http, API) {
        var vm = this;
        vm.logout = logout;
        vm.tokenClaims = auth.getTokenClaims();
        vm.setShareLocation = setShareLocation;
        vm.setPushNotifications = setPushNotifications;

        active();

        function active() {
            vm.myId = vm.tokenClaims.sub;
            $http.get(API.BASE_URL + '/users/' + vm.myId).success(function (data) {
                vm.user = data.user;
                console.log(data);
            });
        }

        function logout() {
            auth.logout(redirect);
        }

        function redirect() {
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            $state.go('login');
        }

        function setShareLocation() {
            $http.post(API.BASE_URL + '/users/' + vm.myId + '/profile', {
                is_sharing_location: vm.user.is_sharing_location
            }).success(function (data) {
                console.log(data);
            }).error(function (data) {
                console.log(data);
            });
        }

        function setPushNotifications() {
            $http.post(API.BASE_URL + '/users/' + vm.myId + '/profile', {
                receive_notifications: vm.user.receive_notifications
            }).success(function (data) {
                console.log(data);
            }).error(function (data) {
                console.log(data);
            });
        }
    }
})();
