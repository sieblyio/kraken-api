import { WebsocketClient, WSTopicRequest } from '../../src/index.js';

// Compile-only checks for legacy book typing alongside unified WS subscriptions.
export function bookSubscriptionTypes(client: WebsocketClient) {
  const spotBook: WSTopicRequest<'book'> = {
    topic: 'book',
    payload: { symbol: ['BTC/USD'], depth: 25, snapshot: true },
  };
  const derivativesBook: WSTopicRequest<'book'> = {
    topic: 'book',
    payload: { product_ids: ['PF_XBTUSD'] },
  };
  client.subscribe(spotBook, 'spotPublicV2');
  client.unsubscribe(spotBook, 'spotPublicV2');
  client.subscribe(derivativesBook, 'derivativesPublicV1');
  client.unsubscribe(derivativesBook, 'derivativesPublicV1');
  client.subscribe<'book'>(spotBook, 'spotPublicV2');
  client.unsubscribe<'book'>(derivativesBook, 'derivativesPublicV1');
  client.subscribe(
    [
      { topic: 'instrument' },
      { topic: 'book', payload: { symbol: ['BTC/USD'], depth: 25 } },
    ],
    'spotPublicV2',
  );

  client.subscribe(
    // @ts-expect-error Inferred book payloads must use a supported depth.
    { topic: 'book', payload: { symbol: ['BTC/USD'], depth: 20 } },
    'spotPublicV2',
  );
  client.unsubscribe(
    // @ts-expect-error Unsubscribe retains the same inferred book constraints.
    { topic: 'book', payload: { symbol: ['BTC/USD'], depth: 20 } },
    'spotPublicV2',
  );
  client.subscribe(
    // @ts-expect-error Book payloads need symbols or product IDs.
    { topic: 'book', payload: { snapshot: true } },
    'spotPublicV2',
  );
  // @ts-expect-error Explicit topic typing cannot bypass unified payload requirements.
  client.subscribe<'book'>(spotBook, 'unifiedPublicV2');

  client.subscribe<'unifiedPublicV2'>(
    { topic: 'book', payload: { asset_class: 'spot', symbol: ['BTC/USD'] } },
    'unifiedPublicV2',
  );
  client.unsubscribe<'unifiedPrivateV2'>(
    { topic: 'executions', payload: { asset_class: 'spot' } },
    'unifiedPrivateV2',
  );
}
