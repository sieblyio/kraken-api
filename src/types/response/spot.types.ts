/**
 * Market Data
 */

export type SpotAffectedService =
  | 'spot_ws'
  | 'spot_rest'
  | 'spot_fix'
  | 'spot_trading'
  | 'futures_ws'
  | 'futures_rest'
  | 'futures_fix'
  | 'futures_trading'
  | 'all';

export type SpotMaintenancePhase =
  | 'announced'
  | 'reminder_24h'
  | 'approaching_30m'
  | 'imminent_5m'
  | 'final_warning_30s';

export type SpotMaintenanceOrderSubmission =
  | 'allowed'
  | 'discouraged'
  | 'blocked';

export type SpotMaintenanceRecommendedAction =
  | 'continue'
  | 'reduce_activity'
  | 'cancel_open_orders'
  | 'stop_new_orders';

export interface SpotScheduledMaintenanceEvent {
  event_id: number;
  title?: string;
  expected_start_utc: string;
  expected_end_utc?: string;
  time_to_start_s?: number;
  phase?: SpotMaintenancePhase;
  affected_services?: SpotAffectedService[];
  order_submission?: SpotMaintenanceOrderSubmission;
  recommended_action?: SpotMaintenanceRecommendedAction;
  cancel_before_utc?: string;
  source_url?: string;
}

export interface SpotEmergencyNextStep {
  applies_to?: SpotAffectedService[];
  type?:
    | 'expected_restart'
    | 'expected_cancel_only'
    | 'expected_post_only'
    | 'expected_online';
  expected_at_utc?: string;
}

export interface SpotEmergencyEvent {
  event_id: number;
  title?: string;
  incident_status?: 'investigating' | 'identified' | 'monitoring';
  impact?: 'none' | 'minor' | 'major' | 'critical';
  affected_services?: SpotAffectedService[];
  started_at_utc?: string;
  next_steps?: SpotEmergencyNextStep[];
  source_url?: string;
}

export interface SpotSystemStatus {
  status: 'online' | 'maintenance' | 'cancel_only' | 'post_only';
  timestamp: string;
  upcoming_maintenance?: SpotScheduledMaintenanceEvent[];
  emergency?: SpotEmergencyEvent[];
}

export interface SpotMaintenanceSchedule {
  events: SpotScheduledMaintenanceEvent[];
}

export interface SpotAssetInfo {
  aclass: string;
  altname: string;
  decimals: number;
  display_decimals: number;
  collateral_value?: number;
  status?: string;
}

export interface SpotAssetPair {
  altname: string;
  wsname?: string;
  aclass_base: string;
  base: string;
  aclass_quote: string;
  quote: string;
  lot?: string;
  pair_decimals: number;
  cost_decimals: number;
  lot_decimals: number;
  lot_multiplier: number;
  leverage_buy?: number[];
  leverage_sell?: number[];
  /** @deprecated Always empty as of 8 Sep 2026. Use SpotClient.getTradingVolume() with fee_schedule. */
  fees?: number[][];
  /** @deprecated Always empty as of 8 Sep 2026. Use SpotClient.getTradingVolume() with fee_schedule. */
  fees_maker?: number[][];
  fee_volume_currency?: string;
  margin_call?: number;
  margin_stop?: number;
  ordermin: string;
  costmin?: string;
  tick_size?: string;
  status?: string;
  long_position_limit?: number;
  short_position_limit?: number;
  execution_venue?: string;
}

export interface SpotAssetTickerInfo {
  a: string[]; // Ask [price, whole lot volume, lot volume]
  b: string[]; // Bid [price, whole lot volume, lot volume]
  c: string[]; // Last trade closed [price, lot volume]
  v: string[]; // Volume [today, last 24 hours]
  p: string[]; // Volume weighted average price [today, last 24 hours]
  t: number[]; // Number of trades [today, last 24 hours]
  l: string[]; // Low [today, last 24 hours]
  h: string[]; // High [today, last 24 hours]
  o: string; // Today's opening price
}

// [time, open, high, low, close, vwap, volume, count]
export type SpotOHLCData = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
];

export interface SpotOHLCResponse {
  last: number;
  [pairName: string]: SpotOHLCData[] | number;
}

// [price, volume, timestamp]
export type SpotOrderBookEntry = [string, string, number];

export interface SpotOrderBook {
  asks: SpotOrderBookEntry[];
  bids: SpotOrderBookEntry[];
}

export interface SpotOrderBookResponse {
  [pairName: string]: SpotOrderBook;
}

export interface SpotGroupedBookLevel {
  price: string;
  qty: string;
}

