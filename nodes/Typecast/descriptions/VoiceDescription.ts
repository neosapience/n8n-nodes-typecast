import type { INodeProperties } from 'n8n-workflow';

export const voiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['voice'],
			},
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
];

export const voiceFields: INodeProperties[] = [
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
		default: 'tc_62a8975e695ad26f7fb514d1',
		description: 'The ID of the voice to retrieve',
		placeholder: 'tc_62a8975e695ad26f7fb514d1',
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
				name: 'SSFM-V21',
				value: 'ssfm-v21',
			},
		],
		default: 'ssfm-v21',
		description: 'Voice model to use',
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
			},
			{
				name: 'SSFM-V21',
				value: 'ssfm-v21',
			},
		],
		default: '',
		description: 'Filter by voice model (optional)',
	},
];
