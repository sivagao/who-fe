//
// # GameOn (Inspired by jogabo.com)
// `GameOn` connects you with the players in your city and
// allows you to find, organize and share games effortlessly.
//
// 2013 Pablo De Nadai
//

'use strict';

var app = angular.module('whoApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ngTouch'
]);

// devcode: development
app.constant('ServerUrl', '//localhost:3000');
app.constant('ApiUrl', '//localhost:3000/api/1');
// endcode

// devcode: production
app.constant('ServerUrl', '/');
app.constant('ApiUrl', '/api/1');
// endcode

app.factory('whoHttpInterceptor', [

    function() {
        var interceptor = {
            responseError: function(resp) {
                console.log(resp);
                if (resp.status === 302) {
                    console.log(resp);
                }
            }
        };
        return interceptor;
    }
]);

app.factory('dataService', ['$http', '$q', '$rootScope',
    function($http, $q) {
        return {
            personList: {},
            loadIdx: function() {
                if (_.isEmpty(this.areaList) || _.isEmpty(this.productList)) {
                    var _self = this;
                    return $q.all([
                        $http.get('/api/v1/list/area'),
                        $http.get('/api/v1/list/product')
                    ]).then(function(results) {
                        _self.areaList = results[0].data;
                        _self.productList = results[1].data;
                        // get all data and then json it!
                        return;
                        window.productList = _self.productList;
                        $q.all(_.map(_self.areaList, function(area) {
                            return $http.get('/api/v1/area/' + area.name);
                        })).then(function(results) {
                            window._areaDetailList = _.pluck(results, 'data');
                            var _wandouNameList = _.uniq(_.flatten(_.pluck(_areaDetailList, 'members')));
                            $q.all(_.map(_wandouNameList, function(name) {
                                return $http.get('/api/v1/person/' + name);
                            })).then(function(results) {
                                window._wandouList = _.pluck(results, 'data');
                            });
                        });
                    });
                }
            },
            loadWandou: function(name) {
                if (_.isEmpty(this.personList[name])) {
                    var _self = this,
                        _wandou;
                    return $http.get('/api/v1/person/' + name, {
                        cache: true
                    }).then(function(resp) {
                        _self.personList[name] = resp.data;
                        _self.personList[name].nick = name;
                        return $http.get('/api/v1/area/' + resp.data.PA, {
                            cache: true
                        });
                    }).then(function(resp) {
                        _self.personList[name].colleagues = resp.data.members.slice(0, 18);
                    });
                }
            }
        }
    }
]);

app.config(function($routeProvider, $httpProvider, $locationProvider) {

    $httpProvider.interceptors.push('whoHttpInterceptor');

    // Add `withCredentials` header to requests. (CORS requirement)
    $httpProvider.defaults.withCredentials = true;

    // Enable HTML5 mode. (Remove the `#` from Url)
    $locationProvider.html5Mode(true);

    // Routing.
    $routeProvider
        .when('/', {
            templateUrl: '/views/main.html',
            requireAuthentication: false,
            controller: 'mainCtrl',
            resolve: {
                load: ['dataService',
                    function(dataService) {
                        return dataService.loadIdx();
                    }
                ]
            }
        })
        .when('/wandou/:name', {
            templateUrl: '/views/wandou.html',
            controller: 'wandouCtrl',
            resolve: {
                load: ['dataService', '$route',
                    function(dataService, $route) {
                        // $routeParams assign after route is changed.
                        return dataService.loadWandou($route.current.params.name);
                    }
                ]
            }
        })
        .when('/team/:name', {
            templateUrl: '/views/team.html',
            controller: 'teamCtrl'
        })
        .when('/area/:name', {
            templateUrl: '/views/area.html',
            controller: 'areaCtrl'
        })
        .when('/product/:name', {
            templateUrl: '/views/product.html',
            controller: 'productCtrl'
        })
        .when('/auth/signin', {
            templateUrl: '/views/authentication/SignInView.html',
            controller: 'AuthenticationCtrl',
            requireAuthentication: false
        })
        .when('/auth/signup', {
            templateUrl: '/views/authentication/SignUpView.html',
            controller: 'AuthenticationCtrl',
            requireAuthentication: false
        })
        .otherwise({
            redirectTo: '/',
            requireAuthentication: false
        });

});

