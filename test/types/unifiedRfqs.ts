import {
  WebsocketClient,
  WSAPIAddUnifiedOrderParams,
  WSUnifiedExecutionData,
  WSUnifiedPrivateChannelError,
  WSUnifiedPrivateExceptionEvent,
  WSUnifiedPrivateMessageEvent,
  WSUnifiedPrivateSubscriptionResult,
  WSUnifiedPrivateTopicRequest,
  WSUnifiedPublicChannelError,
  WSUnifiedPublicExceptionEvent,
  WSUnifiedPublicMessageEvent,
  WSUnifiedPublicSubscriptionResult,
  WSUnifiedPublicTopicRequest,
} from '../../src/index.js';

// Compile-only contract checks. This function is never run.
export function unifiedRFQSubscriptions(client: WebsocketClient) {
  const rfqs: WSUnifiedPublicTopicRequest = {
    topic: 'rfqs',
    payload: { asset_class: 'derivatives', snapshot: true },
  };
  const quotes: WSUnifiedPrivateTopicRequest = {
    topic: 'quotes',
    payload: { asset_class: 'derivatives' },
  };
  client.subscribe(rfqs, 'unifiedPublicV2');
  client.unsubscribe(rfqs, 'unifiedPublicV2');
  client.subscribe(quotes, 'unifiedPrivateV2');
  client.unsubscribe(quotes, 'unifiedPrivateV2');

  // @ts-expect-error Public RFQs require asset_class.
  client.subscribe({ topic: 'rfqs', payload: {} }, 'unifiedPublicV2');
  // @ts-expect-error Private quotes require asset_class even on unsubscribe.
  client.unsubscribe('quotes', 'unifiedPrivateV2');
  // @ts-expect-error Private quotes cannot omit their payload.
  client.subscribe('quotes', 'unifiedPrivateV2');
  // @ts-expect-error RFQs are derivatives-only.
  client.subscribe(
    { topic: 'rfqs', payload: { asset_class: 'spot' } },
    'unifiedPublicV2',
  );
  // @ts-expect-error Quotes are derivatives-only.
  client.subscribe(
    { topic: 'quotes', payload: { asset_class: 'spot' } },
    'unifiedPrivateV2',
  );
  // @ts-expect-error RFQs belong on the public endpoint.
  client.subscribe(rfqs, 'unifiedPrivateV2');
  // @ts-expect-error Quotes belong on the private endpoint.
  client.subscribe(quotes, 'unifiedPublicV2');
  // @ts-expect-error RFQs do not accept a symbol filter.
  client.subscribe(
    { topic: 'rfqs', payload: { asset_class: 'derivatives', symbol: [] } },
    'unifiedPublicV2',
  );
}

// Acknowledgements are per channel, without a symbol. Unsubscribe omits options.
export const rfqsSubscribed = {
  channel: 'rfqs',
  asset_class: 'derivatives',
  snapshot: true,
} satisfies WSUnifiedPublicSubscriptionResult;

export const rfqsUnsubscribed = {
  channel: 'rfqs',
} satisfies WSUnifiedPublicSubscriptionResult;

export const quotesSubscribed = {
  channel: 'quotes',
  asset_class: 'derivatives',
  snapshot: false,
} satisfies WSUnifiedPrivateSubscriptionResult;

export const quotesUnsubscribed = {
  channel: 'quotes',
} satisfies WSUnifiedPrivateSubscriptionResult;

export const rfqsSnapshotError = {
  channel: 'rfqs',
  type: 'snapshot',
  error: 'snapshot_too_large',
  data: [],
} satisfies WSUnifiedPublicChannelError;

export const quotesSnapshotError = {
  channel: 'quotes',
  type: 'snapshot',
  error: 'snapshot_too_large',
  data: [],
} satisfies WSUnifiedPrivateChannelError;

export function consumeUnifiedRFQs(event: WSUnifiedPublicMessageEvent) {
  if (event.channel !== 'rfqs') return;
  const size: number = event.data[0].legs[0].size;
  // @ts-expect-error Public RFQs do not expose private offer prices.
  const bid = event.data[0].best_bid;
  return size;
}

export function consumeUnifiedQuotes(event: WSUnifiedPrivateMessageEvent) {
  if (event.channel !== 'quotes') return;
  const entry = event.data[0];
  if (entry.type === 'rfq') {
    const bid: number | undefined = entry.best_bid;
    const price: number | undefined = entry.best_bid_legs?.[0].price;
    const expiry: string = entry.expiry;
    // @ts-expect-error RFQ entries have no offer ID.
    const offerId = entry.offer_id;
    return { bid, price, expiry };
  }
  const offerId: string = entry.offer_id;
  const ask: number | undefined = entry.ask;
  const price: number | undefined = entry.ask_legs?.[0].price;
  // @ts-expect-error Offer entries have no RFQ legs or expiry.
  const legs = entry.legs;
  return { offerId, ask, price };
}

export function consumeRFQException(
  event: WSUnifiedPublicExceptionEvent | WSUnifiedPrivateExceptionEvent,
) {
  if (
    'channel' in event &&
    (event.channel === 'rfqs' || event.channel === 'quotes')
  ) {
    const type: 'snapshot' = event.type;
    const error: 'snapshot_too_large' = event.error;
    const data: [] = event.data;
    return { type, error, data };
  }
}

// RFQ is a received execution order type, not an add_order request type.
export const rfqExecutionOrderType: WSUnifiedExecutionData['order_type'] =
  'rfq';
// @ts-expect-error RFQs cannot be created through add_order.
export const rfqOrderRequestType: WSAPIAddUnifiedOrderParams['order_type'] =
  'rfq';
