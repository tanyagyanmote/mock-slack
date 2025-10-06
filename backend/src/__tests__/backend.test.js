const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
  db.shutdown();
});

test('GET Invalid URL', async () => {
    await request.get('/v0/so-not-a-real-end-point-ba-bip-de-doo-da/')
      .expect(404);
});

test('Successful login with valid credentials', async () => {
    const response = await request.post('/v0/login')
    .send({ email: 'anna@books.com', password: 'annaadmin' });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
});

test('Failed login with invalid password', async () => {
    const response = await request.post('/v0/login')
    .send({ email: 'anna@books.com', password: 'fakepassword' });
    expect(response.statusCode).toBe(401);
});

test('Failed login with invalid email', async () => {
    const response = await request.post('/v0/login')
    .send({ email: 'hello@books.com', password: 'fakepassword' });
    expect(response.statusCode).toBe(401);
});

test('Failed login with invalid email', async () => {
    const response = await request.post('/v0/login')
    .send({ email: 'hello@books.com', password: 'annaadmin' });
    expect(response.statusCode).toBe(401);
});



