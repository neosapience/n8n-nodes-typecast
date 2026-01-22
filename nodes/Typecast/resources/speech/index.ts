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
		default: 'tc_60e5426de8b95f1d3000d7b5',
		description: 'Voice ID in format \'tc_\' followed by a unique identifier\n\nCase-sensitive: must use lowercase (tc_xxx). Example: \'tc_60e5426de8b95f1d3000d7b5\'. Use the "Get Many" operation under Voice resource to see all available voices.',
		placeholder: 'tc_60e5426de8b95f1d3000d7b5',
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
		description: 'Text to convert to speech (1-2000 characters)\n\nCredits consumed based on text length. Supports multiple languages including English, Korean, Japanese, and Chinese. Special characters and punctuation are handled automatically.',
		placeholder: 'Everything is so incredibly perfect that I feel like I\'m dreaming.',
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
				name: 'SSFM-V30 (Latest)',
				value: 'ssfm-v30',
				description: 'Latest model with improved prosody, Smart Emotion, and 37 language support (recommended)',
			},
			{
				name: 'SSFM-V21',
				value: 'ssfm-v21',
				description: 'Stable production model with reliable quality and 27 language support',
			},
		],
		default: 'ssfm-v30',
		description: 'Voice model to use for speech synthesis\n\nssfm-v30 is recommended for best quality and Smart Emotion features.',
	},
	{
		displayName: 'Emotion Type',
		name: 'emotionType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['textToSpeech'],
				model: ['ssfm-v30'],
			},
		},
		options: [
			{
				name: 'Smart (Auto-detect from Context)',
				value: 'smart',
				description: 'AI automatically infers emotion from text context - best for dialogue and storytelling',
			},
			{
				name: 'Preset (Manual Selection)',
				value: 'preset',
				description: 'Manually select emotion preset and intensity - best for precise control',
			},
		],
		default: 'preset',
		description: 'How to control emotional expression (ssfm-v30 only)\n\nSmart: AI detects emotion automatically from context. Preset: Manual selection with 7 emotion options.',
	},
	{
		displayName: 'Previous Text',
		name: 'previousText',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['textToSpeech'],
				model: ['ssfm-v30'],
				emotionType: ['smart'],
			},
		},
		default: '',
		typeOptions: {
			rows: 2,
		},
		description: 'Text that comes BEFORE the main text\n\nProvides context for AI to infer appropriate emotion. Optional but helps improve emotional accuracy (max 2000 characters).',
		placeholder: 'I feel like I\'m walking on air and I just want to scream with joy!',
	},
	{
		displayName: 'Next Text',
		name: 'nextText',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['textToSpeech'],
				model: ['ssfm-v30'],
				emotionType: ['smart'],
			},
		},
		default: '',
		typeOptions: {
			rows: 2,
		},
		description: 'Text that comes AFTER the main text\n\nProvides context for AI to infer appropriate emotion. Optional but helps improve emotional accuracy (max 2000 characters).',
		placeholder: 'I am literally bursting with happiness and I never want this feeling to end!',
	},
	{
		displayName: 'Emotion Preset',
		name: 'emotionPreset',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['textToSpeech'],
				model: ['ssfm-v30'],
				emotionType: ['preset'],
			},
		},
		options: [
			{
				name: 'Normal',
				value: 'normal',
				description: 'Neutral, standard tone',
			},
			{
				name: 'Happy',
				value: 'happy',
				description: 'Joyful, cheerful expression',
			},
			{
				name: 'Sad',
				value: 'sad',
				description: 'Melancholic, somber tone',
			},
			{
				name: 'Angry',
				value: 'angry',
				description: 'Intense, forceful expression',
			},
			{
				name: 'Whisper',
				value: 'whisper',
				description: 'Soft, intimate speaking style',
			},
			{
				name: 'Tone Up',
				value: 'toneup',
				description: 'Energetic, upbeat delivery',
			},
			{
				name: 'Tone Down',
				value: 'tonedown',
				description: 'Calm, subdued delivery',
			},
		],
		default: 'normal',
		description: 'Emotion preset to apply to the generated speech\n\nAll 7 emotions are available across all voices. Check specific voice characteristics via the Voices resource.',
	},
	{
		displayName: 'Emotion Intensity',
		name: 'emotionIntensity',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['textToSpeech'],
				model: ['ssfm-v30'],
				emotionType: ['preset'],
			},
		},
		typeOptions: {
			minValue: 0,
			maxValue: 2,
			numberPrecision: 1,
		},
		default: 1,
		description: 'Controls the strength of emotional expression (0.0 - 2.0)\n\n0.0=completely neutral (no emotion), 0.5=subtle hints, 1.0=standard expression (default), 1.5=strong emphasis, 2.0=maximum intensity (highly expressive).',
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
						description: 'MPEG Layer III, 320 kbps, smaller file size - ideal for web streaming',
					},
					{
						name: 'WAV',
						value: 'wav',
						description: 'PCM Uncompressed, 16-bit, higher quality - suitable for professional production',
					},
				],
				default: 'wav',
				description: 'Output audio format\n\nWAV: uncompressed 16-bit PCM, mono, 44.1kHz. MP3: 320 kbps, mono, 44.1kHz.',
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
				description: 'Pitch adjustment in semitones (-12 to +12)\n\n-12 (one octave down) to +12 (one octave up). Default: 0 (no adjustment).',
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
				description: 'Speed of speech playback (0.5x to 2.0x)\n\n0.5x (half speed) to 2.0x (double speed). Default: 1.0 (normal speed).',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryProperty',
				type: 'string',
				default: 'data',
				description: 'Name of the binary property to store the generated audio file\n\nDefault: "data". This allows you to reference the audio file in subsequent nodes.',
			},
			{
				displayName: 'Emotion Preset (ssfm-v21)',
				name: 'emotionPresetV21',
				type: 'options',
				displayOptions: {
					show: {
						'/model': ['ssfm-v21'],
					},
				},
				options: [
					{
						name: 'Normal',
						value: 'normal',
						description: 'Neutral, standard tone',
					},
					{
						name: 'Happy',
						value: 'happy',
						description: 'Joyful, cheerful expression',
					},
					{
						name: 'Sad',
						value: 'sad',
						description: 'Melancholic, somber tone',
					},
					{
						name: 'Angry',
						value: 'angry',
						description: 'Intense, forceful expression',
					},
					{
						name: 'Whisper',
						value: 'whisper',
						description: 'Soft, intimate speaking style',
					},
					{
						name: 'Tone Up',
						value: 'toneup',
						description: 'Energetic, upbeat delivery',
					},
					{
						name: 'Tone Down',
						value: 'tonedown',
						description: 'Calm, subdued delivery',
					},
				],
				default: 'normal',
				description: 'Emotion preset for ssfm-v21 model\n\nUses the legacy prompt format without Smart Emotion support.',
			},
			{
				displayName: 'Emotion Intensity (ssfm-v21)',
				name: 'emotionIntensityV21',
				type: 'number',
				displayOptions: {
					show: {
						'/model': ['ssfm-v21'],
					},
				},
				typeOptions: {
					minValue: 0,
					maxValue: 2,
					numberPrecision: 1,
				},
				default: 1,
				description: 'Controls the strength of emotional expression for ssfm-v21 (0.0 - 2.0)\n\n0.0 (neutral) to 2.0 (maximum intensity). Default: 1.0 (standard).',
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
						name: 'Arabic',
						value: 'ara',
					},
					{
						name: 'Bengali',
						value: 'ben',
					},
					{
						name: 'Bulgarian',
						value: 'bul',
					},
					{
						name: 'Cantonese',
						value: 'yue',
					},
					{
						name: 'Chinese (Mandarin)',
						value: 'zho',
					},
					{
						name: 'Croatian',
						value: 'hrv',
					},
					{
						name: 'Czech',
						value: 'ces',
					},
					{
						name: 'Danish',
						value: 'dan',
					},
					{
						name: 'Dutch',
						value: 'nld',
					},
					{
						name: 'English',
						value: 'eng',
					},
					{
						name: 'Finnish',
						value: 'fin',
					},
					{
						name: 'French',
						value: 'fra',
					},
					{
						name: 'German',
						value: 'deu',
					},
					{
						name: 'Greek',
						value: 'ell',
					},
					{
						name: 'Hindi',
						value: 'hin',
					},
					{
						name: 'Hungarian',
						value: 'hun',
					},
					{
						name: 'Indonesian',
						value: 'ind',
					},
					{
						name: 'Italian',
						value: 'ita',
					},
					{
						name: 'Japanese',
						value: 'jpn',
					},
					{
						name: 'Korean',
						value: 'kor',
					},
					{
						name: 'Malay',
						value: 'msa',
					},
					{
						name: 'Min Nan',
						value: 'nan',
					},
					{
						name: 'Norwegian',
						value: 'nor',
					},
					{
						name: 'Polish',
						value: 'pol',
					},
					{
						name: 'Portuguese',
						value: 'por',
					},
					{
						name: 'Punjabi',
						value: 'pan',
					},
					{
						name: 'Romanian',
						value: 'ron',
					},
					{
						name: 'Russian',
						value: 'rus',
					},
					{
						name: 'Slovak',
						value: 'slk',
					},
					{
						name: 'Spanish',
						value: 'spa',
					},
					{
						name: 'Swedish',
						value: 'swe',
					},
					{
						name: 'Tagalog',
						value: 'tgl',
					},
					{
						name: 'Tamil',
						value: 'tam',
					},
					{
						name: 'Thai',
						value: 'tha',
					},
					{
						name: 'Turkish',
						value: 'tur',
					},
					{
						name: 'Ukrainian',
						value: 'ukr',
					},
					{
						name: 'Vietnamese',
						value: 'vie',
					},
				],
				default: '',
				description: 'Language code following ISO 639-3 standard\n\nCase-insensitive (both "ENG" and "eng" are accepted). If not provided, language will be auto-detected based on text content. ssfm-v30 supports 37 languages, ssfm-v21 supports 27 languages.',
			},
			{
				displayName: 'Seed',
				name: 'seed',
				type: 'number',
				default: 42,
				description: 'Random seed for controlling speech generation variations\n\nUse any integer value. Using the same seed with identical parameters will produce consistent results, useful for reproducibility.',
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
				description: 'Audio output volume level (0 - 200)\n\n0 (silent) to 200 (maximum). Default: 100 (normal volume). Values above 100 may cause distortion.',
			},
		],
	},
];
