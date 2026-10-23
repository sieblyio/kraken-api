/**
 * Order Management
 */

export interface FuturesBatchOrderSend {
  order: 'send';
  order_tag: string;
  orderType:
    | 'lmt'
    | 'post'
    | 'ioc'
    | 'mkt'
    | 'stp'
    | 'take_profit'
    | 'trailing_stop'
    | 'fok';
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  limitPrice?: number;
  stopPrice?: number;
  cliOrdId?: string;
  triggerSignal?: 'mark' | 'index' | 'last';
  reduceOnly?: boolean;
  trailingStopMaxDeviation?: number;
  trailingStopDeviationUnit?: 'PERCENT' | 'QUOTE_CURRENCY';
}

export interface FuturesBatchOrderEdit {
  order: 'edit';
  order_id: string;
  cliOrdId?: string | null;
  /**
   * New size for this batch edit.
   *
   * Kraken reads this with `qtyMode`, which defaults to `RELATIVE` when omitted.
   * `RELATIVE` sets the current open (remaining / unfilled) size to `size`.
   * Past fills stay on the order and are not part of `size`.
   * `ABSOLUTE` sets the total order size, including past fills, to `size`.
   */
  size?: number;
  limitPrice?: number;
  stopPrice?: number;
  trailingStopMaxDeviation?: number;
  trailingStopDeviationUnit?: 'PERCENT' | 'QUOTE_CURRENCY';
  /**
   * How `size` is interpreted. Defaults to `RELATIVE` (open / remaining size).
   * `ABSOLUTE` sets the total order size, including past fills.
   */
  qtyMode?: 'ABSOLUTE' | 'RELATIVE';
}

export interface FuturesBatchOrderCancel {
  order: 'cancel';
  order_id?: string;
  cliOrdId?: string;
}

export interface FuturesBatchOrderParams {
  ProcessBefore?: string;
  json: {
    batchOrder: (
      | FuturesBatchOrderSend
      | FuturesBatchOrderEdit
      | FuturesBatchOrderCancel
    )[];
  };
}

export interface FuturesCancelOrderParams {
  processBefore?: string;
  order_id?: string;
  cliOrdId?: string;
}

export interface FuturesEditOrderParams {
  processBefore?: string;
  orderId?: string;
  cliOrdId?: string;
  /**
   * New size for the order.
   *
   * Kraken reads this with `qtyMode`, which defaults to `RELATIVE` when omitted.
   * `RELATIVE` sets the current open (remaining / unfilled) size to `size`.
   * Past fills stay on the order and are not part of `size`.
   * `ABSOLUTE` sets the total order size, including past fills, to `size`.
   *
   * A partially filled order edited with the default mode keeps its fills and
   * rests `size` more. Pass `qtyMode: 'ABSOLUTE'` when `size` is the new total.
   *
   * @see https://docs.kraken.com/api-reference/order-management/edit-order
   */
  size?: number;
  limitPrice?: number;
  stopPrice?: number;
  trailingStopMaxDeviation?: number;
  trailingStopDeviationUnit?: 'PERCENT' | 'QUOTE_CURRENCY';
  /**
   * How `size` is interpreted. Defaults to `RELATIVE` (open / remaining size).
   * `ABSOLUTE` sets the total order size, including past fills.
   */
  qtyMode?: 'ABSOLUTE' | 'RELATIVE';
}

export interface FuturesSendOrderParams {
  processBefore?: string;
  orderType:
    | 'lmt'
    | 'post'
    | 'ioc'
    | 'mkt'
    | 'stp'
    | 'take_profit'
    | 'trailing_stop'
    | 'fok';
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  limitPrice?: number;
  stopPrice?: number;
  cliOrdId?: string;
  triggerSignal?: 'mark' | 'index' | 'last';
  reduceOnly?: boolean;
  trailingStopMaxDeviation?: number;
  trailingStopDeviationUnit?: 'PERCENT' | 'QUOTE_CURRENCY';
  limitPriceOffsetValue?: number;
  limitPriceOffsetUnit?: 'QUOTE_CURRENCY' | 'PERCENT';
  broker?: string;
}

