/**
 * Maintain a local BTC/USD Spot book, validate CRC32 checksums, resubscribe on
 * mismatch, and log the best bid and ask after each valid snapshot or update.
 * From the repo root, install dependencies with `npm ci`, then run:
 * TS_NODE_COMPILER_OPTIONS='{"module":"ESNext"}' node --loader ts-node/esm examples/Spot/WebSockets/orderbookLocalWs.ts
 * No API credentials are required.
 */
import { WebsocketClient, WSTopicRequest } from '../../../src/index.js';
// Installed SDK: import { WebsocketClient, WSTopicRequest } from '@siebly/kraken-api';

interface Level {
  price: number | string;
  qty: number | string;
}

interface Book {
  asks: Map<string, Level>;
  bids: Map<string, Level>;
}

type BookMessage = {
  channel: 'book';
  type: 'snapshot' | 'update';
  data?: {
    symbol: string;
    asks?: Level[];
    bids?: Level[];
    checksum: number;
  }[];
};

type InstrumentMessage = {
  channel: 'instrument';
  data?: {
    pairs?: {
      symbol: string;
      price_precision: number;
      qty_precision: number;
    }[];
  };
};

const depth = 10;
const bookTopic: WSTopicRequest = {
  topic: 'book',
  payload: { symbol: ['BTC/USD'], depth },
};
const books = new Map<string, Book>();
// instrument: price_precision / qty_precision. REST AssetPairs: pair_decimals / lot_decimals.
const precision = new Map<string, [number, number]>();

// JSON.parse drops trailing zeros. Restore pair precision before removing the
// decimal point and leading zeros (0.1 at qty precision 8 becomes 10000000).
function token(value: number | string, decimals: number) {
  return (
    Number(value).toFixed(decimals).replace('.', '').replace(/^0+/, '') || '0'
  );
}

function crc32(text: string) {
  let crc = ~0;
  for (let i = 0; i < text.length; i++) {
    crc ^= text.charCodeAt(i);
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return ~crc >>> 0;
}

function sorted(side: Map<string, Level>, highFirst: boolean) {
  return [...side.values()].sort((a, b) => {
    const delta = Number(a.price) - Number(b.price);
    return highFirst ? -delta : delta;
  });
}

// WebsocketClient handles reconnects, heartbeats and resubscription after a
// reconnect; this example maintains the local book and handles checksum resync.
const ws = new WebsocketClient();
ws.subscribe([{ topic: 'instrument' }, bookTopic], 'spotPublicV2');

ws.on('message', (msg: InstrumentMessage | BookMessage) => {
  if (msg.channel === 'instrument') {
    for (const pair of msg.data?.pairs || []) {
      precision.set(pair.symbol, [pair.price_precision, pair.qty_precision]);
    }
    return;
  }
  if (msg.channel !== 'book' || !Array.isArray(msg.data)) return;

  for (const row of msg.data) {
    const pairDp = precision.get(row.symbol);
    if (!pairDp) continue;

    let book = books.get(row.symbol);
    if (!book || msg.type === 'snapshot') {
      book = { asks: new Map(), bids: new Map() };
      books.set(row.symbol, book);
    }
    for (const [name, levels] of [
      ['asks', row.asks],
      ['bids', row.bids],
    ] as const) {
      for (const level of levels || []) {
        const key = String(level.price);
        if (Number(level.qty) === 0) book[name].delete(key);
        else book[name].set(key, level);
      }
    }

    const [priceDp, qtyDp] = pairDp;
    const asks = sorted(book.asks, false).slice(0, depth);
    const bids = sorted(book.bids, true).slice(0, depth);
    book.asks = new Map(asks.map((level) => [String(level.price), level]));
    book.bids = new Map(bids.map((level) => [String(level.price), level]));
    // CRC32 of the top 10 asks (low to high), then bids (high to low).
    // https://docs.kraken.com/exchange/guides/websockets/book-checksum-v2
    const sideText = (levels: Level[]) =>
      levels
        .slice(0, 10)
        .map((level) => token(level.price, priceDp) + token(level.qty, qtyDp))
        .join('');
    if (crc32(sideText(asks) + sideText(bids)) === row.checksum) {
      console.log(row.symbol, { bid: bids[0], ask: asks[0] });
      continue;
    }

    // Drop the mismatched book and subscribe again for a fresh snapshot.
    books.delete(row.symbol);
    ws.subscribe(bookTopic, 'spotPublicV2');
  }
});
