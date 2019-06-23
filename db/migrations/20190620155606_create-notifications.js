exports.up = function(knex, Promise) {
  const createIssueTypesTable = async () =>
    knex.schema.createTable('issue_types', table => {
      table
        .increments('issue_type_id')
        .unsigned()
        .primary();
      table
        .string('type')
        .notNullable()
        .defaultTo('data');
    });

  const createNotificationsTable = async () =>
    knex.schema.createTable('notifications', table => {
      table
        .increments('notification_id')
        .unsigned()
        .primary();
      table
        .string('title')
        .notNullable()
        .defaultTo('Sample Notification');
      table
        .string('body')
        .notNullable()
        .defaultTo('Sample Notification Text');
      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
      table
        .integer('issue_type_id')
        .unsigned()
        .notNullable();
      table
        .foreign('issue_type_id')
        .references('issue_type_id')
        .inTable('issue_types');
    });

  return Promise.resolve()
    .then(createIssueTypesTable)
    .then(createNotificationsTable);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('notifications'),
    knex.schema.dropTable('issue_types')
  ]);
};
