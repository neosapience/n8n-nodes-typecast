const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { test } = require('node:test');

test('patched handlebars retains development template rendering', () => {
  const cliRequire = createRequire(require.resolve('../node_modules/@n8n/node-cli/package.json'));
  const handlebars = cliRequire('handlebars');
  assert.ok(handlebars.VERSION.localeCompare('4.7.10', undefined, { numeric: true }) >= 0);
  assert.equal(handlebars.compile('Hello {{name}}')({ name: '<Typecast>' }), 'Hello &lt;Typecast&gt;');
});

test('patched axios preserves the development caller request contract', async () => {
  const networkRequire = createRequire(require.resolve('../node_modules/@n8n/backend-network/package.json'));
  const axios = networkRequire('axios');
  assert.ok(axios.VERSION.localeCompare('1.20.0', undefined, { numeric: true }) >= 0);
  const response = await axios.get('https://api.example.test/v3/voices', {
    headers: { 'X-API-KEY': 'test-key' },
    adapter: async (config) => {
      assert.equal(config.method, 'get');
      assert.equal(config.headers.get('X-API-KEY'), 'test-key');
      return { data: [], status: 200, statusText: 'OK', headers: {}, config };
    },
  });
  assert.deepEqual(response.data, []);
});

test('patched development dependencies retain caller APIs and reject short UUID buffers', () => {
  const networkRequire = createRequire(require.resolve('../node_modules/@n8n/backend-network/package.json'));
  assert.deepEqual(networkRequire('qs').parse('name=typecast&tags=a&tags=b'), {
    name: 'typecast', tags: ['a', 'b'],
  });
  for (const pkg of ['classic', 'community']) {
    const callerRequire = createRequire(require.resolve(`../node_modules/@langchain/${pkg}/package.json`));
    const uuid = callerRequire('uuid');
    assert.equal(uuid.validate(uuid.v4()), true);
    assert.equal(uuid.v5('python.org', uuid.v5.DNS), '886313e1-3b8a-5372-9b90-0c9aee199e5d');
    assert.throws(() => uuid.v5('typecast.ai', uuid.v5.DNS, new Uint8Array(1)), RangeError);
  }
});
