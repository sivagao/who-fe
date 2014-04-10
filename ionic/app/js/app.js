// angular.module is a global place for creating, registering and retrieving Angular modules
// 'directory' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'directory.services' is found in services.js
// 'directory.controllers' is found in controllers.js
angular.module('whoApp', ['ionic', 'whoApp.services', 'whoApp.controllers'])


.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    // $locationProvider.html5Mode(true);
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    .state('main', {
        url: '/',
        templateUrl: 'templates/main.html',
        controller: 'mainCtrl',
        resolve: {
            wandous: function(dataService) {
                return dataService.loadWandous();
            },
            area: function(dataService) {
                return dataService.loadArea();
            },
            product: function(dataService) {
                return dataService.loadProduct();
            }
        }
    })

    .state('wandou', {
        url: '/wandou/:name',
        templateUrl: 'templates/wandou.html',
        controller: 'wandouCtrl',
        resolve: {
            load: function(dataService) {
                return dataService.loadWandous();
            }
        }
    })

    .state('area', {
        url: '/area/:name',
        templateUrl: 'templates/area.html',
        controller: 'areaCtrl',
        resolve: {
            load: function(dataService) {
                return dataService.loadArea();
            }
        }
    })

    .state('product', {
        url: '/product/:name',
        templateUrl: 'templates/product.html',
        controller: 'productCtrl',
        resolve: {
            load: function(dataService) {
                return dataService.loadProduct();
            }
        }
    })

    .state('generalList', {
        url: '/:type/:name',
        templateUrl: 'templates/general-list.html',
        controller: 'generalListCtrl',
        resolve: {
            load: function(dataService) {
                return dataService.loadWandous();
            }
        }
    })

    .state('employedTimeline', {
        url: '/employed-timeline',
        templateUrl: 'templates/employed-timeline.html',
        controller: 'employedTimelineCtrl',
        resolve: {
            load: function(dataService) {
                return dataService.loadWandous();
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

}).run(function($rootScope, $ionicLoading) {
    $rootScope.checkHideBackBtn = function() {
        return false;
    };

    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            $rootScope.loading = $ionicLoading.show({
                content: 'Loading',
            });
        }
    );
    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            if (toState === 'main') {
                $rootScope.isLeftSideMenu = true;
                $rootScope.isRightSideMenu = true;
            } else {
                $rootScope.isLeftSideMenu = false;
                $rootScope.isRightSideMenu = false;
            }
        }
    );
});