angular.module('whoApp.controllers', [])

.controller('mainCtrl', function($scope, dataService, $ionicPopup, $rootScope, $timeout, $ionicLoading) {
    var _wandouList = _.shuffle(dataService.wandouList);
    $scope.hideBackButton = true;
    $scope.hideNavBar = false;
    $rootScope.isLeftSideMenu = true;
    $rootScope.isRightSideMenu = true;
    $scope.wandouList = _wandouList.splice(0, 20);
    $rootScope.areaList = _.shuffle(dataService.areaList);
    $rootScope.productList = _.shuffle(dataService.productList);
    $scope.searchKey = "";

    $timeout(function() {
        $ionicLoading.hide();
    });

    $scope.clearSearch = function() {
        $scope.searchKey = "";
        return;
        findAllEmployees();
    }

    $scope.search = function() {
        $ionicPopup.alert({
            title: 'Demo',
            content: '搜索功能还没跨域呢'
        }).then(function(res) {
            console.log('下次再试试?!');
        });
    };

    $scope.loadMore = function() {
        $scope.wandouList = $scope.wandouList.concat(_wandouList.splice(0, 10));
        if (_wandouList.length == 0) {
            $scope.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.noMoreItemsAvailable = false;
})

.controller('wandouCtrl', function($scope, $stateParams, dataService, $rootScope, $timeout, $ionicPopup, $ionicLoading) {
    $scope.hideBackButton = false;
    $scope.hideNavBar = false;
    $scope.wandouInfo = _.find(dataService.wandouList, function(wandouInfo) {
        return wandouInfo.nick === $stateParams.name;
    });
    if (!$scope.wandouInfo) {
        $ionicPopup.alert({
            title: 'Demo',
            content: '这个人的数据补全呢，返回'
        }).then(function(res) {
            window.history.back();
            console.log('下次再试试?!');
        });
    } else {
        $scope.wandouInfo.pic = dataService.getPic();
        $scope.wandouInfo.managerNick = dataService.getNick($scope.wandouInfo.manager);
    }
    $timeout(function() {
        $ionicLoading.hide();
    });
})

.controller('areaCtrl', function($scope, $stateParams, dataService, $timeout, $rootScope, $timeout, $ionicLoading) {
    $scope.hideBackButton = false;
    $scope.hideNavBar = false;
    $scope.areaInfo = dataService.areaDict[$stateParams.name];
    // $scope.areaInfo = _.find(dataService.areaList, function(areaInfo) {
    //     return areaInfo.name === $stateParams.name;
    // });
    $ionicLoading.hide();
})

.controller('productCtrl', function($scope, $stateParams, dataService, $rootScope, $timeout, $ionicLoading) {
    $scope.hideBackButton = false;
    $scope.hideNavBar = false;
    $scope.productInfo = _.find(dataService.productList, function(productInfo) {
        return productInfo.name === $stateParams.name;
    });
    $ionicLoading.hide();
})

.controller('generalListCtrl', function($scope, $stateParams, dataService, $rootScope, $timeout, $ionicLoading) {
    $scope.hideBackButton = false;
    $scope.hideNavBar = false;
    // $stateParams.type, $stateParams.name
    var list = _.filter(dataService.wandouList, function(item) {
        return item[$stateParams.type] === $stateParams.name;
    });
    $scope.listInfo = {
        list: list,
        name: $stateParams.name,
        type: $stateParams.type
    };
    $timeout(function() {
        $ionicLoading.hide();
    });
})

.controller('employedTimelineCtrl', function($scope, $stateParams, dataService, $rootScope, $timeout, $ionicLoading) {
    $scope.hideBackButton = false;
    $scope.hideNavBar = false;
    // $stateParams.type, $stateParams.name
    var list = _.groupBy(dataService.wandouList, function(item) {
        return item.edate.replace(/-\d{1,2}$/, '');
    });
    var monthList = _.map(list, function(item, key) {
        return {
            key: key,
            list: _.sortBy(item, function(ii) {
                return new Date(ii.edate);
            })
        }
    });
    var _monthList = _.sortBy(monthList, function(item) {
        return new Date(item.key)
    });
    $scope.monthList = _monthList.splice(0, 5);
    $timeout(function() {
        $ionicLoading.hide();
    });

    $scope.loadMore = function() {
        $scope.monthList = $scope.monthList.concat(_monthList.splice(0, 2));
        if (_monthList.length == 0) {
            $scope.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.noMoreItemsAvailable = false;
});