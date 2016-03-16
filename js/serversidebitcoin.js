var Bitcoin = require('bitcoinjs-lib');
var BigInteger = require('bigi');

module.exports = {
    CreateKeyPair: function(){
        var hash = Bitcoin.crypto.sha256('correct horse battery staple');
        var d = BigInteger.fromBuffer(hash);
        var keyPair = new Bitcoin.ECPair(d);
        return keyPair;
    },
    bar: function(){}
};
