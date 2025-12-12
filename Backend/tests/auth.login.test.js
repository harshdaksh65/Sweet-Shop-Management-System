const request = require('supertest');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user.model');

describe('POST /api/auth/login', () => {
  const baseUser = {
    username: 'loginuser',
    email: 'login@example.com',
    password: 'Password123!',
    fullname: { firstname: 'Login', lastname: 'User' },
    role: 'user',
  };

  beforeEach(async () => {
    // ensure the user exists in DB with hashed password
    const hash = await bcrypt.hash(baseUser.password, 10);
    await User.create({
      username: baseUser.username,
      email: baseUser.email,
      password: hash,
      fullname: baseUser.fullname,
      role: baseUser.role,
    });
  });

  it('should login successfully with correct username and password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: baseUser.username,
        password: baseUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User logged in successfully');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', baseUser.username);
    expect(res.body.user).toHaveProperty('email', baseUser.email);
  });

  it('should login successfully with correct email and password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: baseUser.email,
        password: baseUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User logged in successfully');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', baseUser.username);
    expect(res.body.user).toHaveProperty('email', baseUser.email);
  });

  it('should fail with invalid credentials (wrong password)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: baseUser.username,
        password: 'WrongPassword!1',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid Credentials');
  });

  it('should fail when user does not exist', async () => {
    await mongoose.connection.db.dropDatabase();

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'unknownuser',
        password: 'Password123!',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid Credentials');
  });
});
