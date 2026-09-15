const assert = require('node:assert/strict');
const { test } = require('node:test');
const { silenceOutput } = require('../dist/nodes/Typecast/shared/output.js');

test('optional silence preserves zero and rejects invalid input', () => {
  for (const value of [undefined, null]) assert.deepEqual(silenceOutput(value), {});
  for (const value of [0, 300, 1000]) {
    assert.deepEqual(silenceOutput(value), { remove_silence_ms: value });
  }
  for (const value of [-1, 1001, 0.5, NaN, Infinity, true, '0', '']) {
    assert.throws(() => silenceOutput(value), /integer between 0 and 1000/);
  }
});
