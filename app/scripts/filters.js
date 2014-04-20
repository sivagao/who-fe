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
        ]).filter('getRandomColor', [

            function() {
                return function(val) {
                    var colors = ['c38867', 'ffc247', '3baa24', '4cc9b6', '4e9ce6', 'ff7272', 'ff8f4b', '9777d6'];
                    return '#' + _.shuffle(colors)[0];
                }
            }
        ]);
});