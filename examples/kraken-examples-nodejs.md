# **Kraken API Examples** - Node.js, JavaScript & TypeScript SDK for Kraken Spot & Derivatives REST APIs & WebSockets

This page collects short, copy-ready examples for `@siebly/kraken-api`, the Node.js, JavaScript and TypeScript SDK for the Kraken Spot REST API, Kraken Derivatives (Futures) REST API, WebSocket v2 subscriptions, the Futures WebSocket and the Spot WebSocket API. Each snippet is a complete file. Runnable versions live in [examples/Spot](./Spot/) and [examples/Derivatives](./Derivatives/), and there is one small example per endpoint in [examples/apidoc](./apidoc/).

- [Kraken API documentation](https://docs.kraken.com/api/) - official Kraken API docs
- [SDK docs](https://sieblyio.github.io/docs/kraken/) - guides and the full API reference
- [JavaScript tutorial](https://siebly.io/sdk/kraken/javascript/tutorial) - a longer walkthrough

## Installation

```bash
npm install @siebly/kraken-api
```

The SDK works with `import` and `require`, and ships its own TypeScript types.

## Which client do I need?

| Client | Use it for |
| --- | --- |
| `SpotClient` | Spot REST API: market data, balances, orders, ledgers, deposits and withdrawals, Earn |
| `DerivativesClient` | Kraken Futures REST API: tickers, order book, candles, orders, positions, fills, transfers |
| `WebsocketClient` | Streaming: Spot WebSocket v2 (public, private, level3) and Futures WebSocket v1 (public, private) |
| `WebsocketAPIClient` | Awaitable Spot order requests over the WebSocket API (add, amend, cancel, batch) |

Spot and Futures use separate API keys. Create Spot keys in Kraken Pro settings and Futures keys in the Futures settings.

## Create a client

### Public Spot client (no key)

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient();
```

### Private Spot client

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.KRAKEN_SPOT_API_KEY!,
  apiSecret: process.env.KRAKEN_SPOT_API_SECRET!, // the base64 private key from Kraken
});
```

### Public and private Derivatives (Futures) clients

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

// Public market data, no key needed
const publicClient = new DerivativesClient();

// Private calls use a Futures API key
const privateClient = new DerivativesClient({
  apiKey: process.env.KRAKEN_FUTURES_API_KEY!,
  apiSecret: process.env.KRAKEN_FUTURES_API_SECRET!,
});
```

Note: Kraken retired the Futures demo environment on 14 July 2026 and Spot has never had a testnet, so there is no `testnet` option to set. Setting `testnet: true` throws.

### CommonJS (require)

```javascript
const { SpotClient } = require('@siebly/kraken-api');

const client = new SpotClient();

client.getTicker({ pair: 'XBTUSD' }).then((res) => console.log(res.result));
```

## Spot market data

### Server time and system status

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient();

async function main() {
  const time = await client.getServerTime();
  console.log('Server time:', time.result);

  const status = await client.getSystemStatus();
  console.log('System status:', status.result);
}

main().catch(console.error);
```

### Ticker for one or more pairs

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient();

async function main() {
  const res = await client.getTicker({ pair: 'XBTUSD,ETHUSD' });

  // Kraken returns its own pair keys, e.g. XXBTZUSD for XBTUSD
  for (const [pair, ticker] of Object.entries(res.result)) {
    console.log(pair, 'last:', ticker.c[0], 'bid:', ticker.b[0], 'ask:', ticker.a[0]);
  }
}

main().catch(console.error);
```

### Order book

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient();

async function main() {
  const res = await client.getOrderBook({ pair: 'XBTUSD', count: 10 });
  const book = Object.values(res.result)[0];

  console.log('Best bid:', book.bids[0]);
  console.log('Best ask:', book.asks[0]);
}

main().catch(console.error);
```

### OHLC candles

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient();

async function main() {
  // interval is in minutes: 1, 5, 15, 30, 60, 240, 1440, 10080, 21600
  const res = await client.getCandles({ pair: 'XBTUSD', interval: 60 });
  console.log(res.result);
}

main().catch(console.error);
```

### Recent trades and spreads

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient();

async function main() {
  const trades = await client.getRecentTrades({ pair: 'XBTUSD', count: 10 });
  console.log('Recent trades:', trades.result);

  const spreads = await client.getRecentSpreads({ pair: 'XBTUSD' });
  console.log('Recent spreads:', spreads.result);
}

main().catch(console.error);
```

### Asset info and tradable pairs

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient();

async function main() {
  const assets = await client.getAssetInfo({ asset: 'XBT,ETH' });
  console.log('Assets:', assets.result);

  // Pair metadata: decimals, lot sizes, ordermin, costmin, status
  const pairs = await client.getAssetPairs({ pair: 'XBTUSD,ETHUSD' });
  console.log('Pairs:', pairs.result);
}

main().catch(console.error);
```

## Spot account

### Balances

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.KRAKEN_SPOT_API_KEY!,
  apiSecret: process.env.KRAKEN_SPOT_API_SECRET!,
});

async function main() {
  const balances = await client.getAccountBalance();
  console.log('Balances:', balances.result);

  // Includes amounts held in open orders
  const extended = await client.getExtendedBalance();
  console.log('Extended balances:', extended.result);

  const tradeBalance = await client.getTradeBalance();
  console.log('Trade balance:', tradeBalance.result);
}

main().catch(console.error);
```

### Open and closed orders

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.KRAKEN_SPOT_API_KEY!,
  apiSecret: process.env.KRAKEN_SPOT_API_SECRET!,
});

async function main() {
  const open = await client.getOpenOrders();
  console.log('Open orders:', open.result.open);

  const closed = await client.getClosedOrders();
  console.log('Closed orders:', closed.result.closed);
}

main().catch(console.error);
```

### Trade history and ledgers

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.KRAKEN_SPOT_API_KEY!,
  apiSecret: process.env.KRAKEN_SPOT_API_SECRET!,
});

async function main() {
  const trades = await client.getTradesHistory();
  console.log('Trades:', trades.result);

  // Ledger list with filters (Kraken "Get Ledgers Info", POST /0/private/Ledgers)
  const ledgers = await client.getLedgersInfo({ asset: 'XBT', type: 'deposit' });
  console.log('Ledgers:', ledgers.result);

  // Look up specific ledger entries by ID (Kraken "Query Ledgers")
  // const entries = await client.getLedgers({ id: 'LUI2RA-CJFLB-EN5I4P' });
}

main().catch(console.error);
```

## Spot trading

### Limit order with a client order ID

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.KRAKEN_SPOT_API_KEY!,
  apiSecret: process.env.KRAKEN_SPOT_API_SECRET!,
});

