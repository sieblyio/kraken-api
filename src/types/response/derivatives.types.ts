/**
 * Market Data
 */

export interface FuturesTradeHistoryItem {
  price: number;
  side?: string; // "buy" if taker is buyer, "sell" if taker is seller
  size?: string;
  time: string;
  trade_id?: number;
  type?: 'fill' | 'liquidation' | 'assignment' | 'termination' | 'block';
  uid?: string;
  instrument_identification_type?: string;
  isin?: string;
  execution_venue?: string;
  price_notation?: string;
  price_currency?: string;
  notional_amount?: number;
  notional_currency?: string;
  publication_time?: string;
  publication_venue?: string;
  transaction_identification_code?: string;
  to_be_cleared?: boolean;
}

export interface FuturesOrderBook {
  asks: [number, number][]; // [price, size]
  bids: [number, number][]; // [price, size]
}

export interface TickerGreeks {
  iv: number; // Implied volatility, -1.0 if impossible to calculate
  delta: number;
  gamma: number | null;
  vega: number | null;
  theta: number | null;
  rho: number | null;
}

export interface FuturesTicker {
  symbol: string;
  last?: number;
  lastTime?: string;
  lastSize?: number;
  tag: 'perpetual' | 'month' | 'quarter' | 'semiannual';
  pair: string;
  markPrice: number;
  bid?: number;
  bidSize?: number;
  ask?: number;
  askSize?: number;
  vol24h: number;
  volumeQuote: number;
  openInterest: number;
  open24h?: number;
  high24h?: number;
  low24h?: number;
  extrinsicValue?: number; // Only for options
  fundingRate?: number; // Only for perpetuals
  fundingRatePrediction?: number; // Only for perpetuals
  suspended: boolean;
  indexPrice: number;
  postOnly: boolean;
  change24h: number;
  greeks?: TickerGreeks; // Only for options
  isUnderlyingMarketClosed?: boolean; // Only for tradfi markets
}

/**
 * Instrument Details
 */

export interface FuturesMarginLevel {
  contracts?: number | null;
  numNonContractUnits?: number | null;
  initialMargin: number;
  maintenanceMargin: number;
}

export interface FuturesMarginSchedule {
  retail: FuturesMarginLevel[];
  professional: FuturesMarginLevel[];
}

export interface FuturesInstrument {
  symbol: string;
  type: 'flexible_futures' | 'futures_inverse' | 'futures_vanilla';
  tradeable: boolean;
  tradfi: boolean;
  pair?: string;
  base?: string;
  quote?: string;
  underlying?: string;
  tickSize?: number;
  contractSize?: number;
  contractValueTradePrecision?: number;
  impactMidSize?: number;
  maxPositionSize?: number;
  openingDate?: string;
  lastTradingTime?: string;
  category?: string;
  fundingRateCoefficient?: number;
  maxRelativeFundingRate?: number;
  isin?: string;
  marginSchedules?: Record<string, FuturesMarginSchedule>;
  retailMarginLevels?: FuturesMarginLevel[];
  marginLevels?: FuturesMarginLevel[];
  postOnly?: boolean;
  /** Maker protection window in milliseconds. Omitted when the market has no Maker Protection. */
  makerProtectionMillis?: number;
  /** @deprecated Effective 2026-06-22. Fee schedules are deprecated; use Spot GetTradeVolume instead. */
  feeScheduleUid?: string;
  tags?: string[];
  underlyingFuture?: string;
  mtf?: boolean;
}

export interface FuturesInstrumentStatus {
  tradeable: string;
  experiencingDislocation: boolean;
  priceDislocationDirection: 'ABOVE_UPPER_BOUND' | 'BELOW_LOWER_BOUND' | null;
  experiencingExtremeVolatility: boolean;
  extremeVolatilityInitialMarginMultiplier: number;
}

/**
 * Order Management
 */

