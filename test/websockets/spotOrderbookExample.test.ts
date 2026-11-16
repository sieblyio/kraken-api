describe('Spot local orderbook example', () => {
  let client: { subscribe: jest.Mock; on: jest.Mock };
  let message: (data: unknown) => void;
  let log: jest.SpyInstance;

  const bookTopic = {
    topic: 'book',
    payload: { symbol: ['BTC/USD'], depth: 10 },
  };
  const snapshot = {
    symbol: 'BTC/USD',
    asks: [
      { price: 101.2, qty: 0.1 },
      { price: 101.1, qty: 0.2 },
    ],
    bids: [
      { price: 100.8, qty: 0.4 },
      { price: 100.9, qty: 0.3 },
    ],
    // CRC32 fixtures calculated independently with Python zlib.crc32.
    checksum: 3950975721,
  };

  beforeEach(async () => {
    log = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    client = { subscribe: jest.fn(), on: jest.fn() };
    await jest.isolateModulesAsync(async () => {
      jest.doMock('../../src/index.js', () => ({
        WebsocketClient: jest.fn(() => client),
      }));
      await import('../../examples/Spot/WebSockets/orderbookLocalWs.js');
    });
    message = client.on.mock.calls.find(([event]) => event === 'message')![1];
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function instrument() {
    message({
      channel: 'instrument',
      data: {
        pairs: [{ symbol: 'BTC/USD', price_precision: 2, qty_precision: 4 }],
      },
    });
  }

  it('subscribes to instrument precision and the depth-10 book', () => {
    expect(client.subscribe).toHaveBeenCalledWith(
      [{ topic: 'instrument' }, bookTopic],
      'spotPublicV2',
    );
  });

  it('ignores unrelated messages and book data without pair precision', () => {
    message({ channel: 'heartbeat' });
    message({ channel: 'instrument' });
    message({ channel: 'book' });
    message({ channel: 'book', type: 'snapshot', data: [snapshot] });
    expect(client.subscribe).toHaveBeenCalledTimes(1);
    expect(log).not.toHaveBeenCalled();
  });

  it('validates a sorted snapshot using precision-restored trailing zeros', () => {
    instrument();
    message({ channel: 'book', type: 'snapshot', data: [snapshot] });
    expect(client.subscribe).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenLastCalledWith('BTC/USD', {
      bid: { price: 100.9, qty: 0.3 },
      ask: { price: 101.1, qty: 0.2 },
    });
  });

  it('applies insertions, replacements and zero-quantity deletions', () => {
    instrument();
    message({ channel: 'book', type: 'snapshot', data: [snapshot] });
    message({
      channel: 'book',
      type: 'update',
      data: [
        {
          symbol: 'BTC/USD',
          asks: [
            { price: 101.1, qty: 0 },
            { price: 101.2, qty: 0.25 },
            { price: 101.3, qty: 0.5 },
          ],
          bids: [
            { price: 100.9, qty: 0.7 },
            { price: 101, qty: 0.6 },
          ],
          checksum: 663012422,
        },
      ],
    });
    expect(client.subscribe).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenLastCalledWith('BTC/USD', {
      bid: { price: 101, qty: 0.6 },
      ask: { price: 101.2, qty: 0.25 },
    });
  });

  it('replaces an existing book on a new snapshot', () => {
    instrument();
    message({ channel: 'book', type: 'snapshot', data: [snapshot] });
    message({
      channel: 'book',
      type: 'snapshot',
      data: [
        {
          symbol: 'BTC/USD',
          asks: [{ price: 102, qty: 0.9 }],
          bids: [{ price: 100, qty: 0.8 }],
          checksum: 1579091221,
        },
      ],
    });
    expect(client.subscribe).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenLastCalledWith('BTC/USD', {
      bid: { price: 100, qty: 0.8 },
      ask: { price: 102, qty: 0.9 },
    });
  });

  it('validates the top ten levels and discards levels outside the depth', () => {
    instrument();
    message({
      channel: 'book',
      type: 'snapshot',
      data: [
        {
          symbol: 'BTC/USD',
          asks: Array.from({ length: 11 }, (_, i) => ({
            price: 100 + i,
            qty: 0.1,
          })),
          bids: Array.from({ length: 11 }, (_, i) => ({
            price: 99 - i,
            qty: 0.1,
          })),
          checksum: 2037702317,
        },
      ],
    });
    // Removing the best ask must not bring back the discarded eleventh level.
    message({
      channel: 'book',
      type: 'update',
      data: [
        {
          symbol: 'BTC/USD',
          asks: [{ price: 100, qty: 0 }],
          checksum: 60966514,
        },
      ],
    });
    expect(client.subscribe).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenLastCalledWith('BTC/USD', {
      bid: { price: 99, qty: 0.1 },
      ask: { price: 101, qty: 0.1 },
    });
  });

  it('drops a mismatched book, resubscribes and accepts a fresh snapshot', () => {
    instrument();
    message({ channel: 'book', type: 'snapshot', data: [snapshot] });
    log.mockClear();
    message({
      channel: 'book',
      type: 'update',
      data: [{ symbol: 'BTC/USD', asks: [{ price: 1, qty: 1 }], checksum: 0 }],
    });
    expect(client.subscribe).toHaveBeenCalledTimes(2);
    expect(client.subscribe).toHaveBeenLastCalledWith(
      bookTopic,
      'spotPublicV2',
    );
    expect(log).not.toHaveBeenCalled();
    // An update after the reset also starts from an empty local book.
    message({ channel: 'book', type: 'update', data: [snapshot] });
    message({ channel: 'book', type: 'snapshot', data: [snapshot] });
    expect(client.subscribe).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenCalledTimes(2);
  });
});
