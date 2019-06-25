const knex = require('knex');
const config = require('../knexfile');

const env = process.env.NODE_ENV || 'prod';

const envConfig = config[env];
const connection = knex(envConfig);

module.exports = connection;
