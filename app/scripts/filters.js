define([], function() {
    'use strict';

    angular.module('whoApp.filters', [])
        .filter('isEmpty', [

            function() {
                return function(val) {
                    return _.isEmpty(val);
                }
            }
        ]).filter('checkImg', [

            function() {
                return function(val) {
                    if (_.isEmpty(val)) {
                        return 'http://img.wdjimg.com/who/default-avatar.png';
                    }
                    return val;
                }
            }
        ]);
});