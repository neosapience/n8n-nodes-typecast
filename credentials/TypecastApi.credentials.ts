import {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TypecastApi implements ICredentialType {
	name = 'typecastApi';
	displayName = 'Typecast API';
	icon: Icon = 'file:../icons/typecast.svg';
	documentationUrl = 'https://typecast.ai/docs/api-reference/endpoint/text-to-speech/text-to-speech';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key from Typecast dashboard',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.typecast.ai/v1',
			url: '/voices',
		},
	};
}
