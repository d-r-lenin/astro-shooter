const mongoose = require('mongoose');

const schema = new mongoose.Schema({
   count:{
      type:"number"
   },
   highScore:{
      type:"number"
   }
});

const Score = mongoose.model('score',schema);

module.exports = Score;
