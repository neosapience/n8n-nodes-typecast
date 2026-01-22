import type { INodeProperties } from 'n8n-workflow';

const showOnlyForVoice = {
	resource: ['voice'],
};

export const voiceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForVoice,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific voice model',
				action: 'Get a voice',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get all available voice models',
				action: 'Get all voices',
			},
		],
		default: 'getMany',
	},
	// ----------------------------------
	//         voice:get
	// ----------------------------------
	{
		displayName: 'Voice ID',
		name: 'voiceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['voice'],
				operation: ['get'],
			},
		},
		default: 'tc_60e5426de8b95f1d3000d7b5',
		description: 'Voice ID in format \'tc_\' followed by a unique identifier\n\nCase-sensitive: must use lowercase (tc_xxx). Example: \'tc_60e5426de8b95f1d3000d7b5\'. Use "Get Many" to see all available voice IDs.',
		placeholder: 'tc_60e5426de8b95f1d3000d7b5',
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['voice'],
				operation: ['get'],
			},
		},
		options: [
			{
				name: 'SSFM-V30 (Latest)',
				value: 'ssfm-v30',
				description: 'Latest model with improved prosody and Smart Emotion support',
			},
			{
				name: 'SSFM-V21',
				value: 'ssfm-v21',
				description: 'Stable production model with reliable quality',
			},
		],
		default: 'ssfm-v30',
		description: 'Voice model to query\n\nDifferent models may have different characteristics for the same voice ID.',
	},
	// ----------------------------------
	//         voice:getMany
	// ----------------------------------
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['voice'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				name: 'All',
				value: '',
				description: 'List all available voices for all models',
			},
			{
				name: 'SSFM-V30 (Latest)',
				value: 'ssfm-v30',
				description: 'List voices for ssfm-v30 model only',
			},
			{
				name: 'SSFM-V21',
				value: 'ssfm-v21',
				description: 'List voices for ssfm-v21 model only',
			},
		],
		default: '',
		description: 'Filter voices by model\n\nLeave as "All" to retrieve all available voices across all models. Each voice has unique characteristics and supported emotions.',
	},
];
