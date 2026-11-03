/**
 * Market Data
 */

export interface SpotGetAssetPairsParams {
  pair?: string;
  aclass_base?: 'currency' | 'tokenized_asset';
  info?: 'info' | 'leverage' | 'fees' | 'margin';
  country_code?: string;
  execution_venue?: string;
}

export interface SpotGetOHLCParams {
  pair: string;
  interval?: 1 | 5 | 15 | 30 | 60 | 240 | 1440 | 10080 | 21600;
  since?: number;
  asset_class?: 'tokenized_asset';
}

export interface SpotGetOrderBookParams {
  pair: string;
  count?: number;
  asset_class?: 'tokenized_asset';
}

export interface SpotGetGroupedBookParams {
  pair: string;
  depth?: 10 | 25 | 100 | 250 | 1000;
  grouping?: 1 | 5 | 10 | 25 | 50 | 100 | 250 | 500 | 1000;
}

export interface SpotGetLevel3Params {
  pair: string;
  depth?: 0 | 10 | 25 | 100 | 250 | 1000;
}

export interface SpotTradeVolumePairInput {
  asset: string;
  aclass:
    | 'currency'
    | 'forex'
    | 'equity'
    | 'equity_pair'
    | 'nft'
    | 'derivatives'
    | 'tokenized_asset'
    | 'futures_contract';
}

export interface SpotGetTradingVolumeParams {
  pair?: string | SpotTradeVolumePairInput[];
  fee_schedule?: boolean;
  rebase_multiplier?: 'rebased' | 'base';
}

export interface SpotGetRecentTradesParams {
  pair: string;
  since?: string;
  count?: number;
  asset_class?: 'tokenized_asset';
}

export interface SpotGetRecentSpreadsParams {
  pair: string;
  since?: number;
  asset_class?: 'tokenized_asset';
}

/**
 * Account Data
 */

export interface SpotGetAccountBalanceParams {
  rebase_multiplier?: 'rebased' | 'base';
  account_id?: string;
}

export interface SpotGetApiKeyInfoParams {
  otp?: string;
}

export interface SpotGetOpenOrdersParams {
  trades?: boolean;
  userref?: number;
  cl_ord_id?: string;
  consolidate_taker?: boolean;
  with_cursor?: boolean;
  limit?: number;
  cursor?: string;
  rebase_multiplier?: 'rebased' | 'base';
  account_id?: string;
}

export interface SpotGetClosedOrdersParams {
  trades?: boolean;
  userref?: number;
  cl_ord_id?: string;
  start?: number;
  end?: number;
  /** @deprecated 30 Sep 2026. Use with_cursor and cursor. Must be absent or 0 when with_cursor is true. */
  ofs?: number;
  with_cursor?: boolean;
  cursor?: string;
  closetime?: 'open' | 'close' | 'both';
  consolidate_taker?: boolean;
  without_count?: boolean;
  rebase_multiplier?: 'rebased' | 'base';
  account_id?: string;
}

export interface SpotQueryOrdersParams {
  trades?: boolean;
  userref?: number;
  txid: string;
  cl_ord_id?: string;
  consolidate_taker?: boolean;
  rebase_multiplier?: 'rebased' | 'base';
  account_id?: string;
}

export interface SpotGetTradesHistoryParams {
  type?:
    | 'all'
    | 'any position'
    | 'closed position'
    | 'closing position'
    | 'no position';
  trades?: boolean;
  start?: number;
  end?: number;
  /** @deprecated 30 Sep 2026. Use with_cursor and cursor. Must be absent or 0 when with_cursor is true. */
  ofs?: number;
  with_cursor?: boolean;
  cursor?: string;
  consolidate_taker?: boolean;
  ledgers?: boolean;
  rebase_multiplier?: 'rebased' | 'base';
  pair?: string;
  account_id?: string;
  aclass?:
    | 'forex'
    | 'equity_pair'
    | 'futures_contract'
    | 'synthetic_pair'
    | 'external_pair';
  limit?: number;
}

export interface SpotQueryTradesParams {
  txid: string;
  trades?: boolean;
  ledgers?: boolean;
  rebase_multiplier?: 'rebased' | 'base';
  account_id?: string;
}

