const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;
let accessToken;

// const badAccessToken = `eyJhbGciOiJIUzI1NiIcCI6IkpXVCJ9.
// eyJlbWFpbCI6ImFucmFAYm9va3MuY29tIiwidXNlcm5hbWU9OiJBbm
// 5hIEFkbWluIiwiaWF0IjoxNzA5NzkxNDU5LCJleHAiOjE3MDk3OTMyN
// Tl9.lRIrU926SKP03atDFMto8JWSrwT7D4aMmcAv-aDAsCs`;

const badAccessToken = `1234`;

beforeAll( async () => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  await db.reset();
  const response = await request.post('/v0/login')
    .send({email: 'anna@books.com', password: 'annaadmin'});
  accessToken = response.body.accessToken;
});

afterAll((done) => {
  server.close(done);
  db.shutdown();
});

test('Login with non-existent email returns 401', async () => {
  const response = await request.post('/v0/login')
    .send({email: 'nonexistentemail@example.com', password: 'anyPassword'});
  expect(response.status).toBe(401);
});

test('Login with correct email but incorrect password returns 401',
  async () => {
    const response = await request.post('/v0/login')
      .send({email: 'anna@books.com', password: 'wrongPassword'});

    expect(response.status).toBe(401);
  });

test('Access with invalid/expired token should return 403 Forbidden',
  async () => {
    const userID = encodeURIComponent('8cf5d496-f232-48c7-93f2-92b12b587d76');
    await request.get(`/v0/users/${userID}/workspaces`)
      .set('Authorization', `Bearer ${badAccessToken}`)
      .expect(403);
  });

test('Access without token should return 401 Unauthorized', async () => {
  const userID = encodeURIComponent('8cf5d496-f232-48c7-93f2-92b12b587d98');
  await request.get(`/v0/users/${userID}/workspaces`)
    .expect(401);
});

test('GET /workspace for user that doesnt have any workspaces', async () => {
  const userID = encodeURIComponent('470104fd-ae76-4ec8-a695-40e81f002541');
  await request.get(`/v0/users/${userID}/workspaces`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(404);
});

test('GET /workspace for user that doesnt exsist EXPECT 404', async () => {
  const userID = encodeURIComponent('d312ec08-2e78-4e64-a959-ad2c969e4e22');
  await request.get(`/v0/users/${userID}/workspaces`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(404);
});

test('GET /workspace with a valid email should return workspaces', async () => {
  const userID = ('8cf5d496-f232-48c7-93f2-92b12b587d94');
  await request.get(`/v0/users/${userID}/workspaces`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200)
    .then((response) => {
      const workspaces = response.body;
      expect(Array.isArray(workspaces)).toBe(true);
      expect(workspaces.length).toBeGreaterThan(0);
    });
});

test('GET /workspace with a valid email bad accesstoken', async () => {
  const userID = ('8cf5d496-f232-48c7-93f2-92b12b587d94');
  await request.get(`/v0/users/${userID}/workspaces`)
    .set('Authorization', `Bearer ${badAccessToken}`)
    .expect(403);
});

test('POST /workspace with a bad email good accesstoken', async () => {
  const userID = ('4e4a9e9a-e2ea-43f1-ae4b-74b629ad81ac');
  await request.post(`/v0/users/${userID}/workspaces`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({name: 'Testing'})
    .expect(404);
});


test('POST /users/:userID/workspaces', async () => {
  const userID = ('8cf5d496-f232-48c7-93f2-92b12b587d94');
  const response = await request.post(`/v0/users/${userID}/workspaces`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({name: 'AnotherTest'})
    .expect(200);
  expect(response.body).toEqual(expect.anything());
  const getResponse = await request.get(`/v0/users/${userID}/workspaces`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);
  expect(getResponse.body).toEqual(expect.arrayContaining([
    expect.objectContaining({
      info: expect.objectContaining({
        name: 'AnotherTest',
      }),
    }),
  ]));
});

test('POST w/ fake email', async () => {
  const userID = ('d312ec08-2e78-4e64-a959-ad2c969e4e22');
  await request.post(`/v0/users/${userID}/workspaces`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({name: 'NewWorkspace'});
  expect(404);
});


test('POST a new channel and retrieve it', async () => {
  // const userID = ('da953f7e-4d08-4d12-b05e-a0f4526f1848');
  // const workspaceName = encodeURIComponent('WorkspaceOne');
  const workspaceID = ('9970731b-e9de-45a5-b4cb-198231f4abcb');
  const newChannelName = 'TestChannel';
  await request.post(`/v0/users/userID/workspaces/${workspaceID}/channels`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({channelName: newChannelName})
    .expect(201);
  const getResponse =
  await request.get(`/v0/users/userID/workspaces/${workspaceID}/channels`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);
  expect(getResponse.body).toEqual(expect.arrayContaining([
    expect.objectContaining({
      info: {name: newChannelName},
    }),
  ]));
});

test('GET a channel w/ fake workspace, fake ID and receive an error',
  async () => {
    const nonExistentuserID = ('d312ec08-2e78-4e64-a959-ad2c969e4e22');
    const workspaceName = ('SomeWorkspace');
    await request
      .get(`/v0/users/${nonExistentuserID}/
      workspaces/${workspaceName}/channels`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

test('GET a channel w/ fake workspace, right email and receive an error',
  async () => {
    const nonExistentID = ('da953f7e-4d08-4d12-b05e-a0f4526f1848');
    const workspaceName = encodeURIComponent('SomeWorkspace');
    await request
      .get(`/v0/users/${nonExistentID}/workspaces/${workspaceName}/channels`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

test('POST a channel w/ fake workspace, fake email and receive an error',
  async () => {
    const nonExistentuserID = 'a2999a53-2927-4482-b709-666bb89c85a1';
    const workspaceName = 'Hello';
    const channelName = 'NewChannel';
    await request
      .post(`/v0/users/${nonExistentuserID}/
      workspaces/${workspaceName}/channels`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({channelName: channelName})
      .expect(404);
  });

test('POST a channel w/ fake workspace right email and receive an error',
  async () => {
    const nonExistentuserID = ('d312ec08-2e78-4e64-a959-ad2c969e4e22');
    const nonExistentWorkspaceName = ('NonExistentWorkspace');
    const channelName = 'NewChannel';
    await request
      .post(`/v0/users/${nonExistentuserID}/
    workspaces/${nonExistentWorkspaceName}/channels`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({channelName: channelName})
      .expect(404);
  });


test('Get a msg from channel', async () => {
  const workspaceID = ('e3cdbc28-4a78-4672-9778-4fae87d8dec8');
  await request.get(`/v0/channel/${workspaceID}/message`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);
  const getResponse = await request.get(`/v0/channel/${workspaceID}/message`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);
  const message = getResponse.body[0].info.msg;
  expect(message).toBe('Hello CSE186');
});


test('Testing delete', async () => {
  const channelID = ('7a0489d1-8f52-4a3c-92f3-df5d5b3d2566');
  await request.delete(`/v0/channel/${channelID}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);
  const workspaceID = '27864707-300e-418e-bd96-118322a2ea7c';
  const getResponse =
    await request.get(`/v0/users/userID/workspaces/${workspaceID}/channels`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  expect(getResponse.body).not.toEqual(expect.arrayContaining([
    expect.objectContaining({
      id: channelID,
    }),
  ]));
});

