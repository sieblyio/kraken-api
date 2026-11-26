import {
  DefaultLogger,
  LogParams,
  WebsocketAPIClient,
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
  const client = new WebsocketAPIClient({ apiKey, apiSecret }, customLogger);

  try {
    // The client supplies the token and request ID, and resolves on the reply.
    // validate: true checks the order without placing it.
    const response = await client.submitUnifiedOrder({
      asset_class: 'spot',
      order_type: 'limit',
      side: 'buy',
      symbol: 'BTC/USD',
      order_qty: 0.001,
      limit_price: 10000,
      validate: true,
    });
    console.log('Order validation result:', response.result);

    // Uncomment these to manage your own live Spot orders:
    // await client.amendUnifiedOrder({
    //   asset_class: 'spot', order_id: 'YOUR_ORDER_ID', limit_price: 11000,
    // });
    // await client.cancelUnifiedOrder({
    //   asset_class: 'spot', order_id: ['YOUR_ORDER_ID'],
    // });
    // await client.batchSubmitUnifiedOrders({
    //   asset_class: 'spot', symbol: 'BTC/USD', validate: true,
    //   orders: [
    //     { order_type: 'limit', side: 'buy', order_qty: 0.001, limit_price: 10000 },
    //     { order_type: 'limit', side: 'buy', order_qty: 0.001, limit_price: 11000 },
    //   ],
    // });
    // await client.batchCancelUnifiedOrders({
    //   asset_class: 'spot', orders: ['YOUR_FIRST_ORDER_ID', 'YOUR_SECOND_ORDER_ID'],
    // });
    // await client.cancelAllUnifiedOrders({ asset_class: 'spot' });
    // await client.cancelAllUnifiedOrdersAfter({ asset_class: 'spot', timeout: 60 });
  } catch (error) {
    const failure = error as { error?: string; message?: string };
    console.error('Request failed:', failure.error ?? failure.message);
  } finally {
    client.getWSClient().closeAll();
  }
}

start().catch(console.error);
