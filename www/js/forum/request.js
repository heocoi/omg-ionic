(function () {
    'use strict';

    angular.module('app.forum').controller('RequestCtrl', RequestCtrl);
    RequestCtrl.$inject = ['$scope', '$state', '$stateParams', '$http', 'API', '$ionicNavBarDelegate', 'auth', '$ionicModal'];

    function RequestCtrl($scope, $state, $stateParams, $http, API, $ionicNavBarDelegate, auth, $ionicModal) {
        var vm = this;
        vm.back = back;
        vm.tokenClaims = auth.getTokenClaims();
        vm.save = save;

        active();

        function active() {
            // hide back button (use customized-back button)
            $ionicNavBarDelegate.showBackButton(false);

            vm.myId = vm.tokenClaims.sub;

            $http.get(API.BASE_URL + '/requests/' + $stateParams.requestId).success(function (data) {
                vm.request = data.request;
            });

            $http.get(API.BASE_URL + '/requestCategories').success(function (data) {
                vm.categories = data.categories;
            });

            $ionicModal.fromTemplateUrl('editRequestModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                vm.modal = modal;
            });
            vm.openModal = function() {
                vm.modal.show();
                console.log(vm.request);
            };
            vm.closeModal = function() {
                vm.modal.hide();
                vm.errors = [];
            };
            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                vm.modal.remove();
            });

        }

        function back() {
            $state.go('tab.forum');
        }

        function save() {
            $http.post(API.BASE_URL + '/requests/' + vm.request.id, {
                category_id: vm.request.category_id,
                start_time: vm.request.start_time,
                end_time: vm.request.end_time,
                place: vm.request.place,
                description: vm.request.description
            }).success(function (data) {
                vm.closeModal();
                $state.go($state.current, {}, {reload: true});
            })
        }
    }
})();
