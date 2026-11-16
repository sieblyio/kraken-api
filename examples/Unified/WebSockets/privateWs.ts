import {
  DefaultLogger,
  LogParams,
  WebsocketClient,
  WS_KEY_MAP,
  WSUnifiedPrivateMessageEvent,
  WSUnifiedPrivateTopicRequest,
  WSUnifiedPublicMessageEvent,
  WSUnifiedPublicTopicRequest,
} from '../../../src/index.js';
// Installed package: import { ... } from '@siebly/kraken-api';

const customLogger: DefaultLogger = {
  trace: (...params: LogParams): void => {
    // console.log('trace', ...params);
  },
  info: (...params: LogParams): void => {
    console.log('info', ...params);
  },
  error: (...params: LogParams): void => {
    console.error('error', ...params);
  },
};

async function start() {
  // Unified WebSockets use the Spot REST GetWebSocketsToken endpoint, including
  // for derivatives streams. Use Spot API credentials with WebSocket access.
  const account = {
    key: process.env.API_SPOT_KEY,
    secret: process.env.API_SPOT_SECRET,
  };
  if (!account.key || !account.secret) {
    throw new Error(
      'Set API_SPOT_KEY and API_SPOT_SECRET before running this example.',
    );
  }

  // The client manages connections, token fetching/caching, heartbeats, and
  // resubscription after reconnects, just like the other private WS examples.
  const client = new WebsocketClient(
    { apiKey: account.key, apiSecret: account.secret },
    customLogger,
  );

  client.on('open', (data) => console.log('connected:', data.wsKey));
  client.on('reconnecting', (data) => console.log('reconnecting:', data.wsKey));
  client.on('reconnected', (data) => console.log('reconnected:', data.wsKey));
  client.on('close', (data) => console.log('close:', data.wsKey));
  client.on('response', (data) =>
    console.info('server reply:', JSON.stringify(data)),
  );
  client.on('exception', (data) => console.error('exception:', data));
  client.on(
    'message',
    (data: WSUnifiedPrivateMessageEvent | WSUnifiedPublicMessageEvent) => {
      console.info('data received:', JSON.stringify(data));
    },
  );

  // Tokens are injected automatically into subscribe AND unsubscribe requests.
  // Subscribe acknowledgements confirm access; there is no separate login event.
  const subscriptions: WSUnifiedPrivateTopicRequest[] = [
    {
      topic: 'executions',
      payload: {
        asset_class: 'spot', // Or 'derivatives', subject to account/API availability.
        snap_orders: true,
        snap_trades: true,
        // order_status: true,
        // ratecounter: true,
      },
    },
    { topic: 'balances', payload: { snapshot: true } },
    { topic: 'ledgers' },
    { topic: 'preferences' },
    // Optional derivatives-only channels:
    // {
    //   topic: 'positions',
    //   payload: {
    //     asset_class: 'derivatives',
    //     snapshot: true,
    //     // For margin/risk figures, replace snapshot with with_margin: true.
    //     // Enriched messages replace all positions and have no type field.
    //   },
    // },
    // {
    //   topic: 'margin',
    //   payload: { asset_class: 'derivatives' },
    // },
  ];
  client.subscribe(subscriptions, WS_KEY_MAP.unifiedPrivateV2);

  // Balances, ledgers, and preferences also accept bare topic names when no
  // options are needed, e.g. client.subscribe('balances', 'unifiedPrivateV2').
  // They are account-wide and do not take asset_class. Margin takes no snapshot.
  // Ledgers has no snapshot; use REST to recover entries after a sequence gap.
  // Positions and margin each allow only one subscription per connection.

  // Authenticated Level 3 uses the unified PUBLIC endpoint, not a separate L3 URL.
  // Discover symbols through instrument and pass the returned symbols unchanged.
  const level3: WSUnifiedPublicTopicRequest = {
    topic: 'level3',
    payload: {
      asset_class: 'spot',
      symbol: ['BTC/USD'],
      depth: 10, // Supported depths: 10, 100, 1000.
      snapshot: true,
    },
  };
  client.subscribe(level3, WS_KEY_MAP.unifiedPublicV2);

  // Reuse the same requests, including optional parameters, to remove them
  // from the reconnect cache:
  // client.unsubscribe(subscriptions, WS_KEY_MAP.unifiedPrivateV2);
  // client.unsubscribe(level3, WS_KEY_MAP.unifiedPublicV2);

  process.once('SIGINT', () => client.closeAll());
}

start().catch(console.error);
