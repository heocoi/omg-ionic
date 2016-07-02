(function () {
    'use strict';

    angular.module('app.forum').controller('ForumCtrl', ForumCtrl);
    ForumCtrl.$inject = ['$scope', '$ionicModal', '$http', 'API', '$state', 'auth', '_'];

    function ForumCtrl($scope, $ionicModal, $http, API, $state, auth, _) {
        var vm = this;
        vm.tokenClaims = auth.getTokenClaims();
        vm.request = {};
        vm.errors = [];
        vm.sendRequest = sendRequest;
        vm.allRequests = [];
        vm.myrequests = [];

        active();

        function active() {
            vm.myId = vm.tokenClaims.sub;

            $ionicModal.fromTemplateUrl('composeModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                vm.modal = modal;
            });
            vm.openModal = function() {
                vm.modal.show();
            };
            vm.closeModal = function() {
                vm.modal.hide();
                vm.errors = [];
                vm.request = {};
            };
            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                vm.modal.remove();
            });

            $http.get(API.BASE_URL + '/requests').success(function (data) {
                vm.allRequests = _.reverse(_.sortBy(data.requests, 'updated_at'));
                console.log(data);
            });

            $http.get(API.BASE_URL + '/users/' + vm.myId + '/requests').success(function (data) {
                vm.myRequests = _.reverse(_.sortBy(data.requests, 'updated_at'));
                console.log(data);
            });

            $http.get(API.BASE_URL + '/requestCategories').success(function (data) {
                vm.categories = data.categories;
                console.log(data);
            });
        }

        function sendRequest() {
            // valdate user input
            vm.errors = validateInput();
            if (!vm.errors.length) {
                $http.post(API.BASE_URL + '/requests', {
                    category_id: vm.request.categoryId,
                    start_time: vm.request.startDatetime,
                    end_time: vm.request.endDatetime,
                    place: vm.request.place,
                    description: vm.request.description
                }).success(function (data) {
                    vm.modal.hide();
                    $state.go('tab.forum', {}, {reload: true});
                    console.log(data);
                });
            }

            function validateInput() {
                var errors = [];
                if (angular.isUndefined(vm.request.categoryId)) {
                    errors.push('Request title is required');
                }
                if (angular.isUndefined(vm.request.startDatetime)) {
                    errors.push('Start time is required');
                }
                if (angular.isUndefined(vm.request.endDatetime)) {
                    errors.push('End time is required');
                }
                if (angular.isUndefined(vm.request.place)) {
                    errors.push('Place is required');
                }
                if (angular.isUndefined(vm.request.description)) {
                    errors.push('Description is required');
                }
                return errors;
            }
        }
    }

})();