export interface SpotGetOpenPositionsParams {
  txid?: string;
  docalcs?: boolean;
  consolidation?: 'market';
  rebase_multiplier?: 'rebased' | 'base';
  account_id?: string;
}

export interface SpotGetLedgersInfoParams {
  account_id?: string;
  asset?: string | SpotTradeVolumePairInput[];
  /** @deprecated 30 Sep 2026. Use the { asset, aclass } list form of asset. */
  aclass?: string;
  type?:
    | 'all'
    | 'trade'
    | 'deposit'
    | 'withdrawal'
    | 'transfer'
    | 'margin'
    | 'adjustment'
    | 'rollover'
    | 'credit'
    | 'settled'
    | 'staking'
    | 'dividend'
    | 'sale'
    | 'nft_rebate';
  start?: number;
  end?: number;
  /** @deprecated 6 Oct 2026. Use with_cursor and cursor. Must be absent or 0 when with_cursor is true. */
  ofs?: number;
  with_cursor?: boolean;
  cursor?: string;
  without_count?: boolean;
  rebase_multiplier?: 'rebased' | 'base';
}

export interface SpotQueryLedgersParams {
  id: string;
  /** @deprecated 30 Sep 2026. Do not rely on this parameter. */
  trades?: boolean;
  rebase_multiplier?: 'rebased' | 'base';
  account_id?: string;
}

export interface SpotRequestExportReportParams {
  report: 'trades' | 'ledgers';
  format?: 'CSV' | 'TSV';
  description: string;
  fields?: string;
  starttm?: number;
  endtm?: number;
}

/**
 * Trading
 */

export interface SpotSubmitOrderParams {
  userref?: number;
  cl_ord_id?: string;
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
  type: 'buy' | 'sell';
  volume: string;
  displayvol?: string;
  pair: string;
  asset_class?: 'tokenized_asset';
  price?: string;
  price2?: string;
  trigger?: 'index' | 'last';
  leverage?: string;
  reduce_only?: boolean;
  stptype?: 'cancel-newest' | 'cancel-oldest' | 'cancel-both';
  oflags?: string;
  timeinforce?: 'GTC' | 'IOC' | 'GTD' | 'FOK';
  starttm?: string;
  expiretm?: string;
  'close[ordertype]'?: string;
  'close[price]'?: string;
  'close[price2]'?: string;
  deadline?: string;
  validate?: boolean;
  broker?: string;
}

export interface SpotAmendOrderParams {
  txid?: string;
  cl_ord_id?: string;
  order_qty?: string;
  display_qty?: string;
  limit_price?: string;
  trigger_price?: string;
  pair?: string;
  post_only?: boolean;
  deadline?: string;
}

export interface SpotBatchOrderItem {
  userref?: number;
  cl_ord_id?: string;
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
  type: 'buy' | 'sell';
  volume: string;
  displayvol?: string;
  price?: string;
  price2?: string;
  trigger?: 'index' | 'last';
  leverage?: string;
  reduce_only?: boolean;
  stptype?: 'cancel-newest' | 'cancel-oldest' | 'cancel-both';
  oflags?: string;
  timeinforce?: 'GTC' | 'IOC' | 'GTD' | 'FOK';
  starttm?: string;
  expiretm?: string;
  close?: {
    ordertype?: string;
    price?: string;
    price2?: string;
  };
}

export interface SpotSubmitOrderBatchParams {
  orders: SpotBatchOrderItem[];
  pair: string;
  asset_class?: 'tokenized_asset';
  broker?: string;
  deadline?: string;
  validate?: boolean;
}

/**
 * Algo Trading
 */

export interface SpotSubmitStrategyParams {
  strategy_type: 'twap';
  symbol: string;
  asset_class: 'forex';
  side: 'buy' | 'sell';
  volume: string;
  ordertype: 'market' | 'limit';
  price?: string; // Required for limit; must be omitted for market.
  starttm?: string;
  expiretm: string;
  validate?: boolean;
}

export interface SpotGetClosedStrategiesParams {
  asset_class?: 'forex' | 'tokenized_asset' | 'synthetic_pair';
  strategy_type?: 'twap';
  status?: 'closed' | 'expired' | 'cancelled';
  start?: number;
  end?: number;
  query_time_mode?: 'open' | 'close' | 'both';
  limit?: number;
  cursor?: string;
}

