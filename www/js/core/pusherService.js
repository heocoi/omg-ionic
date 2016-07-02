(function () {
    'use strict';

    angular.module('app.core').factory('pusherService', pusherService);
    pusherService.$inject = ['PUSHER', '$pusher'];

    function pusherService(PUSHER, $pusher) {
        var client = new Pusher(PUSHER.KEY);
        var pusher = $pusher(client);
        var service = {
            getChannel: getChannel
        };

        return service;

        function getChannel(channelName) {
            return pusher.subscribe(channelName);
        }
    }

})();
