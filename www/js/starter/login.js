(function () {
    'use strict';

    angular.module('app.starter').controller('LoginCtrl', LoginCtrl);
    LoginCtrl.$inject = ['$scope', '$state', '$http', '$localStorage', 'auth'];

    function LoginCtrl($scope, $state, $http, $localStorage, auth) {
        var vm = this;
        vm.submit = submit;

        function submit() {
            // transition to dash if authenticated
            auth.login({
                email: vm.email,
                password: vm.password
            }, function (data) {
                // FIXME change path to home page
                $state.transitionTo('tab.map');
                $localStorage.token = data.token;
                console.log(data);
                console.log(auth.getTokenClaims());
            }, function () {
                vm.error = 'Login failed.';
            });
        }

    }

})();