export interface FuturesOrderJson {
  orderId: string;
  cliOrdId?: string | null;
  type:
    | 'lmt'
    | 'ioc'
    | 'post'
    | 'liquidation'
    | 'assignment'
    | 'stp'
    | 'unwind'
    | 'block'
    | 'fok'
    | 'unknown';
  symbol: string;
  side: 'buy' | 'sell' | 'unknown';
  quantity: number;
  filled: number;
  limitPrice: number;
  reduceOnly: boolean;
  timestamp: string;
  lastUpdateTimestamp: string;
  reducedQuantity?: number | null;
}

export interface FuturesOrderTriggerJson {
  uid: string;
  clientId: string | null;
  type:
    | 'lmt'
    | 'ioc'
    | 'post'
    | 'liquidation'
    | 'assignment'
    | 'stp'
    | 'unwind'
    | 'fok'
    | 'unknown';
  symbol: string;
  side: 'buy' | 'sell' | 'unknown';
  quantity: number | null;
  limitPrice: number | null;
  triggerPrice: number | null;
  triggerSide: 'trigger_above' | 'trigger_below' | 'unknown' | null;
  triggerSignal: 'mark_price' | 'last_price' | 'spot_price' | 'unknown' | null;
  reduceOnly: boolean;
  timestamp: string;
  lastUpdateTimestamp: string;
  startTime: string | null;
}

export interface FuturesPlaceEvent {
  type: 'PLACE';
  order: FuturesOrderJson;
}

export interface FuturesCancelEvent {
  type: 'CANCEL';
  uid: string;
  order: FuturesOrderJson;
}

export interface FuturesEditEvent {
  type: 'EDIT';
  old: FuturesOrderJson;
  new: FuturesOrderJson & { reducedQuantity: number | null };
}

export interface FuturesRejectEvent {
  type: 'REJECT';
  uid: string;
  order: FuturesOrderJson;
  reason: 'POST_WOULD_EXECUTE' | 'IOC_WOULD_NOT_EXECUTE';
}

export interface FuturesExecuteEvent {
  type: 'EXECUTION';
  executionId: string;
  price: number;
  amount: number;
  orderPriorEdit: FuturesOrderJson;
  orderPriorExecution: FuturesOrderJson & {
    takerReducedQuantity: number | null;
  };
}

export interface FuturesPlaceTriggerEvent {
  type: 'PLACE';
  orderTrigger: FuturesOrderTriggerJson;
}

export interface FuturesCancelTriggerEvent {
  type: 'CANCEL';
  uid: string;
  orderTrigger: FuturesOrderTriggerJson;
}

