const assert = require('node:assert/strict');
const { test } = require('node:test');
const { Typecast } = require('../dist/nodes/Typecast/Typecast.node.js');

test('SSFM 3.1 is selectable and retains smart/preset prompts for all speech actions', async () => {
  const node = new Typecast();
  const model = node.description.properties.find((field) => field.name === 'model');
  assert.ok(model.options.some((option) => option.value === 'ssfm-v31'));
  assert.equal(model.default, 'ssfm-v30');
  const emotion = node.description.properties.find((field) => field.name === 'emotionType');
  assert.ok(emotion.displayOptions.show.model.includes('ssfm-v31'));
  const voice = node.description.properties.find((field) =>
    field.name === 'voiceId' && field.displayOptions.show.resource.includes('speech'));
  assert.deepEqual(voice.typeOptions.loadOptionsDependsOn, ['model']);
  for (const operation of ['textToSpeech', 'textToSpeechStream', 'textToSpeechWithTimestamps']) {
    for (const emotionType of ['smart', 'preset']) {
      const captured = [];
      const context = {
        getInputData: () => [{ json: {} }],
        getNodeParameter: (name, _index, fallback) => ({
          resource: 'speech', operation, voiceId: 'tc_test', text: 'hello', model: 'ssfm-v31',
          emotionType, emotionPreset: 'happy', emotionIntensity: 1.5,
          previousText: 'Before', nextText: 'After',
          additionalOptions: {},
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
      assert.equal(captured[0].model, 'ssfm-v31');
      assert.equal(captured[0].prompt.emotion_type, emotionType);
      assert.deepEqual(captured[0].prompt, emotionType === 'smart'
        ? { emotion_type: 'smart', previous_text: 'Before', next_text: 'After' }
        : { emotion_type: 'preset', emotion_preset: 'happy', emotion_intensity: 1.5 });
    }
  }
});

test('voice picker does not borrow emotions from another model', async () => {
  const node = new Typecast();
  const context = {
    getNodeParameter: () => 'ssfm-v31',
    helpers: { httpRequestWithAuthentication: async () => [{
      voice_id: 'tc_test', voice_name: 'Test',
      models: [{ version: 'ssfm-v30', emotions: ['whisper'] }],
    }] },
  };
  const result = await node.methods.listSearch.searchVoices.call(context);
  assert.match(result.results[0].name, /N\/A$/);
  assert.doesNotMatch(result.results[0].name, /whisper/);
});

test('voice picker displays the selected model emotions instead of v30 emotions', async () => {
  const node = new Typecast();
  const context = {
    getNodeParameter: () => 'ssfm-v31',
    helpers: { httpRequestWithAuthentication: async () => [{
      voice_id: 'tc_test', voice_name: 'Test', models: [
        { version: 'ssfm-v30', emotions: ['whisper'] },
        { version: 'ssfm-v31', emotions: ['normal'] },
      ],
    }] },
  };
  const result = await node.methods.listSearch.searchVoices.call(context);
  assert.match(result.results[0].name, /normal/);
  assert.doesNotMatch(result.results[0].name, /whisper/);
});
