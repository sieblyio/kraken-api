<!-- siebly:metadata
siebly:
  version: 1
  hero:
    headline: Kraken API JavaScript Tutorial for Node.js and TypeScript
    badges:
      - Kraken Spot
      - Kraken Futures
      - WebSockets
      - WebSocket API
    summary: Build Kraken integrations without hand-rolling raw HTTP requests, Kraken JWTs/request signing, WebSocket authentication, heartbeats, reconnects, or exchange-specific payload plumbing.
    codeFilename: first-kraken-call.ts
    codeStatus: ready to run
    startSectionId: fast-path-first-kraken-api-calls-in-javascript
  software:
    description: Node.js and JavaScript SDK for Kraken Spot REST, Futures REST, WebSocket streams, Spot WebSocket API command workflows, and REST API and WebSocket proxy support.
    topics:
      - Spot REST
      - Futures REST
      - WebSockets
      - WebSocket API
      - REST API and WebSocket proxies
  machineCatalog:
    label: Kraken API JavaScript Tutorial
    topics:
      - Spot REST
      - Futures REST
      - public WebSockets
      - private WebSockets
      - WebSocket API commands
      - HTTP and SOCKS proxies
      - production reconnect handling
      - troubleshooting
  sdkPagePromo:
    descriptionBeforePackage: 'A richer JavaScript guide for building Kraken Spot REST, Futures REST, public and private WebSockets, WebSocket API trading, proxy configuration, reconnect handling, and production rollout patterns with '
    descriptionAfterPackage: '.'
    highlights:
      - Spot and Futures clients
      - Public and private streams
      - Promise-wrapped WebSocket API trading
      - REST API and WebSocket proxy examples
    exampleHref: /examples/Kraken/Spot/WebSockets/wsAPI
    exampleLabel: WebSocket API example
    architectureClientSummary: SpotClient, DerivativesClient, WebsocketClient
    architectureApiTitle: Kraken APIs
    architectureApiSummary: Spot REST, Futures REST, WebSockets, WebSocket API
  surfaceMap:
    heading: One package, four integration paths
    summary: The SDK keeps Kraken product boundaries explicit while giving JavaScript and TypeScript projects a single install, shared authentication patterns, and consistent async behavior.
    appLabel: Dashboard, worker, bot, tool
    appSummary: Any JavaScript-compatible runtime that needs Kraken data, orders, or account state.
    apiLabel: Kraken APIs
    apiItems:
      - Spot REST and WebSockets
      - Futures REST and WebSockets
      - Spot WebSocket API commands
      - Public and private account flows
    packageNodes:
      - label: SpotClient
        summary: Spot REST
      - label: DerivativesClient
        summary: Futures REST
      - label: WebsocketClient
        summary: Public and private streams
      - label: WebsocketAPIClient
        summary: Spot API commands
  coverage:
    heading: The Kraken API pieces developers usually get stuck on
    summary: The guide covers the Kraken API surfaces developers use first, including authentication, proxy configuration, reconnect recovery, and product-specific Spot and Futures behavior.
    cards:
      - heading: Authentication and network paths
        summary: Keep Spot token fetches, Futures challenge authentication, REST API networking, and WebSocket proxy settings explicit.
      - heading: Spot and Futures REST APIs
        summary: Use typed clients for market data, account state, order entry, and product-specific request shapes.
      - heading: Public and private WebSockets
        summary: Stream market data and account events with heartbeat, reconnect, and resubscribe handling.
      - heading: WebSocket API commands
        summary: Send Spot commands over Kraken's event-driven WebSocket API with awaitable SDK methods.
  snippets:
    heading: First REST API calls, WebSocket subscriptions, and order management, with just a few lines of code.
    summary: For more detail, refer to the full guide below, but if you want to jump straight to code that gets you making requests and receiving data,
    labels:
      spot-rest: Spot REST API
      public-websocket: Public WebSockets
      private-websocket: Private WebSockets
      spot-orders: Spot Orders
      futures-orders: Futures Orders
  workflows:
    heading: Where your code stops and the SDK takes over
    summary: Function-style stages keep the implementation order explicit, while the badges show which parts are automatic SDK behavior.
    diagrams:
      - heading: WebSocket stream lifecycle
        summary: Use this pattern for public market data and private account streams that must survive normal network interruptions.
        steps:
          - label: subscribe(topics)
            owner: app
          - label: await(connect)
            owner: sdk
          - label: await(authenticate)
            owner: sdk
          - label: on(authenticated)
            owner: event
          - label: trigger(backfill via REST)
            owner: app
          - label: on(message)
            owner: event
      - heading: WebSocket stream private lifecycle
        summary: When a private connection reconnects, pause sensitive commands, backfill with REST, then resume from a known state.
        steps:
          - label: on(reconnecting)
            owner: event
          - label: pause(private writes)
            owner: app
          - label: await(automatic reconnect)
            owner: sdk
          - label: await(automatic resubscribe)
            owner: sdk
          - label: on(reconnected)
            owner: event
          - label: trigger(backfill)
            owner: app
          - label: resume(private writes)
            owner: app
      - heading: WebSocket API request flow
        summary: The SDK wraps asynchronous WebSocket API commands in promises so private calls can be awaited like REST.
        steps:
          - label: Call & await SDK method
            owner: app
          - label: await(connect)
            owner: sdk
          - label: await(authenticate)
            owner: sdk
          - label: on(authenticated)
            owner: event
          - label: wrapInPromise(request)
            owner: sdk
          - label: send(WSCommand)
            owner: sdk
          - label: on(response)
            owner: event
          - label: resolve(requestPromise)
            owner: sdk
          - label: Handle result
            owner: app
  production:
    heading: Operational patterns for production-ready Kraken integrations
    summary: Explore the recommended patterns for production deployments, including how to handle reconnects, key separation, client-generated IDs, safe validation, logging, and post-reconnect best practices.
    items:
      - Use client-generated order IDs for safer retries and reconciliation.
      - Treat reconnects as a normal design path, not as an exceptional case.
      - Start with public data, validate private flows, then test live writes carefully.
      - Keep Spot & Futures API credentials & REST API clients separate.
      - Use minimum API key permissions and avoid withdrawal scopes for private API workflows.
      - Inject your own logger when SDK events need to feed monitoring or alerting.
      - Monitor proxy reachability, latency, and egress IP when a proxy is enabled.
  journeys:
    eyebrow: Choose your path
    heading: Jump to the workflow you are building
    actionLabel: Open section
    cards:
      - heading: Get market data
        summary: Start with public Spot REST and public WebSocket streams for ticker, trade, candles, and order book workflows.
        href: "#fast-path-first-kraken-api-calls-in-javascript"
      - heading: Monitor accounts
        summary: Authenticate private streams for balances, orders, executions, account events, and reconnect-aware state handling.
        href: "#kraken-websockets-in-javascript-public-and-private-streaming"
      - heading: Submit orders
        summary: Use typed REST clients for Spot and Futures order management, validation, and batch placement.
        href: "#kraken-spot-rest-api-in-javascript-and-typescript"
      - heading: Use WebSocket API
        summary: Use promise-wrapped WebSocket API methods when a persistent authenticated command channel is the better fit.
        href: "#spot-websocket-api-commands-with-websocketapiclient"
  article:
    heading: Learn how to use the Kraken REST API & WebSockets in JavaScript
    summary: This tutorial covers REST API and WebSocket usage for Spot and Futures, with examples for authentication, proxies, reconnects, order management, and rollout checks.
  related:
    cards:
      - heading: Kraken SDK page
        summary: Return to install snippets, direct examples, endpoint maps, and package links.
        href: /sdk/kraken/javascript
      - heading: Endpoint reference
        summary: Map Kraken REST and WebSocket API methods to the current JavaScript SDK calls.
        href: /sdk/kraken/javascript#endpoint-reference
      - heading: Security notes
        summary: Review package release integrity, safe SDK usage, and key-handling guidance.
        href: /security
      - heading: All SDK guides
        summary: Compare Kraken with the other Siebly JavaScript and TypeScript exchange SDKs.
        href: /sdk
