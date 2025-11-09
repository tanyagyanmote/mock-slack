const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const express = require('express');

require('dotenv').config();
const app = require('../../backend/src/app');

let backend;
let frontend;
let browser;
let page;

beforeAll(() => {
  backend = http.createServer(app);
  backend.listen(3010, () => {
    console.log('Backend Running at http://localhost:3010');
  });
  frontend = http.createServer(
    express()
      .use('/assets', express.static(
        path.join(__dirname, '..', '..', 'frontend', 'dist', 'assets')))
      .get('*', function(req, res) {
        res.sendFile('index.html',
          {root: path.join(__dirname, '..', '..', 'frontend', 'dist')});
      }),
  );
  frontend.listen(3000, () => {
    console.log('Frontend Running at http://localhost:3000');
  });
});

afterAll((done) => {
  backend.close(() => {
    frontend.close(done);
  });
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
  });
  page = await browser.newPage();
});

afterEach(async () => {
  await browser.close();
});

test('Testing good Login ', async () => {
  await page.goto('http://localhost:3000');
  const email = await page.$('#email');
  await email.type('anna@books.com');
  const password = await page.$('#password');
  await password.type('annaadmin');
  await page.waitForSelector('#signin');
  await Promise.all([
    page.click('#signin'),
  ]);
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Channels")',
  );
  const label = await page.$('#testChannel');
  const val = await (await label.getProperty('textContent')).jsonValue();
  expect(val.search(/Channels/)).toEqual(0);
});


test('Testing Bad Login and trying to Sign In Again', async () => {
  const handleDialog = new Promise((res) => {
    page.on('dialog', async (dialog) => {
      await dialog.dismiss();
      res();
    });
  });

  await page.goto('http://localhost:3000');

  const email = await page.$('#email');
  await email.type('anna@books.com');
  const password = await page.$('#password');
  await password.type('badpassword');
  await page.waitForSelector('#signin');
  await Promise.all([
    page.click('#signin'),
  ]);

  await handleDialog;

  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Login")',
  );
});


test('Testing if Workspaces render correctly', async () => {
  await page.goto('http://localhost:3000');
  const email = await page.$('#email');
  await email.type('anna@books.com');
  const password = await page.$('#password');
  await password.type('annaadmin');
  await page.waitForSelector('#signin');
  await Promise.all([
    page.click('#signin'),
  ]);
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Channels")',
  );
  const label = await page.$('#testChannel');
  const val = await (await label.getProperty('textContent')).jsonValue();
  expect(val.search(/Channels/)).toEqual(0);

  await page.waitForSelector('#clickopen');
  await Promise.all([
    page.click('#clickopen'),
  ]);
  await page.waitForSelector('#clickcloseWorkspaceOne');
  await Promise.all([
    page.click('#clickcloseWorkspaceOne'),
  ]);
});

test('Fake adding workshapes, checks if it doesnt exist', async () => {
  await page.goto('http://localhost:3000');
  const email = await page.$('#email');
  await email.type('anna@books.com');
  const password = await page.$('#password');
  await password.type('annaadmin');
  await page.waitForSelector('#signin');
  await Promise.all([
    page.click('#signin'),
  ]);
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Channels")',
  );
  await page.$('#createWorkspace');
  await page.waitForSelector('#postWorkspace');
  await Promise.all([
    page.click('#postWorkspace'),
  ]);
  await page.waitForSelector('#clickopen');
  await Promise.all([
    page.click('#clickopen'),
  ]);
  const channellabel = await page.$('#clickclosethisisafaketest');
  expect(channellabel).toBeNull();
});

test('Adding Workspaces correctly', async () => {
  await page.goto('http://localhost:3000');
  const email = await page.$('#email');
  await email.type('anna@books.com');
  const password = await page.$('#password');
  await password.type('annaadmin');
  await page.waitForSelector('#signin');
  await Promise.all([
    page.click('#signin'),
  ]);
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Channels")',
  );
  const workspace = await page.$('#createWorkspace');
  await workspace.type('thisisatest');
  await page.waitForSelector('#postWorkspace');
  await Promise.all([
    page.click('#postWorkspace'),
  ]);
  await page.waitForSelector('#clickopen');
  await Promise.all([
    page.click('#clickopen'),
  ]);
  await page.waitForSelector('#clickclosethisisatest');
  await Promise.all([
    page.click('#clickclosethisisatest'),
  ]);
});


test('Testing if Channels render correctly', async () => {
  await page.goto('http://localhost:3000');
  const email = await page.$('#email');
  await email.type('anna@books.com');
  const password = await page.$('#password');
  await password.type('annaadmin');
  await page.waitForSelector('#signin');
  await Promise.all([
    page.click('#signin'),
  ]);
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Channels")',
  );
  const label = await page.$('#testChannel');
  const val = await (await label.getProperty('textContent')).jsonValue();
  expect(val.search(/Channels/)).toEqual(0);

  await page.waitForSelector('#clickopen');
  await Promise.all([
    page.click('#clickopen'),
  ]);
  await page.waitForSelector('#clickcloseWorkspaceOne');
  await Promise.all([
    page.click('#clickcloseWorkspaceOne'),
  ]);
  await page.waitForSelector('#clickChannelUCSC');
  await Promise.all([
    page.click('#clickChannelUCSC'),
  ]);
});


