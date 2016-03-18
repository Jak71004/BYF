var Bitcoin = require('bitcoinjs-lib');
var BigInteger = require('bigi');
var requestify = require('requestify');

module.exports = {
    CreateKeyPair: function(localWager){
        Wager=localWager;
        var hash = Bitcoin.crypto.sha256('correct horse battery staple');
        var d = BigInteger.fromBuffer(hash);
        var keyPair = new Bitcoin.ECPair(d);
        return keyPair;
    },
    SendTranasction: function(wager, toAddress){
        var localKeyPair = CreateKeyPair(wager);
        var tx = new Bitcoin.TransactionBuilder();
        var balance;
        
        requestify.get('http://btc.blockr.io/api/v1/address/balance/'+localKeyPair.getAddress()).then(function(response){
            var sendAmount;
            
            balance = response.getBody().data.balance;
            
            sendAmount = balance-0.0001;
            
            tx.addInput(localKeyPair.toWIF(), 0);
            tx.addOutput(toAddress, sendAmount);
            tx.sign(0, localKeyPair);
            requestify.post('http://btc.blockr.io/api/v1/tx/push', {
                    "hex":tx.build().toHex();
                })
                .then(function(response){
                console.log(response.getBody());
            });//post to network
        }); //get balance
        
        
        return tx;
    }
};