app.controller('mainCtrl', ['$scope', '$rootScope', '$timeout', '$http', 'dataService',
    function($scope, $rootScope, $timeout, $http, dataService) {
        Holder.run();
        $scope.areaList = dataService.areaList;
        $scope.productList = dataService.productList;
        $('body').animate({
            scrollTop: 80
        }, 800);

        // $http.get('/api/v1/list/area').then(function(resp) {
        //     console.log(resp.data);
        //     $scope.areaList = resp.data;
        // });

        // $http.get('/api/v1/list/product').then(function(resp) {
        //     console.log(resp.data);
        //     $rootScope.productList = resp.data;
        // });

        $scope.teamList = [];
        _.times(12, function() {
            $scope.teamList.push({
                key: 'frontend',
                name: 'FrontEnd',
                number: 40,
                description: '负责公司内数据分析产品的研发与运营，同时与各项目组一同对数据深入分析与整理。例如看不明白某个数据，不知道某个数据去哪里找，可以咨询DM.'
            });
        });
        $scope.showAllProjects = function() {
            $container.isotope('appended', $(newElements));
        };

        function processTeams(items) {
            items = _.map(items, function(item, idx) {
                // sky, vine, lava, gray, industrial, and social
                var themes = ['sky', 'vine', 'lava', 'industrial', 'social'];
                return {
                    src: 'holder.js/150x150/' + _.shuffle(themes)[0] + '/text:TEAM NAME' + idx,
                    name: 'Team' + idx,
                    id: idx
                };
            });
            items = _.shuffle(items);
            // randomize
            // 只是显示5个
            return items;
        }

        function processWandous(items) {
            items = _.map(items, function(item, idx) {
                var themes = ['sky', 'vine', 'lava', 'industrial', 'social'];
                return {
                    src: 'holder.js/150x150/' + _.shuffle(themes)[0] + '/text:USER NAME' + idx,
                    name: '匿名用户' + idx,
                    id: idx
                };
            });
            items = _.shuffle(items);
            // randomize
            // add placeholder - 置顶广告位
            // 只是显示20个 - ng-show, idx<20
            return items;
        }

        var fakeWandous = _.map(_.range(20), function() {
            return {};
        });

        // $rootScope.teams = processTeams(fakeTeams);
        $rootScope.wandous = processWandous(fakeWandous);
    }
]);

app.controller('wandouCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$routeParams', 'dataService',
    function($scope, $rootScope, $timeout, $http, $routeParams, dataService) {
        $('body').animate({
            scrollTop: 120
        }, 800);

        $scope.wandouInfo = dataService.personList[$routeParams.name];
        $timeout(function() {
            Holder.run();
        });
    }
]);

app.controller('teamCtrl', ['$scope', '$rootScope', '$timeout',
    function($scope, $rootScope, $timeout) {
        $('body').animate({
            scrollTop: 120
        }, 800);

        $scope.teamInfo = {
            'name': 'Design',
            'desc': '负责公司内数据分析产品的研发与运营，同时与各项目组一同对数据深入分析与整理。例如看不明白某个数据，不知道某个数据去哪里找，可以咨询DM',
            'team': 'Design',
            'owner': '刘亚平',
            'email': 'bubu@wandouija.com'
        };
    }
]);

app.controller('areaCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$routeParams',
    function($scope, $rootScope, $timeout, $http, $routeParams) {
        $('body').animate({
            scrollTop: 120
        }, 800);

        $http.get('/api/v1/area/' + $routeParams.name, {
            cache: true
        }).then(function(resp) {
            console.log(resp);
            $scope.areaInfo = resp.data;
            $timeout(function() {
                Holder.run();
            });
        });
    }
]);

app.controller('productCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$routeParams',
    function($scope, $rootScope, $timeout, $http, $routeParams) {

        if (!$rootScope.productList) {
            $http.get('/api/v1/list/product').then(function(resp) {
                console.log(resp.data);
                $rootScope.productList = resp.data;
            }).then(function() {
                $scope.productInfo = _.find($rootScope.productList, function(p) {
                    return p.name === $routeParams.name;
                });
            });
        } else {
            $scope.productInfo = _.find($rootScope.productList, function(p) {
                return p.name === $routeParams.name;
            });
        }

        $timeout(function() {
            Holder.run();
        });
    }
]);

app.controller('navbarCtrl', ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {
        $scope.focusHandler = function() {
            $location.path('/');
        };

    }
]);

app.run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function() {
        // run some code to do your animations
    });
});