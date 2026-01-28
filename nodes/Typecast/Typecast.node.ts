import {
  NodeConnectionTypes,
  type IExecuteFunctions,
  type ILoadOptionsFunctions,
  type INodeExecutionData,
  type INodeListSearchResult,
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
    documentationUrl: 'https://typecast.ai/docs/bestpractice/n8n',
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

  methods = {
    listSearch: {
      async searchVoices(
        this: ILoadOptionsFunctions,
        filter?: string,
      ): Promise<INodeListSearchResult> {
        const results: INodeListSearchResult = {
          results: [],
        };

        try {
          // Get the selected model to filter voices
          const model = (this.getNodeParameter('model', 0) as string) || 'ssfm-v30';
          const qs: IDataObject = {};
          
          // Add model filter to query string
          if (model) {
            qs.model = model;
          }

          // Fetch voices from v2 API filtered by model
          const response = await typecastApiRequest.call(this, 'GET', '/voices', {}, qs, 'v2');

          // Process the response - it could be an array directly or wrapped in a result object
          const voices = Array.isArray(response) ? response : response.result || [];

          for (const voice of voices) {
            const voiceId = voice.voice_id;
            const voiceName = voice.voice_name || voiceId;
            const gender = voice.gender
              ? voice.gender.charAt(0).toUpperCase() + voice.gender.slice(1)
              : 'Unknown';
            const age = voice.age
              ? voice.age.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
              : 'Unknown';

            // Get supported emotions from models array (prefer ssfm-v30)
            let emotions: string[] = [];
            if (voice.models && Array.isArray(voice.models)) {
              // Try to find ssfm-v30 first, then fall back to first model
              const v30Model = voice.models.find((m: IDataObject) => m.version === 'ssfm-v30');
              const modelToUse = v30Model || voice.models[0];
              if (modelToUse && Array.isArray(modelToUse.emotions)) {
                emotions = modelToUse.emotions as string[];
              }
            }
            // Format emotions for display
            const emotionList = emotions.join(', ');
            const emotionDisplay = emotionList || 'N/A';

            // Get use cases
            const useCases = voice.use_cases || [];
            const useCaseList = Array.isArray(useCases) ? useCases.join(', ') : '';
            const useCaseDisplay = useCaseList || 'N/A';

            // Format: Name | Gender | Age | Emotions (all info in name for visibility)
            const displayName = `${voiceName} | ${gender} | ${age} | ${emotionDisplay}`;
            const description = `ID: ${voiceId} | Use Cases: ${useCaseDisplay}`;

            // Apply filter if provided
            if (filter) {
              const searchLower = filter.toLowerCase();
              const matchesName = voiceName.toLowerCase().includes(searchLower);
              const matchesId = voiceId.toLowerCase().includes(searchLower);
              const matchesGender = gender.toLowerCase().includes(searchLower);
              const matchesAge = age.toLowerCase().includes(searchLower);
              const matchesEmotion = emotions.some((e: string) =>
                e.toLowerCase().includes(searchLower),
              );
              const matchesUseCase = useCases.some((u: string) =>
                u.toLowerCase().includes(searchLower),
              );

              if (
                !matchesName &&
                !matchesId &&
                !matchesGender &&
                !matchesAge &&
                !matchesEmotion &&
                !matchesUseCase
              ) {
                continue;
              }
            }

            results.results.push({
              name: displayName,
              value: voiceId,
              url: `https://typecast.ai/developers/api/voices/${voiceId}`,
              description,
            });
          }

          // Sort by name
          results.results.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
          // If API call fails, show helpful message - user can still use "By ID" mode
          const errorMessage = (error as Error).message || 'Unknown error';
          let hint = 'Check your Typecast API credentials';

          if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
            hint = 'Invalid API key - update your credentials';
          } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
            hint = 'API key has no permission - check credentials';
          } else if (errorMessage.includes('network') || errorMessage.includes('ENOTFOUND')) {
            hint = 'Network error - check internet connection';
          }

          results.results = [
            {
              name: `⚠️ ${hint}`,
              value: '',
              description: 'Use "By ID" mode to enter Voice ID directly',
            },
            {
              name: '💡 Switch to "By ID" mode to enter Voice ID manually',
              value: '',
              description: 'Click the dropdown on the left and select "By ID"',
            },
          ];
        }

        return results;
      },
    },
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
            returnData.push(
              ...this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(response), {
                itemData: { item: i },
              }),
            );
          }
        }

        if (resource === 'speech') {
          // ----------------------------------
          //         speech:textToSpeech
          // ----------------------------------
          if (operation === 'textToSpeech') {
            const voiceId = this.getNodeParameter('voiceId', i, '', {
              extractValue: true,
            }) as string;
            const text = this.getNodeParameter('text', i) as string;
            const model = this.getNodeParameter('model', i) as string;
            const additionalOptions = this.getNodeParameter(
              'additionalOptions',
              i,
              {},
            ) as IDataObject;

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
