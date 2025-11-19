import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSpeech = {
	resource: ['speech'],
};

export const speechDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForSpeech,
		},
		options: [
			{
				name: 'Text to Speech',
				value: 'textToSpeech',
				description: 'Convert text to speech using a specified voice',
				action: 'Convert text to speech',
			},
		],
		default: 'textToSpeech',
	},
	// ----------------------------------
	//         speech:textToSpeech
	// ----------------------------------
	{
		displayName: 'Voice ID',
		name: 'voiceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['textToSpeech'],
			},
		},
		default: 'tc_62a8975e695ad26f7fb514d1',
		description: 'Voice ID to use for speech generation',
		placeholder: 'tc_62a8975e695ad26f7fb514d1',
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['textToSpeech'],
			},
		},
		default: '',
		typeOptions: {
			rows: 4,
		},
		description: 'Text to convert to speech',
		placeholder: 'Hello, Typecast!',
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['textToSpeech'],
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
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['textToSpeech'],
			},
		},
		options: [
			{
				displayName: 'Audio Format',
				name: 'audioFormat',
				type: 'options',
				options: [
					{
						name: 'MP3',
						value: 'mp3',
					},
					{
						name: 'WAV',
						value: 'wav',
					},
				],
				default: 'wav',
				description: 'Output audio format',
			},
			{
				displayName: 'Audio Pitch',
				name: 'audioPitch',
				type: 'number',
				typeOptions: {
					minValue: -12,
					maxValue: 12,
				},
				default: 0,
				description: 'Pitch adjustment in semitones (-12 to +12)',
			},
			{
				displayName: 'Audio Tempo',
				name: 'audioTempo',
				type: 'number',
				typeOptions: {
					minValue: 0.5,
					maxValue: 2,
					numberPrecision: 1,
				},
				default: 1,
				description: 'Speed of speech (0.5x to 2.0x)',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryProperty',
				type: 'string',
				default: 'data',
				description: 'Name of the binary property to store the audio file',
			},
			{
				displayName: 'Emotion Intensity',
				name: 'emotionIntensity',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 2,
					numberPrecision: 1,
				},
				default: 1,
				description: 'Intensity of emotion (0.0 to 2.0)',
			},
			{
				displayName: 'Emotion Preset',
				name: 'emotionPreset',
				type: 'options',
				options: [
					{
						name: 'Angry',
						value: 'angry',
					},
					{
						name: 'Happy',
						value: 'happy',
					},
					{
						name: 'Normal',
						value: 'normal',
					},
					{
						name: 'Sad',
						value: 'sad',
					},
					{
						name: 'Tone Mid',
						value: 'tonemid',
					},
					{
						name: 'Tone Up',
						value: 'toneup',
					},
				],
				default: 'normal',
				description: 'Emotion type for the generated speech',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				options: [
					{
						name: 'Auto-Detect',
						value: '',
					},
					{
						name: 'Chinese',
						value: 'zho',
					},
					{
						name: 'English',
						value: 'eng',
					},
					{
						name: 'Japanese',
						value: 'jpn',
					},
					{
						name: 'Korean',
						value: 'kor',
					},
				],
				default: '',
				description: 'Language code (ISO 639-3). If not provided, will be auto-detected.',
			},
			{
				displayName: 'Seed',
				name: 'seed',
				type: 'number',
				default: 42,
				description: 'Random seed for reproducible results',
			},
			{
				displayName: 'Volume',
				name: 'volume',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 200,
				},
				default: 100,
				description: 'Audio volume (0-200)',
			},
		],
	},
];
