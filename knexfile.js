require('dotenv').config();

const path = require('path');

const {
  POSTGRES_USER: user,
  POSTGRES_PASSWORD: password,
  POSTGRES_DB: database,
  POSTGRES_HOST: host
} = process.env;

module.exports = {
  prod: {
    client: 'pg',
    connection: {
      host,
      user,
      password: password || undefined,
      database
    },
    migrations: {
      directory: path.join(__dirname, '/db/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '/db/seeds')
    }
  },
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      database: 'test-notifications'
    },
    migrations: {
      directory: path.join(__dirname, '/db/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '/db/seeds')
    }
  }
};
