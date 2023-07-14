const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const helper = require('./user_test_helper');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Testing creating new user', () => {
  test('Too short password causes status 400', async () => {
    const user = {
      username: 'test name',
      name: 'test',
      password: 'qw',
    };
    const response = await api
      .post('/api/users')
      .send(user)
      .expect(400);

    expect(response.body).toEqual({ error: 'password must be 3 characters long' });
    expect(helper.usersInDb.length).toEqual(0);
  });
  test('Missing password or username causes status 400', async () => {
    const withoutPassword = {
      username: 'test name',
      name: 'test',
    };
    const withoutUsername = {
      name: 'jea',
      password: 'hiwdjwd8898e',
    };
    const response1 = await api
      .post('/api/users')
      .send(withoutPassword)
      .expect(400);
    const response2 = await api
      .post('/api/users')
      .send(withoutUsername)
      .expect(400);
    expect(response1.body.error).toContain('password must be 3 characters long');
    expect(response2.body.error).toContain('validation failed');
  });
  test('Valid user can be added', async () => {
    const user = {
      username: 'test_name',
      name: 'test',
      password: 'qwerty',
    };
    await api
      .post('/api/users')
      .send(user)
      .expect(201);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
