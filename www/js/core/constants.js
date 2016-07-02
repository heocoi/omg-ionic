(function () {
    'use strict';

    angular.module('app.core').constant('API', {
        'BASE_URL': 'http://localhost:8000/api' /*test*/
        // 'BASE_URL': 'http://47.88.137.165/omg/api' /*prod*/
    });

    angular.module('app.core').constant('PUSHER', {
        'KEY': 'f3f621f802e912a07298'
    });

    // lodash support
    angular.module('app.core').constant('_', window._);

})();