async function main() {
  const res = await client.submitOrder({
    pair: 'XBTUSD',
    type: 'buy',
    ordertype: 'limit',
    volume: '0.0001',
    price: '10000',
    timeinforce: 'GTC',
    cl_ord_id: client.generateNewOrderID(),
  });
  console.log('Order:', res.result);
}

main().catch(console.error);
```

### Market order

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.KRAKEN_SPOT_API_KEY!,
  apiSecret: process.env.KRAKEN_SPOT_API_SECRET!,
});

async function main() {
  const res = await client.submitOrder({
    pair: 'XBTUSD',
    type: 'buy',
    ordertype: 'market',
    volume: '0.0001',
    cl_ord_id: client.generateNewOrderID(),
  });
  console.log('Order:', res.result);
}

main().catch(console.error);
```

### Post-only order and validate-only order

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.KRAKEN_SPOT_API_KEY!,
  apiSecret: process.env.KRAKEN_SPOT_API_SECRET!,
});

async function main() {
  // Maker only: rejected instead of taking liquidity
  const postOnly = await client.submitOrder({
    pair: 'XBTUSD',
    type: 'buy',
    ordertype: 'limit',
    volume: '0.0001',
    price: '10000',
    oflags: 'post',
    cl_ord_id: client.generateNewOrderID(),
  });
  console.log('Post-only:', postOnly.result);

  // validate: true checks the order without placing it
  const check = await client.submitOrder({
    pair: 'XBTUSD',
    type: 'sell',
    ordertype: 'limit',
    volume: '0.0001',
    price: '500000',
    validate: true,
  });
  console.log('Validation:', check.result);
}

