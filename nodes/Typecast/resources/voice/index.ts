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
        name: 'Clone Voice',
        value: 'clone',
        description: 'Create a quick-cloned custom voice from an audio sample',
        action: 'Clone a voice',
      },
      {
        name: 'Delete Cloned Voice',
        value: 'delete',
        description: 'Delete a quick-cloned custom voice by ID',
        action: 'Delete a cloned voice',
      },
      {
        name: 'Get All Voices',
        value: 'getMany',
        description: 'Get all available voice models',
        action: 'Get all voices',
      },
      {
        name: 'Get Voice',
        value: 'getOne',
        description: 'Get detailed information about a single voice by ID',
        action: 'Get a voice',
      },
      {
        name: 'Recommend Voices',
        value: 'recommend',
        description: 'Recommend voices from a text description',
        action: 'Recommend voices',
      },
    ],
    default: 'getMany',
  },
  // ----------------------------------
  //         voice:clone
  // ----------------------------------
  {
    displayName: 'Audio Binary Property',
    name: 'binaryProperty',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['voice'],
        operation: ['clone'],
      },
    },
    default: 'data',
    description:
      'Name of the incoming binary property that contains the audio sample, usually "data" from the previous file/download node. WAV and MP3 are supported; max 25 MB. The output voice_id can be used in Speech > Text to Speech > Voice ID > By ID.',
  },
  {
    displayName: 'Voice Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['voice'],
        operation: ['clone'],
      },
    },
    default: '',
    placeholder: 'e.g., My Cloned Voice',
    description: 'Name for the cloned voice. Must be 1-30 characters.',
  },
  {
    displayName: 'Model',
    name: 'cloneModel',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['voice'],
        operation: ['clone'],
      },
    },
    options: [
      {
        name: 'SSFM-V30 (Latest)',
        value: 'ssfm-v30',
        description: 'Latest model with improved prosody and multilingual support',
      },
      {
        name: 'SSFM-V21',
        value: 'ssfm-v21',
        description: 'Stable production model with reliable quality',
      },
    ],
    default: 'ssfm-v30',
    description:
      'Model to use for quick voice cloning. Use the same model in the following Text to Speech node for this cloned voice.',
  },
  // ----------------------------------
  //         voice:delete
  // ----------------------------------
  {
    displayName: 'Cloned Voice ID',
    name: 'clonedVoiceId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['voice'],
        operation: ['delete'],
      },
    },
    default: '',
    placeholder: 'e.g., uc_672c5f5ce59fac2a48faeaee',
    description: 'The quick-cloned voice ID to delete. It must start with "uc_".',
  },
  // ----------------------------------
  //         voice:getOne
  // ----------------------------------
  {
    displayName: 'Voice ID',
    name: 'voiceId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['voice'],
        operation: ['getOne'],
      },
    },
    default: '',
    placeholder: 'e.g., tc_672c5f5ce59fac2a48faeaee',
    description: 'The voice ID to look up via the V2 voices endpoint',
  },
  // ----------------------------------
  //         voice:recommend
  // ----------------------------------
  {
    displayName: 'Query',
    name: 'recommendQuery',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['voice'],
        operation: ['recommend'],
      },
    },
    default: '',
    placeholder: 'e.g., warm female voice for product tutorial',
    description:
      'Text description of the desired voice style, mood, language, use case, or content context',
  },
  {
    displayName: 'Count',
    name: 'recommendCount',
    type: 'number',
    required: true,
    displayOptions: {
      show: {
        resource: ['voice'],
        operation: ['recommend'],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 10,
    },
    default: 5,
    description:
      'Maximum number of recommended voices to return. The response contains voice_id, voice_name, and score only; use Get Voice or Get All Voices for detailed metadata.',
  },
  // ----------------------------------
  //         voice:getMany
  // ----------------------------------
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['voice'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        options: [
          {
            name: 'All',
            value: '',
            description: 'List all available voices for all models',
          },
          {
            name: 'SSFM-V30 (Latest)',
            value: 'ssfm-v30',
            description: 'Latest model with improved prosody and additional emotion presets',
          },
          {
            name: 'SSFM-V21',
            value: 'ssfm-v21',
            description: 'Stable production model with proven reliability',
          },
        ],
        default: '',
        description: 'Filter voices by TTS model version',
      },
      {
        displayName: 'Gender',
        name: 'gender',
        type: 'options',
        options: [
          {
            name: 'Female',
            value: 'female',
            description: 'Female voice',
          },
          {
            name: 'Male',
            value: 'male',
            description: 'Male voice',
          },
        ],
        default: 'female',
        description: 'Filter voices by gender',
      },
      {
        displayName: 'Age',
        name: 'age',
        type: 'options',
        options: [
          {
            name: 'Child',
            value: 'child',
            description: 'Child voice (under 12 years old)',
          },
          {
            name: 'Elder',
            value: 'elder',
            description: 'Elder voice (over 60 years old)',
          },
          {
            name: 'Middle Age',
            value: 'middle_age',
            description: 'Middle-aged voice (36-60 years old)',
          },
          {
            name: 'Teenager',
            value: 'teenager',
            description: 'Teenage voice (13-19 years old)',
          },
          {
            name: 'Young Adult',
            value: 'young_adult',
            description: 'Young adult voice (20-35 years old)',
          },
        ],
        default: 'child',
        description: 'Filter voices by age group',
      },
      {
        displayName: 'Use Cases',
        name: 'use_cases',
        type: 'options',
        options: [
          {
            name: 'Ads',
            value: 'Ads',
            description: 'Advertising and promotional content',
          },
          {
            name: 'Anime',
            value: 'Anime',
            description: 'Animation and character voices',
          },
          {
            name: 'Announcer',
            value: 'Announcer',
            description: 'Public announcements and presentations',
          },
          {
            name: 'Audiobook',
            value: 'Audiobook',
            description: 'Long-form narration and storytelling',
          },
          {
            name: 'Conversational',
            value: 'Conversational',
            description: 'Chatbots and conversational AI',
          },
          {
            name: 'Documentary',
            value: 'Documentary',
            description: 'Documentary narration and commentary',
          },
          {
            name: 'E-Learning',
            value: 'E-learning',
            description: 'Educational content and tutorials',
          },
          {
            name: 'Game',
            value: 'Game',
            description: 'Video game characters and narration',
          },
          {
            name: 'News',
            value: 'News',
            description: 'News broadcasting',
          },
          {
            name: 'Podcast',
            value: 'Podcast',
            description: 'Broadcasting and podcast production',
          },
          {
            name: 'Rapper',
            value: 'Rapper',
            description: 'Rap and music performance',
          },
          {
            name: 'TikTok/Reels',
            value: 'Tiktok/Reels',
            description: 'Short-form social media content',
          },
          {
            name: 'Voicemail',
            value: 'Voicemail',
            description: 'IVR systems and voice assistants',
          },
        ],
        default: 'Announcer',
        description: 'Filter voices by use case category',
      },
    ],
    description: 'Filter voices by model, gender, age, or use cases',
  },
];