/**
 * Assignment Program
 */

export interface FuturesAddAssignmentPreferenceParams {
  contractType: string;
  contract?: string;
  maxSize?: number;
  maxPosition?: number;
  acceptLong: boolean;
  acceptShort: boolean;
  timeFrame: 'all' | 'weekdays' | 'weekends';
  enabled: boolean;
  minimumProfitabilityPerAssignmentLongBps?: number;
  minimumProfitabilityPerAssignmentShortBps?: number;
}

/**
 * Trading Settings
 */

export interface FuturesSetRfqAssignmentMaxLeverageParams {
  maxLeverage: number;
}

export interface FuturesUpdateSelfTradeStrategyParams {
  strategy:
    | 'REJECT_TAKER'
    | 'CANCEL_MAKER_SELF'
    | 'CANCEL_MAKER_CHILD'
    | 'CANCEL_MAKER_ANY';
}

/**
 * Transfers
 */

export interface FuturesInitiateWalletTransferParams {
  fromAccount: string;
  toAccount: string;
  unit: string;
  amount: number;
}

export interface FuturesInitiateSubaccountTransferParams {
  fromUser: string;
  toUser: string;
  fromAccount: string;
  toAccount: string;
  unit: string;
  amount: string;
}

export interface FuturesSubmitToSpotParams {
  currency: string;
  amount: string;
  sourceWallet?: string;
}

/**
 * Account History
 */

export interface FuturesHistoryBaseParams {
  since?: number; // Timestamp in milliseconds
  before?: number; // Timestamp in milliseconds
  sort?: 'asc' | 'desc';
  continuation_token?: string; // base64
  count?: number;
  tradeable?: string;
}

export interface FuturesGetOrderEventsParams extends FuturesHistoryBaseParams {
  opened?: boolean;
  closed?: boolean;
}

export interface FuturesGetTriggerEventsParams
  extends FuturesHistoryBaseParams {
  opened?: boolean;
  closed?: boolean;
}

export interface FuturesGetPositionEventsParams
  extends FuturesHistoryBaseParams {
  opened?: boolean;
  closed?: boolean;
  increased?: boolean;
  decreased?: boolean;
  reversed?: boolean;
  no_change?: boolean;
  trades?: boolean;
  funding_realization?: boolean;
  settlement?: boolean;
}

export interface FuturesGetAccountLogParams {
  since?: number; // Timestamp in milliseconds
  before?: number; // Timestamp in milliseconds
  from?: number; // ID of the first entry (inclusive)
  to?: number; // ID of the last entry (inclusive)
  sort?: 'asc' | 'desc';
  info?: string[]; // Types of entry to filter by
  count?: number;
  conversion_details?: boolean;
}

/**
 * Market History
 */

export interface FuturesMarketHistoryBaseParams {
  tradeable: string; // Symbol of the contract
  since?: number; // Timestamp in milliseconds
  before?: number; // Timestamp in milliseconds
  sort?: 'asc' | 'desc';
  continuation_token?: string; // base64
  count?: number;
}

/**
 * Charts - Candles
 */

export interface FuturesGetCandlesParams {
  tickType: 'spot' | 'mark' | 'trade';
  symbol: string;
  resolution: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '12h' | '1d' | '1w';
  from?: number; // From date in epoch seconds
  to?: number; // To date in epoch seconds
  count?: number; // Number of candles to return
}

/**
 * Charts - Analytics
 */

export interface FuturesGetAnalyticsParams {
  symbol: string;
  analyticsType: string;
  since: number; // Epoch time in seconds (required)
  interval: 60 | 300 | 900 | 1800 | 3600 | 14400 | 43200 | 86400 | 604800; // Resolution in seconds (required)
  to?: number; // Epoch time in seconds, default now
}
