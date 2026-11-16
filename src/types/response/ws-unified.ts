import { WSAPIAddSpotOrderParams } from '../request/wsapi.types.js';
import { WSSpotStatusData } from '../websockets/ws-events.js';
import {
  WSUnifiedAssetClass,
  WSUnifiedBookDepth,
  WSUnifiedLevel3Depth,
  WSUnifiedOHLCInterval,
  WSUnifiedOHLCTickType,
  WSUnifiedPrivateTopic,
  WSUnifiedPublicTopic,
} from '../websockets/ws-unified.js';

export interface WSUnifiedTickerData {
  symbol: string;
  bid: number;
  bid_qty: number;
  ask: number;
  ask_qty: number;
  /** Only guaranteed when the market traded in the last 24 hours. */
  last?: number;
  volume: number;
  vwap: number;
  low: number;
  high: number;
  change: number;
  change_pct: number;
  timestamp: string;
  /** Additional fields observed on the unified derivatives feed. */
  volume_quote?: number;
  suspended?: boolean;
  open?: number;
  mark?: number;
  index?: number;
  premium?: number;
  open_interest?: number;
  funding_rate?: number;
  funding_rate_prediction?: number;
  relative_funding_rate?: number;
  relative_funding_rate_prediction?: number;
  trades?: number;
  next_funding_rate_time?: string;
}

export interface WSUnifiedBookLevel {
  price: number;
  /** Zero quantity removes a price level. */
  qty: number;
}

export interface WSUnifiedBookData {
  symbol: string;
  bids: WSUnifiedBookLevel[];
  asks: WSUnifiedBookLevel[];
  /** Exchange-provided CRC32 checksum for the top 10 bids and asks. */
  checksum: number;
  timestamp: string;
}

export interface WSUnifiedOHLCData {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vwap: number;
  trades: number;
  volume: number;
  interval_begin: string;
  interval: WSUnifiedOHLCInterval;
  /** @deprecated Use interval_begin. */
  timestamp?: string;
}

export interface WSUnifiedTradeData {
  symbol: string;
  side: 'buy' | 'sell';
  qty: number;
  price: number;
  ord_type: 'limit' | 'market';
  /** Documented by Kraken, but omitted on the current derivatives feed. */
  trade_id?: number;
  timestamp: string;
}

export interface WSUnifiedInstrumentAsset {
  id: string;
  status:
    | 'depositonly'
    | 'disabled'
    | 'enabled'
    | 'fundingtemporarilydisabled'
    | 'withdrawalonly'
    | 'workinprogress';
  precision: number;
  precision_display: number;
  borrowable: boolean;
  collateral_value?: number;
  margin_rate?: number;
  multiplier?: number;
  class?: string;
}

export interface WSUnifiedInstrumentPair {
  symbol: string;
  base: string;
  quote: string;
  status:
    | 'cancel_only'
    | 'delisted'
    | 'limit_only'
    | 'maintenance'
    | 'online'
    | 'post_only'
    | 'reduce_only'
    | 'work_in_progress';
  price_precision: number;
  /** Use the published increment, which need not be a power of ten. */
  price_increment: number;
  qty_precision: number;
  qty_increment: number;
  qty_min: number;
  cost_min?: number;
  cost_precision?: number;
  has_index?: boolean;
  margin_initial?: number;
  marginable?: boolean;
  position_limit_long?: number;
  position_limit_short?: number;
  ws_display_price_precision?: number;
  /** @deprecated Use price_increment. */
  tick_size?: number;
}

export interface WSUnifiedInstrumentData {
  assets: WSUnifiedInstrumentAsset[];
  pairs: WSUnifiedInstrumentPair[];
}

export interface WSUnifiedLevel3Order {
  order_id: string;
  limit_price: number;
  order_qty: number;
  timestamp: string;
}

export interface WSUnifiedLevel3OrderUpdate extends WSUnifiedLevel3Order {
  event: 'add' | 'modify' | 'delete';
}

