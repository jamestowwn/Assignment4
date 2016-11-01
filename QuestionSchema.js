var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var TriviaSchema = new mongoose.Schema({
  question: String,
  answer: String,
  answerId: Number
});

TriviaSchema.plugin(passportLocalMongoose);

var Trivia = mongoose.model('Trivia', TriviaSchema);
module.exports = Trivia;
