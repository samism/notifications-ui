const { Model } = require('objection');
const knex = require('../db/knex');

Model.knex(knex);

class Notification extends Model {
  static get tableName() {
    return 'notifications';
  }

  static get idColumn() {
    return 'notification_id';
  }

  static get relationMappings() {
    const IssueType = require('./IssueType');

    return {
      issueTypes: {
        relation: Model.HasManyRelation,
        modelClass: IssueType,
        join: {
          from: 'notifications.notifications_id',
          to: 'issue_types.issue_type_id'
        }
      }
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['issue_type_id', 'title', 'body'],

      properties: {
        notification_id: { type: 'integer' },
        issue_type_id: { type: 'integer' },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        body: { type: 'string', minLength: 1, maxLength: 255 },
        created_at: { type: 'date', default: new Date().toISOString() }
      }
    };
  }
}

module.exports = Notification;
