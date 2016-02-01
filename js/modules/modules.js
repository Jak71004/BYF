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
            
            return $http.post('http://localhost:8080/api/bears', self)
                .then(function(response){
                    return response.data;
            });
        };
        
        wgrFactory.prototype.getWagers = function(){
            var self = this;
            
            return $http.get('http://localhost:8080/api/bears')
                .then(function(response){
                    return response.data;
                });
        };
        
        wgrFactory.prototype.getWager = function(email){
            var self = this;
            
            return $http.get('http://localhost:8080/api/bears/'+email)
                .then(function(response){
                    self.email = response.data.email;
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
    // Wage Factor Function: Is the wager object
    //
    ///////////////////////////////////////////////
    var wagerFactoryVar = function($http){
        var wager = {
            email:'Eat@Joes.com',
            amount:'2',
            amountBTC:'0',
            proposition:'Loose Weight',
            duration:'1 Week',
            startMetric:'',
            endMetric:''
        };

        return wager;
        
    };
   
    module.factory('wagerFactory', ['$http',wagerFactoryVar]);
    
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
    var mainController = function($scope, $http, $location, wagerFactory, bitcoinFactory, wgrFactory){
             
        var btcFactory = new bitcoinFactory();
        var myWagerFactory = new wgrFactory();
        
        btcFactory.getBalance(btcFactory.address).then(function(){$scope.balance = btcFactory.balance;});
        //myWagerFactory.saveWager().then(function(res){$scope.email = res.message;})  
        
        $scope.isActive = function (viewLocation) { 
            return viewLocation === $location.path();
        };
        
        $scope.ChangeView = function(view){$location.path(view);};
        $scope.wager = myWagerFactory;
        
        $scope.UpdateBTC = function(){
            btcFactory.getLastPrice().then(function(){
                $scope.price = btcFactory.price;
                myWagerFactory.amountBTC = myWagerFactory.amount/btcFactory.price;
            })
            btcFactory.createAddress();
            //btcFactory.createCustomAddress();
            $scope.btcAddress=btcFactory.address;
        };
        
    };
    
    mainController.$inject = ['$scope', '$http', '$location', 'wagerFactory', 'bitcoinFactory', 'wgrFactory'];
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
    var wagerController = function($scope, wagerFactory){};
    wagerController.$inject = ['$scope', 'wagerFactory'];
    module.controller('wagerCtrl', wagerController)
    
    
    ///////////////////////////////////////////////////////
    //                                                   //       
    //  Defeat Controller                                //
    ///////////////////////////////////////////////////////
    var defeatController = function($scope, $http, wgrFactory){
        var myWagerFactory = new wgrFactory();
        $scope.wager = myWagerFactory;
        $scope.GetWager = function(){
            myWagerFactory.getWager(myWagerFactory.email).then(function(res){
                $scope.email = myWagerFactory.email +" " + " " +res.email;
            })    
        };
    };
    defeatController.$inject = ['$scope', '$http', 'wgrFactory'];
    module.controller('defeatCtrl',defeatController)
    
})();