export interface FuturesRejectTriggerEvent {
  type: 'REJECT';
  uid: string;
  orderTrigger: FuturesOrderTriggerJson;
  reason:
    | 'MARKET_SUSPENDED'
    | 'MARKET_NOT_FOUND'
    | 'INVALID_PRICE'
    | 'INVALID_QUANTITY'
    | 'SMALL_ORDER_LIMIT_EXCEEDED'
    | 'INSUFFICIENT_MARGIN'
    | 'WOULD_CAUSE_LIQUIDATION'
    | 'CLIENT_ORDER_ID_IN_USE'
    | 'CLIENT_ORDER_ID_TOO_LONG'
    | 'MAX_POSITION_EXCEEDED'
    | 'PRICE_COLLAR'
    | 'PRICE_DISLOCATION'
    | 'EDIT_HAS_NO_EFFECT'
    | 'ORDER_FOR_CANCELLATION_NOT_FOUND'
    | 'ORDER_FOR_EDIT_NOT_FOUND'
    // REST v4 edit status. v3 reports the same case as editAlreadyHeld. Market data still uses EDIT_HAS_NO_EFFECT.
    | 'EDIT_ALREADY_HELD'
    | 'ORDER_CANNOT_HAVE_TRIGGER_PRICE'
    | 'POST_WOULD_EXECUTE'
    | 'IOC_WOULD_NOT_EXECUTE'
    | 'WOULD_EXECUTE_SELF'
    | 'WOULD_NOT_REDUCE_POSITION'
    | 'REJECTED_AFTER_EXECUTION'
    | 'MARKET_IS_POST_ONLY'
    | 'ORDER_LIMIT_EXCEEDED'
    | 'FIXED_LEVERAGE_TOO_HIGH'
    | 'CANNOT_EDIT_TRIGGER_PRICE_OF_TRAILING_STOP'
    | 'CANNOT_EDIT_LIMIT_PRICE_OF_TRAILING_STOP'
    | 'TRAILING_STOP_ORDER_LIMIT_EXCEEDED'
    | 'TRAILING_STOP_PERCENT_DEVIATION_EXCEEDS_MAX_DECIMAL_PLACES'
    | 'TRAILING_STOP_QUOTE_DEVIATION_NOT_MULTIPLE_OF_TICK_SIZE'
    | 'TRAILING_STOP_MAX_DEVIATION_TOO_LARGE'
    | 'TRAILING_STOP_MAX_DEVIATION_TOO_SMALL'
    | 'INSUFFICIENT_HEADROOM_AROUND_CURRENT_PRICE_TO_EDIT_TRAILING_STOP'
    | 'NO_REFERENCE_PRICE_AVAILABLE_FOR_CALCULATING_TRAILING_STOP_TRIGGER_PRICE'
    | 'INSUFFICIENT_CLOSING_MARGIN'
    | 'LIMIT_PRICE_SET_AS_ABSOLUTE_AND_RELATIVE'
    | 'LIMIT_PRICE_OFFSET_VALUE_INVALID'
    | 'LIMIT_PRICE_OFFSET_UNIT_INVALID'
    | 'LIMIT_PRICE_OFFSET_MUST_HAVE_VALUE_AND_UNIT'
    | 'LIMIT_PRICE_OFFSET_QUOTE_CURRENCY_VALUE_MUST_BE_MULTIPLE_OF_TICK_SIZE'
    | 'LIMIT_PRICE_OFFSET_PERCENT_VALUE_TOO_MANY_DECIMAL_PLACES'
    | 'LIMIT_PRICE_OFFSET_TOO_HIGH'
    | 'LIMIT_PRICE_OFFSET_TOO_LOW';
}

export type FuturesOrderEvent =
  | FuturesPlaceEvent
  | FuturesCancelEvent
  | FuturesEditEvent
  | FuturesRejectEvent
  | FuturesExecuteEvent
  | FuturesPlaceTriggerEvent
  | FuturesCancelTriggerEvent
  | FuturesRejectTriggerEvent;

export interface FuturesBatchOrderStatus {
  cliOrdId?: string;
  dateTimeReceived?: string | null;
  orderEvents: FuturesOrderEvent[];
  order_id?: string | null;
  order_tag?: string | null;
  status:
    | 'placed'
    | 'edited'
    | 'cancelled'
    | 'invalidOrderType'
    | 'invalidSide'
    | 'invalidSize'
    | 'invalidPrice'
    | 'insufficientAvailableFunds'
    | 'selfFill'
    | 'tooManySmallOrders'
    | 'marketSuspended'
    | 'marketInactive'
    | 'clientOrderIdAlreadyExist'
    | 'clientOrderIdTooLong'
    | 'outsidePriceCollar'
    | 'postWouldExecute'
    | 'iocWouldNotExecute'
    | 'orderForEditNotFound'
    | 'editAlreadyHeld';
}

export interface FuturesCancelledOrder {
  cliOrdId?: string | null;
  order_id: string;
}

export interface FuturesCancelAllOrdersStatus {
  cancelOnly: string;
  cancelledOrders: FuturesCancelledOrder[];
  orderEvents: FuturesOrderEvent[];
  receivedTime: string;
  status: 'noOrdersToCancel' | 'cancelled';
}

