const express = require('express');
const router = express.Router();

const { param, body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { transaction } = require('objection');

const { Notification } = require('../models');

/**
 * Basic healthcheck endpoint
 */
router.get('/ping', function(req, res, next) {
  res.json({ status: 'healthy!' });
});

/**
 * Returns all notifications in the database.
 */
router.get('/notifications/', async (req, res, next) => {
  // const notifications = await notifQueries.getAll();
  const notifications = await Notification.query()
    .select('notification_id', 'title', 'body', 'created_at', 'type')
    .join(
      'issue_types',
      'notifications.issue_type_id',
      'issue_types.issue_type_id'
    );

  return res.json(notifications);
});

/**
 * Returns a specific notification.
 */
router.get(
  '/notification/:id/',
  param('id', 'Please specify a valid notification ID.')
    .not()
    .isEmpty()
    .isInt({ min: 1 }),
  async (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array()[0] });
    }

    try {
      const [notification] = await Notification.query()
        .select('notification_id', 'title', 'body', 'created_at', 'type')
        .join(
          'issue_types',
          'notifications.issue_type_id',
          'issue_types.issue_type_id'
        )
        .where('notification_id', '=', req.params.id);

      return res.json(notification);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
);

/**
 * Creates a notification.
 */
router.post(
  '/notification',
  [
    sanitizeBody('notification.issue_type_id').toInt(),
    body('notification', 'Please submit a valid notification.').exists(),
    body('notification.title', 'Please submit a valid title.')
      .exists()
      .isAscii()
      .isLength({ min: 1, max: 255 }),
    body('notification.body', 'Please submit a valid body text.')
      .exists()
      .isAscii()
      .isLength({ min: 1, max: 255 }),
    body('notification.issue_type_id', 'Please submit a valid issue type.')
      .exists()
      .isInt()
  ],
  async (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array()[0] });
    }

    try {
      const insertedGraph = await transaction(Notification.knex(), trx =>
        Notification.query(trx).insertAndFetch({ ...req.body.notification })
      );

      return res.json(insertedGraph);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
);

module.exports = router;