export interface SpotGroupedBookResponse {
  pair: string;
  grouping: number;
  bids: SpotGroupedBookLevel[];
  asks: SpotGroupedBookLevel[];
}

export interface SpotLevel3OrderEntry {
  price: string;
  qty: string;
  order_id: string;
  timestamp: number;
}

export interface SpotLevel3OrderBookResponse {
  pair: string;
  bids: SpotLevel3OrderEntry[];
  asks: SpotLevel3OrderEntry[];
}

// [price, volume, time, buy/sell, market/limit, miscellaneous, trade_id]
export type SpotTradeData = [
  string,
  string,
  number,
  string,
  string,
  string,
  number,
];

export interface SpotRecentTradesResponse {
  last: string;
  [pairName: string]: SpotTradeData[] | string;
}

// [time, bid, ask]
export type SpotSpreadData = [number, string, string];

export interface SpotRecentSpreadsResponse {
  last: number;
  [pairName: string]: SpotSpreadData[] | number;
}

/**
 * Account Data
 */

export interface SpotAccountBalance {
  [assetName: string]: string;
}

export interface SpotWalletAccountFlags {
  user_defined: boolean;
  active: boolean;
}

export interface SpotWalletAccount {
  account_id: string;
  flags: SpotWalletAccountFlags;
  status: 'active' | 'disabled' | 'closed' | 'unknown';
  type: 'main' | 'spot' | 'pay' | 'prop_paper' | 'prop_real' | 'unknown';
  name?: string | null;
}

export interface SpotListWalletAccountsResponse {
  accounts: SpotWalletAccount[];
  cursor: {
    next: string | null;
  };
}

export interface SpotExtendedBalanceAsset {
  balance: string;
  credit: string;
  credit_used: string;
  hold_trade: string;
}

export interface SpotExtendedBalance {
  [assetName: string]: SpotExtendedBalanceAsset;
}

export interface SpotCreditLinesAsset {
  balance: string;
  /** @deprecated 30 Sep 2026. The credit limit field is credit. */
  credit_limit?: string;
  credit?: string;
  credit_used: string;
  /** @deprecated 30 Sep 2026. Not returned. */
  available_credit?: string;
  rollover_fees?: string;
  reserve_fees?: string;
}

export interface SpotCreditLinesMonitor {
  total_credit_usd: string | null;
  total_credit_used_usd: string | null;
  total_collateral_value_usd: string | null;
  equity_usd: string | null;
  ongoing_balance: string | null;
  debt_to_equity: string | null;
}

export interface SpotCreditLines {
  asset_details: {
    [assetName: string]: SpotCreditLinesAsset;
  };
  limits_monitor: SpotCreditLinesMonitor;
}

export interface SpotTradeBalance {
  eb: string; // Equivalent balance
  tb: string; // Trade balance
  m: string; // Margin amount of open positions
  n: string; // Unrealized net profit/loss of open positions
  c: string; // Cost basis of open positions
  v: string; // Current floating valuation of open positions
  e: string; // Equity: trade balance + unrealized net profit/loss
  mf: string; // Free margin
  ml: string; // Margin level
  uv: string; // Unexecuted value
}

export interface SpotOpenOrderDescription {
  pair: string;
  type: 'buy' | 'sell';
  ordertype:
    | 'market'
    | 'limit'
    | 'iceberg'
    | 'stop-loss'
    | 'take-profit'
    | 'stop-loss-limit'
    | 'take-profit-limit'
    | 'trailing-stop'
    | 'trailing-stop-limit'
    | 'settle-position';
  price: string;
  price2: string;
  leverage: string;
  order: string;
  close: string;
}

export interface SpotOpenOrder {
  refid: string | null;
  userref: number | null;
  cl_ord_id: string | null;
  status: 'pending' | 'open' | 'closed' | 'canceled' | 'expired';
  opentm: number;
  starttm: number;
  expiretm: number;
  descr: SpotOpenOrderDescription;
  vol: string;
  vol_exec: string;
  cost: string;
  fee: string;
  price: string;
  stopprice: string;
  limitprice: string;
  displayvol?: string;
  displayvolremain?: string;
  ext_ord_id?: string;
  link_id?: string;
  reduce_only?: boolean;
  trigger?: 'last' | 'index';
  margin?: boolean;
  misc: string;
  stopped?: string;
  touched?: string;
  liquidated?: string;
  partial?: string;
  amended?: string;
  sender_sub_id: string | null;
  oflags: string;
  trades?: string[];
}

export interface SpotPageCursor {
  next: string | null;
}

