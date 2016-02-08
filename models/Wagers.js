var mongoose = require('mongoose');

var WagerSchema = new mongoose.Schema({
  email: String,
  amount: Number,
  amountBTC: Number,
  proposition: String,
  duration: String,
  startMetric: String,
  endMetric: String,
  publicAddress: String
  
});

mongoose.model('Wager', WagerSchema);
