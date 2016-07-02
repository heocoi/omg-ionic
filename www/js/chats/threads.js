(function () {
    'use strict';

    angular.module('app.chats').controller('ThreadsCtrl', ThreadsCtrl);
    ThreadsCtrl.$inject = ['$rootScope', '$scope', '$state', '$http', 'API', 'pusherService', 'auth', '_'];

    function ThreadsCtrl($rootScope, $scope, $state, $http, API, pusherService, auth, _) {
        var vm = this;
        vm.tokenClaims = auth.getTokenClaims();

        active();

        //////////////////

        function active() {
            vm.myId = vm.tokenClaims.sub;
            getThreads();

            //  subscribe to events and be notified when messages
            var channel = pusherService.getChannel('for_user_' + vm.myId);
            channel.bind('new_message', function(data) {
                console.log(data);
                getThreads();
            });

            function getThreads() {
                $http.get(API.BASE_URL + '/threads').success(function (data) {
                    // sort in desc order by updated timestamp
                    vm.threads = _.reverse(_.sortBy(data.threads, 'updated_at'));
                    console.log(data);
                }).error(function (data) {
                    console.log(data);
                });
            }


        }
    }
})();
