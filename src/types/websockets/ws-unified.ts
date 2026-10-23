/** Asset class is specified per subscription on the unified v2 connection. */
export type WSUnifiedAssetClass = 'spot' | 'derivatives';

export type WSUnifiedBookDepth = 10 | 25 | 100 | 500 | 1000;

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

/** Unauthenticated channels only. Status and heartbeats arrive automatically. */
export interface WSUnifiedPublicSubscribeParamMap {
  ticker: WSUnifiedTickerSubscribeParams;
  book: WSUnifiedBookSubscribeParams;
  ohlc: WSUnifiedOHLCSubscribeParams;
  trade: WSUnifiedTradeSubscribeParams;
  instrument: WSUnifiedInstrumentSubscribeParams;
}

export type WSUnifiedPublicTopic = keyof WSUnifiedPublicSubscribeParamMap;

/** Reuse the complete request when unsubscribing so the subscription cache can remove it. */
export type WSUnifiedPublicTopicRequest = {
  [TTopic in WSUnifiedPublicTopic]: {
    topic: TTopic;
    payload: WSUnifiedPublicSubscribeParamMap[TTopic];
  };
}[WSUnifiedPublicTopic];
