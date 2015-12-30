(function(){
    
    var module = angular.module('BetYouFail');

    var wagerFactory = function(){
        var wager = {
            email:'Eat@Joes.com',
            amount:'2',
            amountBTC:'',
            proposition:'Loose Weight',
            duration:'2 Week',
            startMetric:'',
            endMetric:''
        };
        
        return wager;
    };
    
    module.factory('wagerFactory', wagerFactory)

    function headerController($scope, $location) 
    { 
        $scope.isActive = function (viewLocation) { 
            return viewLocation === $location.path();
        };
    }
    
    var mainController = function($scope, $http, $location, wagerFactory){
        
        $scope.isActive = function (viewLocation) { 
            return viewLocation === $location.path();
        };
        
        $scope.wager = wagerFactory;
        $http.get("https://api.bitcoinaverage.com/ticker/USD/last")
         .success(function(response){
            $scope.wager.amountBTC = $scope.wager.amount / response;});
         
    };
    
    mainController.$inject = ['$scope', '$http', '$location', 'wagerFactory'];
    module.controller('mainCtrl', mainController);

    var wagerController = function($scope, wagerFactory){};
    wagerController.$inject = ['$scope', 'wagerFactory']
    module.controller('wagerCtrl', wagerController);
    
})();
