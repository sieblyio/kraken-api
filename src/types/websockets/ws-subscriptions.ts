export const WS_SPOT_PUBLIC_TOPICS = [
  'ticker',
  'book',
  'ohlc',
  'trade',
  'instrument',
] as const; // Note: Admin topics (Status, Heartbeat & Ping are automatically used internally and can't be subscribed to manually).

export type WSSpotPublicTopic = (typeof WS_SPOT_PUBLIC_TOPICS)[number];

export const WS_SPOT_PRIVATE_TOPICS = [
  'executions',
  'balances',
  'level3',
] as const;

export type WSSpotPrivateTopic = (typeof WS_SPOT_PRIVATE_TOPICS)[number];

export type WSSpotTopic = WSSpotPublicTopic | WSSpotPrivateTopic;

export const WS_DERIVATIVES_PUBLIC_TOPICS = [
  'ticker',
  'ticker_lite',
  'book',
  'trade',
] as const;

export type WSDerivativesPublicTopic =
  (typeof WS_DERIVATIVES_PUBLIC_TOPICS)[number];

export const WS_DERIVATIVES_PRIVATE_TOPICS = [
  'open_orders',
  'open_orders_verbose',
  'fills',
  'balances',
  'open_positions',
  'account_log',
  'notifications_auth',
] as const;

export type WSDerivativesPrivateTopic =
  (typeof WS_DERIVATIVES_PRIVATE_TOPICS)[number];

export type WSDerivativesTopic =
  | WSDerivativesPublicTopic
  | WSDerivativesPrivateTopic;

export type WSTopic = WSSpotTopic | WSDerivativesTopic;

export interface WSSpotInstrumentSubscribeParams {
  execution_venue?: 'international' | 'bitnomial-exchange';
  snapshot?: boolean;
}

export interface WSSpotExecutionsSubscribeParams {
  symbol?: string[];
  snap_trades?: boolean;
  snapshot?: boolean;
  rebased?: boolean;
}

export interface WSSpotBalancesSubscribeParams {
  snapshot?: boolean;
  rebased?: boolean;
}

/** Spot public v2 `book` subscribe payload. Spread into `params` beside `channel`. */
export interface WSSpotPublicBookParams {
  symbol: string[];
  /** 10, 25, 100, 500, or 1000. Default 10. */
  depth?: 10 | 25 | 100 | 500 | 1000;
  /** Default true. */
  snapshot?: boolean;
}

/** Derivatives public v1 `book` subscribe payload. Spread beside `feed`. */
export interface WSDerivativesPublicBookParams {
  product_ids: string[];
}

export type WSPublicBookParams =
  | WSSpotPublicBookParams
  | WSDerivativesPublicBookParams;
