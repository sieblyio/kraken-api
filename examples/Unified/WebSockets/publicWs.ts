import {
  WebsocketClient,
  WS_KEY_MAP,
  WSUnifiedPublicMessageEvent,
  WSUnifiedPublicTopicRequest,
} from '../../../src/index.js';
// Installed package: import { ... } from '@siebly/kraken-api';

const client = new WebsocketClient();
const wsKey = WS_KEY_MAP.unifiedPublicV2;

client.on('open', (event) => console.log('Connected:', event.wsKey));
client.on('reconnecting', (event) => console.log('Reconnecting:', event.wsKey));
client.on('reconnected', (event) => console.log('Resubscribing:', event.wsKey));
client.on('response', (event) => console.log('Response:', event));
client.on('exception', (event) => console.error('Exception:', event));

// This client only opens unifiedPublicV2. The exported union narrows by channel.
client.on('message', (event: WSUnifiedPublicMessageEvent) => {
  if (event.channel === 'instrument') {
    console.log('Available pairs:', event.data.pairs);
  } else if (event.channel === 'ticker') {
    console.log('Tickers:', event.data);
  } else {
    console.log('Data:', event);
  }
});

// Discover symbols for each asset class through the instrument channel.
// Use Kraken's returned symbols unchanged, e.g. BTC/USD for Spot.
// For derivatives, use asset_class: 'derivatives' and symbols such as PF_XBTUSD.
// Availability depends on Kraken's unified endpoint rollout.
const subscriptions: WSUnifiedPublicTopicRequest[] = [
  { topic: 'instrument', payload: { asset_class: 'spot' } },
  {
    topic: 'ticker',
    payload: { asset_class: 'spot', symbol: ['BTC/USD'] },
  },
  {
    topic: 'book',
    payload: { asset_class: 'spot', symbol: ['BTC/USD'], depth: 10 },
  },
  {
    topic: 'ohlc',
    payload: {
      asset_class: 'spot',
      symbol: ['BTC/USD'],
      interval: 1,
    },
  },
  // Optional derivatives-only trade channel:
  // {
  //   topic: 'trade',
  //   payload: {
  //     asset_class: 'derivatives',
  //     symbol: ['PF_XBTUSD'],
  //     snapshot: true,
  //   },
  // },
];
client.subscribe(subscriptions, wsKey);

// Reuse the same requests, including optional parameters, to remove cached subscriptions:
// client.unsubscribe(subscriptions, wsKey);

process.once('SIGINT', () => client.closeAll());