test('Testing if Messages render, checking if Home button is enabled',
  async () => {
    await page.goto('http://localhost:3000');
    const email = await page.$('#email');
    await email.type('anna@books.com');
    const password = await page.$('#password');
    await password.type('annaadmin');
    await page.waitForSelector('#signin');
    await Promise.all([
      page.click('#signin'),
    ]);
    await page.waitForFunction(
      'document.querySelector("body").innerText.includes("Channels")',
    );
    const label = await page.$('#testChannel');
    const val = await (await label.getProperty('textContent')).jsonValue();
    expect(val.search(/Channels/)).toEqual(0);

    await page.waitForSelector('#clickopen');
    await Promise.all([
      page.click('#clickopen'),
    ]);
    await page.waitForSelector('#clickcloseWorkspaceOne');
    await Promise.all([
      page.click('#clickcloseWorkspaceOne'),
    ]);
    await page.waitForSelector('#clickChannelUCSC');
    await Promise.all([
      page.click('#clickChannelUCSC'),
    ]);
    await page.waitForSelector('#clickHome');
    await Promise.all([
      page.click('#clickHome'),
    ]);
  });

test('Fake adding channel, checks if it doesnt exist', async () => {
  await page.goto('http://localhost:3000');
  const email = await page.$('#email');
  await email.type('anna@books.com');
  const password = await page.$('#password');
  await password.type('annaadmin');
  await page.waitForSelector('#signin');
  await Promise.all([
    page.click('#signin'),
  ]);
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Channels")',
  );
  const label = await page.$('#testChannel');
  const val = await (await label.getProperty('textContent')).jsonValue();
  expect(val.search(/Channels/)).toEqual(0);
  await page.waitForSelector('#testChannel');
  await Promise.all([
    page.click('#testChannel'),
  ]);
  await page.waitForSelector('#addChannel');
  await Promise.all([
    page.click('#addChannel'),
  ]);
  const channellabel = await page.$('#clickChanneldoesntexsist');
  expect(channellabel).toBeNull();
});

// test('Creating Channels correctly, checks if it exists', async () => {
//   await page.goto('http://localhost:3000');
//   const email = await page.$('#email');
//   await email.type('anna@books.com');
//   const password = await page.$('#password');
//   await password.type('annaadmin');
//   await page.waitForSelector('#signin');
//   await Promise.all([
//     page.click('#signin'),
//   ]);
//   await page.waitForFunction(
//     'document.querySelector("body").innerText.includes("Channels")',
//   );
//   const label = await page.$('#testChannel');
//   const val = await (await label.getProperty('textContent')).jsonValue();
//   expect(val.search(/Channels/)).toEqual(0);
//   await page.waitForSelector('#testChannel');
//   await Promise.all([
//     page.click('#testChannel'),
//   ]);
//   await page.waitForSelector('#addChannel');
//   await Promise.all([
//     page.click('#addChannel'),
//   ]);
//   await page.waitForSelector('#adding', {visible: true});
//   await page.type('#adding', 'UniqueChannelName');
//   await page.click('#add');
//   await page.waitForFunction(
//     'document.querySelector("body").innerText.includes("UniqueChannelName")',
//   );
//   const channellabel = await page.$('#clickChannelUniqueChannelName');
//   const channelval =
//     await (await channellabel.getProperty('textContent')).jsonValue();
//   expect(channelval.search(/UniqueChannelName/)).toBeGreaterThan(-1);
// });


test('Testing logout button after logging in ', async () => {
  await page.goto('http://localhost:3000');
  const email = await page.$('#email');
  await email.type('anna@books.com');
  const password = await page.$('#password');
  await password.type('annaadmin');
  await page.waitForSelector('#signin');
  await Promise.all([
    page.click('#signin'),
  ]);
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Channels")',
  );
  const label = await page.$('#testChannel');
  const val = await (await label.getProperty('textContent')).jsonValue();
  expect(val.search(/Channels/)).toEqual(0);
  await page.waitForSelector('#logout');
  await Promise.all([
    page.click('#logout'),
  ]);
});


test('Create and then delete a channel', async () => {
  await page.goto('http://localhost:3000/signup');
  await page.type('#email', 'anna@books.com');
  await page.type('#password', 'annaadmin');
  await page.click('#signin');
  await page.waitForFunction(`
  document.querySelector("body").innerText.includes("Channels")`);
  // Create a new channel
  await page.waitForSelector('#testChannel');
  await Promise.all([
    page.click('#testChannel'),
  ]);
  await page.waitForSelector('#addChannel');
  await Promise.all([
    page.click('#addChannel'),
  ]);
  await page.waitForSelector('#adding', {visible: true});
  await page.type('#adding', 'deleteChannel');
  await page.waitForSelector('#add', {visible: true});
  await page.click('#add');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("deleteChannel")',
  );
  const channellabel = await page.$('#clickChanneldeleteChannel');
  const channelval =
    await (await channellabel.getProperty('textContent')).jsonValue();
  expect(channelval.search(/deleteChannel/)).toBeGreaterThan(-1);
  await page.click(`#deleteChanneldeleteChannel`);
  await page.waitForFunction(
    `document.querySelector("body")
    .innerText.includes("deleteChannel") === false`);
});