main().catch(console.error);
```

### Batch orders (2 to 15, same pair)

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.KRAKEN_SPOT_API_KEY!,
  apiSecret: process.env.KRAKEN_SPOT_API_SECRET!,
});

async function main() {
  const res = await client.submitBatchOrders({
    pair: 'XBTUSD',
    orders: [
      {
        ordertype: 'limit',
        type: 'buy',
        volume: '0.0001',
        price: '10000',
        cl_ord_id: client.generateNewOrderID(),
      },
      {
        ordertype: 'limit',
        type: 'buy',
        volume: '0.0001',
        price: '11000',
        cl_ord_id: client.generateNewOrderID(),
      },
    ],
  });
  console.log('Batch:', JSON.stringify(res.result, null, 2));
}

main().catch(console.error);
```

### Amend, cancel, cancel all and the dead man's switch

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.KRAKEN_SPOT_API_KEY!,
  apiSecret: process.env.KRAKEN_SPOT_API_SECRET!,
});

async function main() {
  // Amend keeps the order IDs and, where possible, queue priority
  const amended = await client.amendOrder({
    cl_ord_id: 'your-client-order-id',
    limit_price: '10500',
  });
  console.log('Amend:', amended.result);

  // Cancel by Kraken txid or by client order ID
  const cancelled = await client.cancelOrder({ cl_ord_id: 'your-client-order-id' });
  console.log('Cancel:', cancelled.result);

  const all = await client.cancelAllOrders();
  console.log('Cancel all:', all.result);

  // Cancel everything in 60 seconds unless this is called again (timeout: 0 disables it)
  const dms = await client.cancelAllOrdersAfter({ timeout: 60 });
  console.log('Dead man switch:', dms.result);
}

main().catch(console.error);
```

## Derivatives (Futures) market data

### Tickers

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const client = new DerivativesClient();

async function main() {
  const all = await client.getTickers();
  console.log('Tickers:', all.tickers.length);

  const eth = await client.getTicker({ symbol: 'PF_ETHUSD' });
  console.log('PF_ETHUSD:', eth.ticker);
}

main().catch(console.error);
```

### Order book

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const client = new DerivativesClient();

async function main() {
  const res = await client.getOrderbook({ symbol: 'PF_ETHUSD' });
  console.log('Best bid:', res.orderBook.bids[0]);
  console.log('Best ask:', res.orderBook.asks[0]);
}

main().catch(console.error);
```

### Candles

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const client = new DerivativesClient();

async function main() {
  const res = await client.getCandles({
    tickType: 'trade', // 'trade', 'mark' or 'spot'
    symbol: 'PF_ETHUSD',
    resolution: '1h',
    from: Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000), // epoch seconds
  });
  console.log('Candles:', res.candles.length, res.candles.at(-1));
}

main().catch(console.error);
```

### Instruments and public trades

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const client = new DerivativesClient();

async function main() {
  const instruments = await client.getInstruments();
  console.log('Instruments:', instruments.instruments.length);

  const trades = await client.getPublicExecutionEvents({ tradeable: 'PF_ETHUSD' });
  console.log('Recent executions:', trades.elements.length);
}

main().catch(console.error);
```

## Derivatives (Futures) account and trading

### Accounts, positions and fills

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const client = new DerivativesClient({
  apiKey: process.env.KRAKEN_FUTURES_API_KEY!,
  apiSecret: process.env.KRAKEN_FUTURES_API_SECRET!,
});

async function main() {
  const accounts = await client.getAccounts();
  console.log('Accounts:', accounts.accounts);

  const positions = await client.getOpenPositions();
  console.log('Positions:', positions.openPositions);

  const fills = await client.getFills();
  console.log('Fills:', fills.fills);
}

main().catch(console.error);
```

### Limit, market and reduce-only orders

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const client = new DerivativesClient({
  apiKey: process.env.KRAKEN_FUTURES_API_KEY!,
  apiSecret: process.env.KRAKEN_FUTURES_API_SECRET!,
});

