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
						const model = this.getNodeParameter('model', i) as string;
						const qs: IDataObject = {};
						if (model) {
							qs.model = model;
						}
						const response = await typecastApiRequest.call(this, 'GET', '/voices', {}, qs);
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
						const model = this.getNodeParameter('model', i) as string;
						const qs: IDataObject = {};
						if (model) {
							qs.model = model;
						}
						const response = await typecastApiRequest.call(
							this,
							'GET',
							`/voices/${voiceId}`,
							{},
							qs,
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

						// Add emotion settings
						const prompt: IDataObject = {};
						if (additionalOptions.emotionPreset) {
							prompt.emotion_preset = additionalOptions.emotionPreset;
						}
						if (additionalOptions.emotionIntensity !== undefined) {
							prompt.emotion_intensity = additionalOptions.emotionIntensity;
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
