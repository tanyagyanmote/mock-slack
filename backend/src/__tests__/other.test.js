const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;
let accessToken;

let badAccessToken = 'eyJhbGciOiJIUzI1NiIcCI6IkpXVCJ9.eyJlbWFpbCI6ImFucmFAYm9va3MuY29tIiwidXNlcm5hbWU9OiJBbm5hIEFkbWluIiwiaWF0IjoxNzA5NzkxNDU5LCJleHAiOjE3MDk3OTMyNTl9.lRIrU926SKP03atDFMto8JWSrwT7D4aMmcAv-aDAsCs';


beforeAll( async () => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  await db.reset();
  const response = await request.post('/v0/login')
  .send({ email: 'anna@books.com', password: 'annaadmin' });
  accessToken = response.body.accessToken;
});

afterAll((done) => {
  server.close(done);
  db.shutdown();
});

test('Access with invalid/expired token should return 403 Forbidden', async () => {
    const email = encodeURIComponent('anna@books.com');
    await request.get(`/v0/users/${email}/workspaces`)
    .set('Authorization', `Bearer ${badAccessToken}`)
    .expect(403)
});

test('Access without token should return 401 Unauthorized', async () => {
    const email = encodeURIComponent('anna@books.com');
    await request.get(`/v0/users/${email}/workspaces`)
    .expect(401)
});

test('GET /workspace for user that doesnt have any workspaces', async () => {
    const email = encodeURIComponent('dummy@email.com');
    await request.get(`/v0/users/${email}/workspaces`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(404)
});

test('GET /workspace for user that doesnt exsist EXPECT 404', async () => {
    const email = encodeURIComponent('hola@email.com');
    await request.get(`/v0/users/${email}/workspaces`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(404)
});

test('GET /workspace with a valid email should return workspaces', async () => {
    const email = 'anna@books.com';
    await request
      .get(`/v0/users/${email}/workspaces`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then((response) => {
        const workspaces = response.body;
        expect(Array.isArray(workspaces)).toBe(true);
        expect(workspaces.length).toBeGreaterThan(0);
        });
});

test('GET /workspace with a valid email bad accesstoken', async () => {
    const email = 'anna@books.com';
    await request
      .get(`/v0/users/${email}/workspaces`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
});


//workspace with an email of a user without workspaces should return empty array

test('Login with non-existent email returns 401', async () => {
    const response = await request.post('/v0/login')
      .send({ email: 'nonexistentemail@example.com', password: 'anyPassword' });
  
    expect(response.status).toBe(401);
});
  
test('Login with correct email but incorrect password returns 401', async () => {
    const response = await request.post('/v0/login')
      .send({ email: 'anna@books.com', password: 'wrongPassword' });
  
    expect(response.status).toBe(401);
});


test('POST /users/:email/workspaces', async () => {
    const email = encodeURIComponent('molly@books.com');
    const response = await request.post(`/v0/users/${email}/workspaces`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ name: 'NewWorkspace'})
    .expect(200)
    expect(response.body).toEqual(expect.anything());
    const getResponse = await request.get(`/v0/users/${email}/workspaces`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200)
    expect(getResponse.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
        name: 'NewWorkspace'
        })
    ]));
});

test('POST w/ fake email', async () => {
    const email = encodeURIComponent('testing@books.com');
    await request.post(`/v0/users/${email}/workspaces`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'NewWorkspace'});
        expect(404);
});


test('POST a new channel and retrieve it', async () => {
    const userEmail = encodeURIComponent('anna@books.com');
    const workspaceName = encodeURIComponent('WorkspaceOne');
    const newChannelName = 'TestChannel';
    await request.post(`/v0/users/${userEmail}/workspaces/${workspaceName}/channels`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ channelName: newChannelName })
      .expect(200)
    const getResponse = await request.get(`/v0/users/${userEmail}/workspaces/${workspaceName}/channels`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(getResponse.body.channels).toEqual(expect.arrayContaining([newChannelName]));
});

test('GET a channel w/ fake workspace, fake email and receive an error', async () => {
    const nonExistentEmail = encodeURIComponent('nonexistentuser@example.com');
    const workspaceName = encodeURIComponent('SomeWorkspace');
    await request
      .get(`/v0/users/${nonExistentEmail}/workspaces/${workspaceName}/channels`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404)
});

test('GET a channel w/ fake workspace, right email and receive an error', async () => {
    const nonExistentEmail = encodeURIComponent('anna@books.com');
    const workspaceName = encodeURIComponent('SomeWorkspace');
    await request
      .get(`/v0/users/${nonExistentEmail}/workspaces/${workspaceName}/channels`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(500)
});

test('POST a channel w/ fake workspace, fake email and receive an error', async () => {
    const email = encodeURIComponent('testing@books.com');
    const workspaceName = encodeURIComponent('SomeWorkspace');
    await request
      .post(`/v0/users/${email}/workspaces/${workspaceName}/channels`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'NewChannel' })
      .expect(400)
});

test('POST a channel w/ fake workspace, right email and receive an error', async () => {
    const userEmail = encodeURIComponent('anna@example.com');
    const nonExistentWorkspaceName = encodeURIComponent('NonExistentWorkspace');
    const channelName = 'NewChannel';
    await request
      .post(`/v0/users/${userEmail}/workspaces/${nonExistentWorkspaceName}/channels`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: channelName })
      .expect(400)
});