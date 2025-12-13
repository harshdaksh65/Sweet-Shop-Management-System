const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('POST /api/auth/register', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
      fullname: { firstname: 'Test', lastname: 'User' }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', 'testuser');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });

  it('should not allow duplicate username or email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
      fullname: { firstname: 'Test', lastname: 'User' }
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test2@example.com',
        password: 'Password123!',
      fullname: { firstname: 'Test', lastname: 'User2' }
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'User with this username or email already exists');
  });
});
