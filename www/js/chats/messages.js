(function () {
    'use strict';

    angular.module('app.chats').controller('MessagesCtrl', MessagesCtrl);
    MessagesCtrl.$inject = ['auth', '$rootScope', '$scope', '$state', '$stateParams', '$http', '$timeout', '$ionicScrollDelegate', 'pusherService', 'API'];

    function MessagesCtrl(auth, $rootScope, $scope, $state, $stateParams, $http, $timeout, $ionicScrollDelegate, pusherService, API) {
        var vm = this;
        var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
        vm.sendMessage = sendMessage;
        vm.inputUp = inputUp;
        vm.inputDown = inputDown;
        vm.messages = [];
        vm.tokenClaims = auth.getTokenClaims();
        vm.keyboardHeight = 0;

        active();

        //////////////////

        function active() {
            vm.myId = vm.tokenClaims.sub;
            // hide tabs
            $rootScope.hideTabs = true;

            // scroll to last message (bottom)
            $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
            }, 1000);

            if (window.cordova) {
                cordova.plugins.Keyboard.show();
            }

            // console.log($stateParams.chatId);
            $http.get(API.BASE_URL + '/threads/' + $stateParams.chatId).success(function (data) {
                vm.messages = data.thread.messages;
                vm.partnerId = data.partnerId;
                $http.get(API.BASE_URL + '/users/' + vm.partnerId).success(function (data) {
                    vm.partner = data.user;
                });
                console.log(data);
            }).error(function (data) {
                console.log(data);
            });

            //  subscribe to events and be notified when messages
            var channel = pusherService.getChannel('for_user_' + vm.myId);
            channel.bind('new_message', function(data) {
                vm.messages.push({
                    body: data.text,
                    user_id: data['sender_id'],
                    created_at: data['thread_created_at']['date'],
                    partner: {
                        email: data['sender_name']
                    }
                });
                console.log(data);
                scrollBottom();
            });
        }

        function sendMessage() {
            // call API to add message to thread
            var message = {};
            message.body = vm.message;
            message.recipients = [vm.partnerId];
            $http.post(API.BASE_URL + '/threads/' + $stateParams.chatId, message).success(function (data) {
                console.log(data);
            }).error(function (data) {
                console.log(data);
            });

            vm.messages.push({
                body: vm.message,
                user_id: vm.myId
            });

            delete vm.message;
            scrollBottom();
        };

        function inputUp() {
            if (isIOS) vm.keyboardHeight = 216;
            scrollBottom();
        };

        function inputDown() {
            if (isIOS) vm.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };

        function scrollBottom() {
            $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);
        }
    }
})();
