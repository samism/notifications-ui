const { notifications } = require('../data');

exports.seed = (knex, Promise) => {
  return knex('notifications').insert(notifications);
};
