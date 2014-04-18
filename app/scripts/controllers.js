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
        .controller('wandouCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$routeParams', 'dataService',
            function($scope, $rootScope, $timeout, $http, $routeParams, dataService) {
                // $('body').animate({
                //     scrollTop: 120
                // }, 800);

                $scope.wandouInfo = dataService.personDict[$routeParams.name];
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
        .controller('searchCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$routeParams',
            function($scope, $rootScope, $timeout, $http, $routeParams) {
                $('body').animate({
                    scrollTop: 120
                }, 800);
                console.log('searchCtrl');

                $http.get('/api/v1/query', {
                    params: {
                        word: $routeParams.word
                    },
                    cache: true
                }).then(function(resp) {
                    if ((resp.data.length === 1) && _.isEmpty(resp.data[0])) {
                        console.log('NO RESULT');
                        return;
                    }
                    $scope.searchInfo = _.groupBy(resp.data, function(item) {
                        return item.type
                    });
                    console.log(resp);
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
                $scope.focusHandler = function() {
                    $location.path('/');
                };

                $scope.$watch('navbarQuery', function(val) {
                    if (val) {
                        $http.get('/api/v1/query?word=' + val).then(function(resp) {
                            $scope.searchResults = resp.data;
                            console.log($scope.searchResults);
                        });
                    }
                });
            }
        ]);
});