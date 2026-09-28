const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { test } = require('node:test');

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
