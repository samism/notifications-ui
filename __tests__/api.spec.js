const request = require('supertest');

const app = require('../app');
const { notifications } = require('../db/data');

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

notifications.forEach(notification => {
  notification['type'] =
    notification['issue_type_id'] === 1 ? 'data' : 'config';
  delete notification['issue_type_id'];
});

describe('GET /notifications ', () => {
  it('should return an array of notification objects', async () => {
    const response = await request(app).get('/api/v1/notifications');

    const withoutArbitraryProperties = response.body.map(notifObject => {
      const { created_at, ...rest } = notifObject;

      return rest;
    });

    console.log(withoutArbitraryProperties);

    expect(withoutArbitraryProperties).toEqual(
      expect.arrayContaining(notifications)
    );
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /notification/:id ', () => {
  it('should return a specific notification object', async () => {
    const response = await request(app).get('/api/v1/notification/1');
    const { created_at, ...rest } = response.body;

    expect(rest).toEqual(notifications[0]);
    expect(response.statusCode).toBe(200);
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
});
