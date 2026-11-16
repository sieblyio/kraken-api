import {
  WebsocketClient,
  WS_KEY_MAP,
  WSUnifiedPrivateChannelError,
  WSUnifiedPrivateExceptionEvent,
  WSUnifiedPrivateMessageEvent,
  WSUnifiedPrivateResponseEvent,
  WSUnifiedPrivateSubscriptionResult,
  WSUnifiedPrivateTopicRequest,
  WSUnifiedPublicMessageEvent,
  WSUnifiedStatusData,
} from '../../src/index.js';

// Field shapes observed on the live unified service on 23 October 2026.
export const livePositionsUnavailable = {
  channel: 'positions',
  error: 'margin_unavailable',
} satisfies WSUnifiedPrivateChannelError;

export const livePositionsAcknowledgement = {
  channel: 'positions',
  asset_class: 'derivatives',
} satisfies WSUnifiedPrivateSubscriptionResult;

export const liveExecutionsAcknowledgement = {
  channel: 'executions',
  asset_class: 'spot',
} satisfies WSUnifiedPrivateSubscriptionResult;

export const liveMarginAcknowledgement = {
  channel: 'margin',
  asset_class: 'derivatives',
} satisfies WSUnifiedPrivateSubscriptionResult;

export const liveMarginStatus = {
  margin: 'online',
} satisfies WSUnifiedStatusData;

// Compile-only checks of the consumer-facing contract. No sockets are mocked or opened.
export function unifiedPrivateTypes(client: WebsocketClient) {
  const subscriptions: WSUnifiedPrivateTopicRequest[] = [
    {
      topic: 'executions',
      payload: { asset_class: 'derivatives', snap_trades: true },
    },
    {
      topic: 'executions',
      payload: { asset_class: 'spot', ratecounter: true },
    },
    { topic: 'balances', payload: { snapshot: false } },
    {
      topic: 'positions',
      payload: { asset_class: 'derivatives', snapshot: true },
    },
    { topic: 'margin', payload: { asset_class: 'derivatives' } },
    { topic: 'ledgers' },
    { topic: 'preferences' },
  ];
  client.subscribe(subscriptions, WS_KEY_MAP.unifiedPrivateV2);
  client.unsubscribe(subscriptions, WS_KEY_MAP.unifiedPrivateV2);
  client.subscribe(['balances', 'ledgers', 'preferences'], 'unifiedPrivateV2');
  client.unsubscribe('balances', 'unifiedPrivateV2');
  client.subscribe(
    {
      topic: 'positions',
      payload: { asset_class: 'derivatives', with_margin: true },
    },
    'unifiedPrivateV2',
  );
  client.subscribe(
    {
      topic: 'level3',
      payload: {
        asset_class: 'derivatives',
        symbol: ['PF_XBTUSD'],
        depth: 1000,
      },
    },
    'unifiedPublicV2',
  );

  // @ts-expect-error Executions require asset_class.
  client.subscribe('executions', 'unifiedPrivateV2');
  // @ts-expect-error Positions require asset_class even on unsubscribe.
  client.unsubscribe('positions', 'unifiedPrivateV2');
  // @ts-expect-error Ticker belongs on the public endpoint.
  client.subscribe('ticker', 'unifiedPrivateV2');
  // @ts-expect-error Level 3 belongs on the public endpoint.
  client.subscribe(
    { topic: 'level3', payload: { asset_class: 'spot', symbol: ['BTC/USD'] } },
    'unifiedPrivateV2',
  );
  // @ts-expect-error Ledgers rejects asset_class because it covers the account.
  client.subscribe(
    { topic: 'ledgers', payload: { asset_class: 'derivatives' } },
    'unifiedPrivateV2',
  );
  // @ts-expect-error Preferences always snapshots, without a snapshot option.
  client.subscribe(
    { topic: 'preferences', payload: { snapshot: false } },
    'unifiedPrivateV2',
  );
  // @ts-expect-error Margin has no snapshot option.
  client.subscribe(
    {
      topic: 'margin',
      payload: { asset_class: 'derivatives', snapshot: true },
    },
    'unifiedPrivateV2',
  );
  // @ts-expect-error Positions are derivatives-only.
  client.subscribe(
    { topic: 'positions', payload: { asset_class: 'spot' } },
    'unifiedPrivateV2',
  );
  // @ts-expect-error snapshot and with_margin cannot be combined, even when false.
  client.subscribe(
    {
      topic: 'positions',
      payload: {
        asset_class: 'derivatives',
        snapshot: false,
        with_margin: false,
      },
    },
    'unifiedPrivateV2',
  );
  // @ts-expect-error Level 3 supports a different set of depths from Level 2.
  client.subscribe(
    {
      topic: 'level3',
      payload: { asset_class: 'derivatives', symbol: ['PF_XBTUSD'], depth: 25 },
    },
    'unifiedPublicV2',
  );
  // @ts-expect-error Unified trading commands remain a separate implementation stage.
  client.sendWSAPIRequest('unifiedPrivateV2', 'cancel_all');
}

export function consumeUnifiedPrivateMessage(
  event: WSUnifiedPrivateMessageEvent,
) {
  if (event.channel === 'balances' && event.type === 'snapshot') {
    const balance: number = event.data[0].wallets[0].balance;
    return balance;
  }
  if (event.channel === 'balances' && event.type === 'update') {
    const ref: string | undefined = event.data[0].ref_id;
    // @ts-expect-error Updates contain ledger entries, not snapshot wallets.
    const wallets = event.data[0].wallets;
    return ref;
  }
  if (event.channel === 'positions' && event.type === undefined) {
    const margin: string | undefined = event.data.futures[0].initial_margin;
    return margin;
  }
  if (event.channel === 'positions') {
    const size: string = event.data.futures[0].size;
    // @ts-expect-error Default positions do not include enriched risk figures.
    const initialMargin = event.data.futures[0].initial_margin;
    return size;
  }
  if (event.channel === 'margin' && event.type === 'single_collateral') {
    return event.data.wallets[0].available;
  }
  if (event.channel === 'margin') {
    const available: string | undefined = event.data.available_margin;
    // @ts-expect-error Decimal margin figures are not numbers.
    const numeric: number = event.data.available_margin;
    return available;
  }
  if (event.channel === 'executions') {
    const sequence: string | undefined = event.data[0].sequence_id;
    const tradeId: string | number | undefined = event.data[0].trade_id;
    return sequence ?? tradeId;
  }
  if (event.channel === 'ledgers') return event.sequence;
  if (event.channel === 'preferences') return event.data.futures_trading;
}

export function consumeUnifiedLevel3(event: WSUnifiedPublicMessageEvent) {
  if (event.channel === 'level3' && event.type === 'update') {
    const action: 'add' | 'modify' | 'delete' = event.data[0].bids[0].event;
    return action;
  }
}

export function consumeUnifiedPrivateResponse(
  event: WSUnifiedPrivateResponseEvent,
) {
  if (!event.success) return event.error;
  if (event.result.channel === 'executions') return event.result.maxratecount;
  if (event.result.channel === 'positions') return event.result.with_margin;
}

export function consumeUnifiedPrivateException(
  event: WSUnifiedPrivateExceptionEvent,
) {
  if (
    'channel' in event &&
    event.channel === 'positions' &&
    event.error === 'snapshot_too_large'
  ) {
    return event.data.futures;
  }
  return event.error;
}