/**
 * Funding
 */

export interface SpotGetDepositMethodsParams {
  asset: string;
  aclass?: 'currency' | 'tokenized_asset';
  rebase_multiplier?: 'rebased' | 'base';
}

export interface SpotGetDepositAddressesParams {
  asset: string;
  aclass?: 'currency' | 'tokenized_asset';
  method: string;
  new?: boolean;
  amount?: string | number;
}

export interface SpotGetDepositStatusParams {
  asset?: string;
  aclass?: 'currency' | 'tokenized_asset';
  method?: string;
  start?: string;
  end?: string;
  cursor?: boolean | string;
  limit?: number;
  rebase_multiplier?: 'rebased' | 'base';
}

export interface SpotGetWithdrawalMethodsParams {
  asset?: string;
  aclass?: 'currency' | 'tokenized_asset';
  network?: string;
  rebase_multiplier?: 'rebased' | 'base';
}

export interface SpotGetWithdrawalAddressesParams {
  asset?: string;
  aclass?: 'currency' | 'tokenized_asset';
  method?: string;
  key?: string;
  verified?: boolean;
}

export interface SpotGetWithdrawalInfoParams {
  asset: string;
  key: string;
  amount: string;
}

export interface SpotWithdrawFundsParams {
  asset: string;
  aclass?: 'currency' | 'tokenized_asset';
  key: string;
  address?: string;
  amount: string;
  max_fee?: string;
  rebase_multiplier?: 'rebased' | 'base';
}

export interface SpotGetWithdrawalsStatusParams {
  asset?: string;
  aclass?: 'currency' | 'tokenized_asset';
  method?: string;
  start?: string;
  end?: string;
  cursor?: boolean | string;
  limit?: number;
  rebase_multiplier?: 'rebased' | 'base';
}

export interface SpotWalletTransferParams {
  asset: string;
  from: 'Spot Wallet';
  to: 'Futures Wallet';
  amount: string;
}

/**
 * Subaccounts
 */

export interface SpotAccountTransferParams {
  asset: string;
  asset_class?: 'currency' | 'tokenized_asset';
  amount: string;
  from: string;
  to: string;
}

/**
 * Earn
 */

export interface SpotListEarnStrategiesParams {
  ascending?: boolean;
  asset?: string;
  cursor?: string;
  limit?: number;
  lock_type?: ('flex' | 'bonded' | 'timed' | 'instant')[];
}

export interface SpotListEarnAllocationsParams {
  ascending?: boolean;
  converted_asset?: string;
  hide_zero_allocations?: boolean;
}

/**
 * Transparency
 */

export interface SpotGetPostTradeDataParams {
  symbol?: string;
  from_ts?: string;
  to_ts?: string;
  count?: number;
}

/**
 * OAuth
 */

export interface OauthGetAccessTokenParams {
  grant_type: 'authorization_code' | 'refresh_token';
  code?: string; // Required if grant_type = authorization_code
  redirect_uri?: string; // Required if grant_type = authorization_code
  refresh_token?: string; // Required if grant_type = refresh_token
}

export interface OauthCreateFastApiKeyParams {
  api_key_name: string; // max 32 chars
  ip_allowlist: string[];
  nonce_window?: number;
  permissions: {
    export_data?: boolean;
    funds_add?: boolean;
    funds_earn?: boolean;
    funds_query?: boolean;
    funds_withdraw?: boolean;
    ledger_query?: boolean;
    trades_close?: boolean;
    trades_modify?: boolean;
    trades_query_closed?: boolean;
    trades_query_open?: boolean;
  };
  query_from?: number;
  query_to?: number;
  valid_until?: number;
}

export interface OauthUpdateFastApiKeyParams {
  new_api_key_name?: string; // max 32 chars
  api_key_name: string; // max 32 chars
  ip_allowlist: string[];
  nonce_window?: number;
  permissions: {
    export_data?: boolean;
    funds_add?: boolean;
    funds_earn?: boolean;
    funds_query?: boolean;
    funds_withdraw?: boolean;
    ledger_query?: boolean;
    trades_close?: boolean;
    trades_modify?: boolean;
    trades_query_closed?: boolean;
    trades_query_open?: boolean;
  };
  query_from?: number;
  query_to?: number;
  valid_until?: number;
}
