import {
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IDataObject,
} from 'n8n-workflow';

import { typecastApiRequest, typecastApiRequestBinary } from './shared/transport';

import { voiceDescription } from './resources/voice';
import { speechDescription } from './resources/speech';

export class Typecast implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Typecast',
		name: 'typecast',
		icon: 'file:../../icons/typecast.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Typecast TTS API',
		usableAsTool: true,
		defaults: {
			name: 'Typecast',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'typecastApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Speech',
						value: 'speech',
					},
					{
						name: 'Voice',
						value: 'voice',
					},
				],
				default: 'speech',
			},
			...voiceDescription,
			...speechDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'voice') {
					// ----------------------------------
					//         voice:getMany
					// ----------------------------------
					if (operation === 'getMany') {
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const qs: IDataObject = {};
						
						// Add filters to query string
						if (filters.model) {
							qs.model = filters.model;
						}
						if (filters.gender) {
							qs.gender = filters.gender;
						}
						if (filters.age) {
							qs.age = filters.age;
						}
						if (filters.use_cases) {
							qs.use_cases = filters.use_cases;
						}
						
						const response = await typecastApiRequest.call(this, 'GET', '/voices', {}, qs, 'v2');
						returnData.push(...this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(response),
							{ itemData: { item: i } },
						));
					}

					// ----------------------------------
					//         voice:get
					// ----------------------------------
					if (operation === 'get') {
						const voiceId = this.getNodeParameter('voiceId', i) as string;
						const response = await typecastApiRequest.call(
							this,
							'GET',
							`/voices/${voiceId}`,
							{},
							{},
							'v2',
						);
						returnData.push(...this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(response),
							{ itemData: { item: i } },
						));
					}
				}

				if (resource === 'speech') {
					// ----------------------------------
					//         speech:textToSpeech
					// ----------------------------------
					if (operation === 'textToSpeech') {
						const voiceId = this.getNodeParameter('voiceId', i) as string;
						const text = this.getNodeParameter('text', i) as string;
						const model = this.getNodeParameter('model', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

						const body: IDataObject = {
							voice_id: voiceId,
							text,
							model,
						};

						// Add optional language parameter
						if (additionalOptions.language) {
							body.language = additionalOptions.language;
						}

						// Build prompt object based on model and emotion type
						const prompt: IDataObject = {};

						if (model === 'ssfm-v30') {
							// Get emotion type for ssfm-v30
							const emotionType = this.getNodeParameter('emotionType', i, 'preset') as string;

							if (emotionType === 'smart') {
								// Smart Emotion: AI automatically infers emotion from context
								prompt.emotion_type = 'smart';

								const previousText = this.getNodeParameter('previousText', i, '') as string;
								const nextText = this.getNodeParameter('nextText', i, '') as string;

								if (previousText) {
									prompt.previous_text = previousText;
								}
								if (nextText) {
									prompt.next_text = nextText;
								}
							} else {
								// Preset Emotion: Manual selection
								prompt.emotion_type = 'preset';

								const emotionPreset = this.getNodeParameter('emotionPreset', i, 'normal') as string;
								const emotionIntensity = this.getNodeParameter('emotionIntensity', i, 1) as number;

								prompt.emotion_preset = emotionPreset;
								prompt.emotion_intensity = emotionIntensity;
							}
						} else {
							// ssfm-v21: Use legacy prompt format (no emotion_type field)
							// For v21, emotion settings are in additionalOptions
							if (additionalOptions.emotionPresetV21) {
								prompt.emotion_preset = additionalOptions.emotionPresetV21;
							}
							if (additionalOptions.emotionIntensityV21 !== undefined) {
								prompt.emotion_intensity = additionalOptions.emotionIntensityV21;
							}
						}

						if (Object.keys(prompt).length > 0) {
							body.prompt = prompt;
						}

						// Add output settings
						const output: IDataObject = {};
						if (additionalOptions.volume !== undefined) {
							output.volume = additionalOptions.volume;
						}
						if (additionalOptions.audioPitch !== undefined) {
							output.audio_pitch = additionalOptions.audioPitch;
						}
						if (additionalOptions.audioTempo !== undefined) {
							output.audio_tempo = additionalOptions.audioTempo;
						}
						if (additionalOptions.audioFormat) {
							output.audio_format = additionalOptions.audioFormat;
						}
						if (Object.keys(output).length > 0) {
							body.output = output;
						}

						// Add seed if provided
						if (additionalOptions.seed !== undefined) {
							body.seed = additionalOptions.seed;
						}

						const binaryProperty = additionalOptions.binaryProperty || 'data';
						const audioFormat = additionalOptions.audioFormat || 'wav';
						const mimeType = audioFormat === 'mp3' ? 'audio/mpeg' : 'audio/wav';

						const response = await typecastApiRequestBinary.call(
							this,
							'POST',
							'/text-to-speech',
							body,
						);

						const newItem: INodeExecutionData = {
							json: {
								voice_id: voiceId,
								text,
								model,
							},
							binary: {
								[binaryProperty as string]: await this.helpers.prepareBinaryData(
									response,
									`audio.${audioFormat}`,
									mimeType,
								),
							},
						};

						returnData.push(newItem);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
