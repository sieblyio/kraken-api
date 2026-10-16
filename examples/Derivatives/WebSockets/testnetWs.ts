// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  DefaultLogger,
  LogParams,
  WebsocketClient,
  WS_KEY_MAP,
  WSTopicRequest,
} from '../../../src/index.js';
import { WSDerivativesTopic } from '../../../src/types/websockets/ws-subscriptions.js';
// normally you should install this module via npm: `npm install @siebly/kraken-api` and import the module:
// import { LogParams, WebsocketClient, WsTopicRequest } from '@siebly/kraken-api';

const customLogger: DefaultLogger = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trace: (...params: LogParams): void => {
    // console.log(new Date(), '--> trace', ...params);
  },
  info: (...params: LogParams): void => {
    console.log(new Date(), '--> info', ...params);
  },
  error: (...params: LogParams): void => {
    console.error(new Date(), '--> error', ...params);
  },
};

async function start() {
  // https://demo-futures.kraken.com to create demo account
  // Retired 14 July 2026. Do not set testnet: it throws. See https://support.kraken.com/articles/360024809011-api-testing-environment-derivatives
  const account = {
    key: '1mVo6NgddD3os5nnGTPcEcHIncSplLED3Grz1Fnb6l/Vy0iu2TGftQ0Z',
    secret:
      'sCcoKlwBYojnXKTCc+sdkbvwwAieaSfU0VvDlfh2xDV3eR1ZlfpAf7p6Xt/pGL6z+m0KuHqGwQmJnnrlG4ZgNuWd',
  };

  /**
   * UPDATE: Kraken retired the Futures demo on 14 July 2026. Do not set `testnet: true`. It throws. There is no replacement demo host.
   *
   * Kraken Derivatives has a demo environment (testnet) that you can connect to via WebSocket. All you need to do is set the `testnet` option to `true` when creating the WebsocketClient instance, as shown below.
   * Everything else behaves exactly the same way.
   *
   * Note: as of November 2025, only the DerivativesClient supports testnet connections. Kraken refer to this as the "Demo" environment, but it is effectively a testnet.
   * This is a place to test your API integration. It is not a good place to test strategy performance, as the liquidity and orderbook dynamics are very different to the live environment.
   *
   * Refer to the following for more information:
   * https://github.com/tiagosiebler/awesome-crypto-examples/wiki/CEX-Testnets
   */
  const client = new WebsocketClient(
    {
      apiKey: account.key,
      apiSecret: account.secret,
    },
    customLogger,
  );

  client.on('open', (data) => {
    console.log(new Date(), 'connected ', data?.wsKey);
  });

  // Data received
  client.on('message', (data) => {
    console.info(new Date(), 'data received: ', JSON.stringify(data));
  });

  // Something happened, attempting to reconnect
  client.on('reconnecting', (data) => {
    console.log(new Date(), 'reconnect: ', data?.wsKey);
  });

  // Reconnect successful
  client.on('reconnected', (data) => {
    console.log(new Date(), 'reconnected: ', data?.wsKey);
  });

  // Connection closed. If unexpected, expect reconnect -> reconnected.
  client.on('close', (data) => {
    console.error(new Date(), 'close: ', data);
  });

  // Reply to a request, e.g. "subscribe"/"unsubscribe"/"authenticate"
  client.on('response', (data) => {
    console.info(new Date(), 'server reply: ', JSON.stringify(data), '\n');
  });

  client.on('exception', (data) => {
    console.error(new Date(), 'exception: ', data);
  });

  client.on('authenticated', (data) => {
    console.error(new Date(), 'authenticated: ', data);
  });

  /**
   * The below examples demonstrate how you can subscribe to private topics.
   *
   * Note: while the documentation specifies "api_key", "original_challenge" and "signed_challenge" as required parameters, but don't worry about that. The SDK will automatically:
   * - Fetch the challenge using your API key,
   * - Cache the challenge
   * - Include the key, original challenge and signed challenge parameters for you when subscribing to private topics on the derivativesPrivateV1 WebSocket connection.
   *
   * You do NOT need to manually fetch or provide the "original_challenge" and "signed_challenge" tokens when subscribing to private topics.
   *
   * Do note that all of these include the "derivativesPrivateV1" WsKey reference. This tells the WebsocketClient to use the private "wss://futures.kraken.com/ws/v1" endpoint for these private subscription requests. It will also automatically authenticate the connection when it is established.
   */

  try {
    /**
     * All of the following parameters require API keys for Derivatives APIs.
     *
     * Note: your "WsTopicRequest" does not need to include "api_key", "original_challenge" and "signed_challenge". See above for details, or below for examples.
     */

    // Open orders: https://docs.kraken.com/api/docs/futures-api/websocket/open_orders
    const openOrdersTopicRequest: WSTopicRequest<WSDerivativesTopic> = {
      topic: 'open_orders',
    };
    client.subscribe(openOrdersTopicRequest, WS_KEY_MAP.derivativesPrivateV1);

    // Note: if there are no parameters needed, you can also just request the topic by name
    // This is the same as openOrdersTopicRequest, since openOrdersTopicRequest contains no parameters
    // client.subscribe('open_orders', WS_KEY_MAP.derivativesPrivateV1);

    // Open orders (verbose): https://docs.kraken.com/api/docs/futures-api/websocket/open_orders
    client.subscribe('open_orders_verbose', WS_KEY_MAP.derivativesPrivateV1);

    // Fills: https://docs.kraken.com/api/docs/futures-api/websocket/fills
    const accountFillsTopicRequest: WSTopicRequest<WSDerivativesTopic> = {
      topic: 'fills',
      // Optionally, the product_ids field can be used to subscribe only to specific product.
      // payload: {
      //   product_ids: ['PF_XBTUSD'],
      // },
    };
    client.subscribe(accountFillsTopicRequest, WS_KEY_MAP.derivativesPrivateV1);

    // Balances: https://docs.kraken.com/api/docs/futures-api/websocket/balances
    client.subscribe('balances', WS_KEY_MAP.derivativesPrivateV1);

    // Open Position: https://docs.kraken.com/api/docs/futures-api/websocket/open_position
    client.subscribe('open_positions', WS_KEY_MAP.derivativesPrivateV1);

    // Account Log: https://docs.kraken.com/api/docs/futures-api/websocket/account_log
    client.subscribe('account_log', WS_KEY_MAP.derivativesPrivateV1);

    // Notification: https://docs.kraken.com/api/docs/futures-api/websocket/notifications
    client.subscribe('notifications_auth', WS_KEY_MAP.derivativesPrivateV1);
  } catch (e) {
    console.error('Req error: ', e);
  }
}

start();
