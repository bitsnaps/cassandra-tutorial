var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { Client } = require('cassandra-driver');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter = require('./routes/user');
var addUserRouter = require('./routes/adduser');
var editUserRouter = require('./routes/edituser');
var shoutsRouter = require('./routes/shouts');
var addShoutRouter = require('./routes/addshout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/adduser', addUserRouter);
app.use('/edituser', editUserRouter);
app.use('/shouts', shoutsRouter);
app.use('/addshout', addShoutRouter);

// Create and configure Cassandra client
var client = new Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1'
});
client.connect(function (err, result) {
  if (err){
    console.log('Could not connect to Cassandra server!');
  } else {
    console.log('Cassandra connected.');
  }
});

app.set('client', client);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