export interface FuturesDeadMansSwitchStatus {
  currentTime: string;
  triggerTime: string;
}

export interface FuturesCancelOrderStatus {
  cliOrdId?: string | null;
  orderEvents?: FuturesOrderEvent[];
  order_id?: string;
  receivedTime?: string;
  status: 'cancelled' | 'filled' | 'notFound';
}

export interface FuturesEditOrderStatus {
  orderId?: string | null;
  cliOrdId?: string | null;
  orderEvents: FuturesOrderEvent[];
  receivedTime?: string | null;
  status:
    | 'edited'
    | 'invalidSize'
    | 'invalidPrice'
    | 'insufficientAvailableFunds'
    | 'selfFill'
    | 'tooManySmallOrders'
    | 'outsidePriceCollar'
    | 'postWouldExecute'
    | 'wouldNotReducePosition'
    | 'orderForEditNotFound'
    | 'editAlreadyHeld'
    | 'orderForEditNotAStop';
}

export interface FuturesOpenOrder {
  order_id: string;
  cliOrdId?: string;
  status: 'untouched' | 'partiallyFilled';
  side: 'buy' | 'sell' | 'unknown';
  orderType: 'lmt' | 'stop' | 'take_profit' | 'unknown';
  symbol: string;
  limitPrice?: number;
  stopPrice?: number;
  filledSize: number;
  unfilledSize?: number;
  reduceOnly: boolean;
  triggerSignal?: 'mark' | 'last' | 'spot' | 'unknown';
  lastUpdateTime: string;
  receivedTime: string;
}

export interface FuturesSendOrderStatus {
  cliOrdId?: string;
  orderEvents?: FuturesOrderEvent[];
  order_id?: string;
  receivedTime?: string;
  status:
    | 'placed'
    | 'partiallyFilled'
    | 'filled'
    | 'cancelled'
    | 'edited'
    | 'marketSuspended'
    | 'marketInactive'
    | 'invalidPrice'
    | 'invalidSize'
    | 'tooManySmallOrders'
    | 'insufficientAvailableFunds'
    | 'wouldCauseLiquidation'
    | 'clientOrderIdAlreadyExist'
    | 'clientOrderIdTooBig'
    | 'maxPositionViolation'
    | 'outsidePriceCollar'
    | 'wouldIncreasePriceDislocation'
    | 'notFound'
    | 'orderForEditNotAStop'
    | 'orderForEditNotFound'
    | 'editAlreadyHeld'
    | 'postWouldExecute'
    | 'iocWouldNotExecute'
    | 'selfFill'
    | 'wouldNotReducePosition'
    | 'marketIsPostOnly'
    | 'tooManyOrders'
    | 'fixedLeverageTooHigh'
    | 'clientOrderIdInvalid'
    | 'cannotEditTriggerPriceOfTrailingStop'
    | 'cannotEditLimitPriceOfTrailingStop'
    | 'wouldProcessAfterSpecifiedTime';
}

export interface FuturesTriggerOptions {
  triggerPrice: number;
  triggerSide: 'TRIGGER_ABOVE' | 'TRIGGER_BELOW' | 'unknown';
  triggerSignal: 'MARK_PRICE' | 'LAST_PRICE' | 'SPOT_PRICE' | 'unknown';
  triggerTime: string | null;
}

