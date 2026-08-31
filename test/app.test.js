const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { createApp } = require('../src/app');

const app = createApp();

test('returns the requested standard status code with an explanation', async () => {
  for (const [code, reason] of [
    [200, 'OK'],
    [404, 'Not Found'],
    [502, 'Bad Gateway'],
  ]) {
    const res = await request(app).get(`/${code}`);

    assert.strictEqual(res.status, code);
    assert.match(res.headers['content-type'], /text\/html/);
    assert.match(res.text, new RegExp(`${code} ${reason}`));
  }
});

test('returns non-standard status codes without a description', async () => {
  const res = await request(app).get('/599');

  assert.strictEqual(res.status, 599);
  assert.match(res.text, /not a standard HTTP status code/);
});

test('serves an index page describing usage', async () => {
  const res = await request(app).get('/');

  assert.strictEqual(res.status, 200);
  assert.match(res.text, /any-status/);
});

test('responds with 404 for paths that are not valid status codes', async () => {
  for (const path of ['/abc', '/99', '/600', '/1000', '/404/extra']) {
    const res = await request(app).get(path);

    assert.strictEqual(res.status, 404);
    assert.match(res.text, /404 Not Found/);
  }
});

test('escapes html in the requested path', async () => {
  const res = await request(app).get('/%3Cscript%3E');

  assert.strictEqual(res.status, 404);
  assert.doesNotMatch(res.text, /<script>/i);
});
