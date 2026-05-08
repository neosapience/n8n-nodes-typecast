import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSubscription = {
  resource: ['subscription'],
};

export const subscriptionDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: showOnlyForSubscription,
    },
    options: [
      {
        name: 'Get My Subscription',
        value: 'getMy',
        description:
          'Return the authenticated user plan tier, credits, and concurrency limit',
        action: 'Get my subscription',
      },
    ],
    default: 'getMy',
  },
];
