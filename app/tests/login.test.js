// app/tests/login.test.js
const request = require('supertest');
const app = require('../app');

describe('Auth', () => {
  test('login succeeds and returns token', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'test', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('profile requires token', async () => {
    const res = await request(app).get('/profile');
    expect(res.statusCode).toBe(401);
  });
});
