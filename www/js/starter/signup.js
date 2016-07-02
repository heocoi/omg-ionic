(function () {
    'use strict';

    angular.module('app.starter').controller('SignupCtrl', SignupCtrl);
    SignupCtrl.$inject = ['$scope', '$state', '$http', '$localStorage', 'auth'];

    function SignupCtrl($scope, $state, $http, $localStorage, auth) {
        var vm = this;
        vm.submit = submit;

        function submit() {
            auth.signup({
                email: vm.email,
                password: vm.password
            }, function success(data) {
                // FIXME change path to home page
                $state.transitionTo('tab.map');
                $localStorage.token = data.token;
            }, function error(data) {
                vm.error = data.error;
            });
        }
    }

})();
