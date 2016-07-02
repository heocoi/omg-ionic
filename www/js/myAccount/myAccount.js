(function () {
    'use strict';

    angular.module('app.myAccount').controller('MyAccountCtrl', MyAccountCtrl);
    MyAccountCtrl.$inject = ['$scope', '$state', 'auth', '$ionicHistory', '$http', 'API'];

    function MyAccountCtrl($scope, $state, auth, $ionicHistory, $http, API) {
        var vm = this;
        vm.logout = logout;
        vm.tokenClaims = auth.getTokenClaims();

        active();

        function active() {
            vm.myId = vm.tokenClaims.sub;
            $http.get(API.BASE_URL + '/users/' + vm.myId).success(function (data) {
                vm.user = data.user;
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
    }
})();
