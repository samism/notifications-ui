const express = require('express');
const { param, body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { transaction } = require('objection');
const crypto = require('crypto');

const router = express.Router();
const knex = require('../db/knex');
const { Notification } = require('../models');

const redisClient = require('../redis-client');

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
  const existing = await redisClient.getAsync('notifications:all');

  if (existing) {
    return res.json(JSON.parse(existing));
  }

  const notifications = await Notification.query()
    .select(
      knex.raw(
        "notification_id, title, CONCAT(SUBSTRING(body, 1, 50), '...') as body, created_at, type"
      )
    )
    .join(
      'issue_types',
      'notifications.issue_type_id',
      'issue_types.issue_type_id'
    );

  const cachedResult = await redisClient.setAsync(
    'notifications:all',
    JSON.stringify(notifications)
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

    const existing = await redisClient.getAsync(
      `notifications:${req.params.id}`
    );

    if (existing) {
      return res.json(JSON.parse(existing));
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

      const cachedResult = await redisClient.setAsync(
        `notifications:${req.params.id}`,
        JSON.stringify(notification)
      );

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

    const hash = crypto
      .createHash('sha1')
      .update(JSON.stringify(req.body.notification))
      .digest('hex');

    const existing = await redisClient.getAsync(hash);

    if (existing) {
      return res.json(JSON.parse(existing));
    }

    try {
      const insertedGraph = await transaction(Notification.knex(), trx =>
        Notification.query(trx).insertAndFetch({ ...req.body.notification })
      );

      const cachedResult = await redisClient.setAsync(
        hash,
        JSON.stringify(insertedGraph)
      );

      return res.json(insertedGraph);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
);

module.exports = router;
