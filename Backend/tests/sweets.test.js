const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Sweet = require('../src/models/sweet.model');

async function createUserAndLogin({ username, email, password, role = 'user' }) {
  const hash = await bcrypt.hash(password, 10);
  await User.create({
    username,
    email,
    password: hash,
    fullname: { firstname: 'Test', lastname: 'User' },
    role,
  });

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  expect(res.statusCode).toBe(200);
  const cookies = res.headers['set-cookie'];
  expect(cookies).toBeDefined();
  return cookies;
}

describe('Sweets API', () => {
  it('should require auth for sweets routes', async () => {
    const res = await request(app).get('/api/sweets');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });

  it('should create and fetch sweets for logged in user', async () => {
    const cookies = await createUserAndLogin({
      username: 'user1',
      email: 'user1@example.com',
      password: 'Password123!',
      role: 'user',
    });

    const createRes = await request(app)
      .post('/api/sweets')
      .set('Cookie', cookies)
      .send({
        name: 'Ladoo',
        imageUrl: 'http://image',
      category: 'Traditional',
        price: 50,
        quantity: 10,
      });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body).toHaveProperty('sweet');
    const sweetId = createRes.body.sweet._id;

    const listRes = await request(app)
      .get('/api/sweets')
      .set('Cookie', cookies);

    expect(listRes.statusCode).toBe(200);
    expect(listRes.body).toHaveProperty('sweets');
    expect(listRes.body.sweets.length).toBe(1);
    expect(listRes.body.sweets[0]._id).toBe(sweetId);
  });

  it('should search sweets by name and price range', async () => {
    const cookies = await createUserAndLogin({
      username: 'user2',
      email: 'user2@example.com',
      password: 'Password123!',
    });

    await Sweet.create([
      { name: 'Barfi', category: 'Milk', price: 100, quantity: 5, inStock: true },
      { name: 'Kaju Katli', category: 'DryFruit', price: 200, quantity: 3, inStock: true },
    ]);

    const res = await request(app)
      .get('/api/sweets/search?name=bar&category=Milk&minPrice=50&maxPrice=150')
      .set('Cookie', cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('sweets');
    expect(res.body.sweets.length).toBe(1);
    expect(res.body.sweets[0].name).toBe('Barfi');
  });

  it('should update a sweet for logged in user', async () => {
    const cookies = await createUserAndLogin({
      username: 'user3',
      email: 'user3@example.com',
      password: 'Password123!',
    });

    const sweet = await Sweet.create({
      name: 'Jalebi',
      category: 'Fried',
      price: 80,
      quantity: 15,
      inStock: true,
    });

    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set('Cookie', cookies)
      .send({ price: 90 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('sweet');
    expect(res.body.sweet.price).toBe(90);
  });

  it('should prevent non-admin from deleting a sweet', async () => {
    const cookies = await createUserAndLogin({
      username: 'user4',
      email: 'user4@example.com',
      password: 'Password123!',
      role: 'user',
    });

    const sweet = await Sweet.create({
      name: 'Rasgulla',
      category: 'Syrup',
      price: 120,
      quantity: 8,
      inStock: true,
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set('Cookie', cookies);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'Forbidden: Admins only');
  });

  it('should allow admin to delete a sweet', async () => {
    const cookies = await createUserAndLogin({
      username: 'admin',
      email: 'admin@example.com',
      password: 'Password123!',
      role: 'admin',
    });

    const sweet = await Sweet.create({
      name: 'Peda',
      category: 'Milk',
      price: 60,
      quantity: 20,
      inStock: true,
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set('Cookie', cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Sweet deleted successfully');
  });

  it('should purchase a sweet and decrease quantity', async () => {
    const cookies = await createUserAndLogin({
      username: 'buyer',
      email: 'buyer@example.com',
      password: 'Password123!',
    });

    const sweet = await Sweet.create({
      name: 'Sonpapdi',
      category: 'Flaky',
      price: 70,
      quantity: 5,
      inStock: true,
    });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set('Cookie', cookies)
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweet.quantity).toBe(3);
  });

  it('should not purchase more than available quantity', async () => {
    const cookies = await createUserAndLogin({
      username: 'buyer2',
      email: 'buyer2@example.com',
      password: 'Password123!',
    });

    const sweet = await Sweet.create({
      name: 'Imarti',
      category: 'Fried',
      price: 90,
      quantity: 1,
      inStock: true,
    });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set('Cookie', cookies)
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Insufficient quantity available');
  });

  it('should allow admin to restock a sweet', async () => {
    const cookies = await createUserAndLogin({
      username: 'admin2',
      email: 'admin2@example.com',
      password: 'Password123!',
      role: 'admin',
    });

    const sweet = await Sweet.create({
      name: 'Chamcham',
      category: 'Syrup',
      price: 110,
      quantity: 0,
      inStock: false,
    });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set('Cookie', cookies)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweet.quantity).toBe(5);
    expect(res.body.sweet.inStock).toBe(true);
  });

  it('should prevent non-admin from restocking a sweet', async () => {
    const cookies = await createUserAndLogin({
      username: 'user5',
      email: 'user5@example.com',
      password: 'Password123!',
      role: 'user',
    });

    const sweet = await Sweet.create({
      name: 'Kalakand',
      category: 'Milk',
      price: 130,
      quantity: 0,
      inStock: false,
    });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set('Cookie', cookies)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'Forbidden: Admins only');
  });
});
