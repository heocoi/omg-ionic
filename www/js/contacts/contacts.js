(function () {
    'use strict';

    angular.module('app.contacts').controller('ContactsCtrl', ContactsCtrl);
    ContactsCtrl.$inject = ['$scope', '$state', '$http', '$ionicModal', 'API'];

    function ContactsCtrl($scope, $state, $http, $ionicModal, API) {
        var vm = this;
        vm.contact = {};
        vm.showContact = showContact;
        vm.chatWith = chatWith;

        active();

        /////////////////////

        function active() {
            $http.get(API.BASE_URL + '/users').success(function (data) {
                console.log(data);
                vm.contacts = data.users;
            }).error(function (data) {
                console.log(data);
            });

            $ionicModal.fromTemplateUrl('my-modal.html', {
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
            };
        }

        function showContact(userId) {
            for (var i = 0; i < vm.contacts.length; i++) {
                var c = vm.contacts[i];
                if (c.id === userId) {
                    vm.contact = c;
                    break;
                }
            }
        }

        function chatWith(userId) {
            $http.get(API.BASE_URL + '/threads/participants/' + userId).success(function (data) {
                // console.log(data);
                // go to specify thread if chatted with user before
                if (data.threads.length) {
                    var threadId = data.threads[0]['id'];
                    // console.log(threadId);
                    vm.modal.hide();
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
                        vm.modal.hide();
                        $state.go('tab.chat-detail', {chatId: data.thread.id});
                    }).error(function (data) {
                        console.log(data);
                    });
                }
            }).error(function (data) {
                console.log(data);
            });
        }

    }

})();
