import {
  WebsocketClient,
  WS_KEY_MAP,
  WsKey,
  WSTopicRequest,
  WSUnifiedPublicMessageEvent,
  WSUnifiedPublicResponseEvent,
  WSUnifiedPublicTopicRequest,
} from '../../src/index.js';

// Compile-only contract checks. This function is never run.
export function unifiedPublicTypes(
  client: WebsocketClient,
  existingKey: Exclude<WsKey, 'unifiedPublicV2'>,
) {
  const instrument: WSUnifiedPublicTopicRequest = {
    topic: 'instrument',
    payload: { asset_class: 'derivatives' },
  };
  client.subscribe(instrument, WS_KEY_MAP.unifiedPublicV2);
  client.unsubscribe(instrument, WS_KEY_MAP.unifiedPublicV2);
  client.subscribe(
    [
      {
        topic: 'ticker',
        payload: { asset_class: 'spot', symbol: ['BTC/USD'] },
      },
      {
        topic: 'book',
        payload: {
          asset_class: 'derivatives',
          symbol: ['PF_XBTUSD'],
          depth: 100,
        },
      },
      {
        topic: 'ohlc',
        payload: {
          asset_class: 'derivatives',
          symbol: ['PF_XBTUSD'],
          tick_type: 'trade',
          interval: 60,
        },
      },
      {
        topic: 'trade',
        payload: { asset_class: 'derivatives', symbol: ['PF_XBTUSD'] },
      },
    ],
    'unifiedPublicV2',
  );

  // @ts-expect-error Unified subscriptions cannot omit their parameters.
  client.subscribe('ticker', 'unifiedPublicV2');
  client.subscribe(
    // @ts-expect-error asset_class is required.
    { topic: 'ticker', payload: { symbol: ['BTC/USD'] } },
    'unifiedPublicV2',
  );
  client.subscribe(
    // @ts-expect-error Market subscriptions require symbols.
    { topic: 'ticker', payload: { asset_class: 'spot' } },
    'unifiedPublicV2',
  );
  client.subscribe(
    {
      topic: 'book',
      // @ts-expect-error Depth must be supported by Kraken.
      payload: { asset_class: 'spot', symbol: ['BTC/USD'], depth: 20 },
    },
    'unifiedPublicV2',
  );
  client.subscribe(
    {
      topic: 'ohlc',
      // @ts-expect-error Candle intervals are minutes from Kraken's supported list.
      payload: { asset_class: 'spot', symbol: ['BTC/USD'], interval: 3 },
    },
    'unifiedPublicV2',
  );
  client.subscribe(
    {
      topic: 'ohlc',
      // @ts-expect-error tick_type is specific to derivatives candles.
      payload: { asset_class: 'spot', symbol: ['BTC/USD'], tick_type: 'mark' },
    },
    'unifiedPublicV2',
  );
  client.subscribe(
    // @ts-expect-error The unified trade channel is currently derivatives-only.
    { topic: 'trade', payload: { asset_class: 'spot', symbol: ['BTC/USD'] } },
    'unifiedPublicV2',
  );
  client.subscribe(
    // @ts-expect-error Level 3 requires authentication, which is a later stage.
    { topic: 'level3', payload: { asset_class: 'spot', symbol: ['BTC/USD'] } },
    'unifiedPublicV2',
  );
  // @ts-expect-error Private channels are not public subscriptions.
  client.subscribe('balances', 'unifiedPublicV2');
  client.subscribe(
    // @ts-expect-error Status cannot be subscribed to manually.
    { topic: 'status', payload: { asset_class: 'spot' } },
    'unifiedPublicV2',
  );
  // @ts-expect-error Unsubscribe requires the same full request as subscribe.
  client.unsubscribe({ topic: 'ticker' }, 'unifiedPublicV2');
  // @ts-expect-error No unified trading support in the public stage.
  client.sendWSAPIRequest('unifiedPublicV2', 'cancel_all');

  const legacy: WSTopicRequest = {
    topic: 'ticker',
    payload: { symbol: ['BTC/USD'] },
  };
  client.subscribe(legacy, existingKey);
  client.unsubscribe([legacy, 'ticker'], existingKey);
  client.subscribe('ticker', 'spotPublicV2');
  client.subscribe(
    { topic: 'ticker', payload: { product_ids: ['PF_XBTUSD'] } },
    'derivativesPublicV1',
  );
  client.sendWSAPIRequest('spotPrivateV2', 'cancel_all');
}

export function consumeUnifiedMessage(event: WSUnifiedPublicMessageEvent) {
  if (event.channel === 'ticker') {
    const last: number | undefined = event.data[0].last;
    return last;
  }
  if (event.channel === 'instrument') {
    const increment: number = event.data.pairs[0].price_increment;
    return increment;
  }
  if (event.channel === 'status') {
    return event.data[0].system;
  }
  // @ts-expect-error Instrument metadata is not an array of tickers.
  return event.data.pairs;
}

export function consumeUnifiedResponse(event: WSUnifiedPublicResponseEvent) {
  if (!event.success) return event.error;
  if (event.result.channel === 'book') return event.result.depth;
  // @ts-expect-error Success does not imply an error string.
  return event.error;
}
