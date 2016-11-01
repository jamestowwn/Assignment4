var mongoose = require('mongoose');

var TriviaSchema = new mongoose.Schema({
  question: String,
  answer: String,
  answerId: Number
});

var Trivia = mongoose.model('Trivia', TriviaSchema);
module.exports = Trivia;