export interface SpotOpenOrdersResponse {
  open: {
    [orderId: string]: SpotOpenOrder;
  };
  cursor?: SpotPageCursor | null;
}

export interface SpotClosedOrder extends SpotOpenOrder {
  closetm: number;
  reason: string;
}

export interface SpotClosedOrdersResponse {
  closed: {
    [orderId: string]: SpotClosedOrder;
  };
  count?: number;
  cursor?: SpotPageCursor | null;
}

export interface SpotQueryOrdersResponse {
  [orderId: string]: SpotOpenOrder | SpotClosedOrder;
}

export interface SpotOrderAmend {
  amend_id: string;
  amend_type: 'original' | 'user' | 'restated';
  order_qty: string;
  display_qty: string;
  remaining_qty: string;
  limit_price: string;
  trigger_price: string;
  reason: string;
  post_only: boolean;
  timestamp: number;
}

export interface SpotOrderAmendsResponse {
  count: number;
  amends: SpotOrderAmend[];
}

export interface SpotTrade {
  ordertxid: string;
  postxid: string;
  pair: string;
  time: number;
  type: string;
  ordertype: string;
  price: string;
  cost: string;
  fee: string;
  vol: string;
  margin: string;
  leverage: string;
  misc: string;
  ledgers?: string[];
  trade_id: number;
  maker: boolean;
  ext_exec_id?: string;
  posstatus?: string;
  cprice?: number;
  ccost?: number;
  cfee?: number;
  cvol?: number;
  cmargin?: number;
  net?: number;
  trades?: string[];
}

export interface SpotTradesHistoryResponse {
  count: number;
  trades: {
    [tradeId: string]: SpotTrade;
  };
  cursor?: SpotPageCursor | null;
}

export interface SpotQueryTradesResponse {
  [tradeId: string]: SpotTrade;
}

export interface SpotOpenPosition {
  ordertxid: string;
  class?: string;
  posstatus: 'open';
  pair: string;
  time: number;
  type: string;
  ordertype: string;
  cost: string;
  fee: string;
  vol: string;
  vol_closed: string;
  margin: string;
  value?: string;
  net?: string;
  terms: string;
  rollovertm: string;
  misc: string;
  oflags: string;
}

export interface SpotOpenPositionsResponse {
  [positionId: string]: SpotOpenPosition;
}

export interface SpotConsolidatedOpenPosition {
  pair: string;
  class: string;
  positions: string;
  type: string;
  leverage: string;
  cost: string;
  fee: string;
  vol: string;
  vol_closed: string;
  margin: string;
  value?: string;
  net?: string;
}

export type SpotOpenPositionsResult =
  | SpotOpenPositionsResponse
  | SpotConsolidatedOpenPosition[];

export interface SpotLedgerEntry {
  refid: string;
  time: number;
  type:
    | 'none'
    | 'trade'
    | 'deposit'
    | 'withdrawal'
    | 'transfer'
    | 'margin'
    | 'adjustment'
    | 'rollover'
    | 'spend'
    | 'receive'
    | 'settled'
    | 'credit'
    | 'staking'
    | 'reward'
    | 'dividend'
    | 'sale'
    | 'conversion'
    | 'nfttrade'
    | 'nftcreatorfee'
    | 'nftrebate'
    | 'custodytransfer';
  subtype: string;
  aclass: string;
  asset: string;
  amount: string;
  fee: string;
  balance: string;
}

export interface SpotLedgersInfoResponse {
  ledger: {
    [ledgerId: string]: SpotLedgerEntry;
  };
  count?: number | null;
  cursor?: SpotPageCursor | null;
}

export interface SpotQueryLedgerEntry extends SpotLedgerEntry {
  amount_token?: string;
}

export interface SpotQueryLedgersResponse {
  [ledgerId: string]: SpotQueryLedgerEntry;
}

export interface SpotFeeTierInfo {
  fee: string;
  min_fee: string;
  max_fee: string;
  next_fee: string | null;
  tier_volume: string | null;
  next_volume: string | null;
}

export interface SpotTradeVolumeInputs {
  domain_spot_volume_30d: string;
  domain_futures_volume_30d: string;
  domain_assets_on_platform: string;
}

export interface SpotTradeVolumeFeeScheduleTier {
  maker_fee: string;
  taker_fee: string;
  min_spot_volume?: string | null;
  min_futures_volume?: string | null;
  min_assets_on_platform?: string | null;
  active?: boolean | null;
}