export interface FuturesOrderStatusInfo {
  order: {
    type: 'TRIGGER_ORDER' | 'ORDER';
    orderId: string;
    cliOrdId: string | null;
    symbol: string;
    side: string;
    quantity: number | null;
    filled: number | null;
    limitPrice: number | null;
    reduceOnly: boolean;
    timestamp: string;
    lastUpdateTimestamp: string;
    priceTriggerOptions?: FuturesTriggerOptions;
  };
  status:
    | 'ENTERED_BOOK'
    | 'FULLY_EXECUTED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'TRIGGER_PLACED'
    | 'TRIGGER_ACTIVATION_FAILURE';
  updateReason:
    | 'LOADING_MARKET'
    | 'NEW_USER_ORDER'
    | 'LIQUIDATION_ORDER'
    | 'STOP_ORDER_TRIGGERED'
    | 'LIMIT_FROM_STOP'
    | 'PARTIAL_FILL'
    | 'FULL_FILL'
    | 'CANCELLED_BY_USER'
    | 'CONTRACT_EXPIRED'
    | 'NOT_ENOUGH_MARGIN'
    | 'MARKET_INACTIVE'
    | 'DEAD_MAN_SWITCH'
    | 'CANCELLED_BY_ADMIN'
    | 'POST_WOULD_EXECUTE_REASON'
    | 'IOC_WOULD_NOT_EXECUTE_REASON'
    | 'WOULD_EXECUTE_SELF_REASON'
    | 'WOULD_NOT_REDUCE_POSITION'
    | 'EDITED_BY_USER'
    | 'ORDER_FOR_EDIT_NOT_FOUND_REASON'
    | 'EXPIRED'
    | 'TRAILING_STOP_PRICE_UPDATED'
    | 'TRAILING_STOP_CANCELLED_AND_REPLACED_BY_ADMIN'
    | 'unknown';
  error?: string; // OrderError type - reusing the same errors as FuturesRejectTriggerEvent
}

/**
 * Multi-Collateral
 */

export interface FuturesPnlPreference {
  symbol: string;
  pnlCurrency: string;
}

export interface FuturesLeveragePreference {
  symbol: string;
  maxLeverage: number;
}

/**
 * Account Information
 */

export interface FuturesFlexCurrencySummary {
  quantity: number;
  value: number;
  collateral: number;
}

export interface FuturesPortfolioMarginBreakdown {
  totalCrossAssetNettedMarketRisk: number;
  totalMarketRisk: number;
  totalScenarioPnls: number[];
  totalAbsoluteOptionPositionDeltaNotional: number;
  netPortfolioDelta: number;
  totalPremium: number;
  isBuyOnly: boolean;
  futuresMaintenanceMargin: number;
}

export interface FuturesFlexAccount {
  type: 'multiCollateralMarginAccount';
  currencies: Record<string, FuturesFlexCurrencySummary>;
  available: number;
  initialMargin: number;
  initialMarginWithOrders: number;
  maintenanceMargin: number;
  balanceValue: number;
  portfolioValue: number;
  collateralValue: number;
  pnl: number;
  unrealizedFunding: number;
  totalUnrealized: number;
  totalUnrealizedAsMargin: number;
  availableMargin: number;
  marginEquity: number;
  portfolioMarginBreakdown?: FuturesPortfolioMarginBreakdown;
}

export interface FuturesCashAccount {
  type: 'cashAccount';
  balances: Record<string, string>;
}

export interface FuturesMarginAccount {
  type: 'marginAccount';
  currency: string;
  balances: Record<string, string>;
  auxiliary: {
    usd: number;
    pv: number;
    pnl: number;
    af: number;
    funding: number;
  };
  marginRequirements: {
    im: number;
    mm: number;
    lt: number;
    tt: number;
  };
  triggerEstimates: {
    im: number;
    mm: number;
    lt: number;
    tt: number;
  };
}

export interface FuturesAccounts {
  cash?: FuturesCashAccount;
  flex?: FuturesFlexAccount;
  [key: string]:
    | FuturesMarginAccount
    | FuturesCashAccount
    | FuturesFlexAccount
    | undefined;
}

export interface FuturesOpenPosition {
  symbol: string;
  side: 'long' | 'short';
  size: number;
  price: number;
  fillTime: string;
  unrealizedFunding: number | null;
  pnlCurrency?: string | null; // USD, EUR, GBP, USDC, USDT, BTC, ETH
  maxFixedLeverage?: number | null;
}

export interface FuturesUnwindQueuePosition {
  symbol: string;
  percentile: number;
}

