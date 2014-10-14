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
    'whoApp.directives',
    'whoApp.controllers',
    'whoApp.filters',
    'imageupload'
]);

app.config(function($routeProvider, $httpProvider, $locationProvider) {

    // $httpProvider.defaults.withCredentials = true;
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

        $http.jsonp('http://sso.wandoulabs.com/getUserInfo/?jsonp=JSON_CALLBACK', {
            cache: false
        }).then(function(resp) {
            if (resp.data.code == 200) {
                $rootScope.currentUser = {
                    'name': resp.data.result.name,
                    'id': resp.data.result.id,
                    'img': resp.data.result.img
                };
            } else {
                $window.location.href = 'http://sso.wandoulabs.com/?redirect=' + $window.location.href;
            }
        }, function(resp) {});
    });
    $rootScope.$on('$routeChangeStart', function() {
        $window.scrollTo(0, 0);
    });
    window.disqus_shortname = 'wandoujiawho';
});