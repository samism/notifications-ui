const { Model } = require('objection');
const knex = require('../db/knex');

Model.knex(knex);

class IssueType extends Model {
  static get tableName() {
    return 'issue_types';
  }

  static get idColumn() {
    return 'issue_type_id';
  }

  static get relationMappings() {
    const Notification = require('./Notification');

    return {
      notification: {
        relation: Model.BelongsToOneRelation,
        modelClass: Notification,
        join: {
          from: 'issue_types.issue_type_id',
          to: 'notification.notification_id'
        }
      }
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['type'],

      properties: {
        issue_type_id: { type: 'integer' },
        type: { type: 'string', minLength: 1, maxLength: 255 }
      }
    };
  }
}

module.exports = IssueType;
