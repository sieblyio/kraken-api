# Node.js & JavaScript SDK for Kraken REST APIs & WebSockets

[![Build & Test](https://github.com/sieblyio/kraken-api/actions/workflows/e2etest.yml/badge.svg?branch=main)](https://github.com/sieblyio/kraken-api/actions/workflows/e2etest.yml)
[![npm version](https://img.shields.io/npm/v/@siebly/kraken-api)][1]
[![npm size](https://img.shields.io/bundlephobia/min/@siebly/kraken-api/latest)][1]
[![npm downloads](https://img.shields.io/npm/dt/@siebly/kraken-api)][1]
[![last commit](https://img.shields.io/github/last-commit/sieblyio/kraken-api)][1]
[![Telegram](https://img.shields.io/badge/chat-on%20telegram-blue.svg)](https://t.me/nodetraders)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/sieblyio/kraken-api)

<p align="center">
  <a href="https://www.npmjs.com/package/@siebly/kraken-api">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/sieblyio/kraken-api/blob/main/docs/images/logoDarkMode2.svg?raw=true#gh-dark-mode-only">
      <img alt="SDK Logo" src="https://github.com/sieblyio/kraken-api/blob/main/docs/images/logoBrightMode2.svg?raw=true#gh-light-mode-only">
    </picture>
  </a>
</p>

[1]: https://www.npmjs.com/package/@siebly/kraken-api

Complete & robust JavaScript & Node.js SDK for the Kraken REST APIs and WebSockets:

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

## Table of Contents

- [Installation](#installation)
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
    - [Public WebSocket Streams](#public-websocket-streams)
    - [Private WebSocket Streams](#private-websocket-streams)
    - [WebSocket API (WebsocketAPIClient)](#websocket-api-websocketapiclient)
- [Customise Logging](#customise-logging)
- [Browser/Frontend Usage](#browserfrontend-usage)
  - [Webpack](#webpack)
- [LLMs & AI](#use-with-llms--ai)
- [Used By](#used-by)
- [Contributions & Thanks](#contributions--thanks)

## Installation

`npm install --save @siebly/kraken-api`

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

Most methods accept JS objects. These can be populated using parameters specified by Kraken's API documentation, or check the type definition in each class within this repository.

### API Documentation Links

- [Kraken API Documentation](https://docs.kraken.com/api/)
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

The `WebsocketAPIClient` provides a REST-like interface for trading operations over WebSocket, offering lower latency than REST APIs. Currently, only Spot trading is supported.

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

See the [WebSocket API examples](./examples/WebSockets/Spot/wsAPI.ts) for more detailed usage.

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

### Webpack

Build a bundle using webpack:

- `npm install`
- `npm run build`
- `npm run pack`

The bundle can be found in `dist/`. Altough usage should be largely consistent, smaller differences will exist. Documentation is still TODO.

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
