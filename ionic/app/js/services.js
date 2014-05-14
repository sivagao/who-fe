angular.module('whoApp.services', [])
    .factory('dataService', function($q, $http) {
        var picStack = ["James_King.jpg", "Julie_Taylor.jpg", "Eugene_Lee.jpg", "John_Williams.jpg", "Ray_Moore.jpg", "Paul_Jones.jpg", "Paula_Gates.jpg", "Lisa_Wong.jpg", "Gary_Donovan.jpg", "Kathleen_Byrne.jpg", "Amy_Jones.jpg", "Steven_Wells.jpg"];
        return {
            areaDict: {},
            projectDict: {},
            functionDict: {},
            query: function(word) {
                return $http.get('/api/v1/query?word=' + word);
            },
            loadWandous: function() {
                var deferred = $q.defer();
                if (_.isEmpty(this.wandouList)) {
                    var _self = this;
                    $http.get('/api/v1/list/person').then(function(resp) {
                        _self.wandouList = resp.data;
                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            },
            getPic: function() {
                return (_.shuffle(picStack))[0];
            },
            getNick: function(name) {
                var wandouInfo = _.find(this.wandouList, function(wandouInfo) {
                    return wandouInfo.name === name;
                });
                if (wandouInfo) {
                    return wandouInfo.nick;
                } else {
                    return name;
                }
            },
            loadArea: function() {
                var deferred = $q.defer();
                if (_.isEmpty(this.areaList)) {
                    var _self = this;
                    $http.get('/api/v1/list/area').then(function(resp) {
                        _areaList = resp.data;
                        _.each(_areaList, function(area) {
                            area.members = _.map(area.members, function(name) {
                                return {
                                    name: name,
                                    pic: _self.getPic()
                                };
                            });
                        });
                        _self.areaList = _areaList;
                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            },
            loadAreaByName: function(name) {
                var deferred = $q.defer();
                if (!this.areaDict[name]) {
                    var _self = this;
                    $http.get('/api/v1/area/' + name).then(function(resp) {
                        _self.areaDict[name] = resp.data;
                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            },
            loadProduct: function() {
                var deferred = $q.defer();
                if (_.isEmpty(this.productList)) {
                    var _self = this;
                    $http.get('/api/v1/list/product').then(function(resp) {
                        _self.productList = resp.data;
                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            }
        }
    })
    .directive('dragBack', function($ionicGesture, $state) {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {

                $ionicGesture.on('swiperight', function(event) {
                    event.preventDefault();
                    window.history.back();
                }, elem);

            }
        }
    });