(function () {
    'use strict';

    angular.module('app').controller('AppCtrl', AppCtrl);
    AppCtrl.$inject = ['$rootScope', '$scope', '$state', '$http', 'API', 'pusherService', 'auth', '_', 'toastr'];

    function AppCtrl($rootScope, $scope, $state, $http, API, pusherService, auth, _, toastr) {
        var vm = this;
        vm.tokenClaims = auth.getTokenClaims();

        active();

        //////////////////

        function active() {
            vm.myId = vm.tokenClaims.sub;
            //  subscribe to events and be notified when messages
            var channel = pusherService.getChannel('for_user_' + vm.myId);

            channel.bind('new_request', function(data) {
                // console.log(data);
                toastr.info(data.notify, 'Have new request!', {
                    onTap: function (e) {
                        $state.go('tab.request', {requestId: data.request_id});
                    }
                });
            });
        }
    }
})();
