(function () {
    'use strict';

    angular.module('app.myAccount').controller('ProfileCtrl', ProfileCtrl);
    ProfileCtrl.$inject = ['auth', 'API', '$http', '$state'];

    function ProfileCtrl(auth, API, $http, $state) {
        var vm = this;
        vm.tokenClaims = auth.getTokenClaims();
        vm.saveProfile = saveProfile;

        active();

        function active() {
            vm.myId = vm.tokenClaims.sub;
            $http.get(API.BASE_URL + '/users/' + vm.myId).success(function (data) {
                vm.user = data.user;
            });
        }

        function saveProfile() {
            $http.post(API.BASE_URL + '/users/' + vm.myId + +'/profile', {
                first_name: vm.user.first_name,
                last_name: vm.user.last_name,
                age: vm.user.age,
                country: vm.user.country,
                language: vm.user.language,
                introduction: vm.user.introduction
            }).success(function (data) {
                $state.go('tab.showProfile');
            }).error(function (data) {
                console.log(data);
            });
        }
    }

})();