export interface WSUnifiedLevel3Data<
  TOrder extends WSUnifiedLevel3Order = WSUnifiedLevel3Order,
> {
  symbol: string;
  bids: TOrder[];
  asks: TOrder[];
  checksum: number;
  /** Documented, but omitted from Kraken's example messages. */
  timestamp?: string;
}

export type WSUnifiedLevel3Event = { channel: 'level3' } & (
  | { type: 'snapshot'; data: WSUnifiedLevel3Data[] }
  | { type: 'update'; data: WSUnifiedLevel3Data<WSUnifiedLevel3OrderUpdate>[] }
);

export interface WSUnifiedPublicDataMap {
  ticker: WSUnifiedTickerData[];
  book: WSUnifiedBookData[];
  ohlc: WSUnifiedOHLCData[];
  trade: WSUnifiedTradeData[];
  instrument: WSUnifiedInstrumentData;
  level3: WSUnifiedLevel3Data[];
}

/** Raw exchange messages, discriminated by channel. No asset_class is added or inferred. */
export type WSUnifiedPublicDataEvent<
  TTopic extends WSUnifiedPublicTopic = WSUnifiedPublicTopic,
> = {
  [TChannel in TTopic]: TChannel extends 'level3'
    ? WSUnifiedLevel3Event
    : {
        channel: TChannel;
        type: 'snapshot' | 'update';
        data: WSUnifiedPublicDataMap[TChannel];
      };
}[TTopic];

export type WSUnifiedExchangeStatus = WSSpotStatusData['system'] | 'offline';

/** Reuses v2 maintenance metadata; unified deployments also report each exchange separately. */
export interface WSUnifiedStatusData extends Omit<WSSpotStatusData, 'system'> {
  system?: WSSpotStatusData['system'];
  spot_exchange?: WSUnifiedExchangeStatus;
  futures_exchange?: WSUnifiedExchangeStatus;
  margin?: WSUnifiedExchangeStatus;
}

export interface WSUnifiedStatusEvent {
  channel: 'status';
  type: 'update';
  data: WSUnifiedStatusData[];
}

/** Payload emitted by WebsocketClient's message event for unifiedPublicV2. */
export type WSUnifiedPublicMessageEvent = (
  | WSUnifiedPublicDataEvent
  | WSUnifiedStatusEvent
) & {
  wsKey: 'unifiedPublicV2';
  isWSAPIResponse: false;
};

export type WSUnifiedPublicSubscriptionResult = {
  [TTopic in WSUnifiedPublicTopic]: {
    channel: TTopic;
    snapshot?: boolean;
    warnings?: string[];
  } & (TTopic extends 'instrument' ? { symbol?: string } : { symbol: string }) &
    (TTopic extends 'book' ? { depth?: WSUnifiedBookDepth } : object) &
    (TTopic extends 'level3' ? { depth?: WSUnifiedLevel3Depth } : object) &
    (TTopic extends 'ohlc'
      ? {
          interval?: WSUnifiedOHLCInterval;
          tick_type?: WSUnifiedOHLCTickType;
        }
      : object);
}[WSUnifiedPublicTopic];

/** Each symbol can receive its own acknowledgement with the same req_id. */
export type WSUnifiedPublicSubscriptionResponse = {
  method: 'subscribe' | 'unsubscribe';
  req_id?: number;
} & (
  | {
      success: true;
      result: WSUnifiedPublicSubscriptionResult;
      time_in: string;
      time_out: string;
    }
  | {
      success: false;
      error: string;
      result?: WSUnifiedPublicSubscriptionResult;
      time_in?: string;
      time_out?: string;
    }
);

export type WSUnifiedPublicResponseEvent =
  WSUnifiedPublicSubscriptionResponse & {
    wsKey: 'unifiedPublicV2';
    isWSAPIResponse: false;
  };

/** Heartbeats and successful pongs are consumed internally by the client. */
export interface WSUnifiedHeartbeatEvent {
  channel: 'heartbeat';
}

