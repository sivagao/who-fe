define([], function() {
    'use strict';
    // dataService 对httpInterceptor， 对所以4xx等错误alert提示
    angular.module('whoApp.controllers', ['whoApp.services'])
        .controller('homeCtrl', ['$scope', '$rootScope', '$timeout', '$http', 'dataService',
            function($scope, $rootScope, $timeout, $http, dataService) {
                $scope.areaList = dataService.areaList;
                $scope.productList = dataService.productList;
                $scope.personList = dataService.personList;
            }
        ])
        .controller('wandouCtrl', ['$scope', '$rootScope', '$timeout', '$routeParams', 'dataService', '$configData',
            function($scope, $rootScope, $timeout, $routeParams, dataService, $configData) {
                // $('body').animate({
                //     scrollTop: 120
                // }, 800);

                $scope.xingzuoList = $configData.xingzuoList;
                $scope.provinceList = $configData.provinceList;
                $scope.wandouInfo = dataService.personDict[$routeParams.name];

                console.log($scope.wandouInfo);

                $scope.updateWandouInfoHandler = function() {
                    console.log($scope.wandouInfo);
                    dataService.updateWandou($scope.wandouInfo).then(function() {
                        $scope.isShowEditForm = false;
                    });
                };
            }
        ])
        .controller('areaCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$routeParams',
            function($scope, $rootScope, $timeout, $http, $routeParams) {

                $http.get('/api/v1/area/' + $routeParams.name, {
                    cache: true
                }).then(function(resp) {
                    console.log(resp);
                    $scope.areaInfo = resp.data;
                });
            }
        ])
        .controller('searchCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$routeParams', 'dataService', '$filter',
            function($scope, $rootScope, $timeout, $http, $routeParams, dataService, $filter) {
                console.log('searchCtrl');


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
                    console.log($scope.searchInfo);
                });
            }
        ])
        .controller('productCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$routeParams', 'dataService',
            function($scope, $rootScope, $timeout, $http, $routeParams, dataService) {
                $scope.productInfo = dataService.productDict[$routeParams.name];
            }
        ])
        .controller('navbarCtrl', ['$scope', '$rootScope', '$location', '$http',
            function($scope, $rootScope, $location, $http) {
                $scope.keydownHandler = function(e) {
                    console.log(e);
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
});