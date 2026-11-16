/** Asset class is specified per subscription on the unified v2 connection. */
export type WSUnifiedAssetClass = 'spot' | 'derivatives';

export type WSUnifiedBookDepth = 10 | 25 | 100 | 500 | 1000;

export type WSUnifiedLevel3Depth = 10 | 100 | 1000;

/** trade is the deployed default; mark and spot are documented but availability varies. */
export type WSUnifiedOHLCTickType = 'trade' | 'mark' | 'spot';

/** Candle interval in minutes. */
export type WSUnifiedOHLCInterval =
  | 1
  | 5
  | 15
  | 30
  | 60
  | 240
  | 1440
  | 10080
  | 21600;

export interface WSUnifiedInstrumentSubscribeParams {
  asset_class: WSUnifiedAssetClass;
  snapshot?: boolean;
}

export interface WSUnifiedTickerSubscribeParams
  extends WSUnifiedInstrumentSubscribeParams {
  symbol: string[];
}

export interface WSUnifiedBookSubscribeParams
  extends WSUnifiedTickerSubscribeParams {
  depth?: WSUnifiedBookDepth;
}

export type WSUnifiedOHLCSubscribeParams = {
  symbol: string[];
  interval?: WSUnifiedOHLCInterval;
  snapshot?: boolean;
} & (
  | { asset_class: 'spot'; tick_type?: never }
  | { asset_class: 'derivatives'; tick_type?: WSUnifiedOHLCTickType }
);

/** Kraken currently documents the unified trade channel as derivatives-only. */
export interface WSUnifiedTradeSubscribeParams
  extends WSUnifiedTickerSubscribeParams {
  asset_class: 'derivatives';
}

export interface WSUnifiedLevel3SubscribeParams
  extends WSUnifiedTickerSubscribeParams {
  depth?: WSUnifiedLevel3Depth;
}

/** Public endpoint channels. Level 3 requires authentication. */
export interface WSUnifiedPublicSubscribeParamMap {
  ticker: WSUnifiedTickerSubscribeParams;
  book: WSUnifiedBookSubscribeParams;
  ohlc: WSUnifiedOHLCSubscribeParams;
  trade: WSUnifiedTradeSubscribeParams;
  instrument: WSUnifiedInstrumentSubscribeParams;
  level3: WSUnifiedLevel3SubscribeParams;
}

export type WSUnifiedPublicTopic = keyof WSUnifiedPublicSubscribeParamMap;

/** Reuse the complete request when unsubscribing so the subscription cache can remove it. */
export type WSUnifiedPublicTopicRequest = {
  [TTopic in WSUnifiedPublicTopic]: {
    topic: TTopic;
    payload: WSUnifiedPublicSubscribeParamMap[TTopic];
  };
}[WSUnifiedPublicTopic];

/** Authentication tokens are supplied by the client, as with Spot private subscriptions. */
export interface WSUnifiedExecutionsSubscribeParams {
  asset_class: WSUnifiedAssetClass;
  snap_trades?: boolean;
  snap_orders?: boolean;
  order_status?: boolean;
  ratecounter?: boolean;
  /** @deprecated Use snap_trades. */
  snapshot_trades?: boolean;
  /** @deprecated Use snap_orders or snap_trades. */
  snapshot?: boolean;
}

export interface WSUnifiedBalancesSubscribeParams {
  snapshot?: boolean;
  /** Balances cover all wallets on the account. */
  asset_class?: never;
}

/** Account-wide channels that accept neither asset_class nor snapshot. */
export interface WSUnifiedAccountSubscribeParams {
  asset_class?: never;
  snapshot?: never;
}

/** Kraken rejects snapshot together with with_margin, including false values. */
export type WSUnifiedPositionsSubscribeParams = {
  asset_class: 'derivatives';
} & (
  | { snapshot?: boolean; with_margin?: never }
  | { with_margin: boolean; snapshot?: never }
);

/** Every margin message replaces the complete state of its section. */
export interface WSUnifiedMarginSubscribeParams {
  asset_class: 'derivatives';
  snapshot?: never;
}

export const WS_UNIFIED_PRIVATE_TOPICS = [
  'executions',
  'balances',
  'positions',
  'margin',
  'ledgers',
  'preferences',
] as const;

export interface WSUnifiedPrivateSubscribeParamMap {
  executions: WSUnifiedExecutionsSubscribeParams;
  balances: WSUnifiedBalancesSubscribeParams;
  positions: WSUnifiedPositionsSubscribeParams;
  margin: WSUnifiedMarginSubscribeParams;
  ledgers: WSUnifiedAccountSubscribeParams;
  preferences: WSUnifiedAccountSubscribeParams;
}

export type WSUnifiedPrivateTopic = keyof WSUnifiedPrivateSubscribeParamMap;

export type WSUnifiedPrivateTopicWithoutParams = {
  [TTopic in WSUnifiedPrivateTopic]: {} extends WSUnifiedPrivateSubscribeParamMap[TTopic]
    ? TTopic
    : never;
}[WSUnifiedPrivateTopic];

/** Reuse the complete request when unsubscribing to remove the cached subscription. */
export type WSUnifiedPrivateTopicRequest = {
  [TTopic in WSUnifiedPrivateTopic]: {
    topic: TTopic;
  } & (TTopic extends WSUnifiedPrivateTopicWithoutParams
    ? { payload?: WSUnifiedPrivateSubscribeParamMap[TTopic] }
    : { payload: WSUnifiedPrivateSubscribeParamMap[TTopic] });
}[WSUnifiedPrivateTopic];
