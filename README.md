# n8n-nodes-typecast

This is an n8n community node for integrating Typecast TTS API into your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Typecast](https://typecast.ai/) is an AI-powered text-to-speech platform that provides realistic voice generation.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Voice

- **Get Many**: Retrieve all available voice models
- **Get**: Get details of a specific voice model by ID

### Speech

- **Text to Speech**: Convert text to speech using a specified voice model

## Credentials

To use this node, you need to configure your Typecast API credentials:

1. Get your API key from [Typecast Dashboard](https://typecast.ai/developers)
2. In n8n, create new credentials of type "Typecast API"
3. Enter your API key

## Compatibility

Tested with n8n version 1.0+

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Typecast API Documentation](https://typecast.ai/docs/api-reference/endpoint/text-to-speech/text-to-speech)

## License

[MIT](LICENSE)