export interface FuturesOptionsUserLimitsPerBaseCurrency {
  maxTotalPositionSize: number;
  maxTotalOpenOrdersSize: number;
}

export interface FuturesPortfolioMarginParameters {
  crossAssetNettingFactor: number;
  extremePriceShockMultiplier: number;
  volShockMultiplicationFactor: number;
  volShockExponentFactor: number;
  optionExpiryTimeShockHours: number;
  optionsInitialMarginFactor: number;
  totalOptionOrdersConsideredInInitialMarginCalc: number;
  priceShockLevels: number[];
  optionsUserLimits: {
    maxNetPositionDelta: number;
    limitsPerBaseCurrency: Record<
      string,
      FuturesOptionsUserLimitsPerBaseCurrency
    >;
  };
}

export interface FuturesOptionGreeks {
  iv: number; // -1.0 if impossible to calculate
  delta: number;
  gamma: number | null;
  vega: number | null;
  theta: number | null;
  rho: number | null;
}

export interface FuturesPortfolioSimulation {
  maintenanceMargin: number;
  initialMargin: number;
  pnl: number;
  portfolioMarginBreakdown: FuturesPortfolioMarginBreakdown;
  greeks: Record<string, FuturesOptionGreeks>;
}

/**
 * Assignment Program
 */

export interface FuturesAssignmentProgramParticipant {
  contractType: string;
  contract: string | null;
  maxSize: number | null;
  maxPosition: number | null;
  acceptLong: boolean;
  acceptShort: boolean;
  timeFrame: 'all' | 'weekdays' | 'weekends';
  enabled: boolean;
  minimumProfitabilityPerAssignmentLongBps?: number | null;
  minimumProfitabilityPerAssignmentShortBps?: number | null;
}

export interface FuturesAssignmentProgram {
  id: number;
  participant: FuturesAssignmentProgramParticipant;
  contractType: string;
  contract: string | null;
  maxSize: number | null;
  maxPosition: number | null;
  acceptLong: boolean;
  acceptShort: boolean;
  timeFrame: 'all' | 'weekdays' | 'weekends';
  enabled: boolean;
  minimumProfitabilityPerAssignmentLongBps?: number | null;
  minimumProfitabilityPerAssignmentShortBps?: number | null;
}

export interface FuturesAssignmentProgramHistory {
  deleted: boolean;
  participant: FuturesAssignmentProgramParticipant;
  contractType: string;
  contract: string | null;
  maxSize: number | null;
  maxPosition: number | null;
  acceptLong: boolean;
  acceptShort: boolean;
  timeFrame: 'all' | 'weekdays' | 'weekends';
  enabled: boolean;
  timestamp: string;
  minimumProfitabilityPerAssignmentLongBps?: number | null;
  minimumProfitabilityPerAssignmentShortBps?: number | null;
}

/**
 * Fee Schedules
 *
 * @deprecated Effective 2026-06-22. Use Spot GetTradeVolume (SpotClient.getTradingVolume) instead.
 */

export interface FuturesFeeTier {
  makerFee: number;
  takerFee: number;
  usdVolume: number;
}

export interface FuturesFeeSchedule {
  tiers: FuturesFeeTier[];
  name: string;
  uid: string;
}

/**
 * General
 */

export interface FuturesNotification {
  effectiveTime: string;
  note: string;
  priority: 'low' | 'medium' | 'high';
  type:
    | 'new_feature'
    | 'bug_fix'
    | 'settlement'
    | 'general'
    | 'maintenance'
    | 'market';
  expectedDowntimeMinutes?: number;
}

/**
 * Historical Data
 */

export interface FuturesFill {
  cliOrdId?: string | null;
  fillTime: string;
  fillType:
    | 'maker'
    | 'taker'
    | 'liquidation'
    | 'assignor'
    | 'assignee'
    | 'takerAfterEdit'
    | 'unwindBankrupt'
    | 'unwindCounterparty';
  fill_id: string;
  order_id: string;
  price: number;
  side: 'buy' | 'sell' | 'unknown';
  size: number;
  symbol: string;
}

