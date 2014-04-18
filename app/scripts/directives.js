define([], function() {
    'use strict';

    angular.module('whoApp.directives', [])
        .directive('openHeaderNav', [

            function() {
                return {
                    link: function(scope, elem, attrs) {
                        scope.$watch('$root.routePath', function(val) {
                            if (val) {
                                val = val.replace(/\?.*$/, '');
                            } else {
                                return;
                            }
                            elem.find('.main-nav li a').removeClass('current');
                            switch (val) {
                                case '/open-api':
                                    jQuery('.pmt-nav li').eq(0).find('a').addClass('current');
                                    break;
                                case '/open-api/usage':
                                    jQuery('.pmt-nav li').eq(2).find('a').addClass('current');
                                    break;
                                case '/open-api/config':
                                    jQuery('.pmt-nav li').eq(1).find('a').addClass('current');
                                    break;
                                default:
                                    if (val.indexOf('/open-api/config') > -1) {
                                        jQuery('.pmt-nav li').eq(1).find('a').addClass('current');
                                    }
                                    break;
                            }
                        });
                    }
                }
            }
        ])
        .directive('openPackageUpload', [

            function() {
                return {
                    priority: 10,
                    controller: ['$scope', '$rootScope', '$element', '$attrs', '$http', '$filter',
                        function($scope, $rootScope, $elem, $attrs, $http, $filter) {
                            $scope.oemPkgNotifyHandler = function(ev) {
                                console.log(ev);
                                if (ev == 1) {
                                    $scope.channelPkgUploadStatus = '正在进行安全扫描...';
                                } else {
                                    $scope.channelPkgUploadStatus = '正在上传...' + $filter('humanBytes')(ev * $scope.channelPkgTask.totalBytes) + '/' + $filter('humanBytes')($scope.channelPkgTask.totalBytes);
                                }
                            };
                            $scope.oemPkgAddHandler = function(e, task) {
                                console.log(task);
                                $rootScope.vm.apkWarning = '';
                                $scope.channelPkgTask = task;
                            };
                            $scope.oemPkgSuccessHandler = function(resp) {
                                console.log(resp);
                                $scope.channelPkgUploadStatus = '';
                                // emit upload resp
                                if (!resp.success) {
                                    $scope.channelPkgUploadStatus = '解析失败，请重新上传';
                                } else {
                                    $scope.currentConfig.oemApks = resp.apks;
                                    $scope.channelPkgUploadStatus = '已上传成功';
                                }
                                return;
                                $scope.$emit('uploader-' + $scope.channelPkgTask.endpoint, resp);
                                if (resp.packageName) {
                                    if (resp.itemStatus != 'SHOW' || resp.auditStatus != 'PASS') {
                                        $rootScope.vm.apkWarning = resp.auditDetail.replace('({0}，{1})', '');
                                        $scope.channelPkgUploadStatus = '';
                                        return;
                                    }
                                    $scope.campaign.uploadPackageName = resp.packageName;
                                    $scope.campaign.uploadMd5 = resp.md5;
                                    $scope.channelPkgUploadStatus = '已上传成功';
                                } else {
                                    $rootScope.vm.apkWarning = 'APK解析错误，请重新上传';
                                }
                                $rootScope.vm.uploadedSize = 0;
                                $rootScope.vm.isOnApkUploading = false;
                            };
                        }
                    ]
                };
            }
        ])
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
});