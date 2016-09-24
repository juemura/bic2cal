var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');// templating engine
// var mongoose = require('mongoose');
// var db;

// db = mongoose.connect('localhost:27017/poll');

// var choiceSchema = require('./models/rewardpoll.js').ChoiceSchema;
// var Choices = db.model('choices', choiceSchema);

// var adminSchema = require('./models/adminAcc.js').AdminSchema;
// var Admin = db.model('admin', adminSchema);


var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({layoutsDir: __dirname + '/views'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/admin', routes);

//Calls to DB
app.get('/poll', function(req, res, next) {
  Choices.find(function(err, doc) {
    if(err) throw err;
    res.json(doc);
  });
});

app.post('/poll', function(req, res, next) {
  var item = {
    text: req.body.text,
    votes: 0,
    totalVotes: req.body.totalVotes
  }
  console.dir(item)
  var choice = new Choices(item);
  choice.save();
  res.json(item)
});

app.delete('/poll/:id', function(req, res) {
  var id = req.params.id;
  Choices.findByIdAndRemove(id).exec();
  Choices.find(function(err, doc) {
    if(err) throw err;
    res.json(doc);
  });
});

app.put('/poll/:id', function(req, res) {
  var id = req.params.id;
  Choices.findOne({_id: id}, function(err, choices) {
    var total = 0;
    if(err) throw err;
    choices.votes += 1;
    total = choices.totalVotes + 1;
    Choices.update({},{ $set: {totalVotes: total}}, {multi: true}).exec();
    choices.save(function (err) {
      if(err) throw err;
    });
    res.json(choices);
  });
});

//Call to DB to login admin
app.post('/login', function(req, res) {
  console.dir(req.body)
  var input = req.body
  Admin.find(function(err, doc) {
    var admin = doc[0]
    if(err) 
      throw err;
    console.dir(admin)
    if(admin.username == input.username &&
     admin.password == input.password){
      res.json({success: true});
    } else {
      res.json({message: "Wrong Username or Password"});
    };
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
