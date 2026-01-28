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
        name: 'Get All Voices',
        value: 'getMany',
        description: 'Get all available voice models',
        action: 'Get all voices',
      },
    ],
    default: 'getMany',
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
            name: 'Male',
            value: 'male',
            description: 'Male voice',
          },
          {
            name: 'Female',
            value: 'female',
            description: 'Female voice',
          },
        ],
        default: '',
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
            name: 'Teenager',
            value: 'teenager',
            description: 'Teenage voice (13-19 years old)',
          },
          {
            name: 'Young Adult',
            value: 'young_adult',
            description: 'Young adult voice (20-35 years old)',
          },
          {
            name: 'Middle Age',
            value: 'middle_age',
            description: 'Middle-aged voice (36-60 years old)',
          },
          {
            name: 'Elder',
            value: 'elder',
            description: 'Elder voice (over 60 years old)',
          },
        ],
        default: '',
        description: 'Filter voices by age group',
      },
      {
        displayName: 'Use Cases',
        name: 'use_cases',
        type: 'options',
        options: [
          {
            name: 'Announcer',
            value: 'Announcer',
            description: 'Public announcements and presentations',
          },
          {
            name: 'Anime',
            value: 'Anime',
            description: 'Animation and character voices',
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
            name: 'E-learning',
            value: 'E-learning',
            description: 'Educational content and tutorials',
          },
          {
            name: 'Rapper',
            value: 'Rapper',
            description: 'Rap and music performance',
          },
          {
            name: 'Game',
            value: 'Game',
            description: 'Video game characters and narration',
          },
          {
            name: 'TikTok/Reels',
            value: 'Tiktok/Reels',
            description: 'Short-form social media content',
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
            name: 'Voicemail',
            value: 'Voicemail',
            description: 'IVR systems and voice assistants',
          },
          {
            name: 'Ads',
            value: 'Ads',
            description: 'Advertising and promotional content',
          },
        ],
        default: '',
        description: 'Filter voices by use case category',
      },
    ],
    description: 'Filter voices by model, gender, age, or use cases',
  },
];
