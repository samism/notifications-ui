require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  express.static(
    path.join(
      __dirname,
      process.env.NODE_ENV === 'production' ? 'build' : 'client/public'
    )
  )
);

app.use('/api', indexRouter);

module.exports = app;
