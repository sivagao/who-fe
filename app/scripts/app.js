'use strict';
var app = angular.module('whoApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ngTouch',
    'ui.select2',
    'ngDisqus',
    // whoApp
    'whoApp.directives',
    'whoApp.controllers',
    'whoApp.filters',
    'imageupload'
]);
//     'fx.animations'
// development
// app.constant('ServerUrl', '//localhost:3000');
// app.constant('ApiUrl', '//localhost:3000/api/1');

// production
// app.constant('ServerUrl', '/');
// app.constant('ApiUrl', '/api/1');

app.config(function($routeProvider, $httpProvider, $locationProvider) {

    // $httpProvider.interceptors.push('whoHttpInterceptor');

    // Add `withCredentials` header to requests. (CORS requirement)
    $httpProvider.defaults.withCredentials = true;

    // Enable HTML5 mode. (Remove the `#` from Url)
    // $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode(false).hashPrefix("!");

    // Routing.
    $routeProvider
        .when('/', {
            templateUrl: '/views/home.html',
            controller: 'homeCtrl',
            resolve: {
                load: ['dataService',
                    function(dataService) {
                        return dataService.loadIdx();
                    }
                ]
            }
        })
        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'loginCtrl'
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
        .when('/area/:name', {
            templateUrl: '/views/area.html',
            controller: 'areaCtrl',
            resolve: {
                load: ['dataService', '$route',
                    function(dataService, $route) {
                        // $routeParams assign after route is changed.
                        return dataService.loadArea($route.current.params.name);
                    }
                ]
            }
        })
        .when('/function/:name', {
            templateUrl: '/views/function.html',
            controller: 'functionCtrl',
            resolve: {
                load: ['dataService', '$route',
                    function(dataService, $route) {
                        // $routeParams assign after route is changed.
                        return dataService.loadFunction($route.current.params.name);
                    }
                ]
            }
        })
        .when('/product/:name', {
            templateUrl: '/views/product.html',
            controller: 'productCtrl',
            resolve: {
                load: ['dataService', '$route',
                    function(dataService, $route) {
                        // $routeParams assign after route is changed.
                        return dataService.loadProduct($route.current.params.name);
                    }
                ]
            }
        })
        .when('/search/:word', {
            templateUrl: '/views/search.html',
            controller: 'searchCtrl'
        })
        .otherwise({
            redirectTo: '/',
            requireAuthentication: false
        });
}).run(function($rootScope, $location, $http, $window) {
    $rootScope.$on('$routeChangeSuccess', function() {
        $http.get('/api/v1/current_user', {
            cache: true
        }).then(function(resp) {
            $rootScope.currentUser = resp.data;
        }, function() {});
        // run some code to do your animations
    });
    $rootScope.$on('$routeChangeStart', function() {
        $window.scrollTo(0, 0);
    });
    window.disqus_shortname = 'wandoujiawho';
});