async function main() {
  const limit = await client.submitOrder({
    orderType: 'lmt',
    symbol: 'PF_ETHUSD',
    side: 'buy',
    size: 0.01,
    limitPrice: 1000,
    cliOrdId: client.generateNewOrderID(),
  });
  console.log('Limit:', limit.sendStatus);

  const market = await client.submitOrder({
    orderType: 'mkt',
    symbol: 'PF_ETHUSD',
    side: 'buy',
    size: 0.01,
  });
  console.log('Market:', market.sendStatus);

  const reduceOnly = await client.submitOrder({
    orderType: 'lmt',
    symbol: 'PF_ETHUSD',
    side: 'sell',
    size: 0.01,
    limitPrice: 9000,
    reduceOnly: true,
  });
  console.log('Reduce-only:', reduceOnly.sendStatus);
}

main().catch(console.error);
```

### Edit, cancel and cancel all

```typescript
import { DerivativesClient } from '@siebly/kraken-api';

const client = new DerivativesClient({
  apiKey: process.env.KRAKEN_FUTURES_API_KEY!,
  apiSecret: process.env.KRAKEN_FUTURES_API_SECRET!,
});

async function main() {
  const edited = await client.editOrder({
    cliOrdId: 'your-client-order-id',
    limitPrice: 1100,
  });
  console.log('Edit:', edited.editStatus);

  const cancelled = await client.cancelOrder({ cliOrdId: 'your-client-order-id' });
  console.log('Cancel:', cancelled.cancelStatus);

  const all = await client.cancelAllOrders({ symbol: 'PF_ETHUSD' });
  console.log('Cancel all:', all.cancelStatus);
}

main().catch(console.error);
```

## WebSockets

The `WebsocketClient` opens, authenticates, pings and reconnects connections for you, and resubscribes after a reconnect. Pick the connection with a `WS_KEY_MAP` key.

### Spot public streams (WebSocket v2)

```typescript
import { WebsocketClient, WS_KEY_MAP } from '@siebly/kraken-api';

const ws = new WebsocketClient();

ws.on('open', (data) => console.log('Connected:', data.wsKey));
ws.on('message', (data) => console.log('Message:', JSON.stringify(data)));
ws.on('response', (data) => console.log('Response:', JSON.stringify(data)));
ws.on('reconnected', (data) => console.log('Reconnected:', data.wsKey));
ws.on('exception', (data) => console.error('Exception:', data));

ws.subscribe(
  [
    { topic: 'ticker', payload: { symbol: ['BTC/USD', 'ETH/USD'] } },
    { topic: 'book', payload: { symbol: ['BTC/USD'], depth: 10 } },
    { topic: 'trade', payload: { symbol: ['BTC/USD'] } },
    { topic: 'ohlc', payload: { symbol: ['BTC/USD'], interval: 1 } },
  ],
  WS_KEY_MAP.spotPublicV2,
);
```

### Spot private streams (executions and balances)

The SDK fetches and refreshes the WebSocket token for you.

```typescript
import { WebsocketClient, WS_KEY_MAP } from '@siebly/kraken-api';

const ws = new WebsocketClient({
  apiKey: process.env.KRAKEN_SPOT_API_KEY!,
  apiSecret: process.env.KRAKEN_SPOT_API_SECRET!,
});

ws.on('message', (data) => console.log('Private:', JSON.stringify(data)));
ws.on('exception', (data) => console.error('Exception:', data));

ws.subscribe(
  [
    { topic: 'executions', payload: { snap_orders: true, snap_trades: true } },
    { topic: 'balances', payload: {} },
  ],
  WS_KEY_MAP.spotPrivateV2,
);

// Level 3 order book uses its own endpoint:
// ws.subscribe({ topic: 'level3', payload: { symbol: ['BTC/USD'] } }, WS_KEY_MAP.spotL3V2);
```

### Futures public streams

```typescript
import { WebsocketClient, WS_KEY_MAP } from '@siebly/kraken-api';

const ws = new WebsocketClient();

