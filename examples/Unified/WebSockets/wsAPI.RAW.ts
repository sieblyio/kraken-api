import {
  DefaultLogger,
  LogParams,
  WebsocketClient,
  WS_KEY_MAP,
} from '../../../src/index.js';
// Installed package: import { ... } from '@siebly/kraken-api';

const customLogger: DefaultLogger = {
  trace: (...params: LogParams): void => {
    // console.log('trace', ...params);
  },
  info: (...params: LogParams): void => console.log('info', ...params),
  error: (...params: LogParams): void => console.error('error', ...params),
};

async function start() {
  // Unified WS API uses Spot API credentials for both asset classes.
  const apiKey = process.env.API_SPOT_KEY;
  const apiSecret = process.env.API_SPOT_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error(
      'Set API_SPOT_KEY and API_SPOT_SECRET before running this example.',
    );
  }
  const client = new WebsocketClient({ apiKey, apiSecret }, customLogger);

  try {
    // The client supplies the token and request ID, and resolves on the reply.
    // validate: true checks the order without placing it.
    const response = await client.sendWSAPIRequest(
      WS_KEY_MAP.unifiedPrivateV2,
      'add_order',
      {
        asset_class: 'spot',
        order_type: 'limit',
        side: 'buy',
        symbol: 'BTC/USD',
        order_qty: 0.001,
        limit_price: 10000,
        validate: true,
      },
    );
    console.log('Order validation result:', response.result);

    // Other commands use the same call and require asset_class:
    // await client.sendWSAPIRequest(WS_KEY_MAP.unifiedPrivateV2, 'amend_order', {
    //   asset_class: 'spot', order_id: 'YOUR_ORDER_ID', limit_price: 11000,
    // });
    // await client.sendWSAPIRequest(WS_KEY_MAP.unifiedPrivateV2, 'cancel_order', {
    //   asset_class: 'spot', order_id: ['YOUR_ORDER_ID'],
    // });
  } catch (error) {
    const failure = error as { error?: string; message?: string };
    console.error('Request failed:', failure.error ?? failure.message);
  } finally {
    client.closeAll();
  }
}

start().catch(console.error);