export interface WSUnifiedPongEvent {
  method: 'pong';
  req_id?: number;
  time_in: string;
  time_out: string;
  success?: boolean;
  error?: string;
}

/** Execution updates are partial reports. Fields depend on exec_type and asset class. */
export interface WSUnifiedExecutionData {
  order_id: string;
  exec_type:
    | 'pending_new'
    | 'new'
    | 'trade'
    | 'filled'
    | 'iceberg_refill'
    | 'canceled'
    | 'expired'
    | 'amended'
    | 'restated'
    | 'status';
  timestamp: string;
  order_status?:
    | 'pending_new'
    | 'new'
    | 'partially_filled'
    | 'filled'
    | 'canceled'
    | 'expired';
  amended?: boolean;
  avg_price?: number;
  cash_order_qty?: number;
  cl_ord_id?: string;
  contingent?: WSAPIAddSpotOrderParams['conditional'];
  cost?: number;
  cum_cost?: number;
  cum_qty?: number;
  display_qty?: number;
  display_qty_remain?: number;
  effective_time?: string;
  exec_id?: string;
  expire_time?: string;
  ext_ord_id?: string;
  ext_exec_id?: string;
  fees?: { asset: string; qty: number }[];
  /** Derivatives reports can carry a single fee instead of fees. */
  fee?: number;
  fee_ccy_pref?: 'fcib' | 'fciq';
  fee_usd_equiv?: number;
  limit_price?: number;
  limit_price_type?: WSAPIAddSpotOrderParams['limit_price_type'];
  liquidated?: boolean;
  liquidity_ind?: 'm' | 't';
  last_price?: number;
  last_qty?: number;
  margin?: boolean;
  margin_borrow?: boolean;
  no_mpp?: boolean;
  ord_ref_id?: string;
  order_qty?: number;
  order_type?: WSAPIAddSpotOrderParams['order_type'];
  order_userref?: number;
  post_only?: boolean;
  position_status?: 'opened' | 'closing' | 'closed';
  ratecount?: number;
  reason?: string;
  reduce_only?: boolean;
  remaining_qty?: number;
  sender_sub_id?: string;
  /** Derivatives per-market 64-bit trade sequence. Keep as a string. */
  sequence_id?: string;
  side?: 'buy' | 'sell';
  symbol?: string;
  time_in_force?: 'GTC' | 'GTD' | 'IOC' | 'FOK';
  /** Spot uses numeric trade IDs; derivatives reports use strings. */
  trade_id?: number | string;
  triggers?: NonNullable<WSAPIAddSpotOrderParams['triggers']> & {
    actual_price?: number;
    peak_price?: number;
    last_price?: number;
    status?: 'triggered' | 'untriggered';
    timestamp?: string;
  };
  /** @deprecated Use reason. */
  cancel_reason?: string;
  /** @deprecated Use triggers. */
  stop_price?: number;
  /** @deprecated Use triggers. */
  trigger?: 'index' | 'last';
  /** @deprecated Use triggers. */
  triggered_price?: number;
}

export interface WSUnifiedExecutionsEvent {
  channel: 'executions';
  type: 'snapshot' | 'update';
  data: WSUnifiedExecutionData[];
  asset_class?: WSUnifiedAssetClass;
  /** Omitted from Kraken's derivatives example. */
  sequence?: number;
}

export type WSUnifiedWalletType =
  | 'spot'
  | 'earn'
  | 'derivatives_holding'
  | 'derivatives_multi_collateral'
  | 'derivatives_single_collateral';

export interface WSUnifiedBalanceData {
  asset: string;
  balance: number;
  wallets: {
    type: WSUnifiedWalletType;
    /** Named wallet or a single-collateral wallet identifier. */
    id: string;
    balance: number;
  }[];
}

