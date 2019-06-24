const path = require('path');

module.exports = {
  prod: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    migrations: {
      directory: path.join(__dirname, '/db/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '/db/seeds')
    }
  },
  dev: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'Sam',
      database: 'notifications'
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
