// CPSC - 473, Assignment 4
// M 7:00-9:45 PM
// James Mitchell
// CWID: 894400936
//
var express = require('express'),
      expressValidator = require('express-validator'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      random = require('mongoose-random'),
      mongo = require('mongodb'),
      session = require('express-session'),
      path = require('path');

var app = express();
var Trivia = require('./QuestionSchema.js');
var TriviaPick = mongoose.model('TriviaPick', Trivia);

TriviaPick.syncRandom(function(err, result) {});

// Connect to the database
mongoose.connect('mongodb://vagrant:vagrant@127.0.0.1:27017/assignment4');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to Mlab 473 Project 1 Database");
});

// Body Parser for JSON & URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

// Creates our session
app.use(session({
	secret: 'secret', //whatever we want as the super secret secret
	resave: true,
  saveUninitialized: true
}));

//Express Validator - Copied from express-validator documentation
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
      root    = namespace.shift(),
      formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

db.counters.insert(
{
  _id: "answerId",
  seq: 0
})
function getNextSequence(name) {
  var ret = db.counters.findAndModify({
        query: { _id: name },
        update: { $inc: { seq: 1 } },
        new: true
  });

  return ret.seq;
};

var right = 0,
    wrong = 0;

app.get("/question", function(req, res) {
  TriviaPick.findRandom().limit(1).exec(function(err, questions) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    questions.forEach(function(question) {
      res.json(question);
    });
    return res.status(200).send();
  });
});

app.post("/question", function(req, res) {i
  var trivia = new Trivia();

  trivia.question = req.body.question;
  trivia.answer = req.body.answer
  trivia.answerId = getNextSequence("answerId");
  trivia.save(function(err, savedTrivia) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.status(200).send();
  });
});

app.post("/answer", function(req, res) {
  Trivia.find({ answerId: req.body.answerId }, function(err, triviaResult) {
    triviaResult.forEach(function(result) {
      if (result.answer === req.body.answer) {
        right += 1;
        res.json("{ correct: true }");
      } else {
        wrong += 1;
        res.json("{ correct: false }");
      }
      return res.status(200).send();
    });
  });
});

app.get("/score", function(req, res) {
  rs.json("{ right: " + right + ", wrong: " + wrong + " }");
  return res.status(200).send();
});

app.listen(3000);
console.log('Listening on port 3000');
