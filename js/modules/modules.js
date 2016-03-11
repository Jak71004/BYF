(function(){
    var module = angular.module('BetYouFail');

        ///////////////////////////////////////////////
    //
    // Bitcoin Factory Function: Is the object that
    //      contains all the data for the bitcoin 
    //      details.
    //
    ///////////////////////////////////////////////
    var wgrFactoryVar = function($http){
        var urlBaseExplorer = 'https://blockexplorer.com/api/addr/';
        var urlBaseLast = 'https://api.bitcoinaverage.com/ticker/USD/last';
                       
        var wgrFactory = function(){
            this.email = 'Eat@Joes.com';
            this.challenge = 'Stuff';
            this.amount = '2';
            this.amountBTC = '0';
            this.proposition = 'Loose Weight';
            this.duration = '1 Week';
            this.startMetric = '';
            this.endMetric = '';
            this.publicAddress = '';
           
        };
        
        wgrFactory.prototype.saveWager = function(){
            var self = this;
            return $http.post('http://127.0.0.1:3000/api/wagers/wager', self )
                .then(function(response){
                    return response.data;
            });
        };
        
        wgrFactory.prototype.getWagers = function(){
            var self = this;
            
            return $http.get('http://127.0.0.1:3000/api/wagers')
                .then(function(response){
                    return response.data;
                });
        };
        
        wgrFactory.prototype.getWager = function(email, publicAddress){
            var self = this;
            
            var parameters = {
                email: email,
                publicAddress: publicAddress
            };
            
            var config = {
                params: parameters
            };
            
            return $http.get('http://127.0.0.1:3000/api/wagers/wager', config)
                .then(function(response){
                    self.email = response.data.email;
                    self.challenge=response.data.challenge;
                    self.amount = response.data.amount;
                    self.amountBTC = response.data.amountBTC;
                    self.proposition = response.data.proposition;
                    self.duration = response.data.duration;
                    self.startMetric = response.data.startMetric;
                    self.endMetric = response.data.endMetric;
                    self.publicAddress = response.data.publicAddress;
                    
                    return response.data;
                });
        };
        
        return wgrFactory;
    };
    module.factory('wgrFactory', ['$http', wgrFactoryVar])
    
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
            this.encryptedKey = '';
            this.decryptedKey = '';
        };
        
        bitcoinFactory.prototype.createCustomAddress = function(){
            var self = this;
            
            /*Create address from SHA256 hash of wager info*/
            //var hash = Bitcoin.crypto.sha256(new Date() email wagerAmount dbKey);
            var hash = Bitcoin.crypto.sha256('correct horse battery staple');
            var d = BigInteger.fromBuffer(hash);
            var keyPair = new Bitcoin.ECPair(d);
            self.address = keyPair.getAddress();
        };
        
        bitcoinFactory.prototype.createAddress = function(){
            var self = this;
            var keyPair = Bitcoin.ECPair.makeRandom();
            self.privateKey = keyPair.toWIF();
            self.address = keyPair.getAddress();
            
            /*Create address from SHA256 hash of wager info*/
            /*var hash = Bitcoin.crypto.sha256('correct horse battery staple');
            var d = BigInteger.fromBuffer(hash);
            var keyPair = new Bitcoin.ECPair(d);
            self.address = hash;*/
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
    
    
    /////////////////////////////////////////////////
    //
    // Main Controller
    //
    /////////////////////////////////////////////////    
    var mainController = function($scope, $http, $location, bitcoinFactory, wgrFactory){
             
        var btcFactory = new bitcoinFactory();
        var myWagerFactory = new wgrFactory();
        myWagerFactory.getWagers().then(function(res){$scope.allWagers =res});
        btcFactory.getBalance(btcFactory.address).then(function(){$scope.balance = btcFactory.balance;});
        //myWagerFactory.saveWager().then(function(res){$scope.email = res.message;})  
        
        $scope.isActive = function (viewLocation) { 
            return viewLocation === $location.path();
        };
        
        $scope.ChangeView = function(view){$location.path(view);};
        $scope.wager = myWagerFactory;
        
        //Called from Wager page at opening of modal.
        $scope.UpdateBTC = function(){
            btcFactory.getLastPrice().then(function(){
                $scope.price = btcFactory.price;
                myWagerFactory.amountBTC = myWagerFactory.amount/btcFactory.price;
                //myWagerFactory.saveWager();
            })
            btcFactory.createAddress();
            //btcFactory.createCustomAddress();
            $scope.btcAddress=btcFactory.address;
            myWagerFactory.publicAddress = btcFactory.address;
            myWagerFactory.saveWager();
        };
        
    };
    
    mainController.$inject = ['$scope', '$http', '$location', 'bitcoinFactory', 'wgrFactory'];
    module.controller('mainCtrl', mainController)

    ///////////////////////////////////////////////////////
    //                                                   //       
    //  Validation Controller                                 //
    ///////////////////////////////////////////////////////
    var validateController = function($scope){
        $scope.submitForm = function() {
            // check to make sure the form is completely valid
            if ($scope.userForm.$valid) {
                alert('our form is amazing');
            }
        };
       /* $scope.ValidateAmount = function(invalid, pristine, amount){
            if(amount < 0.1)
                return true;
        };*/

    };
    validateController.$inject=['$scope'];
    module.controller('validateCtrl',validateController)

    
    ///////////////////////////////////////////////////////
    //                                                   //       
    //  Wager Controller                                 //
    ///////////////////////////////////////////////////////
    var wagerController = function($scope){};
    wagerController.$inject = ['$scope'];
    module.controller('wagerCtrl', wagerController)
    
    
    ///////////////////////////////////////////////////////
    //                                                   //       
    //  Defeat Controller                                //
    ///////////////////////////////////////////////////////
    var defeatController = function($scope, $http){
        var myWagerFactory = $scope.wager;
        //$scope.wager = myWagerFactory;
        $scope.GetWager = function(){
            myWagerFactory.getWager(myWagerFactory.email).then(function(res){
                $scope.wager = myWagerFactory;
                $scope.email = myWagerFactory.email +" " + " " +res.email;
            })    
        };
    };
    defeatController.$inject = ['$scope', '$http'];
    module.controller('defeatCtrl',defeatController)
    
})();