/**
 * Historical Funding Rates
 */

export interface FuturesHistoricalFundingRate {
  fundingRate: number;
  relativeFundingRate: number;
  timestamp: string;
}

/**
 * Subaccounts
 */

export interface FuturesHoldingAccount {
  currency: string;
  amount: number;
}

export interface FuturesSingleCollateralAccount {
  name: string;
  availableMargin: number;
}

export interface FuturesSubaccountFlexCurrency {
  currency: string;
  quantity: number;
  value: number;
  collateral: number;
  available: number;
}

export interface FuturesSubaccountFlexAccount {
  currencies: FuturesSubaccountFlexCurrency[];
  initialMargin: number;
  initialMarginWithOrders: number;
  maintenanceMargin: number;
  balanceValue: number;
  portfolioValue: number;
  collateralValue: number;
  pnl: number;
  unrealizedFunding: number;
  totalUnrealized: number;
  totalUnrealizedAsMargin: number;
  availableMargin: number;
  marginEquity: number;
  portfolioMarginBreakdown?: FuturesPortfolioMarginBreakdown;
}

export interface FuturesSubaccount {
  accountUid: string;
  email: string;
  fullName: string | null;
  holdingAccounts: FuturesHoldingAccount[];
  futuresAccounts: FuturesSingleCollateralAccount[];
  flexAccount: FuturesSubaccountFlexAccount;
}

export interface FuturesSubaccountsInfo {
  masterAccountUid: string;
  subaccounts: FuturesSubaccount[];
}

/**
 * RFQs
 */

export interface FuturesRfqLeg {
  symbol: string;
  size: number;
  markPrice: number;
}

export interface FuturesRfq {
  rfqUid: string;
  expiry: string;
  markPrice: number;
  legs: FuturesRfqLeg[];
}

export interface FuturesOpenOffer {
  uid: string;
  rfqUid: string;
  placementDate: string;
  lastUpdateDate: string;
  bid?: string;
  ask?: string;
}

/**
 * Account History
 */

export interface FuturesHistoryResponse<T> {
  accountUid: string;
  len: number;
  serverTime: string;
  elements: T[];
  continuationToken?: string;
}

export interface FuturesHistoryEventElement<T> {
  uid: string;
  timestamp: number;
  event: T;
}

// Complex nested structures with multiple oneOf variants - keeping generic for flexibility
export type FuturesHistoryExecutionEvent = FuturesHistoryEventElement<any>;
export type FuturesHistoryOrderEvent = FuturesHistoryEventElement<any>;
export type FuturesHistoryTriggerEvent = FuturesHistoryEventElement<any>;

export interface FuturesPositionUpdateEvent {
  accountUid: string;
  tradeable: string;
  oldPosition: string;
  oldAverageEntryPrice: string | null;
  newPosition: string;
  newAverageEntryPrice: string;
  fillTime?: number | null;
  fee?: string;
  feeCurrency?: string;
  realizedPnL?: string;
  positionChange:
    | 'open'
    | 'close'
    | 'increase'
    | 'decrease'
    | 'reverse'
    | 'noChange'
    | 'unknown';
  executionUid?: string;
  executionPrice?: string;
  executionSize?: string;
  tradeType?:
    | 'userExecution'
    | 'liquidation'
    | 'assignment'
    | 'unwind'
    | 'unknown';
  fundingRealizationTime?: number;
  realizedFunding?: string;
  settlementPrice?: string;
  timestamp: number;
  updateReason: 'trade' | 'fundingRealisation' | 'settlement' | 'unknown';
}

