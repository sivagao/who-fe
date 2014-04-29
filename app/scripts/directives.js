'use strict';

angular.module('whoApp.directives', [])
    .controller('pmtAlertController', ['$scope', '$attrs',
        function($scope, $attrs) {
            $scope.closeable = 'close' in $attrs;
        }
    ])
    .factory('$alert', ['$rootScope', '$timeout',
        function($rootScope, $timeout) {
            return {
                add: function(msgObj) {
                    // alert 或者 填入到$rootScope._ctx.alerts中
                    $rootScope._alerts = $rootScope._alerts || [];
                    $rootScope._alerts.push(msgObj);
                    $timeout(function() {
                        var idx = $rootScope._alerts.indexOf(msgObj);
                        $rootScope._alerts.splice(idx, 1);
                    }, 3000);
                }
            }
        }
    ])
    .directive('pmtAlert', function() {
        return {
            restrict: 'EA',
            controller: 'pmtAlertController',
            templateUrl: 'template/alert/alert.html',
            transclude: true,
            replace: true,
            scope: {
                type: '=',
                close: '&'
            }
        };
    })
    .run(["$templateCache",
        function($templateCache) {
            $templateCache.put("template/alert/alert.html",
                "<div class='alert' ng-class='\"alert-\" + (type || \"warning\")'>\n" +
                "    <button ng-show='closeable' type='button' class='close' ng-click='close()'>&times;</button>\n" +
                "    <div ng-transclude></div>\n" +
                "</div>\n" +
                "");
        }
    ]);