# Node.js & JavaScript SDK for Kraken REST APIs & WebSockets

[![Build & Test](https://github.com/sieblyio/kraken-api/actions/workflows/e2etest.yml/badge.svg?branch=main)](https://github.com/sieblyio/kraken-api/actions/workflows/e2etest.yml)
[![npm version](https://img.shields.io/npm/v/@siebly/kraken-api)][1]
[![npm size](https://img.shields.io/bundlephobia/min/@siebly/kraken-api/latest)][1]
[![npm downloads](https://img.shields.io/npm/dt/@siebly/kraken-api)][1]
[![last commit](https://img.shields.io/github/last-commit/sieblyio/kraken-api)][1]
[![Telegram](https://img.shields.io/badge/chat-on%20telegram-blue.svg)](https://t.me/nodetraders)
[![Tutorial](https://img.shields.io/badge/Tutorial-siebly.io-blue)](https://siebly.io/sdk/kraken/javascript/tutorial)

<p align="center">
  <a href="https://www.npmjs.com/package/@siebly/kraken-api">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/sieblyio/kraken-api/blob/main/docs/images/logoDarkMode2.svg?raw=true#gh-dark-mode-only">
      <img alt="SDK Logo" src="https://github.com/sieblyio/kraken-api/blob/main/docs/images/logoBrightMode2.svg?raw=true#gh-light-mode-only">
    </picture>
  </a>
</p>

[1]: https://www.npmjs.com/package/@siebly/kraken-api

Complete & robust JavaScript & Node.js SDK for the Kraken REST APIs and WebSockets.

Take a look at our dedicated [Kraken API quickstart guides for major frameworks and JavaScript runtimes](#frameworks--quickstart-guides).

- Professional, robust & performant Kraken SDK with extensive production use in live trading environments.
- Complete integration with all Kraken REST APIs and WebSockets.
  - Dedicated REST clients for Spot, Derivatives (Futures), Institutional, and Partner operations
  - Unified WebSocket client for all markets
- Complete TypeScript support (with type declarations for most API requests & responses).
  - Strongly typed requests and responses.
  - Automated end-to-end tests ensuring reliability.
- Actively maintained with a modern, promise-driven interface.
- Robust WebSocket integration with configurable connection heartbeats & automatic reconnect then resubscribe workflows.
  - Event driven messaging.
  - Smart WebSocket persistence with automatic reconnection handling.
  - Emit `reconnected` event when dropped connection is restored.
  - Support for both public and private WebSocket streams.
- Browser-friendly HMAC signature mechanism.
- Automatically supports both ESM and CJS projects.
- Heavy automated end-to-end testing with real API calls.
- Proxy support via axios integration.
- Active community support & collaboration in telegram: [Node.js Algo Traders](https://t.me/nodetraders).
- QuickStart Guide: [Kraken JavaScript QuickStart Guide](https://siebly.io/sdk/kraken/javascript)
- Kraken JavaScript Tutorial: [Kraken JavaScript REST API and WebSocket Tutorial](https://siebly.io/sdk/kraken/javascript/tutorial)

## Table of Contents

- [Installation](#installation)
  - [Frameworks & Quickstart Guides](#frameworks--quickstart-guides)
- [Examples](#examples)
- [Issues & Discussion](#issues--discussion)
- [Related Projects](#related-projects)
- [Documentation](#documentation)
- [Structure](#structure)
- [Usage](#usage)
  - [REST API Clients](#rest-api)
    - [Spot Trading](#spot-trading)
    - [Derivatives (Futures) Trading](#derivatives-futures-trading)
  - [WebSockets](#websockets)
    - [Why not raw ws?](#why-not-raw-ws)
    - [Spot orderbook over WebSocket](#spot-orderbook-over-websocket)
    - [Public WebSocket Streams](#public-websocket-streams)
    - [Unified Public WebSocket Streams](#unified-public-websocket-streams)
    - [Unified Private WebSocket Streams](#unified-private-websocket-streams)
    - [Private WebSocket Streams](#private-websocket-streams)
    - [WebSocket API (WebsocketAPIClient)](#websocket-api-websocketapiclient)
    - [Unified WebSocket API](#unified-websocket-api)
- [Customise Logging](#customise-logging)
- [Browser/Frontend Usage](#browserfrontend-usage)
  - [Vite and React](#vite-and-react)
  - [Next.js and server-side requests](#nextjs-and-server-side-requests)
  - [React Native and Expo](#react-native-and-expo)
  - [Standalone Webpack bundle](#standalone-webpack-bundle)
- [LLMs & AI](#use-with-llms--ai)
- [Used By](#used-by)
- [Contributions & Thanks](#contributions--thanks)

## Installation

Install the scoped package **`@siebly/kraken-api`**:

```bash
npm install --save @siebly/kraken-api
```

The unscoped npm package `kraken-api` is a different package. It is not this SDK.

### Frameworks & Quickstart Guides

Our complete Kraken SDK supports all the major JavaScript runtimes. For maximum convenience, we've included guides to quickly get you started with the most popular runtimes. If you're not sure how to use this SDK with a runtime or framework not listed here, feel free to [open an issue on GitHub](https://github.com/sieblyio/kraken-api/issues).

| Runtime                    | Details                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend (trading bots)     | Using [Node.js and JavaScript](https://sieblyio.github.io/docs/kraken/environments/node.html), [Node.js and TypeScript](https://sieblyio.github.io/docs/kraken/environments/typescript.html), [Bun](https://sieblyio.github.io/docs/kraken/environments/bun.html), or [Deno](https://sieblyio.github.io/docs/kraken/environments/deno.html). This is the recommendation for algorithmic trading systems. |
| Frontend / Web Development | Using [React with Vite](https://sieblyio.github.io/docs/kraken/environments/react.html) or [Vite with plain JavaScript](https://sieblyio.github.io/docs/kraken/environments/vite.html). Display REST and WebSocket prices in the browser.                                                                                                                                                                |
| Next.js App Router         | Using the [Next.js App Router](https://sieblyio.github.io/docs/kraken/environments/next.html) to serve the price from a Route Handler running on Node.js.                                                                                                                                                                                                                                                |
| Mobile (iOS & Android)     | Using [React Native with Expo for iOS and Android](https://sieblyio.github.io/docs/kraken/environments/expo.html). The example guides you to display the current BTC/USD price from Kraken and stream updates over WebSockets.                                                                                                                                                                           |
| Cloudflare Workers         | [Cloudflare Workers](https://sieblyio.github.io/docs/kraken/environments/cloudflare-workers.html). Return a public price from a Worker, with a separate example for authenticated orders.                                                                                                                                                                                                                |

Refer to [runtime compatibility](https://sieblyio.github.io/docs/kraken/compatibility.html) for a complete list of runtimes that we've actively tested, including setup guides.

## Examples

Refer to the [examples](./examples) folder for implementation demos, including:

- **Spot Trading Examples**: market data, account management, order placement
- **Derivatives Trading Examples**: futures market data, account management, order placement
- **WebSocket Examples**: public market data streams, private account data

## Issues & Discussion

- Issues? Check the [issues tab](https://github.com/sieblyio/kraken-api/issues).
- Discuss & collaborate with other node devs? Join our [Node.js Algo Traders](https://t.me/nodetraders) engineering community on telegram.
- Follow our announcement channel for real-time updates on [X/Twitter](https://x.com/sieblyio)

<!-- template_related_projects -->

## Related Projects

Check out our JavaScript/TypeScript/Node.js SDKs & Projects:

- Visit our website: [https://Siebly.io](https://siebly.io/)
- Try our REST API & WebSocket SDKs published on npmjs:
  - [Bybit JavaScript SDK: bybit-api](https://www.npmjs.com/package/bybit-api)
  - [Kraken JavaScript SDK: @siebly/kraken-api](https://www.npmjs.com/package/@siebly/kraken-api)
  - [OKX JavaScript SDK: okx-api](https://www.npmjs.com/package/okx-api)
  - [Binance JavaScript SDK: binance](https://www.npmjs.com/package/binance)
  - [Gate (gate.com) JavaScript SDK: gateio-api](https://www.npmjs.com/package/gateio-api)
  - [Bitget JavaScript SDK: bitget-api](https://www.npmjs.com/package/bitget-api)
  - [Kucoin JavaScript SDK: kucoin-api](https://www.npmjs.com/package/kucoin-api)
  - [Coinbase JavaScript SDK: coinbase-api](https://www.npmjs.com/package/coinbase-api)
  - [HTX JavaScript SDK: @siebly/htx-api](https://www.npmjs.com/package/@siebly/htx-api)
- Try my misc utilities:
  - [OrderBooks Node.js: orderbooks](https://www.npmjs.com/package/orderbooks)
  - [Crypto Exchange Account State Cache: accountstate](https://www.npmjs.com/package/accountstate)
- Check out my examples:
  - [awesome-crypto-examples Node.js](https://github.com/sieblyio/awesome-crypto-examples)
  <!-- template_related_projects_end -->

## Documentation

The [Kraken SDK documentation](https://sieblyio.github.io/docs/kraken/) covers installation, client setup, public market data, authenticated trading, and WebSocket subscriptions.

Most methods accept JS objects. These can be populated using parameters specified by Kraken's API documentation, or check the type definition in each class within this repository.

### API Documentation Links

- [Kraken exchange API reference](https://docs.kraken.com/api/)
  - [Spot Trading API](https://docs.kraken.com/api/docs/rest-api/get-server-time)
  - [Futures Trading API](https://docs.futures.kraken.com/)

## Structure

This project uses typescript. Resources are stored in 2 key structures:

- [src](./src) - the whole connector written in typescript
- [examples](./examples) - some implementation examples & demonstrations. Contributions are welcome!

---

# Usage

Create API credentials on Kraken's website:

- [Kraken API Key Management](https://www.kraken.com/u/security/api)
- [Kraken Futures API Key Management](https://futures.kraken.com/settings/api)

## REST API

The SDK provides dedicated REST clients for different trading products:

- **SpotClient** - for spot trading, staking, and account operations
- **DerivativesClient** - for futures trading operations
- **InstitutionalClient** - for institutional trading and custody
- **PartnerClient** - for partner and affiliate operations

### Spot Trading

To use Kraken's Spot APIs, import (or require) the `SpotClient`:

```javascript
import { SpotClient } from '@siebly/kraken-api';
// or if you prefer require:
// const { SpotClient } = require('@siebly/kraken-api');

// For public endpoints, API credentials are optional
const publicClient = new SpotClient();

// For private endpoints, provide API credentials
const client = new SpotClient({
  apiKey: 'your-api-key',
  apiSecret: 'your-base64-encoded-private-key',
});

// Public API Examples

// Get ticker information
const ticker = await publicClient.getTicker({
  pair: 'XBTUSD',
});
console.log('Ticker: ', ticker);

// Get order book
const orderBook = await publicClient.getOrderBook({
  pair: 'XBTUSD',
  count: 10,
});
console.log('Order Book: ', orderBook);

// Private API Examples (requires authentication)

// Submit a market order
client
  .submitOrder({
    ordertype: 'market',
    type: 'buy',
    volume: '0.01',
    pair: 'XBTUSD',
    cl_ord_id: client.generateNewOrderID(),
  })
  .then((result) => {
    console.log('Market Order Result: ', result);
  })
  .catch((err) => {
    console.error('Error: ', err);
  });

// Submit a limit order
client
  .submitOrder({
    ordertype: 'limit',
    type: 'buy',
    volume: '0.0001',
    pair: 'XBTUSD',
    price: '10000',
    cl_ord_id: client.generateNewOrderID(),
  })
  .then((result) => {
    console.log('Limit Order Result: ', result);
  })
  .catch((err) => {
    console.error('Error: ', err);
  });

// Submit batch of orders (minimum 2, maximum 15)
client
  .submitBatchOrders({
    pair: 'XBTUSD',
    orders: [
      {
        ordertype: 'limit',
        type: 'buy',
        volume: '0.0001',
        price: '10000.00',
        timeinforce: 'GTC',
        cl_ord_id: client.generateNewOrderID(),
      },
      {
        ordertype: 'limit',
        type: 'buy',
        volume: '0.0001',
        price: '11111.00',
        timeinforce: 'GTC',
        cl_ord_id: client.generateNewOrderID(),
      },
      {
        ordertype: 'limit',
        type: 'sell',
        volume: '0.0001',
        price: '13000.00',
        timeinforce: 'GTC',
        cl_ord_id: client.generateNewOrderID(),
      },
    ],
  })
  .then((result) => {
    console.log('Batch Order Result: ', JSON.stringify(result, null, 2));
  })
  .catch((err) => {
    console.error('Error: ', err);
  });

// Get account balances
client
  .getAccountBalance()
  .then((balance) => {
    console.log('Account Balance: ', balance);
  })
  .catch((err) => {
    console.error('Error: ', err);
  });
```

See [SpotClient](./src/SpotClient.ts) for further information, or the [examples](./examples/) for lots of usage examples.

### Derivatives (Futures) Trading

Use the `DerivativesClient` for futures trading operations:

```javascript
import { DerivativesClient } from '@siebly/kraken-api';
// or if you prefer require:
// const { DerivativesClient } = require('@siebly/kraken-api');

// For public endpoints, API credentials are optional
const publicClient = new DerivativesClient();

// For private endpoints, provide API credentials
const client = new DerivativesClient({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
});

// Public API Examples

// Get order book for a specific instrument
const orderBook = await publicClient.getOrderBook({
  symbol: 'PF_XBTUSD',
});
console.log('Futures Order Book: ', orderBook);

// Get ticker information
const ticker = await publicClient.getTickers({
  symbol: 'PF_XBTUSD',
});
console.log('Futures Ticker: ', ticker);

// Private API Examples (requires authentication)

// Get account balances
client
  .getAccountsDetails()
  .then((accounts) => {
    console.log('Accounts Details: ', accounts);
  })
  .catch((err) => {
    console.error('Error: ', err);
  });

// Submit a limit order
client
  .submitOrder({
    orderType: 'lmt',
    symbol: 'PF_ETHUSD', // Perpetual ETH/USD
    side: 'buy',
    size: 0.01, // Contract size
    limitPrice: 1000,
    cliOrdId: client.generateNewOrderID(),
  })
  .then((result) => {
    console.log('Limit Order Result: ', JSON.stringify(result, null, 2));
  })
  .catch((err) => {
    console.error('Error: ', err);
  });
```

Kraken retired the Futures demo (testnet) environment on 14 July 2026. There is no replacement demo host, and Spot never had a testnet. Setting `testnet: true` on `DerivativesClient` or `WebsocketClient` throws. See the [announcement](https://support.kraken.com/articles/360024809011-api-testing-environment-derivatives).

See [DerivativesClient](./src/DerivativesClient.ts) for further information.

## WebSockets

Kraken supports two types of WebSocket connections:

1. **WebSocket Subscriptions** - Real-time market data and account updates via the `WebsocketClient`
2. **WebSocket API** - REST-like request/response trading via the `WebsocketAPIClient`

### WebSocket Subscriptions (WebsocketClient)

The unified `WebsocketClient` handles all Kraken WebSocket streams with automatic connection management and reconnection.

Key WebSocket features:

- Event driven messaging
- Smart WebSocket persistence with automatic reconnection
- Heartbeat mechanisms to detect disconnections
- Automatic resubscription after reconnection
- Support for both Spot and Futures markets
- Support for both public and private WebSocket streams

### Why not raw ws?

A raw `ws` socket leaves reconnect, liveness, resubscribe, and auth to you. `WebsocketClient` does that work:

- Reconnects a dropped socket, then resubscribes to the topics already requested.
- Heartbeats (native ping/pong, plus Kraken `heartbeat` / `pong` frames) so a silent socket is treated as dead and reconnected.
- Private auth: Spot WebSocket tokens are fetched from REST, cached, and refreshed before they expire. Futures private streams use the signed challenge flow, and a reconnect re-authenticates.

Kraken book payloads include a checksum. This SDK does not validate it. [Spot orderbook over WebSocket](#spot-orderbook-over-websocket) keeps a local book and checks that checksum.

```javascript
import { WebsocketClient } from '@siebly/kraken-api';
const ws = new WebsocketClient();
ws.on('message', (data) => console.log(data));
ws.subscribe({ topic: 'ticker', payload: { symbol: ['BTC/USD'] } }, 'spotPublicV2');
```

### Spot orderbook over WebSocket

Use `WebsocketClient` to maintain a Spot orderbook over WebSocket with checksum validation, as shown in the runnable [local orderbook example](./examples/Spot/WebSockets/orderbookLocalWs.ts). The example applies snapshots and updates, restores pair precision for CRC32 validation, resubscribes on checksum mismatch, and logs the best bid and ask. The SDK handles reconnects, heartbeats, and resubscription after reconnect; the example supplies the local book and checksum resync logic that a raw `ws` socket leaves to you.

### Public WebSocket Streams

For public market data, API credentials are not required:

```javascript
import { WebsocketClient } from '@siebly/kraken-api';
// or if you prefer require:
// const { WebsocketClient } = require('@siebly/kraken-api');
// Create WebSocket client for public streams
const wsClient = new WebsocketClient();

// Set up event handlers
wsClient.on('open', (data) => {
  console.log('WebSocket connected: ', data?.wsKey);
});

wsClient.on('message', (data) => {
  console.log('Data received: ', JSON.stringify(data, null, 2));
});

wsClient.on('reconnected', (data) => {
  console.log('WebSocket reconnected: ', data);
});

wsClient.on('exception', (data) => {
  console.error('WebSocket error: ', data);
});

// Spot - Subscribe to public data streams
wsClient.subscribe(
  {
    topic: 'ticker',
    payload: {
      symbol: ['BTC/USD', 'ETH/USD'],
    },
  },
  'spotPublicV2',
);

wsClient.subscribe(
  {
    topic: 'book',
    payload: {
      symbol: ['BTC/USD'],
      depth: 10,
    },
  },
  'spotPublicV2',
);

// Derivatives - Subscribe to public data streams
wsClient.subscribe(
  {
    topic: 'ticker',
    payload: {
      product_ids: ['PI_XBTUSD', 'PI_ETHUSD'],
    },
  },
  'derivativesPublicV1',
);

wsClient.subscribe(
  {
    topic: 'book',
    payload: {
      product_ids: ['PI_XBTUSD'],
    },
  },
  'derivativesPublicV1',
);
```

### Unified Public WebSocket Streams

Use `WS_KEY_MAP.unifiedPublicV2` for Kraken's unified endpoint at `wss://uws.kraken.com/v2/public`. It reuses the client's connection management, heartbeats, and automatic resubscription. Each subscription specifies its own `asset_class`.

```typescript
import {
  WebsocketClient,
  WS_KEY_MAP,
  WSUnifiedPublicMessageEvent,
  WSUnifiedPublicTopicRequest,
} from '@siebly/kraken-api';

const client = new WebsocketClient();
const subscription: WSUnifiedPublicTopicRequest = {
  topic: 'ticker',
  payload: { asset_class: 'spot', symbol: ['BTC/USD'] },
};

// This client only subscribes to unified public streams.
client.on('message', (event: WSUnifiedPublicMessageEvent) => {
  if (event.channel === 'ticker') console.log(event.data);
});
client.on('response', (event) => console.log(event));
client.on('exception', (event) => console.error(event));
client.subscribe(subscription, WS_KEY_MAP.unifiedPublicV2);

// Later, reuse the complete request to remove it from the reconnect cache:
// client.unsubscribe(subscription, WS_KEY_MAP.unifiedPublicV2);
```

Supported unauthenticated channels are `ticker`, `book`, `ohlc`, `trade`, `instrument`, and `rfqs`. The current Kraken documentation limits unified `trade` and `rfqs` to `asset_class: 'derivatives'`. Other channels accept `spot` or `derivatives`, subject to Kraken's rollout. Discover symbols through `instrument` for the chosen asset class; do not convert symbols between API families. Incoming messages are passed through without inferring or adding `asset_class`.

The [`rfqs`](https://docs.kraken.com/exchange/api-reference/unified-ws/rfqs) channel streams all open options RFQs without a symbol filter. Subscribe with `{ topic: 'rfqs', payload: { asset_class: 'derivatives', snapshot: true } }`. Snapshots replace the current RFQ list; updates report openings and status changes. There are no sequence numbers. Resubscribe with `snapshot: true` after a gap. A `snapshot_too_large` error is emitted on `exception`.

Status updates are emitted on `message`; heartbeats and pongs are handled internally. Exported `WSUnifiedPublicTopicRequest`, `WSUnifiedPublicMessageEvent`, `WSUnifiedPublicResponseEvent`, and `WSUnifiedPublicExceptionEvent` types describe requests and received events. The client adds `wsKey` and `isWSAPIResponse` to emitted events.

The SDK supports the documented authenticated Level 3 subscription on `unifiedPublicV2`: provide Spot API credentials to the client and subscribe to `level3` with `asset_class`, `symbol`, and an optional `depth` of `10`, `100`, or `1000`. The client supplies the authentication token for Level 3 while ordinary public subscriptions remain unauthenticated. Level 3 is optional in the unified private example. Kraken's Futures demo has been retired; `testnet: true` is rejected.

See the [unified public example](./examples/Unified/WebSockets/publicWs.ts) and [Kraken's unified WS reference](https://docs.kraken.com/exchange/api-reference/unified-ws/ticker).

### Unified Private WebSocket Streams

Use `WS_KEY_MAP.unifiedPrivateV2` for account streams at `wss://uws.kraken.com/v2/private`. As with Spot private streams, supply Spot API credentials with WebSocket access. The client fetches and caches tokens through `GetWebSocketsToken`, refreshes them when needed for requests, and includes them in subscribe and unsubscribe requests. Reconnection and resubscription are automatic. Subscribe acknowledgements confirm access; there is no separate login event.

```typescript
import {
  WebsocketClient,
  WS_KEY_MAP,
  WSUnifiedPrivateMessageEvent,
  WSUnifiedPrivateTopicRequest,
} from '@siebly/kraken-api';

const client = new WebsocketClient({
  apiKey: process.env.API_SPOT_KEY,
  apiSecret: process.env.API_SPOT_SECRET,
});

const subscriptions: WSUnifiedPrivateTopicRequest[] = [
  {
    topic: 'executions',
    payload: {
      asset_class: 'spot',
      snap_orders: true,
      snap_trades: true,
    },
  },
  { topic: 'balances' },
  { topic: 'preferences' },
  // Optional, subject to account and endpoint availability:
  // { topic: 'ledgers' },
  // Optional derivatives-only channels:
  // {
  //   topic: 'positions',
  //   payload: { asset_class: 'derivatives', snapshot: true },
  // },
  // { topic: 'margin', payload: { asset_class: 'derivatives' } },
  // { topic: 'quotes', payload: { asset_class: 'derivatives', snapshot: true } },
];

// This client only opens unifiedPrivateV2.
client.on('message', (event: WSUnifiedPrivateMessageEvent) => {
  console.log(event);
});
client.on('response', (event) => console.log(event));
client.on('exception', (event) => console.error(event));
client.subscribe(subscriptions, WS_KEY_MAP.unifiedPrivateV2);

// Reuse the complete requests, including optional parameters:
// client.unsubscribe(subscriptions, WS_KEY_MAP.unifiedPrivateV2);
```

| Channel       | Subscription parameters                                                                                               | Message behavior                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `executions`  | Required `asset_class`: `spot` or `derivatives`; optional `snap_orders`, `snap_trades`, `order_status`, `ratecounter` | Partial order and fill reports; fields depend on the event                                         |
| `balances`    | Optional `snapshot`; no `asset_class`                                                                                 | Asset/wallet snapshots and ledger updates across the account                                       |
| `positions`   | Required `asset_class: 'derivatives'`; optional `snapshot` or `with_margin`, never both                               | Default snapshots and position deltas; `with_margin: true` replaces all positions and omits `type` |
| `margin`      | Required `asset_class: 'derivatives'`; no `snapshot`                                                                  | Each message replaces the `multi_collateral` or `single_collateral` section                        |
| `ledgers`     | No parameters                                                                                                         | Account-wide ledger updates with sequence numbers; no snapshot                                     |
| `preferences` | No parameters                                                                                                         | Account preference snapshots and updates                                                           |
| `quotes`      | Required `asset_class: 'derivatives'`; optional `snapshot`; no symbol filter | Your options RFQs and offers, discriminated by each entry's `type`: `rfq` or `offer` |

`balances`, `ledgers`, and `preferences` also accept bare topic names, for example `client.subscribe('balances', 'unifiedPrivateV2')`. Positions and margin each permit one subscription per connection. Keep position/margin decimal strings and derivatives `sequence_id` strings unchanged to preserve precision. Use the REST Ledgers endpoint to recover missed entries after a ledger sequence gap. Channel failures such as `margin_unavailable` are emitted on `exception`; the application can resubscribe when ready.

The [`quotes`](https://docs.kraken.com/exchange/api-reference/unified-ws/quotes) channel shares the RFQ snapshot and recovery behavior described above, including `snapshot_too_large` errors on `exception`. A quote's `filled_bid_side` or `filled_ask_side` status does not prove that your offer traded. Check `executions`, where RFQ fills carry `order_type: 'rfq'`, with one fill per leg.

Exported `WSUnifiedPrivateTopicRequest`, `WSUnifiedPrivateMessageEvent`, `WSUnifiedPrivateResponseEvent`, and `WSUnifiedPrivateExceptionEvent` describe requests and events. The SDK adds `wsKey` and `isWSAPIResponse` to emitted events.

See the [unified private example](./examples/Unified/WebSockets/privateWs.ts), which defaults to Spot executions, balances, and preferences, with ledgers and authenticated Level 3 available to enable explicitly, and [Kraken's private stream reference](https://docs.kraken.com/exchange/api-reference/unified-ws/executions). Channel availability depends on the account and Kraken's rollout. For trading commands, see [Unified WebSocket API](#unified-websocket-api).

### Private WebSocket Streams

For private account data streams, API credentials are required:

```javascript
import { WebsocketClient } from '@siebly/kraken-api';

// Create WebSocket client with API credentials for private streams
const wsClient = new WebsocketClient({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
});

// Set up event handlers
wsClient.on('open', (data) => {
  console.log('Private WebSocket connected: ', data?.wsKey);
});

wsClient.on('message', (data) => {
  console.log('Private data received: ', JSON.stringify(data, null, 2));
});

wsClient.on('authenticated', (data) => {
  console.log('WebSocket authenticated: ', data);
});

wsClient.on('response', (data) => {
  console.log('WebSocket response: ', data);
});

wsClient.on('exception', (data) => {
  console.error('WebSocket error: ', data);
});

// Spot - Subscribe to private data streams
wsClient.subscribe(
  {
    topic: 'executions',
    payload: {
      snap_trades: true,
      snap_orders: true,
      order_status: true,
    },
  },
  'spotPrivateV2',
);

wsClient.subscribe(
  {
    topic: 'balances',
    payload: {
      snapshot: true,
    },
  },
  'spotPrivateV2',
);

// Derivatives - Subscribe to private data streams
// Note: SDK automatically handles authentication and challenge tokens
wsClient.subscribe('open_orders', 'derivativesPrivateV1');

wsClient.subscribe(
  {
    topic: 'fills',
    payload: {
      product_ids: ['PF_XBTUSD'],
    },
  },
  'derivativesPrivateV1',
);

wsClient.subscribe('balances', 'derivativesPrivateV1');

wsClient.subscribe('open_positions', 'derivativesPrivateV1');
```

For more comprehensive examples, including custom logging and error handling, check the [examples](./examples/WebSockets) folder.

### WebSocket API (WebsocketAPIClient)

The `WebsocketAPIClient` provides a REST-like interface for trading operations over WebSocket, offering lower latency than REST APIs. Spot methods use the Spot WS API; unified methods support Spot and derivatives through the unified private endpoint.

```javascript
import { WebsocketAPIClient } from '@siebly/kraken-api';

// Create WebSocket API client with credentials
const wsApiClient = new WebsocketAPIClient({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
});

// The client handles event listeners automatically, but you can customize them
wsApiClient
  .getWSClient()
  .on('open', (data) => {
    console.log('WebSocket API connected:', data.wsKey);
  })
  .on('response', (data) => {
    console.log('Response:', data);
  })
  .on('exception', (data) => {
    console.error('Error:', data);
  });

// Trading operations return promises

// Submit a spot order
const orderResponse = await wsApiClient.submitSpotOrder({
  order_type: 'limit',
  side: 'buy',
  limit_price: 26500.4,
  order_qty: 1.2,
  symbol: 'BTC/USD',
});
console.log('Order placed:', orderResponse);

// Amend an existing order
const amendResponse = await wsApiClient.amendSpotOrder({
  order_id: 'OAIYAU-LGI3M-PFM5VW',
  order_qty: 1.5,
  limit_price: 27000,
});

// Cancel specific orders
const cancelResponse = await wsApiClient.cancelSpotOrder({
  order_id: ['OM5CRX-N2HAL-GFGWE9', 'OLUMT4-UTEGU-ZYM7E9'],
});

// Cancel all open orders
const cancelAllResponse = await wsApiClient.cancelAllSpotOrders();
```

The WebSocket API provides several advantages:

- **Lower Latency** - Faster than REST API for high-frequency trading
- **Connection Reuse** - Single persistent connection for multiple requests
- **Better Performance** - Batch operations for submitting/canceling multiple orders
- **Type Safety** - Full TypeScript support with typed requests and responses

See the [Spot WebSocket API example](./examples/Spot/WebSockets/wsAPI.ts) for more detailed usage.


### Unified WebSocket API

Use the unified methods on `WebsocketAPIClient`, or call `sendWSAPIRequest()` with `WS_KEY_MAP.unifiedPrivateV2`. Both reuse the existing connection, token caching, and request/response handling. Supply Spot API credentials for either asset class, and set `asset_class` explicitly on each request.

```typescript
import { WebsocketAPIClient } from '@siebly/kraken-api';

const client = new WebsocketAPIClient({
  apiKey: process.env.API_SPOT_KEY,
  apiSecret: process.env.API_SPOT_SECRET,
});

const response = await client.submitUnifiedOrder({
  asset_class: 'spot',
  order_type: 'limit',
  side: 'buy',
  symbol: 'BTC/USD',
  order_qty: 0.001,
  limit_price: 10000,
  validate: true, // Validate without placing an order.
});
console.log(response.result);
client.getWSClient().closeAll();
```

| Method | Unified command |
| --- | --- |
| `submitUnifiedOrder()` | `add_order` |
| `amendUnifiedOrder()` | `amend_order` |
| `cancelUnifiedOrder()` | `cancel_order` |
| `cancelAllUnifiedOrders()` | `cancel_all` |
| `cancelAllUnifiedOrdersAfter()` | `cancel_all_orders_after` |
| `batchSubmitUnifiedOrders()` | `batch_add` |
| `batchCancelUnifiedOrders()` | `batch_cancel` |
| `setUnifiedPreference()` | `set_preference` |

`setUnifiedPreference()` supports derivatives leverage settings. The request types distinguish Spot and derivatives parameters. Legacy `edit_order` remains available through the Spot API; use `amendUnifiedOrder()` on unified.

As with Spot, cancelling multiple orders through `cancelUnifiedOrder()` can produce several replies: the first settles the promise, and all replies are emitted through `response` or `exception`. Use `batchCancelUnifiedOrders()` for a single response containing the cancellation count.

See the [unified WS API example](./examples/Unified/WebSockets/wsAPI.ts), the [raw request example](./examples/Unified/WebSockets/wsAPI.RAW.ts), and [Kraken's unified trading reference](https://docs.kraken.com/exchange/api-reference/unified-ws/add_order). Both examples default to Spot and validate orders without placing them.

---

## Customise Logging

Pass a custom logger which supports the log methods `trace`, `info` and `error`, or override methods from the default logger as desired.

```javascript
import { WebsocketClient, DefaultLogger } from '@siebly/kraken-api';

// E.g. customise logging for only the trace level:
const customLogger: DefaultLogger = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const ws = new WebsocketClient(
  {
    apiKey: 'apiKeyHere',
    apiSecret: 'apiSecretHere',
  },
  customLogger,
);
```

## Browser/Frontend Usage

The npm package includes ES module and CommonJS builds. You do not need to build the SDK's standalone Webpack bundle to use it in a frontend project. Choose the setup for your application below.

### Vite and React

Use the [Vite guide](https://sieblyio.github.io/docs/kraken/environments/vite.html) or [React guide](https://sieblyio.github.io/docs/kraken/environments/react.html) for a complete public market-data project that imports `@siebly/kraken-api` from npm.

Keep the supplied bundler configuration with the example: it provides EventEmitter through the `events` alias. These browser examples use public Kraken Spot data. Keep private keys and API credentials in a secure server-side environment and make authenticated calls there.

Browser REST requests also depend on Kraken's CORS policy. Keep the guides' public GET client configuration, which removes the SDK's `UserAgent` and `locale` headers to avoid a failing CORS preflight. This setup is limited to public GET requests. If a request is blocked, call the SDK through your application's server route instead. A development proxy does not solve CORS for a deployed application.

### Next.js and server-side requests

The [Next.js guide](https://sieblyio.github.io/docs/kraken/environments/next.html) runs the SDK in a Node.js Route Handler and returns the result to the frontend. Use this pattern when requests need credentials or cannot be made directly from the browser.

### React Native and Expo

Follow the [Expo guide](https://sieblyio.github.io/docs/kraken/environments/expo.html) for its Metro configuration and required polyfill dependencies, including its HTTP, HTTPS and URL aliases. Browser bundler configuration is not interchangeable with Metro configuration. The example uses public Kraken Spot data; keep authenticated operations on your server.

### Standalone Webpack bundle

If you need a standalone UMD bundle rather than npm imports in your application, the SDK repository includes a [Webpack configuration](./webpack/webpack.config.cjs). From a checkout of this repository:

```bash
npm install
npm run build
npm run pack
```

The configuration writes `dist/krakenapi.js` with the `krakenapi` global name. It disables Node.js `http` and `https` imports; the REST client's Node-only `https.Agent` is unavailable in browsers. This is a separate packaging option, not a required step for the framework guides above. Browser-specific configuration and API access restrictions still apply.

## Use with LLMs & AI

This SDK includes a bundled `llms.txt` file in the root of the repository. If you're developing with LLMs, use the included `llms.txt` with your LLM - it will significantly improve the LLMs understanding of how to correctly use this SDK.

This file contains AI optimised structure of all the functions in this package, and their parameters for easier use with any learning models or artificial intelligence.

---

## Used By

[![Repository Users Preview Image](https://dependents.info/sieblyio/kraken-api/image)](https://github.com/sieblyio/kraken-api/network/dependents)

---

<!-- template_contributions -->

### Contributions & Thanks

Have my projects helped you? Share the love, there are many ways you can show your thanks:

- Star & share my projects.
- Are my projects useful? Sponsor me on Github and support my effort to maintain & improve them: https://github.com/sponsors/tiagosiebler
- Have an interesting project? Get in touch & invite me to it.
- Or buy me all the coffee:
  - ETH(ERC20): `0xA3Bda8BecaB4DCdA539Dc16F9C54a592553Be06C` <!-- metamask -->
- Sign up with my referral links:
  - OKX (receive a 20% fee discount!): https://www.okx.com/join/42013004
  - Binance (receive a 20% fee discount!): https://accounts.binance.com/register?ref=OKFFGIJJ
  - HyperLiquid (receive a 4% fee discount!): https://app.hyperliquid.xyz/join/SIEBLY
  - Gate: https://www.gate.io/signup/NODESDKS?ref_type=103

<!---
old ones:
  - BTC: `1C6GWZL1XW3jrjpPTS863XtZiXL1aTK7Jk`
  - BTC(SegWit): `bc1ql64wr9z3khp2gy7dqlmqw7cp6h0lcusz0zjtls`
  - ETH(ERC20): `0xe0bbbc805e0e83341fadc210d6202f4022e50992`
  - USDT(TRC20): `TA18VUywcNEM9ahh3TTWF3sFpt9rkLnnQa
  - gate: https://www.gate.io/signup/AVNNU1WK?ref_type=103

-->
<!-- template_contributions_end -->

### Contributions & Pull Requests

Contributions are encouraged, I will review any incoming pull requests. See the issues tab for todo items.

<!-- template_star_history -->

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=sieblyio/bybit-api,sieblyio/okx-api,sieblyio/binance,sieblyio/bitget-api,sieblyio/bitmart-api,sieblyio/gateio-api,sieblyio/kucoin-api,sieblyio/coinbase-api,sieblyio/orderbooks,sieblyio/accountstate,sieblyio/awesome-crypto-examples&type=Date)](https://star-history.com/#sieblyio/bybit-api&sieblyio/okx-api&sieblyio/binance&sieblyio/bitget-api&sieblyio/bitmart-api&sieblyio/gateio-api&sieblyio/kucoin-api&sieblyio/coinbase-api&sieblyio/orderbooks&sieblyio/accountstate&sieblyio/awesome-crypto-examples&Date)

<!-- template_star_history_end -->