export interface FuturesAccountLogEntry {
  asset: string;
  booking_uid: string;
  collateral: string | null;
  contract: string | null;
  date: string; // RFC 3339 formatted date-time
  execution: string | null;
  fee: number | null;
  funding_rate: number | null;
  id: number;
  info: string;
  margin_account: string;
  mark_price: number | null;
  new_average_entry_price: number | null;
  new_balance: number;
  old_average_entry_price: number | null;
  old_balance: number;
  realized_funding: number | null;
  realized_pnl: number | null;
  trade_price: number | null;
  conversion_spread_percentage?: number | null;
  liquidation_fee?: number | null;
  exchange_rate?: number;
  conversion_fee?: number;
  exchange_rate_from?: string;
}

export interface FuturesAccountLog {
  accountUid: string;
  logs: FuturesAccountLogEntry[];
}

/**
 * Market History
 */

export interface FuturesMarketHistoryResponse<T> {
  len: number;
  elements: T[];
  continuationToken?: string;
}

export interface FuturesMarketHistoryEventElement<T> {
  uid: string;
  timestamp: number;
  event: T;
}

// Complex nested structures - keeping generic for flexibility
export type FuturesPublicExecutionEvent = FuturesMarketHistoryEventElement<any>;
export type FuturesPublicOrderEvent = FuturesMarketHistoryEventElement<any>;

export interface FuturesPublicMarkPriceEvent {
  uid: string;
  timestamp: number;
  event: {
    price: string;
  };
}

/**
 * Charts - Candles
 */

export type FuturesTickType = 'spot' | 'mark' | 'trade';
export type FuturesResolution =
  | '1m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '4h'
  | '12h'
  | '1d'
  | '1w';

export interface FuturesCandle {
  time: number; // Epoch in ms
  high: string;
  low: string;
  open: string;
  close: string;
  volume: number;
}

export interface FuturesCandles {
  candles: FuturesCandle[];
  more_candles: boolean;
}

/**
 * Charts - Analytics
 */

export type FuturesAnalyticsType =
  | 'open-interest'
  | 'aggressor-differential'
  | 'trade-volume'
  | 'trade-count'
  | 'liquidation-volume'
  | 'rolling-volatility'
  | 'long-short-ratio'
  | 'long-short-info'
  | 'cvd'
  | 'top-traders'
  | 'orderbook'
  | 'spreads'
  | 'liquidity'
  | 'slippage'
  | 'future-basis';

export interface FuturesAnalyticsError {
  severity: string;
  error_class: string;
  type: string;
  msg: string;
  value?: string;
  field?: string;
}

export interface FuturesAnalyticsResponse {
  result: {
    timestamp: number[];
    more: boolean;
    data: any; // Complex oneOf structure with multiple types - keeping generic
  };
  errors: FuturesAnalyticsError[];
}

/**
 * Auth - API Keys
 */

export type FuturesApiKeyV3AccessLevel =
  | 'NO_ACCESS'
  | 'READ_ONLY'
  | 'FULL_ACCESS';

export interface FuturesApiKeyV3Check {
  apiKey: string; // base64
  accountUid: string; // uuid
  iiban: string; // Account IIBAN (format: ^AA[A-Z0-9]{2} [A-Z0-9]{4} [A-Z0-9]{4} [A-Z0-9]{4}$)
  createdAt: string; // RFC 3339 date-time
  permissions: {
    general: FuturesApiKeyV3AccessLevel;
    transfer: FuturesApiKeyV3AccessLevel;
  };
  allowedCidrBlock: string | null; // CIDR format (e.g., 192.168.0.0/16)
}

/**
 * Stats - Market Share
 */

export interface FuturesMarketShareContract {
  marketShare: string;
  volume: string;
  usdRebateCredited: string;
}

export interface FuturesMarketShare {
  contracts: Record<string, FuturesMarketShareContract>;
}

// trading settings

export type FuturesSelfTradeStrategy =
  | 'REJECT_TAKER'
  | 'CANCEL_MAKER_SELF'
  | 'CANCEL_MAKER_CHILD'
  | 'CANCEL_MAKER_ANY';
