var Bitcoin = require('bitcoinjs-lib');
var BigInteger = require('bigi');
var requestify = require('requestify');

module.exports = {
    CreateKeyPair: function(localWager){
        Wager=localWager;
        var hash = Bitcoin.crypto.sha256('I Love Karebear');
        var d = BigInteger.fromBuffer(hash);
        var keyPair = new Bitcoin.ECPair(d);
        return keyPair;
    },
    SendTranasction: function(wager){
        var localKeyPair = CreateKeyPair(wager);
        var tx = new Bitcoin.TransactionBuilder();
        var balance;
        
        requestify.get('http://btc.blockr.io/api/v1/address/balance/'+localKeyPair.getAddress()).then(function(response){
            var sendAmount;
            
            balance = response.getBody().data.balance;
            if(balance > 0.0001)
            {
                sendAmount = balance-0.0001;

                tx.addInput(localKeyPair.toWIF(), 0);
                tx.addOutput(wager.payoutAddress, sendAmount);
                tx.sign(0, localKeyPair);
                requestify.post('http://btc.blockr.io/api/v1/tx/push', {
                        "hex":tx.build().toHex()
                    })
                    .then(function(response){
                        console.log(response.getBody());
                        wager.txHash = response.getBody().hex;
                });//post to network
            }
        }); //get balance
        
        
        return wager;
    }
};