export interface WSUnifiedBalanceUpdateData {
  asset: string;
  amount: number;
  balance: number;
  fee: number;
  ledger_id: string;
  /** Omitted for derivatives balance events. */
  ref_id?: string;
  timestamp: string;
  /** Includes Spot ledger types and derivatives-prefixed types. */
  type: string;
  subtype?: string;
  category?: string;
  wallet_type: WSUnifiedWalletType;
  wallet_id: string;
}

export type WSUnifiedBalancesEvent = {
  channel: 'balances';
  /** Omitted from Kraken's derivatives examples. */
  sequence?: number;
} & (
  | { type: 'snapshot'; data: WSUnifiedBalanceData[] }
  | { type: 'update'; data: WSUnifiedBalanceUpdateData[] }
);

export interface WSUnifiedPosition {
  tradeable: string;
  /** A zero size in a default-feed update closes the position. */
  size: string;
  entry_price: string;
  fill_time?: string;
}

/** Unavailable figures are omitted. All numeric figures retain their wire-format strings. */
export interface WSUnifiedPositionWithMargin {
  tradeable: string;
  size?: string;
  entry_price?: string;
  fill_time?: string;
  mark_price?: string;
  index_price?: string;
  pnl?: string;
}

export interface WSUnifiedFuturesPositionWithMargin
  extends WSUnifiedPositionWithMargin {
  initial_margin?: string;
  initial_margin_with_orders?: string;
  maintenance_margin?: string;
  unrealized_funding?: string;
  liquidation_threshold?: string;
  effective_leverage?: string;
  return_on_equity?: string;
  max_fixed_leverage?: string;
  pnl_currency?: string;
}

export interface WSUnifiedOptionsPositionWithMargin
  extends WSUnifiedPositionWithMargin {
  iv?: string;
  delta?: string;
  gamma?: string;
  vega?: string;
  theta?: string;
  rho?: string;
}

export interface WSUnifiedPositionsData {
  time: string;
  futures: WSUnifiedPosition[];
  options: WSUnifiedPosition[];
}

export interface WSUnifiedPositionsWithMarginData {
  time: string;
  futures: WSUnifiedFuturesPositionWithMargin[];
  options: WSUnifiedOptionsPositionWithMargin[];
}

export type WSUnifiedPositionsEvent = { channel: 'positions' } & (
  | { type: 'snapshot' | 'update'; data: WSUnifiedPositionsData }
  /** No type field: each enriched message replaces the account's positions. */
  | { type?: never; data: WSUnifiedPositionsWithMarginData }
);

/** Shared margin figures, all in USD. Missing figures are omitted by Kraken. */
export interface WSUnifiedMarginFigures {
  initial_margin?: string;
  initial_margin_without_orders?: string;
  maintenance_margin?: string;
  pnl?: string;
  unrealized_funding?: string;
  total_unrealized?: string;
  total_unrealized_as_margin?: string;
}

export interface WSUnifiedCollateralMarginFigures
  extends WSUnifiedMarginFigures {
  balance_value?: string;
  portfolio_value?: string;
  collateral_value?: string;
  margin_equity?: string;
  available_margin?: string;
}

export interface WSUnifiedMultiCollateralMarginData
  extends WSUnifiedCollateralMarginFigures {
  time: string;
  cross?: WSUnifiedCollateralMarginFigures & { effective_leverage?: string };
  isolated: (WSUnifiedMarginFigures & { tradeable: string })[];
}

export interface WSUnifiedSingleCollateralMarginWallet {
  base_currency: string;
  quote_currency: string;
  unit: string;
  balance?: string;
  portfolio_value?: string;
  initial_margin?: string;
  maintenance_margin?: string;
  available?: string;
  unrealized_funding?: string;
  pnl?: string;
}

export interface WSUnifiedSingleCollateralMarginData {
  time: string;
  wallets: WSUnifiedSingleCollateralMarginWallet[];
}

/** Each message replaces its section of margin state. */
export type WSUnifiedMarginEvent = { channel: 'margin' } & (
  | { type: 'multi_collateral'; data: WSUnifiedMultiCollateralMarginData }
  | { type: 'single_collateral'; data: WSUnifiedSingleCollateralMarginData }
);