-->
# Kraken API JavaScript Tutorial for Node.js and TypeScript

Build Kraken integrations in JavaScript or TypeScript without hand-rolling raw HTTP requests, Kraken JWTs/request signing for authenticated APIs, WebSocket authentication, heartbeats, reconnects, or exchange-specific payload handling. This guide also covers HTTP, HTTPS, and SOCKS proxy configuration for Spot and Futures connections.

<!-- siebly:website-omit:start -->
> [!TIP]
> Read this guide in tutorial format on the Siebly website: [Kraken JavaScript REST API and WebSocket Tutorial](https://siebly.io/sdk/kraken/javascript/tutorial)
<!-- siebly:website-omit:end -->

This Kraken JavaScript tutorial uses [`@siebly/kraken-api`](https://www.npmjs.com/package/@siebly/kraken-api), the [Kraken JavaScript SDK by Siebly.io](https://siebly.io/sdk/kraken/javascript), to walk through the API surfaces most developers need:

- Kraken Spot REST API
- Kraken Futures REST API
- Public and private Kraken WebSockets
- Spot command workflows over Kraken's event-driven WebSocket API
- Automatic handling for Kraken JWTs, request signing, and private-channel authentication

Key Links

- Kraken JavaScript & Node.js SDK by Siebly: [`@siebly/kraken-api`](https://www.npmjs.com/package/@siebly/kraken-api)
- GitHub Repository: [`sieblyio/kraken-api`](https://github.com/sieblyio/kraken-api)
- SDK function-endpoint map: [Kraken JavaScript Endpoint Reference](https://siebly.io/sdk/kraken/javascript#endpoint-reference)
- More SDKs: [Siebly.io](https://siebly.io)

Topics covered in this guide

- Why use a Kraken SDK
- Choosing the right Kraken API surface
- Install and API keys
- Setup checklist before writing code
- Start building quickstart
- Spot REST APIs
- Spot WebSockets
- Spot WebSocket API commands
- Futures REST APIs
- Futures WebSockets
- Production notes for API integrations
- Troubleshooting common integration problems
- FAQ and next steps

---

<!-- siebly:section id="why-use-a-kraken-sdk" -->
## Why use a Kraken SDK

A stable Kraken API integration has to handle separate REST authentication models, private WebSocket authentication, reconnects, and asynchronous command responses.

- Spot REST and Futures REST APIs use different authentication models and request shapes.
- Public & private WebSockets require connection lifecycle handling, authentication, and reconnection handling.
- Spot commands (such as order management) over Kraken's asynchronous WebSocket API can be complicated without JavaScript Promises to glue WebSocket API responses to the requests that triggered them.
- Production API integrations need typed request schemas, consistent async behavior, resilient WebSockets, and a connectivity architecture that works.

The `@siebly/kraken-api` gives you one JavaScript and TypeScript SDK for Kraken API integration in any Node.js or JavaScript-capable environment:

- Complete API coverage with dedicated REST API clients for each product group, including Spot and Derivatives.
- One `WebsocketClient` for public and private streaming across all Kraken products.
- A `WebsocketAPIClient` for Spot commands over a persistent WebSocket connection, with the convenience of awaitable promise-wrapped WebSocket API requests. Each WebSocket API command can be awaited like a REST API request.
- Automatic heartbeats, reconnect and resubscribe handling for WebSockets. Stay connected, stay in sync.
- TypeScript-first request and response definitions for most SDK methods.
- ESM and CJS support.
- Browser-friendly HMAC signing and proxy support.

The package also includes `InstitutionalClient` and `PartnerClient`, but this guide focuses on the flows most developers look for first: Spot, Futures, market data, account data, and order management.

---

<!-- siebly:section id="what-you-can-build-with-the-kraken-javascript-sdk" -->
## What you can build with the [Kraken JavaScript SDK](https://siebly.io/sdk/kraken/javascript)

This Kraken JavaScript SDK is relevant for any integration with Kraken's APIs and WebSockets, especially if you are building:

- Real-time market data dashboards
- Portfolio and balance monitors
- Alerting and signal pipelines
- Reconciliation or account state services
- Internal operations tooling
- Trading bots and execution services
- AI-assisted engineering workflows that need a reliable & typed Kraken integration layer

---

<!-- siebly:section id="who-this-guide-is-for" -->
## Who this guide is for

This guide is written for JavaScript developers (& LLMs) who:

- Want to build with the Kraken API offering
- Want a quick, easy, predictable, up-to-date and heavily used (reliable) way to integrate with Kraken's APIs & WebSockets
- Care about typed requests and responses
- Are working with exchange REST APIs & WebSockets for the first time
- Are already using exchange APIs elsewhere and are looking to integrate Kraken
- Need dependable connectivity for market data, account monitoring, or order workflows
- Are comparing raw Kraken integration against a maintained SDK

---

<!-- siebly:section id="what-this-one-page-course-covers" -->
## What this one-page course covers

- Installing the Kraken JavaScript SDK by Siebly
- Choosing between Spot REST, Futures REST, WebSocket streams, and the WebSocket API
- Creating Spot and Futures REST API clients
- Making your first public Spot REST API request
- Streaming public Spot market data over WebSockets
- Subscribing to private Spot account streams
- Placing Spot orders over Kraken's REST API
- Managing Spot orders in batches
- Sending Spot commands over Kraken's WebSocket API
- Pulling Kraken Futures market data
- Submitting Kraken Futures orders via REST API
- Using Kraken Futures WebSockets
- Production patterns for reconnects, idempotency, logging, and safer rollout
- Debugging common authentication, symbol, reconnect, and order validation problems

---

<!-- siebly:section id="choose-the-right-kraken-api-surface" -->
## Choose the right Kraken API surface

Kraken exposes several API surfaces, and most integration mistakes start with choosing the wrong one for the job. Use this map before writing code.

| Developer task                                              | Start with                                     | SDK client or key                                                  | Why                                                                                                      |
| ----------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Check connectivity or read public market data               | Spot REST                                      | `SpotClient`                                                       | Easiest request-response path. No API keys needed for public data.                                       |
| Stream public market data                                   | Spot WebSocket streams                         | `WebsocketClient` with `WS_KEY_MAP.spotPublicV2`                   | Better fit when a dashboard, worker, or alerting service needs continuous updates.                       |
| Read balances, orders, fills, or account state              | Private Spot REST plus private Spot WebSockets | `SpotClient` and `WebsocketClient` with `WS_KEY_MAP.spotPrivateV2` | REST gives snapshots. WebSockets keep long-running processes updated after the initial snapshot.         |
| Validate or submit Spot orders                              | Spot REST first                                | `SpotClient.submitOrder` with `validate: true` while testing       | Simple to inspect, log, retry, and validate before live writes.                                          |
| Send low-latency Spot commands over a persistent connection | Spot WebSocket API                             | `WebsocketAPIClient`                                               | Useful after the integration already works over REST and a persistent command channel is the better fit. |
| Build against Kraken Futures                                | Futures REST and Futures WebSockets            | `DerivativesClient` and derivatives `WS_KEY_MAP` entries           | Futures uses separate credentials, symbols, endpoints, and request shapes.                               |

Rule of thumb: use REST when you need one clear answer to one clear request. Use WebSocket streams when you need live data or account events. Use the WebSocket API when you need a persistent authenticated command channel after the basic REST flow is already understood.

---

<!-- siebly:section id="how-to-get-started-with-the-kraken-api-in-javascript" -->
## How to get started with the Kraken API in JavaScript?

If you don't have Node.js installed yet, refer to the Node.js documentation on getting started with Node.js. The Kraken JavaScript SDK is published to both [GitHub](https://github.com/sieblyio/kraken-api) and [npm](https://www.npmjs.com/package/@siebly/kraken-api).

Install the SDK with npm:

```bash
npm install @siebly/kraken-api
```

Or, if preferred, use your favourite npm-compatible package manager:

```bash
# or pnpm:
pnpm install @siebly/kraken-api
# or yarn:
yarn add @siebly/kraken-api
```

Create API keys where Kraken documents them:

- Spot: [Kraken Spot API key instructions](https://support.kraken.com/articles/360000919966-how-to-create-an-api-key)
- Futures: [Kraken Futures API key instructions](https://pro.kraken.com/app/settings/api)

> Use the minimum permissions needed for your scenario. Trading does not require withdrawal permissions. Analytics does not require trading permissions.

Important auth difference:

- Spot & futures have different API keys.
- Make sure the API keys you have created are for the correct product group.
- API keys for Spot will only work for Spot APIs.
- API keys for Futures will only work for Futures APIs.
- Most market data does not require API keys.

Typical environment variables:

```bash
export API_SPOT_KEY='your-spot-api-key'
export API_SPOT_SECRET='your-spot-api-secret'

export API_FUTURES_KEY='your-futures-api-key'
export API_FUTURES_SECRET='your-futures-api-secret'
```

For local Node.js examples that use a `.env` file, make `.env` loading automatic before reading `process.env`. Prefer Node.js built-in `--env-file` or `--env-file-if-exists` in package scripts when supported; otherwise use `process.loadEnvFile`, `dotenv/config`, or the repo's existing loader. Real process environment variables should override `.env`.

If you are only testing public endpoints, you do not need any keys at all.

<!-- siebly:section id="setup-checklist-before-writing-code" -->
## Setup checklist before writing code

Use this checklist to avoid the common first-hour problems:

- Install `@siebly/kraken-api` in the same project that will run the code.
- Start with a public REST call such as `getServerTime()` or `getTicker()` before adding credentials.
- Create Spot keys for Spot APIs and Futures keys for Futures APIs. They are not interchangeable.
- Give API keys only the permissions needed for the workflow. Read-only analytics does not need trading permission, and trading does not need withdrawal permission.
- Confirm your environment variables are loaded before constructing private clients.
- Keep secrets out of browser bundles, logs, screenshots, Git commits, and prompt context.
- Use `validate: true` for Spot order examples until you intentionally want to submit a live order.
- Add structured logging around `response`, `message`, `reconnecting`, `reconnected`, and `exception` events before relying on a long-running WebSocket process.

---

<!-- siebly:section id="fast-path-first-kraken-api-calls-in-javascript" -->
## Start building: first Kraken API calls in JavaScript

If you only want the fastest path to a working integration, this is the section to start from.

### 1. First Spot REST API request

<!-- siebly:snippet id="spot-rest" -->
```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient();

async function main() {
  const serverTime = await client.getServerTime();
  const systemStatus = await client.getSystemStatus();
  const ticker = await client.getTicker({ pair: 'XBTUSD' });
  const orderBook = await client.getOrderBook({ pair: 'XBTUSD', count: 10 });

  console.log({
    serverTime,
    systemStatus,
    ticker,
    orderBook,
  });
}

// Since each of the above API calls is wrapped in an awaited promise, a high level catch will detect any exceptions:
main().catch(console.error);
```

This is the quickest way to verify that your Kraken API JavaScript integration is wired correctly for public REST API calls.

See also: [Kraken JavaScript Example - How to query spot market data](https://siebly.io/examples/Kraken/Spot/Public/marketData)

### 2. First public Spot WebSocket stream

<!-- siebly:snippet id="public-websocket" -->
```typescript
import { WebsocketClient, WS_KEY_MAP } from '@siebly/kraken-api';

const ws = new WebsocketClient();

ws.on('open', (data) => console.log('connected', data?.wsKey));
ws.on('response', (data) => console.log('response', JSON.stringify(data)));
ws.on('message', (data) => console.log('message', JSON.stringify(data)));
ws.on('reconnected', (data) => console.log('reconnected', data?.wsKey));
ws.on('exception', console.error);

ws.subscribe(
  {
    topic: 'ticker',
    payload: {
      symbol: ['BTC/USD', 'ETH/USD'],
    },
  },
  WS_KEY_MAP.spotPublicV2,
);
```

This gets a public Kraken Spot WebSocket stream running in JavaScript.

See also: [Kraken JavaScript Example - How to subscribe to spot market data WebSocket stream](https://siebly.io/examples/Kraken/Spot/WebSockets/publicWs)

### 3. First private Spot WebSocket stream

<!-- siebly:snippet id="private-websocket" -->
```typescript
import { WebsocketClient, WS_KEY_MAP } from '@siebly/kraken-api';

const ws = new WebsocketClient({
  apiKey: process.env.API_SPOT_KEY!,
  apiSecret: process.env.API_SPOT_SECRET!,
});

ws.on('authenticated', (data) => console.log('authenticated', data?.wsKey));
ws.on('response', (data) => console.log('response', JSON.stringify(data)));
ws.on('message', (data) => console.log('message', JSON.stringify(data)));
ws.on('reconnected', (data) => console.log('reconnected', data?.wsKey));
ws.on('exception', console.error);

ws.subscribe(
  {
    topic: 'executions',
    payload: {
      snap_trades: true,
      snap_orders: true,
      order_status: true,
    },
  },
  WS_KEY_MAP.spotPrivateV2,
);

ws.subscribe(
  {
    topic: 'balances',
    payload: {},
  },
  WS_KEY_MAP.spotPrivateV2,
);
```

For private Spot v2 topics, the SDK can fetch and refresh the token for you. You do not need to manually fetch a token and inject it into every subscribe payload.

See also: [Kraken JavaScript Example - How to subscribe to spot account change WebSocket events](https://siebly.io/examples/Kraken/Spot/WebSockets/privateWs)

### 4. First Spot order over REST API

<!-- siebly:snippet id="spot-orders" -->
```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.API_SPOT_KEY!,
  apiSecret: process.env.API_SPOT_SECRET!,
});

async function placeOrder() {
  const result = await client.submitOrder({
    ordertype: 'limit',
    type: 'buy',
    pair: 'XBTUSD',
    volume: '0.0001',
    price: '10000',
    validate: true,
    cl_ord_id: client.generateNewOrderID(),
  });

  console.log(result);
}

placeOrder().catch(console.error);
```

Use `validate: true` when you want to validate the request shape without sending the live order. Remove `validate: true` when you are ready to submit.

See also: [Kraken JavaScript Example - How to submit spot orders](https://siebly.io/examples/Kraken/Spot/Private/submitOrder)

### 5. First Futures order

<!-- siebly:snippet id="futures-orders" -->
```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const client = new DerivativesClient({
  apiKey: process.env.API_FUTURES_KEY!,
  apiSecret: process.env.API_FUTURES_SECRET!,
  // testnet: true, // optional: route Derivatives REST calls to Kraken's demo environment
});

async function placeFuturesOrder() {
  const result = await client.submitOrder({
    orderType: 'lmt',
    symbol: 'PF_ETHUSD',
    side: 'buy',
    size: 0.01,
    limitPrice: 1000,
    cliOrdId: client.generateNewOrderID(),
  });

  console.log(result);
}

placeFuturesOrder().catch(console.error);
```

See also: [Kraken JavaScript Example - How to submit futures/derivatives orders](https://siebly.io/examples/Kraken/Derivatives/Private/submitOrder)

---

<!-- siebly:section id="kraken-spot-rest-api-in-javascript-and-typescript" -->
## Kraken Spot REST API in JavaScript and TypeScript

Most integrations start with Spot REST APIs because it is one of the simplest ways to test basic connectivity, such as querying account state and submitting orders.

### Create a public Spot client

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient();
```

Public calls do not require keys.

### Create a private Spot client

If you plan on making private API calls, include API keys when creating an instance of the SpotClient class:

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.API_SPOT_KEY!,
  apiSecret: process.env.API_SPOT_SECRET!,
});
```

### Common public Spot market data calls

```typescript
const serverTime = await client.getServerTime();
const systemStatus = await client.getSystemStatus();
const assetInfo = await client.getAssetInfo({ asset: 'XBT,ETH' });
const assetPairs = await client.getAssetPairs({ pair: 'XBTUSD,ETHUSD' });
const ticker = await client.getTicker({ pair: 'XBTUSD' });
const orderBook = await client.getOrderBook({ pair: 'XBTUSD', count: 10 });
const candles = await client.getCandles({ pair: 'XBTUSD', interval: 60 });
const recentTrades = await client.getRecentTrades({
  pair: 'XBTUSD',
  count: 10,
});
const recentSpreads = await client.getRecentSpreads({ pair: 'XBTUSD' });
```

### Common private Spot account calls

```typescript
const balance = await client.getAccountBalance();
const tradeBalance = await client.getTradeBalance();
const openOrders = await client.getOpenOrders();
const openOrdersWithTrades = await client.getOpenOrders({ trades: true });
const closedOrders = await client.getClosedOrders({
  trades: true,
  start: Math.floor(Date.now() / 1000) - 86400 * 7, // last 7 days
});
```

See also:

- [Kraken JavaScript Example - How to query spot market data](https://siebly.io/examples/Kraken/Spot/Public/marketData)
- [Kraken JavaScript Example - How to query Kraken spot account balances, orders & transactions](https://siebly.io/examples/Kraken/Spot/Private/account)
- [Kraken JavaScript Example - How to query, manage, amend & cancel spot orders](https://siebly.io/examples/Kraken/Spot/Private/orderManagement)

### Spot order examples

Market order:

```typescript
await client.submitOrder({
  ordertype: 'market',
  type: 'buy',
  volume: '0.01',
  pair: 'XBTUSD',
});
```

Limit order:

```typescript
await client.submitOrder({
  ordertype: 'limit',
  type: 'buy',
  volume: '0.0001',
  pair: 'XBTUSD',
  price: '10000',
});
```

Post-only limit order:

```typescript
await client.submitOrder({
  ordertype: 'limit',
  type: 'buy',
  volume: '0.001',
  pair: 'XBTEUR',
  price: '1000.00',
  oflags: 'post',
  timeinforce: 'GTC',
});
```

### Spot batch order management

If you want to stage multiple orders on one pair, batch APIs are a better fit than serially sending single orders.

```typescript
await client.submitBatchOrders({
  pair: 'XBTUSD',
  orders: [
    {
      ordertype: 'limit',
      type: 'buy',
      volume: '0.0001',
      price: '10000.00',
      timeinforce: 'GTC',
      // cl_ord_id: client.generateNewOrderID(), // optional: include a custom order ID before placing your order, for easier tracking
    },
    {
      ordertype: 'limit',
      type: 'sell',
      volume: '0.0001',
      price: '13000.00',
      timeinforce: 'GTC',
      // cl_ord_id: client.generateNewOrderID(), // optional: include a custom order ID before placing your order, for easier tracking
    },
  ],
});
```

Validate the batch without sending:

```typescript
await client.submitBatchOrders({
  pair: 'XBTUSD',
  validate: true,
  orders: [
    {
      ordertype: 'limit',
      type: 'buy',
      volume: '0.0001',
      price: '45000.00',
    },
    {
      ordertype: 'limit',
      type: 'sell',
      volume: '0.0001',
      price: '55000.00',
    },
  ],
});
```

See also: [Kraken JavaScript Example - How to submit spot orders via REST API](https://siebly.io/examples/Kraken/Spot/Private/submitOrder)

---

<!-- siebly:section id="kraken-websockets-in-javascript-public-and-private-streaming" -->
## Kraken WebSockets in JavaScript: public and private streaming

For long-running processes, WebSockets are key for staying in sync with market data & account state changes. Latency-sensitive systems should subscribe & react to event-driven market & account updates, rather than depending on REST API polling at regular intervals.

> After subscribing to the topics needed by your system, persistent WebSocket connections will provide real-time updates on any changes to your subscribed topics. Stay informed on new market data as it becomes available. Immediately process and react to any account state changes, such as an order state change or fill. Integrating an event-driven design pattern with WebSockets will both reduce your latency and provide much higher capacity for making API calls within the available rate limits.

The Siebly Kraken JavaScript SDK's WebsocketClient handles most of the complexity of working with WebSockets for you. All you need to do is:

- Create an instance of the WebsocketClient.
- Provide read-only API keys, if private topics are required. Market data does not require API keys.
- Ask the WebsocketClient to subscribe to the topics you're interested in.

The SDK handles the connection work for you:

- Open WebSocket connections to the correct domains & endpoints.
- Use your provided proxy, if desired & configured.
- Prepare & dispatch events to authenticate, if needed.
- Prepare & dispatch events to subscribe to the topics you have requested.
- Monitor active WebSocket connections with regular heartbeats. As soon as a potential disconnect is detected (heartbeat timeout), the SDK will automatically:
  - Emit a `reconnecting` event, informing you this process has started.
    - This is a good time to pause any risky commands until the connection is restored (order management).
  - Teardown the stale connection.
  - Open a new WebSocket connection.
    - Re-authenticate if needed.
    - Re-subscribe to the topics you were subscribed to.
  - Emit a `reconnected` event, informing you this process has completed.
    - This is a good time to query the REST API for any changes you might have missed while disconnected.

### `WebsocketClient` events you will actually care about

| Event           | Meaning                                           |
| --------------- | ------------------------------------------------- |
| `open`          | Connection established                            |
| `message`       | Streaming data received                           |
| `response`      | Subscribe, unsubscribe, and auth acknowledgements |
| `reconnecting`  | Connection dropped and retrying                   |
| `reconnected`   | Connection restored and subscriptions resynced    |
| `close`         | Socket closed                                     |
| `authenticated` | Private auth succeeded                            |
| `exception`     | Errors and unexpected conditions                  |

### Understanding `WS_KEY_MAP`

[`WS_KEY_MAP`](/reference/glossary#ws-key) tells the SDK which Kraken WebSocket endpoint family to use:

- `spotPublicV2`
- `spotPrivateV2`
- `spotL3V2`
- `derivativesPublicV1`
- `derivativesPrivateV1`

> This matters because different product groups and topic families do not all live on the same connection endpoint. These keys act as primary keys, similar to a database, to uniquely identify a dedicated connection group.

### Public Spot WebSocket topics

```typescript
ws.subscribe(
  {
    topic: 'ticker',
    payload: { symbol: ['BTC/USD', 'ETH/USD'] },
  },
  WS_KEY_MAP.spotPublicV2,
);

ws.subscribe(
  {
    topic: 'trade',
    payload: { symbol: ['BTC/USD'] },
  },
  WS_KEY_MAP.spotPublicV2,
);

ws.subscribe(
  {
    topic: 'ohlc',
    payload: {
      symbol: ['BTC/USD'],
      interval: 1,
    },
  },
  WS_KEY_MAP.spotPublicV2,
);
```

You can also batch multiple subscriptions that share the same `WsKey`, by sending an array of WebSocket topics:

```typescript
ws.subscribe(
  [
    { topic: 'ticker', payload: { symbol: ['BTC/USD'] } },
    { topic: 'trade', payload: { symbol: ['BTC/USD'] } },
    {
      topic: 'instrument',
      payload: {
        symbol: ['BTC/USD'],
        include_tokenized_assets: true,
      },
    },
  ],
  WS_KEY_MAP.spotPublicV2,
);
```

### Private Spot WebSocket topics

The SDK can authenticate and manage private Spot streams for you:

```typescript
import { WebsocketClient, WS_KEY_MAP } from '@siebly/kraken-api';

const ws = new WebsocketClient({
  apiKey: process.env.API_SPOT_KEY!,
  apiSecret: process.env.API_SPOT_SECRET!,
});

ws.subscribe(
  {
    topic: 'executions',
    payload: {
      snap_trades: true,
      snap_orders: true,
      order_status: true,
      ratecounter: true,
    },
  },
  WS_KEY_MAP.spotPrivateV2,
);

ws.subscribe(
  {
    topic: 'balances',
    payload: {},
  },
  WS_KEY_MAP.spotPrivateV2,
);

ws.subscribe(
  {
    topic: 'level3',
    payload: {
      symbol: ['BTC/USD'],
    },
  },
  WS_KEY_MAP.spotL3V2,
);
```

The Level 3 order book is a special case. It uses the dedicated L3 endpoint, so `spotL3V2` matters.

See also:

- [Kraken JavaScript Example - How to subscribe to & consume spot market data events](https://siebly.io/examples/Kraken/Spot/WebSockets/publicWs)
- [Kraken JavaScript Example - How to subscribe to & consume private spot account events](https://siebly.io/examples/Kraken/Spot/WebSockets/privateWs)

---

<!-- siebly:section id="spot-websocket-api-commands-with-websocketapiclient" -->
## Spot WebSocket API commands with `WebsocketAPIClient`

Kraken supports authenticated Spot command workflows, such as order management, over a persistent WebSocket connection. While each REST API call requires a new connection to be opened & signed per API call, the WebSocket API allows a persistent WebSocket connection to be opened & authenticated once, and then reused for any WS-API commands sent by your system. This can reduce latency for workflows where a persistent command channel is a better fit than REST alone.

If that model fits your system, `WebsocketAPIClient` gives you REST-like methods over the WebSocket API.

> This utility class is wrapped around the Siebly Kraken JavaScript SDK's WebsocketClient. A persistent WebSocket API connection is automatically opened and managed as needed. Any API calls made via the WebsocketAPIClient are conveniently wrapped in JavaScript promises. This allows for much simpler asynchronous design patterns that feel very much like a REST API, with all the benefits of a persistent WebSocket API connection.

Make a WebSocket API request via a simple function call. Await the result. All of the speed with significantly less complexity.

```typescript
import { WebsocketAPIClient } from '@siebly/kraken-api';

const wsApi = new WebsocketAPIClient({
  apiKey: process.env.API_SPOT_KEY!,
  apiSecret: process.env.API_SPOT_SECRET!,
});

wsApi.getWSClient().on('open', (data) => {
  console.log('ws api open', data?.wsKey);
});

wsApi.getWSClient().on('exception', console.error);

const order = await wsApi.submitSpotOrder({
  order_type: 'limit',
  side: 'buy',
  limit_price: 26500.4,
  order_qty: 1.2,
  symbol: 'BTC/USD',
});

await wsApi.amendSpotOrder({
  order_id: 'TEST-ORDER-ID',
  order_qty: 1.5,
  limit_price: 27000,
});

await wsApi.cancelSpotOrder({
  order_id: ['TEST-ORDER-ID'],
});

await wsApi.cancelAllSpotOrders();
```

Other supported Spot WebSocket API flows include:

- conditional Spot orders
- trigger-style orders
- batch Spot order submission
- batch Spot order cancellation
- cancel-all-after timeout handling

See also: [Kraken JavaScript Example - How to send/manage low-latency spot orders via the WebSocket API](https://siebly.io/examples/Kraken/Spot/WebSockets/wsAPI#L64)

Refer to the Kraken API documentation for a detailed list of available WebSocket API capabilities.

---

<!-- siebly:section id="kraken-futures-api-in-nodejs-and-typescript" -->
## Kraken Futures API in Node.js and TypeScript

While it looks & feels similar, Kraken's Derivatives use a different REST API surface and different request naming conventions than the Kraken Spot APIs. The [`@siebly/kraken-api` JavaScript Kraken SDK](https://www.npmjs.com/package/@siebly/kraken-api) manages this complexity for you, so you can focus on building & integrating your workflows.

Usage is similar to Spot. Create an instance of the utility class dedicated to the Kraken Derivatives API, the DerivativesClient. Provide your API keys if private API calls are desired. Call & await functions corresponding to the REST API endpoint you would like to use.

Detailed request building, routing & authentication are all handled under the hood by the SDK. Below are curated examples for common scenarios.

### Create a public Futures client

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const client = new DerivativesClient();
```

### Create a private Futures client

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const client = new DerivativesClient({
  apiKey: process.env.API_FUTURES_KEY!,
  apiSecret: process.env.API_FUTURES_SECRET!,
  // testnet: true, // optional: route Derivatives REST API calls to Kraken's demo environment
});
```

### Common public Futures market data calls

```typescript
const allTickers = await client.getTickers();
const ticker = await client.getTicker({ symbol: 'PF_ETHUSD' });
const orderBook = await client.getOrderbook({ symbol: 'PF_ETHUSD' });
const instruments = await client.getInstruments();
const feeSchedules = await client.getFeeSchedules();
const candles = await client.getCandles({
  tickType: 'trade',
  symbol: 'PF_ETHUSD',
  resolution: '1h',
});
```

You can also query recent public trade-style events:

```typescript
const executions = await client.getPublicExecutionEvents({
  tradeable: 'PF_ETHUSD',
});
```

See also: [Kraken JavaScript Example - How to query derivatives market data](https://siebly.io/examples/Kraken/Derivatives/Public/marketData)

### Futures order examples

Limit order:

```typescript
await client.submitOrder({
  orderType: 'lmt',
  symbol: 'PF_ETHUSD',
  side: 'buy',
  size: 0.01,
  limitPrice: 1000,
  cliOrdId: client.generateNewOrderID(),
});
```

Market order:

```typescript
await client.submitOrder({
  orderType: 'mkt',
  symbol: 'PF_ETHUSD',
  side: 'sell',
  size: 0.01,
});
```

Post-only and reduce-only:

```typescript
await client.submitOrder({
  orderType: 'post',
  symbol: 'PF_ETHUSD',
  side: 'buy',
  size: 0.01,
  limitPrice: 1000,
  cliOrdId: client.generateNewOrderID(),
});

await client.submitOrder({
  orderType: 'lmt',
  symbol: 'PF_ETHUSD',
  side: 'sell',
  size: 1,
  limitPrice: 1000,
  reduceOnly: true,
});
```

Batch order management:

```typescript
await client.batchOrderManagement({
  json: {
    batchOrder: [
      {
        order: 'send',
        order_tag: 'order-1',
        orderType: 'lmt',
        symbol: 'PF_ETHUSD',
        side: 'buy',
        size: 0.01,
        limitPrice: 1000,
        cliOrdId: client.generateNewOrderID(),
      },
    ],
  },
});
```

See also: [Kraken JavaScript Example - How to submit derivatives/futures orders](https://siebly.io/examples/Kraken/Derivatives/Private/submitOrder)

---

<!-- siebly:section id="kraken-futures-websockets-in-javascript" -->
## Kraken Futures WebSockets in JavaScript

For subscribing to futures/derivatives market & account data in JavaScript (& Node.js), the SDK automatically handles this as well via the same `WebsocketClient` utility class.

```typescript
import { WebsocketClient, WS_KEY_MAP } from '@siebly/kraken-api';

const ws = new WebsocketClient();

ws.on('open', (data) => console.log('connected', data?.wsKey));
ws.on('message', (data) => console.log('message', JSON.stringify(data)));
ws.on('reconnected', (data) => console.log('reconnected', data?.wsKey));
ws.on('exception', console.error);

ws.subscribe(
  {
    topic: 'trade',
    payload: {
      product_ids: ['PI_XBTUSD', 'PI_ETHUSD'],
    },
  },
  WS_KEY_MAP.derivativesPublicV1,
);
```

See also:

- [Kraken JavaScript Example - How to subscribe to derivatives/futures account change WebSocket events](https://siebly.io/examples/Kraken/Derivatives/WebSockets/privateWs)
- [Kraken JavaScript Example - How to subscribe to derivatives/futures market data WebSocket events](https://siebly.io/examples/Kraken/Derivatives/WebSockets/publicWs)

---

<!-- siebly:section id="proxies" -->
## Proxies for REST API and WebSocket

Use a proxy when a deployment needs a fixed egress IP, must cross an approved corporate network, or has a controlled network failover path. A proxy does not change Kraken account eligibility, select Spot or Futures, or make Spot credentials valid for Futures.

The broader [Using proxy with Siebly SDKs](https://siebly.io/blog/using-proxy-with-siebly-sdks) article covers the shared constructor pattern. Kraken private Spot connections need one extra setting because the SDK fetches a WebSocket token through the Spot REST API before sending an authenticated subscription or WebSocket API command.

Proxy agents are a Node.js networking feature. Browser applications cannot select a raw socket agent.

### HTTP or HTTPS proxy

Install the agent:

```bash
npm install @siebly/kraken-api https-proxy-agent
```

Set `KRAKEN_PROXY_URL` to the full proxy URL, including URL-encoded credentials when required.

This public check sends one Spot REST API call and one public Spot WebSocket subscription through the same proxy:

<!-- siebly:snippet id="http-proxy" -->

```typescript
import { HttpsProxyAgent } from 'https-proxy-agent';
import {
  SpotClient,
  WebsocketClient,
  WS_KEY_MAP,
} from '@siebly/kraken-api';

const proxyUrl = process.env.KRAKEN_PROXY_URL;

if (!proxyUrl) {
  throw new Error('Set KRAKEN_PROXY_URL before running this example.');
}

const proxyAgent = new HttpsProxyAgent(proxyUrl);

const rest = new SpotClient(
  {},
  {
    httpsAgent: proxyAgent,
    proxy: false,
  },
);

const ws = new WebsocketClient({
  wsOptions: {
    agent: proxyAgent,
  },
});

ws.on('open', ({ wsKey }) => {
  console.log('WebSocket connected through proxy:', wsKey);
});
ws.on('message', (event) => {
  console.log('stream update', event);
});
ws.on('exception', console.error);

async function main() {
  const serverTime = await rest.getServerTime();
  console.log('REST API connected through proxy:', serverTime);

  ws.subscribe(
    {
      topic: 'ticker',
      payload: {
        symbol: ['BTC/USD'],
      },
    },
    WS_KEY_MAP.spotPublicV2,
  );
}

process.once('SIGINT', () => {
  ws.closeAll();
});

main().catch(console.error);
```

REST API networking options belong in the second constructor argument for `SpotClient` and `DerivativesClient`:

- `httpsAgent` sends the HTTPS request through the agent.
- `proxy: false` prevents Axios from applying another proxy configuration on top of that agent.

WebSocket networking options belong in `wsOptions.agent`.

Public Spot and Futures streams only need the socket agent. Private Futures streams also only need the socket agent because Futures authentication uses a signed challenge sent over the WebSocket.

### Private Spot streams and WebSocket API through a proxy

Private Spot subscriptions, Spot Level 3 subscriptions, and `WebsocketAPIClient` commands fetch a Spot WebSocket token through REST API. Configure both network paths:

- `wsOptions.agent` for the WebSocket
- `requestOptions` for the Axios-backed token request

This example authenticates a private Spot stream and the Spot WebSocket API without placing an order:

<!-- siebly:snippet id="private-proxy" -->

```typescript
import { HttpsProxyAgent } from 'https-proxy-agent';
import {
  WebsocketAPIClient,
  WebsocketClient,
  WS_KEY_MAP,
} from '@siebly/kraken-api';

const proxyUrl = process.env.KRAKEN_PROXY_URL;

if (!proxyUrl) {
  throw new Error('Set KRAKEN_PROXY_URL before running this example.');
}

const apiKey = process.env.KRAKEN_SPOT_API_KEY;
const apiSecret = process.env.KRAKEN_SPOT_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error(
    'Set KRAKEN_SPOT_API_KEY and KRAKEN_SPOT_API_SECRET before running this example.',
  );
}

const proxyAgent = new HttpsProxyAgent(proxyUrl);
const proxyRequestOptions = {
  httpsAgent: proxyAgent,
  proxy: false as const,
};
const credentials = { apiKey, apiSecret };

const streams = new WebsocketClient({
  ...credentials,
  wsOptions: {
    agent: proxyAgent,
  },
  requestOptions: proxyRequestOptions,
});

const wsApi = new WebsocketAPIClient({
  ...credentials,
  attachEventListeners: false,
  wsOptions: {
    agent: proxyAgent,
  },
  requestOptions: proxyRequestOptions,
});
const wsApiConnection = wsApi.getWSClient();

streams.on('authenticated', ({ wsKey }) => {
  console.log('Private Spot stream authenticated:', wsKey);
});
streams.on('exception', console.error);
wsApiConnection.on('authenticated', ({ wsKey }) => {
  console.log('Spot WebSocket API authenticated:', wsKey);
});
wsApiConnection.on('exception', console.error);

async function main() {
  streams.subscribe(
    {
      topic: 'executions',
      payload: {
        snap_trades: true,
        snap_orders: true,
      },
    },
    WS_KEY_MAP.spotPrivateV2,
  );

  await wsApiConnection.connectWSAPI(WS_KEY_MAP.spotPrivateV2);
  console.log('Private Spot connections are ready');
}

process.once('SIGINT', () => {
  streams.closeAll();
  wsApiConnection.closeAll();
});

main().catch(console.error);
```

A private Futures stream does not fetch a REST API token. Its proxy configuration only needs the socket agent:

```typescript
const futuresWs = new WebsocketClient({
  apiKey: process.env.KRAKEN_FUTURES_API_KEY!,
  apiSecret: process.env.KRAKEN_FUTURES_API_SECRET!,
  wsOptions: {
    agent: proxyAgent,
  },
});
```

### SOCKS5 proxy

Install the SOCKS agent:

```bash
npm install @siebly/kraken-api socks-proxy-agent
```

Use `SocksProxyAgent` in the same REST API and WebSocket positions:

<!-- siebly:snippet id="socks-proxy" -->

```typescript
import {
  SpotClient,
  WebsocketClient,
  WS_KEY_MAP,
} from '@siebly/kraken-api';
import { SocksProxyAgent } from 'socks-proxy-agent';

const proxyUrl = process.env.KRAKEN_SOCKS_PROXY_URL;

if (!proxyUrl) {
  throw new Error('Set KRAKEN_SOCKS_PROXY_URL before running this example.');
}

const proxyAgent = new SocksProxyAgent(proxyUrl);

const rest = new SpotClient(
  {},
  {
    httpsAgent: proxyAgent,
    proxy: false,
  },
);

const ws = new WebsocketClient({
  wsOptions: {
    agent: proxyAgent,
  },
});

async function main() {
  const serverTime = await rest.getServerTime();
  console.log('REST API connected through SOCKS5:', serverTime);

  ws.subscribe(
    {
      topic: 'trade',
      payload: {
        symbol: ['BTC/USD'],
      },
    },
    WS_KEY_MAP.spotPublicV2,
  );
}

process.once('SIGINT', () => {
  ws.closeAll();
});

main().catch(console.error);
```

### Proxy checks

- Keep proxy URLs and credentials in environment variables or a secret manager.
- URL-encode usernames and passwords when constructing a proxy URL from separate values.
- Make sure the proxy egress IP matches the Kraken API key's IP whitelist.
- Test a public REST API call and public WebSocket subscription before private authentication.
- Confirm that private Spot token requests and their WebSockets use the same intended network path.
- Keep Spot and Futures credentials, clients, and authentication paths separate.
- Measure request, connection, token-fetch, and reconnect latency through the proxy.
- Treat repeated HTTP 407 responses, TLS errors, token-fetch failures, and WebSocket reconnect loops as network failures.
- Keep the host clock synchronized. Proxy latency does not change how Kraken signatures are calculated.
- The SDK does not rotate proxy endpoints. Handle endpoint selection outside the client when rotation is required.

---

<!-- siebly:section id="production-notes-for-api-integrations" -->
## Production notes for API integrations

This is where SDKs usually earn their keep: not in the first successful request, but in the repeatable behavior around retries, reconnects, logging, and safe rollout.

### 1. Use client-generated order IDs

For Spot, use `cl_ord_id`. For Futures, use `cliOrdId`. This makes retries and reconciliation safer.

```typescript
const orderIdForEntry1 = client.generateNewOrderID();

const result = await client.submitOrder({
  ordertype: 'limit',
  type: 'buy',
  pair: 'XBTUSD',
  volume: '0.0001',
  price: '10000',
  validate: true,
  cl_ord_id: orderIdForEntry1,
});

console.log(result);

// Detect entry 1 has filled, by looking for an order fill with cl_ord_id === orderIdForEntry1 either via REST API or async WebSocket updates.
```

### 2. Treat reconnects as a normal condition

Listen for `reconnecting` and `reconnected`. A dropped connection is not the exceptional case in production. Recovery behavior is part of the design. WebSockets can be unstable, especially during volatility.

The important part is detecting issues early (handled by SDK), promptly reconnecting (handled by SDK), and ensuring your system remains in sync when the SDK emits a `reconnected` event (up to your implementation).

### 3. Start public, then validate private, then change state carefully

The lowest-friction rollout path is:

1. Public REST APIs
2. Public WebSockets
3. Private read-only REST APIs
4. Private account streams
5. Validated write requests where supported
6. Small live write tests only if your workflow needs them

If using WebSockets for updates, integrate a backfill workflow after connecting:

1. Connect and subscribe to WebSocket topics, but pause processing incoming data (drop data as it arrives)
2. Backfill any missing data via REST API (hydrate internal state).
3. Once backfill is complete, enable processing incoming data.

This ensures your system has the full history it needs before it starts processing new market & account updates.

### 4. Keep Spot and Futures credentials separate

Do not blur product boundaries in your code or secrets management. Spot and Futures use different credentials and different request models.

### 5. Watch symbol conventions carefully

Spot & Futures do not use the same symbol formatting. Treat symbols as product-specific inputs, not one universal string format. If needed, build your own solution to normalise outgoing & incoming symbols into a format your system can consistently work with.

### 6. Protect your API keys

- Treat your API keys like passwords. Keep them safe. Do not share them.
- Rotate API keys regularly.
- Use the minimum permissions on your API keys based on your needs. Active trading does not require withdrawal permissions. Analytics does not require trading permissions.
- Use IP whitelists to prevent API keys from being used outside your environment.

### 7. Inject your own logger if needed

If you want to integrate SDK logs into your own monitoring stack:

```typescript
import { WebsocketClient, DefaultLogger, LogParams } from '@siebly/kraken-api';

const customLogger: DefaultLogger = {
  trace: (..._params: LogParams) => {},
  info: (...params: LogParams) => console.log(...params),
  error: (...params: LogParams) => console.error(...params),
};

const ws = new WebsocketClient({}, customLogger);
```

See also: [Kraken JavaScript Example - How to subscribe to spot market data with WebSockets](https://siebly.io/examples/Kraken/Spot/WebSockets/publicWs)

---

<!-- siebly:section id="troubleshooting-common-kraken-javascript-integration-problems" -->
## Troubleshooting common Kraken JavaScript integration problems

Most early Kraken API issues are not SDK installation problems. They are usually auth, product boundary, symbol, or lifecycle issues. Start here when the first example works but the next workflow does not.

| Problem                                                        | Likely cause                                                                                                  | Fix                                                                                                                                                                       |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public REST works, private REST fails                          | API key is missing, loaded under the wrong environment variable, or belongs to the wrong Kraken product group | Log which key names are present, not the secret values. Confirm Spot keys are used with `SpotClient` and Futures keys are used with `DerivativesClient`.                  |
| Private WebSocket never authenticates                          | Private stream credentials are missing or the wrong `WS_KEY_MAP` entry is used                                | Use Spot credentials with `WS_KEY_MAP.spotPrivateV2`. Use derivatives credentials with derivatives WebSocket keys.                                                        |
| Proxied socket opens, but private Spot authentication fails    | The Spot WebSocket token request is not using the proxy                                                        | Set `requestOptions` with the same agent used by `wsOptions.agent`, then confirm the REST API token request succeeds through the intended egress IP.                        |
| Market data request returns an unexpected pair or symbol error | Spot and Futures symbols use different formats                                                                | Treat symbols as product-specific inputs. Do not reuse one normalized symbol string across Spot REST, Futures REST, and WebSocket payloads without mapping it first.      |
| WebSocket process reconnects and the app state looks stale     | The connection recovered, but the app did not backfill missed state                                           | Listen for `reconnected`, then query REST for the latest balances, orders, or market state before resuming normal processing.                                             |
| Order request is rejected                                      | Size, price, pair, permission, or order type is invalid for that market                                       | Use `validate: true` for Spot orders while testing. Log sanitized request fields and compare them with the market's minimum size, precision, and permission requirements. |
| Retries create confusing order tracking                        | The integration does not assign client-generated IDs                                                          | Use `cl_ord_id` for Spot and `cliOrdId` for Futures so retries and reconciliation can be tied back to your own request IDs.                                               |
| The code works locally but fails in deployment                 | Environment variables or secret loading differ between local and production                                   | Make env loading explicit, fail fast when required private keys are absent, and keep public-only examples free of private client construction.                            |

If a public REST request fails, debug connectivity, package installation, or runtime configuration first. If public REST works and private calls fail, debug credentials and permissions next. If REST works but WebSockets fail, debug event handling, `WS_KEY_MAP`, reconnect behavior, and private stream authentication.

---

<!-- siebly:section id="why-use-a-javascript-sdk-for-krakens-apis-websockets" -->
## Why use a JavaScript SDK for Kraken's APIs & WebSockets?

If you are evaluating SDKs rather than just copying a few snippets, these are the practical reasons this SDK tends to matter:

- One Kraken JavaScript SDK for Spot REST APIs, Futures REST APIs, and WebSockets.
- Cleaner onboarding for Node.js and JavaScript developers.
- One snippet now can become hundreds of fragile snippets.
- Less low-value exchange plumbing in your codebase. Less to maintain, less that can break, fewer distractions.
- Stable connectivity with automated integration tests & thousands of daily users.
- Faster integration than building raw API connectivity with correctly crafted request signatures.
- Faster iteration when moving from public data to private API flows.
- Better fit for bots, dashboards, and internal tooling than raw request signing examples.
- A maintained SDK with examples, endpoint references, and a wider SDK ecosystem from [Siebly.io](https://siebly.io)

---

<!-- siebly:section id="faq" -->
## FAQ

**Do I need separate keys for Spot and Futures?**
Yes. Treat Spot and Futures as separate products with separate API credentials. These can be managed within your Kraken account.

**Why both `WebsocketClient` and `WebsocketAPIClient`?**

- `WebsocketClient` is for subscriptions and streaming topics.
- `WebsocketAPIClient` is for Spot commands over Kraken's WebSocket API. Think "REST API" but via low-latency WebSockets.

**Does the SDK handle private authentication?**
Yes. All authentication for both REST APIs & WebSockets will be handled automatically using the underlying SDK architecture. Connectivity & authentication are both managed for you, so you can focus on integrating your system and making the API calls that you need.

**What happens if the connection drops?**
The SDK supports reconnect and resubscribe flows. Listen for `reconnecting` and `reconnected`.

The `reconnecting` event is a good trigger to pause any risky actions until the connection is restored & ready (cancel orders and prevent new orders).

The `reconnected` event is a good trigger to query the REST API for any out-of-sync account & market state before resuming normal private workflows (e.g. restore cancelled orders, resume paused order placement as desired).

**Can I use this Kraken API SDK in TypeScript projects?**
Yes. The package is TypeScript-first and publishes type declarations.

**Do I need TypeScript to use this JavaScript Kraken SDK?**
Pure JavaScript projects (including Node.js & Bun) can use this SDK too. TypeScript type declarations are included (and will help while working with the SDK in your IDE), but TypeScript is not required to use this [JavaScript SDK for Kraken](https://siebly.io/sdk/kraken/javascript).

**Can I use this package in both ESM and CommonJS projects?**
Yes. The package supports both. It is built & published to npm as a hybrid project. Your project will automatically import the correct bundle, due to the configuration in the SDK's package.json.

**Does this guide cover every SDK method?**
Yes, complete API coverage is expected across all available product groups in Kraken's API offering, both for REST APIs & WebSockets. We regularly monitor the API for changes & regularly keep the [Siebly JavaScript SDK for Kraken](https://siebly.io/sdk/kraken/javascript) up to date. If any functionality happens to be missing or out of date, please get in touch by [opening an issue on GitHub](https://github.com/sieblyio/kraken-api/issues).

For full method coverage, see:

- [List of all available Kraken APIs and the JavaScript method to call them](https://siebly.io/sdk/kraken/javascript#endpoint-reference)
- [Siebly SDK examples index](https://siebly.io/examples)

---

<!-- siebly:section id="next-steps" -->
## Next steps

If you want to learn more about integrating with Kraken's APIs & WebSockets:

- Start from the indexable Kraken SDK guide: [Kraken JavaScript SDK guide](https://siebly.io/sdk/kraken/javascript)
- Review the Kraken package overview: [Kraken SDK overview](https://siebly.io/sdk/kraken)
- Compare exchange SDKs: [Siebly SDK directory](https://siebly.io/sdk)
- Review key and package guidance: [Siebly security and release integrity](https://siebly.io/security)
- Explore the [Kraken JavaScript examples on GitHub](https://github.com/sieblyio/kraken-api/tree/main/examples)
- Review the full endpoint list: [Kraken JavaScript endpoint reference](https://siebly.io/sdk/kraken/javascript#endpoint-reference)
- Check the Siebly JavaScript SDK for Kraken on npm: [`@siebly/kraken-api`](https://www.npmjs.com/package/@siebly/kraken-api)
- Browse the source code of the Siebly JavaScript SDK for Kraken on GitHub: [`sieblyio/kraken-api`](https://github.com/sieblyio/kraken-api)
- Explore the wider SDK ecosystem: [Siebly.io](https://siebly.io)
