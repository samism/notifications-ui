const { issues } = require('../data');

exports.seed = function(knex, Promise) {
  return knex('notifications')
    .del()
    .then(() => knex('issue_types').del())
    .then(() => knex.raw('TRUNCATE TABLE issue_types RESTART IDENTITY CASCADE'))
    .then(() => knex('issue_types').insert(issues));
};