export interface WSUnifiedLedgerData {
  ledger_id: string;
  timestamp: string;
  type: string;
  asset: string;
  asset_class: 'currency' | 'equity' | 'tokenized_asset' | 'derivatives';
  wallet_type: WSUnifiedWalletType;
  wallet_id?: string;
  amount: number;
  balance: number;
  /** Omitted on derivatives position entries. */
  fee?: number;
  old_average_entry_price?: number;
  new_average_entry_price?: number;
  trade_price?: number;
  mark_price?: number;
  realized_pnl?: number;
  realized_funding?: number;
  funding_rate?: number;
  liquidation_fee?: number;
  conversion_spread_percentage?: number;
  event_uuid?: string;
}

export interface WSUnifiedLedgersEvent {
  channel: 'ledgers';
  type: 'update';
  data: WSUnifiedLedgerData[];
  sequence: number;
}

export interface WSUnifiedPreferencesData {
  futures_trading: 'enabled' | 'reduce_only' | 'disabled';
}

export interface WSUnifiedPreferencesEvent {
  channel: 'preferences';
  type: 'snapshot' | 'update';
  data: WSUnifiedPreferencesData;
}

export type WSUnifiedPrivateDataEvent =
  | WSUnifiedExecutionsEvent
  | WSUnifiedBalancesEvent
  | WSUnifiedPositionsEvent
  | WSUnifiedMarginEvent
  | WSUnifiedLedgersEvent
  | WSUnifiedPreferencesEvent;

export type WSUnifiedPrivateMessageEvent = (
  | WSUnifiedPrivateDataEvent
  | WSUnifiedStatusEvent
) & {
  wsKey: 'unifiedPrivateV2';
  isWSAPIResponse: false;
};

export type WSUnifiedPrivateSubscriptionResult = {
  [TTopic in WSUnifiedPrivateTopic]: {
    channel: TTopic;
    warnings?: string[];
  } & (TTopic extends 'executions'
    ? {
        asset_class?: WSUnifiedAssetClass;
        snap_orders?: boolean;
        snap_trades?: boolean;
        maxratecount?: number;
        snapshot?: boolean;
      }
    : TTopic extends 'balances'
      ? { snapshot?: boolean }
      : TTopic extends 'positions'
        ? { asset_class?: 'derivatives'; with_margin?: true }
        : TTopic extends 'margin'
          ? { asset_class?: 'derivatives' }
          : object);
}[WSUnifiedPrivateTopic];

export type WSUnifiedPrivateSubscriptionResponse = {
  method: 'subscribe' | 'unsubscribe';
  req_id?: number;
} & (
  | {
      success: true;
      result: WSUnifiedPrivateSubscriptionResult;
      time_in: string;
      time_out: string;
    }
  | {
      success: false;
      error: string;
      result?: WSUnifiedPrivateSubscriptionResult;
      time_in?: string;
      time_out?: string;
    }
);

export type WSUnifiedPrivateResponseEvent =
  WSUnifiedPrivateSubscriptionResponse & {
    wsKey: 'unifiedPrivateV2';
    isWSAPIResponse: false;
  };

/** Channel-level failures are emitted on exception, including failures after subscription. */
export type WSUnifiedPrivateChannelError =
  | {
      channel: 'positions';
      type?: 'snapshot';
      error: 'snapshot_too_large';
      data: { futures: []; options: [] };
    }
  | {
      channel: 'positions';
      type?: never;
      error: 'margin_unavailable';
      /** The live service omits data when the margin subscription is dropped. */
      data?: never;
    }
  | { channel: 'margin'; error: 'margin_unavailable' };

export type WSUnifiedPrivateExceptionEvent = (
  | Extract<WSUnifiedPrivateSubscriptionResponse, { success: false }>
  | WSUnifiedPrivateChannelError
) & {
  wsKey: 'unifiedPrivateV2';
  isWSAPIResponse: false;
};
