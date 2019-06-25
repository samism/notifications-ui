const request = require('supertest');

const app = require('../app');
const { notifications } = require('../db/data');

notifications.forEach((notification, index) => {
  notification['notification_id'] = index + 1;
  notification['type'] =
    notification['issue_type_id'] === 1 ? 'data' : 'config';
  delete notification['issue_type_id'];
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('GET /notifications ', () => {
  it('should return an array of notification objects', async () => {
    const notifTruncated = notifications.map(notification => ({
      ...notification,
      body: notification.body.substring(0, 50) + '...'
    }));

    const response = await request(app).get('/api/v1/notifications');
    const withoutArbitraryProperties = response.body.map(notifObject => {
      const { created_at, ...rest } = notifObject;
      return rest;
    });

    expect(withoutArbitraryProperties).toEqual(
      expect.arrayContaining(notifTruncated)
    );
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /notification/:id ', () => {
  const invalidId = {
    location: 'params',
    param: 'id',
    msg: 'Please specify a valid notification ID.'
  };

  it('should return a specific notification object', async () => {
    const response = await request(app).get('/api/v1/notification/1');
    const { created_at, ...rest } = response.body;

    expect(rest).toEqual(notifications[0]);
    expect(response.statusCode).toBe(200);
  });

  it('should return an error given a non-integer id', async () => {
    const value = 'abcde';
    const response = await request(app).get(`/api/v1/notification/${value}`);

    invalidId.value = value;
    expect(response.body).toEqual({ errors: invalidId });
    expect(response.statusCode).toBe(422);
  });

  it('should return an error given a negative integer id', async () => {
    const value = '-1';
    const response = await request(app).get(`/api/v1/notification/${value}`);

    invalidId.value = value;
    expect(response.body).toEqual({ errors: invalidId });
    expect(response.statusCode).toBe(422);
  });

  it('should return an error given a zero integer id', async () => {
    const value = '0';
    const response = await request(app).get(`/api/v1/notification/${value}`);

    invalidId.value = value;
    expect(response.body).toEqual({ errors: invalidId });
    expect(response.statusCode).toBe(422);
  });
});

describe('POST /notification ', () => {
  it('should return a specific notification object after it is persisted in the db', async () => {
    const payload = {
      issue_type_id: 1,
      title: 'Test Notification',
      body: 'test123'
    };

    const response = await request(app)
      .post('/api/v1/notification')
      .send({ notification: payload })
      .set('Accept', 'application/json');
    const { created_at, notification_id, ...rest } = response.body;

    expect(rest).toEqual(payload);
    expect(response.statusCode).toBe(200);
  });

  it('should return an error without an object wrapping the payload called "notification"', async () => {
    const payloadMissingWrapper = {
      issue_type_id: 1,
      title: 'Test Notification',
      body: 'abc123'
    };

    const response = await request(app)
      .post('/api/v1/notification')
      .send({ payloadMissingWrapper })
      .set('Accept', 'application/json');

    expect(response.body).toEqual({
      errors: {
        location: 'body',
        param: 'notification',
        msg: 'Please submit a valid notification.'
      }
    });
    expect(response.statusCode).toBe(422);
  });

  it('should return an error without a body property', async () => {
    const payloadMissingBody = {
      issue_type_id: 1,
      title: 'Test Notification'
    };

    const response = await request(app)
      .post('/api/v1/notification')
      .send({ notification: payloadMissingBody })
      .set('Accept', 'application/json');

    expect(response.body).toEqual({
      errors: {
        location: 'body',
        msg: 'Please submit a valid body text.',
        param: 'notification.body'
      }
    });
    expect(response.statusCode).toBe(422);
  });

  it('should return an error with an empty body property', async () => {
    const payloadEmptyBody = {
      issue_type_id: 1,
      title: 'Test Notification',
      body: ''
    };

    const response = await request(app)
      .post('/api/v1/notification')
      .send({ notification: payloadEmptyBody })
      .set('Accept', 'application/json');

    expect(response.body).toEqual({
      errors: {
        location: 'body',
        msg: 'Please submit a valid body text.',
        param: 'notification.body',
        value: ''
      }
    });
    expect(response.statusCode).toBe(422);
  });

  it('should return an error without an issue_type_id property', async () => {
    const payloadMissingTypeId = {
      body: 'abc123',
      title: 'Test Notification'
    };

    const response = await request(app)
      .post('/api/v1/notification')
      .send({ notification: payloadMissingTypeId })
      .set('Accept', 'application/json');

    expect(response.body).toEqual({
      errors: {
        location: 'body',
        param: 'notification.issue_type_id',
        msg: 'Please submit a valid issue type.'
      }
    });
    expect(response.statusCode).toBe(422);
  });

  it('should return an error with an empty issue_type_id property', async () => {
    const payloadEmptyTypeId = {
      body: 'abc123',
      title: 'Test Notification',
      issue_type_id: undefined
    };

    const response = await request(app)
      .post('/api/v1/notification')
      .send({ notification: payloadEmptyTypeId })
      .set('Accept', 'application/json');

    expect(response.body).toEqual({
      errors: {
        location: 'body',
        param: 'notification.issue_type_id',
        msg: 'Please submit a valid issue type.'
      }
    });
    expect(response.statusCode).toBe(422);
  });

  it('should return an error with a non-intenger issue_type_id property', async () => {
    const payloadNonIntegerTypeId = {
      body: 'abc123',
      title: 'Test Notification',
      issue_type_id: 'abc123'
    };

    const response = await request(app)
      .post('/api/v1/notification')
      .send({ notification: payloadNonIntegerTypeId })
      .set('Accept', 'application/json');

    expect(response.body).toEqual({
      errors: {
        location: 'body',
        param: 'notification.issue_type_id',
        msg: 'Please submit a valid issue type.',
        value: null
      }
    });
    expect(response.statusCode).toBe(422);
  });

  it('should return an error without a title property', async () => {
    const payloadMissingTitle = {
      issue_type_id: 1,
      body: 'abc123'
    };

    const response = await request(app)
      .post('/api/v1/notification')
      .send({ notification: payloadMissingTitle })
      .set('Accept', 'application/json');

    expect(response.body).toEqual({
      errors: {
        location: 'body',
        param: 'notification.title',
        msg: 'Please submit a valid title.'
      }
    });
    expect(response.statusCode).toBe(422);
  });

  it('should return an error with an empty title property', async () => {
    const payloadEmptyTitle = {
      title: '',
      issue_type_id: 1,
      body: 'abc123'
    };

    const response = await request(app)
      .post('/api/v1/notification')
      .send({ notification: payloadEmptyTitle })
      .set('Accept', 'application/json');

    expect(response.body).toEqual({
      errors: {
        location: 'body',
        param: 'notification.title',
        msg: 'Please submit a valid title.',
        value: ''
      }
    });
    expect(response.statusCode).toBe(422);
  });
});
