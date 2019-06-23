require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rateLimit = require('express-rate-limit');
const rfs = require('rotating-file-stream');

const notificationEndpoints = require('./api');

const app = express();

const { NODE_ENV: env } = process.env;

app.use(
  logger('common', {
    stream: rfs('access.log', {
      interval: '1d',
      path: path.join(__dirname, 'log')
    })
  })
);

if (env === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

if (env !== 'test') {
  app.use(logger(env));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  express.static(
    path.join(__dirname, env === 'production' ? 'build' : 'client/public')
  )
);

app.use(
  '/api/v1/',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }),
  notificationEndpoints
);

module.exports = app;