export interface SpotTradeVolumeFeeSchedule {
  pair: string;
  class:
    | 'currency'
    | 'forex'
    | 'equity'
    | 'equity_pair'
    | 'nft'
    | 'derivatives'
    | 'tokenized_asset'
    | 'futures_contract'
    | 'volume';
  tiers: SpotTradeVolumeFeeScheduleTier[];
}

export interface SpotTradeVolumeSubaccount {
  iiban: string;
  volume: string;
}

export interface SpotTradeVolume {
  currency: string;
  asset_class?:
    | 'currency'
    | 'forex'
    | 'equity'
    | 'equity_pair'
    | 'nft'
    | 'derivatives'
    | 'tokenized_asset'
    | 'futures_contract'
    | null;
  volume: string;
  inputs: SpotTradeVolumeInputs;
  fees?: {
    [pairName: string]: SpotFeeTierInfo;
  } | null;
  fees_maker?: {
    [pairName: string]: SpotFeeTierInfo;
  } | null;
  volume_subaccounts?: SpotTradeVolumeSubaccount[];
  schedules?: SpotTradeVolumeFeeSchedule[] | null;
}

export interface SpotApiKeyInfo {
  apiKeyName: string;
  apiKey: string;
  nonce: string;
  nonceWindow: number;
  permissions: string[];
  iban: string;
  validUntil: string;
  queryFrom: string;
  queryTo: string;
  createdTime: string;
  modifiedTime: string;
  ipAllowlist: string[];
  lastUsed: string | null;
}

export interface SpotRequestExportReportResponse {
  id: string;
}

export interface SpotExportReportStatus {
  id: string;
  descr: string;
  format: string;
  report: string;
  subtype: string;
  status: 'Queued' | 'Processing' | 'Processed';
  flags: string;
  fields: string;
  createdtm: string;
  expiretm: string;
  starttm: string;
  completedtm: string;
  datastarttm: string;
  dataendtm: string;
  aclass: string;
  asset: string;
}

export interface SpotDeleteExportReportResponse {
  delete?: boolean;
  cancel?: boolean;
}

/**
 * Trading
 */

export interface SpotAddOrderDescription {
  order: string;
  close?: string;
}

export interface SpotSubmitOrderResponse {
  descr: SpotAddOrderDescription;
  txid: string[];
}

export interface SpotWebSocketsTokenResponse {
  token: string;
  expires: number;
}

export interface SpotBatchOrderResult {
  descr?: {
    order: string;
  };
  error?: string;
  txid?: string;
}

/**
 * Algo Trading
 */

export interface SpotTwapStrategyInfo {
  strategy_type: 'twap';
  side: 'buy' | 'sell';
  volume: string;
  filled_volume: string;
  avg_price: string;
  total_cost: string;
  total_fee: string;
  starttm: string;
  expiretm: string;
  symbol: string;
  asset_class: 'forex' | 'tokenized_asset' | 'synthetic_pair';
  ordertype: 'market' | 'limit';
  price?: string;
}

export interface SpotAlgoStrategy {
  strategy_id: string; // Kraken-assigned identifier with the AS prefix.
  status: 'pending' | 'open' | 'closed' | 'expired' | 'cancelled';
  reason?: string;
  details: SpotTwapStrategyInfo;
}

export interface SpotClosedStrategiesResponse {
  closed: SpotAlgoStrategy[];
  next_cursor?: string;
}

/**
 * Funding
 */

export interface SpotDepositMethod {
  method: string;
  limit: string | boolean;
  fee: string;
  'address-setup-fee': string;
  'gen-address': boolean;
  minimum: string;
}

export interface SpotDepositAddress {
  address: string;
  expiretm: string;
  new: boolean;
  tag?: string;
}

export interface SpotDepositStatus {
  method: string;
  aclass: string;
  asset: string;
  refid: string;
  txid: string;
  info: string;
  amount: string;
  fee: string;
  time: number;
  status: string;
  'status-prop'?: 'return' | 'onhold';
  originators?: string[];
}

export interface SpotDepositStatusResponse {
  cursor?: string;
  [key: string]: SpotDepositStatus[] | string | undefined;
}

export interface SpotWithdrawalMethod {
  asset: string;
  method: string;
  network: string;
  minimum: string;
}

export interface SpotWithdrawalAddress {
  address: string;
  asset: string;
  method: string;
  key: string;
  tag?: string;
  verified: boolean;
}

export interface SpotWithdrawalInfo {
  method: string;
  limit: string;
  amount: string;
  fee: string;
}

