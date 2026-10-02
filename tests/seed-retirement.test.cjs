const assert = require('node:assert/strict');
const { test } = require('node:test');
const { Typecast } = require('../dist/nodes/Typecast/Typecast.node.js');

test('all speech actions ignore legacy seed values and hide the option', async () => {
  const node = new Typecast();
  const options = node.description.properties.find((field) => field.name === 'additionalOptions');
  assert.ok(options);
  assert.equal(options.options.some((field) => field.name === 'seed'), false);
  for (const operation of ['textToSpeech', 'textToSpeechStream', 'textToSpeechWithTimestamps']) {
    for (const seed of [0, 42]) {
      const captured = [];
      const context = {
        getInputData: () => [{ json: {} }],
        getNodeParameter: (name, _index, fallback) => ({
          resource: 'speech', operation, voiceId: 'tc_test', text: 'hello', model: 'ssfm-v30',
          additionalOptions: { seed },
        })[name] ?? fallback,
        continueOnFail: () => false,
        helpers: {
          httpRequestWithAuthentication: async (_credential, options) => {
            captured.push(options.body);
            return options.url.includes('with-timestamps') ? { audio: '', words: [] } : Buffer.from('audio');
          },
          prepareBinaryData: async () => ({ data: '', mimeType: 'audio/wav' }),
        },
      };
      await node.execute.call(context);
      assert.equal(captured.length, 1);
      assert.equal(Object.hasOwn(captured[0], 'seed'), false);
      assert.equal(captured[0].text, 'hello');
    }
  }
});
