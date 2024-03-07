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

test('GET /workspace with a valid email should return workspaces', async () => {
    const email = 'anna@books.com';
    await request
      .get(`/v0/users/${email}/workspaces`)
      .expect(200)
      .then((response) => {
        const workspaces = response.body;
        expect(Array.isArray(workspaces)).toBe(true);
        expect(workspaces.length).toBeGreaterThan(0);
        });
});

//workspace with an email of a user without workspaces should return empty array

test('GET /workspace with a bad email should return 404', async () => {
    const email = 'not_exist@books.com'; 
    await request
      .get(`/v0/users/${email}/workspaces`)
      .expect(404);
});

// jest.mock('../db', () => ({
//     ...jest.requireActual('../db'),
//     getUserWorkspacesByEmail: jest.fn(() => {
//       throw new Error('Simulated database error');
//     }),
//   }));
  
// test('GET /workspace with a simulated error should return 500', async () => {
// const email = encodeURIComponent('valid_email@test.com'); // Use an email that would normally work
// await request
//     .get(`/v0/users/${email}/workspaces`)
//     .expect(500);
// });

test('POST /users/:email/workspaces', async () => {
    const email = encodeURIComponent('molly@books.com');
    const response = await request.post(`/v0/users/${email}/workspaces`)
    .send({ name: 'NewWorkspace'});
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.anything());
    const getResponse = await request.get(`/v0/users/${email}/workspaces`);
    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
        name: 'NewWorkspace'
        })
    ]));
});

test('POST w/ fake email', async () => {
    const email = encodeURIComponent('testing@books.com');
    await request.post(`/v0/users/${email}/workspaces`)
        .send({ name: 'NewWorkspace'});
        expect(404);
});


test('POST a new channel and retrieve it', async () => {
    const userEmail = encodeURIComponent('anna@books.com');
    const workspaceName = encodeURIComponent('WorkspaceOne');
    const newChannelName = 'TestChannel';
    await request.post(`/v0/users/${userEmail}/workspaces/${workspaceName}/channels`)
      .send({ channelName: newChannelName })
      .expect(200)
    const getResponse = await request.get(`/v0/users/${userEmail}/workspaces/${workspaceName}/channels`)
      .expect(200);
    expect(getResponse.body.channels).toEqual(expect.arrayContaining([newChannelName]));
});

test('GET a channel w/ fake workspace, fake email and receive an error', async () => {
    const nonExistentEmail = encodeURIComponent('nonexistentuser@example.com');
    const workspaceName = encodeURIComponent('SomeWorkspace');
    await request
      .get(`/v0/users/${nonExistentEmail}/workspaces/${workspaceName}/channels`)
      .expect(404)
});

test('GET a channel w/ fake workspace, right email and receive an error', async () => {
    const nonExistentEmail = encodeURIComponent('anna@books.com');
    const workspaceName = encodeURIComponent('SomeWorkspace');
    await request
      .get(`/v0/users/${nonExistentEmail}/workspaces/${workspaceName}/channels`)
      .expect(500)
});

test('POST a channel w/ fake workspace, fake email and receive an error', async () => {
    const nonExistentEmail = encodeURIComponent('nonexistentuser@example.com');
    const workspaceName = encodeURIComponent('SomeWorkspace');
    const channelName = 'NewChannel';
    await request
      .post(`/v0/users/${nonExistentEmail}/workspaces/${workspaceName}/channels`)
      .send({ name: channelName })
      .expect(400)
});

test('POST a channel w/ fake workspace, right email and receive an error', async () => {
    const userEmail = encodeURIComponent('anna@example.com');
    const nonExistentWorkspaceName = encodeURIComponent('NonExistentWorkspace');
    const channelName = 'NewChannel';
    await request
      .post(`/v0/users/${userEmail}/workspaces/${nonExistentWorkspaceName}/channels`)
      .send({ name: channelName })
      .expect(400)
});

