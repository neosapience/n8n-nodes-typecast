# n8n-nodes-typecast


Integrate [Typecast](https://typecast.ai/) AI TTS into your [n8n](https://n8n.io/) workflows with this community node.

## Features

- **Voice Resource**
	- Get Many: List all available voice models
	- Get: Retrieve details of a specific voice model
- **Speech Resource**
	- Text to Speech: Convert text to speech using a selected voice

## Node Structure

- Node: `Typecast`
	- Resources: `voice`, `speech`
	- Operations:
		- `voice`: `getMany`, `get`
		- `speech`: `textToSpeech`

## Credentials Setup

1. Get your API key from [Typecast Dashboard](https://typecast.ai/developers)
2. In n8n, add new credentials of type **Typecast API**
3. Enter your API key

## Usage Example

1. Add the **Typecast** node to your workflow
2. Select a resource and operation (e.g., Speech > Text to Speech)
3. Provide required parameters (e.g., Voice ID, Text)
4. Connect and run your workflow

## Installation

Follow the [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

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