export interface SpotWithdrawalStatus {
  method: string;
  network: string;
  aclass: string;
  asset: string;
  refid: string;
  txid: string;
  info: string;
  amount: string;
  fee: string;
  time: number;
  status: 'Initial' | 'Pending' | 'Settled' | 'Success' | 'Failure';
  'status-prop'?:
    | 'cancel-pending'
    | 'canceled'
    | 'cancel-denied'
    | 'return'
    | 'onhold';
  key: string;
}

/**
 * Subaccounts
 */

export interface SpotAccountTransferResponse {
  transfer_id: string;
  status: string;
}

/**
 * Earn
 */

export interface SpotEarnAmount {
  native: string;
  converted: string;
}

export interface SpotEarnAllocationDetails {
  native: string;
  converted: string;
  created_at: string;
  expires: string;
}

export interface SpotEarnAllocationState {
  allocation_count: number;
  allocations: SpotEarnAllocationDetails[];
  native: string;
  converted: string;
}

export interface SpotEarnPayout {
  accumulated_reward: SpotEarnAmount;
  estimated_reward: SpotEarnAmount;
  period_start: string;
  period_end: string;
}

export interface SpotEarnAllocation {
  strategy_id: string;
  native_asset: string;
  amount_allocated: {
    total: SpotEarnAmount;
    bonding?: SpotEarnAllocationState;
    exit_queue?: SpotEarnAllocationState;
    unbonding?: SpotEarnAllocationState;
    pending?: SpotEarnAmount;
  };
  total_rewarded: SpotEarnAmount;
  payout?: SpotEarnPayout;
}

export interface SpotListEarnAllocationsResponse {
  converted_asset: string;
  total_allocated: string;
  total_rewarded: string;
  items: SpotEarnAllocation[];
}

export interface SpotEarnAPREstimate {
  low: string;
  high: string;
}

export interface SpotEarnAutoCompound {
  type: 'disabled' | string;
  default?: boolean;
}

export interface SpotEarnLockType {
  type: 'flex' | 'bonded' | 'timed' | 'instant';
  payout_frequency?: number;
  bonding_period?: number;
  bonding_period_variable?: boolean;
  bonding_rewards?: boolean;
  unbonding_period?: number;
  unbonding_period_variable?: boolean;
  unbonding_rewards?: boolean;
  exit_queue_period?: number;
}

export interface SpotEarnYieldSource {
  type: 'staking' | 'off_chain' | string;
}

export interface SpotEarnStrategy {
  id: string;
  asset: string;
  lock_type: SpotEarnLockType;
  apr_estimate?: SpotEarnAPREstimate;
  user_min_allocation?: string;
  allocation_fee: string | number;
  deallocation_fee: string | number;
  auto_compound: SpotEarnAutoCompound;
  yield_source: SpotEarnYieldSource;
  can_allocate: boolean;
  can_deallocate: boolean;
  allocation_restriction_info: string[];
  user_cap?: string;
}

/**
 * Transparency
 */

export interface SpotPreTradeLevel {
  side: 'BUY' | 'SELL';
  price: string;
  qty: string;
  count: number;
  publication_ts: string;
}

export interface SpotPreTradeData {
  symbol: string;
  description: string;
  base_asset: string;
  base_notation: 'NOML';
  quote_asset: string;
  quote_notation: 'MONE';
  venue: string;
  system: 'CLOB';
  bids: SpotPreTradeLevel[];
  asks: SpotPreTradeLevel[];
}

export interface SpotPostTrade {
  trade_id: string;
  price: string;
  quantity: string;
  symbol: string;
  description: string;
  base_asset: string;
  base_notation: 'UNIT';
  quote_asset: string;
  quote_notation: 'MONE';
  trade_venue: string;
  trade_ts: string;
  publication_venue: string;
  publication_ts: string;
}

export interface SpotPostTradeDataResponse {
  last_ts: string;
  count: number;
  trades: SpotPostTrade[];
}

/**
 * OAuth
 */

export interface OauthGetAccessTokenResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_token: string;
}

export interface OauthGetUserInfoResponse {
  result: {
    email: string;
    iban: string;
  };
}

export interface OauthFastApiKey {
  api_key?: string; // Only returned on creation
  api_key_name: string;
  created_time: string;
  id: string;
  ip_allowlist: string[];
  last_used: number;
  modified_time: string;
  nonce: number;
  nonce_window: number;
  oauth_client: string;
  permissions: any; // Simplified
  purpose: string;
  query_from: number;
  query_to: number;
  valid_until: number;
}

export interface OauthCreateFastApiKeyResponse {
  result: OauthFastApiKey & {
    secret: string; // Only returned on creation
  };
}
