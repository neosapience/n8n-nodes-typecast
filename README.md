# n8n-nodes-typecast

[![npm version](https://img.shields.io/npm/v/@neosapience/n8n-nodes-typecast.svg)](https://www.npmjs.com/package/@neosapience/n8n-nodes-typecast)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Integrate [Typecast](https://typecast.ai/) AI TTS into your [n8n](https://n8n.io/) workflows with this community node.

## Features

- **Voice Resource**
  - Clone Voice: create a quick-cloned custom voice from a WAV or MP3 binary input
  - Delete Cloned Voice: delete a quick-cloned voice by its `uc_...` voice ID
  - Get All Voices: list voices with `model` / `gender` / `age` / `use_case` filters
  - Get Voice: look up a single voice by ID via the V2 API
- **Speech Resource**
  - Text to Speech: convert text to speech using a selected voice
  - Text to Speech (Streaming): low-latency chunked audio via `POST /v1/text-to-speech/stream`
  - Text to Speech with Timestamps: audio + word / character alignment for SRT / WebVTT caption generation
- **Subscription Resource**
  - Get My Subscription: plan tier, credit usage, and concurrency limit at runtime
- **Output controls**
  - `target_lufs`: absolute loudness normalization (`-70.0 ~ 0.0` LUFS); mutually exclusive with Volume on the non-streaming endpoint

## Node Structure

- Node: `Typecast`
  - Resources: `voice`, `speech`, `subscription`
  - Operations:
    - `voice`: `clone`, `delete`, `getMany`, `getOne`
    - `speech`: `textToSpeech`, `textToSpeechStream`, `textToSpeechWithTimestamps`
    - `subscription`: `getMy`

## Credentials Setup

1. Get your API key from [Typecast Dashboard](https://typecast.ai/developers/api/api-key)
2. In n8n, add new credentials of type **Typecast API**
3. Enter your API key

## Usage Example

1. Add the **Typecast** node to your workflow
2. Select a resource and operation (e.g., Speech > Text to Speech)
3. Provide required parameters (e.g., Voice ID, Text)
4. Connect and run your workflow

### Quick Cloning Example

1. Add a node that outputs an audio file as binary data, such as **Read/Write Files from Disk** or an HTTP download node.
2. Add **Typecast > Voice > Clone Voice**.
3. Set **Audio Binary Property** to the binary property name from the previous node, usually `data`.
4. Set **Voice Name** and **Model**, then run the node.
5. Use the returned `voice_id` (`uc_...`) in a following **Typecast > Speech > Text to Speech** node by selecting Voice ID **By ID**.
6. When the cloned voice is no longer needed, pass the same `uc_...` ID to **Typecast > Voice > Delete Cloned Voice**.

## Installation

### Via npm

```bash
npm install @neosapience/n8n-nodes-typecast
```

### Via n8n Community Nodes

Follow the [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

In n8n, go to **Settings > Community Nodes** and install:

```
@neosapience/n8n-nodes-typecast
```

## Compatibility

- n8n v1.0+

## Development

```bash
# Install dependencies
npm install

# Build the node
npm run build

# Lint & format
npm run lint
npm run format

# Run development mode
npm run dev
```

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Typecast API Docs](https://typecast.ai/docs/api-reference/endpoint/text-to-speech/text-to-speech)

## License

[MIT](LICENSE)
