(function () {
    'use strict';

    angular.module('app.map').controller('MapCtrl', MapCtrl);
    MapCtrl.$inject = ['$scope', '$ionicLoading', 'leafletData', '$http', 'API', '_', '$state'];

    function MapCtrl($scope, $ionicLoading, leafletData, $http, API, _, $state) {
        var vm = this;
        vm.map = {
            defaults: {
                tileLayer: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                tileLayerOptions: {
                    reuseTiles: true
                },
                scrollWheelZoom: false
            }
        };
        vm.ready = false;
        vm.userCurPos = {}; // user's current position
        vm.closePreview = closePreview;
        vm.focusMap = focusMap;
        vm.chatWith = chatWith;
        vm.viewRequest = viewRequest;

        active();

        $scope.$on('leafletDirectiveMarker.map.click', function (event, args) {
            var selectedUserId = args.modelName;
            $http.get(API.BASE_URL + '/users/' + selectedUserId).success(function (data) {
                vm.selectedUser = data.user;
                // get the latest request of user if exist
                vm.selectedUser.request = _.reverse(_.sortBy(data.requests, 'updated_at'))[0];
                console.log(data);
            }).error(function (data) {
                // console.log(data);
            });
        });

        // fix map not showing correctly after closed modal
        $scope.$on('$ionicView.afterEnter', function() {
            // trigger the resize event before entering in the view that contains the map
            ionic.trigger('resize');
        });

        //////////////////

        function active() {
            // loading state
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            // customized marker icon to show user's current pos
            var cuzMarkerIco = {
                iconUrl: 'https://maxcdn.icons8.com/Color/PNG/48/Maps/marker-48.png'
            };

            navigator.geolocation.getCurrentPosition(function (pos) {
                var lat = pos.coords.latitude, lng = pos.coords.longitude;
                vm.userCurPos = pos;
                console.log([lat, lng]);
                angular.extend(vm.map, {
                    center: {
                        lat: lat,
                        lng: lng,
                        zoom: 11
                    },
                    markers: {
                        centerMarker: {
                            lat: lat,
                            lng: lng,
                            focus: true,
                            draggable: false,
                            icon: cuzMarkerIco
                        },
                        // XXX dummy data
                        // TODO markerName must be user id
                        1: {
                            lat: lat - 0.05,
                            lng: lng - 0.05,
                            focus: false,
                            draggable: false
                        },
                    }
                });
                console.log(pos);
                $scope.$apply(function () {
                    vm.ready = true;
                });
                // hide loading to show content
                $ionicLoading.hide();
            });

            $http.get(API.BASE_URL + '/requestCategories').success(function (data) {
                vm.categories = data.categories;
            });
        }

        function closePreview() {
            vm.selectedUser = null;
        }

        function focusMap() {
            console.log('yawn');
            leafletData.getMap('map').then(function (map) {
                map.panTo(new L.LatLng(vm.userCurPos.coords.latitude, vm.userCurPos.coords.longitude));
            });
        }

        function chatWith(userId) {
            $http.get(API.BASE_URL + '/threads/participants/' + userId).success(function (data) {
                // console.log(data);
                // go to specify thread if chatted with user before
                if (data.threads.length) {
                    var threadId = data.threads[0]['id'];
                    // console.log(threadId);
                    $state.go('tab.chat-detail', {chatId: threadId});
                    // XXX when go to child page (msg detail page), back button is not showed
                    // then, unable to back parent page (threads page)
                    // @link https://github.com/driftyco/ionic/issues/437
                } else {
                    // else, create new thread with current user as creator
                    $http.post(API.BASE_URL + '/threads', {
                        subject: '', // FIXME is required?
                        recipients: [userId]
                    }).success(function (data) {
                        $state.go('tab.chat-detail', {chatId: data.thread.id});
                    }).error(function (data) {
                        console.log(data);
                    });
                }
            }).error(function (data) {
                console.log(data);
            });
        }

        function viewRequest(requestId) {
            $state.go('tab.request', {requestId: requestId});
        }
    }
})();
