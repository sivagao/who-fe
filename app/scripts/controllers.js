'use strict';
// dataService 对httpInterceptor， 对所以4xx等错误alert提示
angular.module('whoApp.controllers', ['whoApp.services'])
    .controller('loginCtrl', ['$scope', '$rootScope', '$timeout', 'dataService', '$location',
        function($scope, $rootScope, $timeout, dataService, $location) {
            $scope.loginHandler = function() {
                $scope.errorMsg = '';
                if ($scope.username && $scope.password) {
                    dataService.login($scope.username, $scope.password).then(function() {
                        $location.path('/');
                    }, function() {
                        $scope.errorMsg = '用户名或者密码错误， 请使用豌豆荚wiki帐号登录。';
                    });
                } else {
                    $scope.errorMsg = '请先填写相关信息';
                }
            };
        }
    ])
    .controller('homeCtrl', ['$scope', '$rootScope', '$timeout', '$http', 'dataService', '$filter',
        function($scope, $rootScope, $timeout, $http, dataService, $filter) {
            $scope.areaList = dataService.areaList;
            $scope.productList = dataService.productList;
            $scope.functionList = dataService.functionList;
            _.each(dataService.personList, function(item) {
                item.img = $filter('checkImg2')(item.img);
            });
            $scope.personList = dataService.personList;
        }
    ])
    .controller('wandouCtrl', ['$scope', '$rootScope', '$timeout', '$routeParams', 'dataService', '$configData',
        function($scope, $rootScope, $timeout, $routeParams, dataService, $configData) {

            $scope.xingzuoList = $configData.xingzuoList;
            $scope.provinceList = $configData.provinceList;
            $scope.wandouInfo = dataService.personDict[$routeParams.name];
            if (!$scope.wandouInfo.socials) {
                $scope.wandouInfo.socials = [];
            }

            $scope.updateWandouInfoHandler = function() {
                dataService.updateWandou($scope.wandouInfo).then(function() {
                    $scope.isShowEditForm = false;
                });
            };

            $scope.$watch('imageUpload', function(val) {
                if (val) {
                    var formData = new FormData();

                    formData.append("file", $scope.imageUpload.file);

                    var request = new XMLHttpRequest();
                    request.open("POST", "/api/v1/update/");
                    request.send(formData);
                }
            });
        }
    ])
    .controller('areaCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$routeParams', '$filter',
        function($scope, $rootScope, $timeout, $http, $routeParams, $filter) {

            $http.get('/api/v1/area/' + $routeParams.name, {
                cache: false
            }).then(function(resp) {
                _.each(resp.data.members, function(item) {
                    item.img = $filter('checkImg2')(item.img);
                });
                $scope.areaInfo = resp.data;
            });
        }
    ])
    .controller('searchCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$routeParams', 'dataService', '$filter',
        function($scope, $rootScope, $timeout, $http, $routeParams, dataService, $filter) {
            dataService.query($routeParams.word).then(function(resp) {
                if ((resp.data.length === 1) && _.isEmpty(resp.data[0])) {
                    console.log('NO RESULT');
                    return;
                }
                $scope.searchInfo = _.groupBy(resp.data, function(item) {
                    return item.type
                });
                _.each($scope.searchInfo, function(type) {
                    _.each(type, function(item) {
                        item.color = $filter('getRandomColor')('color');
                    });
                });
                $scope.searchWord = $routeParams.word;
            });
        }
    ])
    .controller('productCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$routeParams', 'dataService',
        function($scope, $rootScope, $timeout, $http, $routeParams, dataService) {
            $scope.productInfo = dataService.productDict[$routeParams.name];
        }
    ])
    .controller('functionCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$routeParams', 'dataService',
        function($scope, $rootScope, $timeout, $http, $routeParams, dataService) {
            $scope.functionInfo = dataService.functionDict[$routeParams.name];
        }
    ])
    .controller('navbarCtrl', ['$scope', '$rootScope', '$location', '$http',
        function($scope, $rootScope, $location, $http) {
            $scope.keydownHandler = function(e) {
                if (e.keyCode === 13) {
                    $location.path('/search/' + $scope.navbarQuery);
                }
            }
            $scope.$watch('navbarQuery', function(val) {
                if (val) {
                    $location.path('/search/' + val);
                }
            });
        }
    ]);