ws.on('message', (data) => console.log('Futures:', JSON.stringify(data)));
ws.on('exception', (data) => console.error('Exception:', data));

ws.subscribe(
  [
    { topic: 'ticker', payload: { product_ids: ['PF_XBTUSD', 'PF_ETHUSD'] } },
    { topic: 'trade', payload: { product_ids: ['PF_XBTUSD'] } },
  ],
  WS_KEY_MAP.derivativesPublicV1,
);
```

### Futures private streams

The challenge and signed challenge are handled for you.

```typescript
import { WebsocketClient, WS_KEY_MAP } from '@siebly/kraken-api';

const ws = new WebsocketClient({
  apiKey: process.env.KRAKEN_FUTURES_API_KEY!,
  apiSecret: process.env.KRAKEN_FUTURES_API_SECRET!,
});

ws.on('message', (data) => console.log('Futures private:', JSON.stringify(data)));
ws.on('exception', (data) => console.error('Exception:', data));

ws.subscribe(
  ['open_orders', 'fills', 'balances', 'open_positions'],
  WS_KEY_MAP.derivativesPrivateV1,
);
```

### Unsubscribe and close

```typescript
import { WebsocketClient, WS_KEY_MAP } from '@siebly/kraken-api';

const ws = new WebsocketClient();
const ticker = { topic: 'ticker' as const, payload: { symbol: ['BTC/USD'] } };

ws.on('message', (data) => console.log(JSON.stringify(data)));
ws.subscribe(ticker, WS_KEY_MAP.spotPublicV2);

setTimeout(() => {
  ws.unsubscribe(ticker, WS_KEY_MAP.spotPublicV2);
  ws.closeAll();
}, 10_000);
```

## Spot WebSocket API (awaitable orders)

`WebsocketAPIClient` sends Spot order requests over the authenticated WebSocket and returns a promise for each reply.

```typescript
import { WebsocketAPIClient } from '@siebly/kraken-api';

const wsApi = new WebsocketAPIClient({
  apiKey: process.env.KRAKEN_SPOT_API_KEY!,
  apiSecret: process.env.KRAKEN_SPOT_API_SECRET!,
});

async function main() {
  const placed = await wsApi.submitSpotOrder({
    order_type: 'limit',
    side: 'buy',
    order_qty: 0.0001,
    limit_price: 10000,
    symbol: 'BTC/USD',
    cl_ord_id: 'my-order-1',
  });
  console.log('Placed:', placed);

  const amended = await wsApi.amendSpotOrder({
    cl_ord_id: 'my-order-1',
    order_qty: 0.0001, // required when amending
    limit_price: 10500,
  });
  console.log('Amended:', amended);

  const cancelled = await wsApi.cancelSpotOrder({ cl_ord_id: ['my-order-1'] });
  console.log('Cancelled:', cancelled);
}

main().catch(console.error);
```

## Error handling

Kraken often answers HTTP 200 even when a request fails, and puts the reason in the response body: Spot uses an `error` array (for example `EAPI:Invalid key` or `EQuery:Unknown asset pair`) and Futures uses `result: 'error'` with an `error` string (for example `authenticationError`). The SDK throws in both cases. The thrown object carries the HTTP status in `code` and the parsed response in `body`, so read `body.error` for Kraken's reason.

```typescript
import { SpotClient } from '@siebly/kraken-api';

const client = new SpotClient({
  apiKey: process.env.KRAKEN_SPOT_API_KEY!,
  apiSecret: process.env.KRAKEN_SPOT_API_SECRET!,
});

async function main() {
  try {
    const res = await client.getAccountBalance();
    console.log(res.result);
  } catch (e) {
    const err = e as { code?: number; body?: { error?: string[] | string } };
    console.error('Kraken request failed:', err.body?.error ?? e);
  }
}

main();
```

## Links

- [Siebly Kraken JavaScript SDK page](https://siebly.io/sdk/kraken/javascript)
- [SDK docs and API reference](https://sieblyio.github.io/docs/kraken/)
- [Endpoint function list](../docs/endpointFunctionList.md)
- [npm: @siebly/kraken-api](https://www.npmjs.com/package/@siebly/kraken-api)
