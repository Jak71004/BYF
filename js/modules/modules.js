(function(){
    var module = angular.module('BetYouFail');

    ///////////////////////////////////////////////
    //
    // Wage Factor Function: Is the wager object
    //
    ///////////////////////////////////////////////
    var wagerFactoryVar = function(){
        var wager = {
            email:'Eat@Joes.com',
            amount:'2',
            amountBTC:'0',
            proposition:'Loose Weight',
            duration:'2 Week',
            startMetric:'',
            endMetric:''
        };
        
        return wager;
    };
    module.factory('wagerFactory', wagerFactoryVar);
    
    ///////////////////////////////////////////////
    //
    // Bitcoin Factory Function: Is the object that
    //      contains all the data for the bitcoin 
    //      details.
    //
    ///////////////////////////////////////////////
    var bitcoinFactoryVar = function($http){
        var urlBaseExplorer = 'https://blockexplorer.com/api/addr/';
        var urlBaseLast = 'https://api.bitcoinaverage.com/ticker/USD/last';
                       
        var bitcoinFactory = function(){
            this.address = '';
            this.balance = '';
            this.price = '';
            this.privateKey = '';
        };
                
        bitcoinFactory.prototype.createAddress = function(){
            var self = this;
            var keyPair = Bitcoin.ECPair.makeRandom();
            self.privateKey = keyPair.toWIF();
            self.address = keyPair.getAddress();
        };
        
        bitcoinFactory.prototype.getLastPrice = function(){
            var self = this;
            
            return $http.get(urlBaseLast)
                .then(function(response){
                    self.price = response.data;
                    return response;
                });
        };
        
        bitcoinFactory.prototype.getBalance = function(address) {
            var self = this;

            return $http.get(urlBaseExplorer+address + '/UnconfirmedBalance')
                .then(function(response){
                    self.balance = response.data/100000000;
                    return response;
                });
        }; 

        return bitcoinFactory;
    };
    module.factory('bitcoinFactory', ['$http',bitcoinFactoryVar])
    
    function BuildQRCode(qrAmount,qrAddress,price){
        var urlQRCodeBase = 'https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=bitcoin:';
        
        return urlQRCodeBase + qrAddress + '?amount='+ price +'&message=You\'re Going to fail';
    }
    
    /////////////////////////////////////////////////
    //
    // Main Controller
    //
    /////////////////////////////////////////////////    
    var mainController = function($scope, $http, $location, wagerFactory, bitcoinFactory){
             
        var btcFactory = new bitcoinFactory();
        
        //btcFactory.createAddress();
        //$scope.btcAddress=btcFactory.address;
        
        btcFactory.getBalance(btcFactory.address).then(function(){$scope.balance = btcFactory.balance;})
                
        $scope.isActive = function (viewLocation) { 
            return viewLocation === $location.path();
        };
        $scope.ChangeView = function(view){$location.path(view);};
        $scope.wager = wagerFactory;
        
        $scope.UpdateBTC = function(){
            btcFactory.getLastPrice().then(function(){
                $scope.price = btcFactory.price;
                wagerFactory.amountBTC = wagerFactory.amount/btcFactory.price;
            })
            btcFactory.createAddress();
            $scope.btcAddress=btcFactory.address;
        };
        
    };
    
    mainController.$inject = ['$scope', '$http', '$location', 'wagerFactory', 'bitcoinFactory'];
    module.controller('mainCtrl', mainController)

    var wagerController = function($scope, wagerFactory){};
    wagerController.$inject = ['$scope', 'wagerFactory'];
    module.controller('wagerCtrl', wagerController)
    
})();
