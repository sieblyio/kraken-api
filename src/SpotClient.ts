import { BaseRestClient } from './lib/BaseRestClient.js';
import { REST_CLIENT_TYPE_ENUM, RestClientType } from './lib/requestUtils.js';
import {
  OauthCreateFastApiKeyParams,
  OauthGetAccessTokenParams,
  OauthUpdateFastApiKeyParams,
  SpotAccountTransferParams,
  SpotAmendOrderParams,
  SpotGetAccountBalanceParams,
  SpotGetApiKeyInfoParams,
  SpotGetAssetPairsParams,
  SpotGetClosedOrdersParams,
  SpotGetClosedStrategiesParams,
  SpotGetDepositAddressesParams,
  SpotGetDepositMethodsParams,
  SpotGetDepositStatusParams,
  SpotGetGroupedBookParams,
  SpotGetLedgersInfoParams,
  SpotGetLevel3Params,
  SpotGetOHLCParams,
  SpotGetOpenOrdersParams,
  SpotGetOpenPositionsParams,
  SpotGetOrderBookParams,
  SpotGetPostTradeDataParams,
  SpotGetRecentSpreadsParams,
  SpotGetRecentTradesParams,
  SpotGetTradesHistoryParams,
  SpotGetTradingVolumeParams,
  SpotGetWithdrawalAddressesParams,
  SpotGetWithdrawalInfoParams,
  SpotGetWithdrawalMethodsParams,
  SpotGetWithdrawalsStatusParams,
  SpotListEarnAllocationsParams,
  SpotListEarnStrategiesParams,
  SpotQueryLedgersParams,
  SpotQueryOrdersParams,
  SpotQueryTradesParams,
  SpotRequestExportReportParams,
  SpotSubmitOrderBatchParams,
  SpotSubmitOrderParams,
  SpotSubmitStrategyParams,
  SpotWalletTransferParams,
  SpotWithdrawFundsParams,
} from './types/request/spot.types.js';
import { SpotAPISuccessResponse } from './types/response/shared.types.js';
import {
  OauthCreateFastApiKeyResponse,
  OauthFastApiKey,
  OauthGetAccessTokenResponse,
  OauthGetUserInfoResponse,
  SpotAccountBalance,
  SpotAccountTransferResponse,
  SpotAlgoStrategy,
  SpotApiKeyInfo,
  SpotAssetInfo,
  SpotAssetPair,
  SpotAssetTickerInfo,
  SpotBatchOrderResult,
  SpotClosedOrdersResponse,
  SpotClosedStrategiesResponse,
  SpotCreditLines,
  SpotDeleteExportReportResponse,
  SpotDepositAddress,
  SpotDepositMethod,
  SpotDepositStatusResponse,
  SpotEarnStrategy,
  SpotExportReportStatus,
  SpotExtendedBalance,
  SpotGroupedBookResponse,
  SpotLedgersInfoResponse,
  SpotLevel3OrderBookResponse,
  SpotListEarnAllocationsResponse,
  SpotListWalletAccountsResponse,
  SpotMaintenanceSchedule,
  SpotOHLCResponse,
  SpotOpenOrdersResponse,
  SpotOpenPositionsResult,
  SpotOrderAmendsResponse,
  SpotOrderBookResponse,
  SpotPostTradeDataResponse,
  SpotPreTradeData,
  SpotQueryLedgersResponse,
  SpotQueryOrdersResponse,
  SpotQueryTradesResponse,
  SpotRecentSpreadsResponse,
  SpotRecentTradesResponse,
  SpotRequestExportReportResponse,
  SpotSubmitOrderResponse,
  SpotSystemStatus,
  SpotTradeBalance,
  SpotTradesHistoryResponse,
  SpotTradeVolume,
  SpotWebSocketsTokenResponse,
  SpotWithdrawalAddress,
  SpotWithdrawalInfo,
  SpotWithdrawalMethod,
  SpotWithdrawalStatus,
} from './types/response/spot.types.js';

/**
 * The SpotClient provides integration to the Kraken Spot API.
 *
 * Docs:
 * - https://docs.kraken.com/api/docs/guides/spot-rest-intro/
 * - https://docs.kraken.com/api/docs/rest-api/get-server-time
 */
export class SpotClient extends BaseRestClient {
  getClientType(): RestClientType {
    // Points to api.kraken.com
    return REST_CLIENT_TYPE_ENUM.main;
  }

  /**
   *
   * Misc Utility Methods
   *
   */

  generateNewOrderID(): string {
    // Generate a short UUID format (32 hex characters without dashes)
    // Compatible with Kraken's cl_ord_id parameter
    const hexChars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += hexChars[Math.floor(Math.random() * 16)];
    }
    return result;
  }

  /**
   *
   * Spot REST API - Market Data
   *
   */

  /**
   * Get Server Time
   *
   * Get the server's time.
   */
  getServerTime(): Promise<
    SpotAPISuccessResponse<{
      unixtime: number;
      rfc1123: string;
    }>
  > {
    return this.get('0/public/Time');
  }

  /**
   * Get System Status
   *
   * Get the current system status or trading mode.
   */
  getSystemStatus(): Promise<SpotAPISuccessResponse<SpotSystemStatus>> {
    return this.get('0/public/SystemStatus');
  }

  /**
   * Get Maintenance Schedule
   *
   * Get all scheduled maintenance events in the next 7-day window.
   */
  getMaintenanceSchedule(): Promise<
    SpotAPISuccessResponse<SpotMaintenanceSchedule>
  > {
    return this.get('0/public/MaintenanceSchedule');
  }

  /**
   * Get Asset Info
   *
   * Get information about the assets that are available for deposit, withdrawal, trading and earn.
   */
  getAssetInfo(params?: {
    asset?: string;
    aclass?: 'currency' | 'tokenized_asset';
  }): Promise<SpotAPISuccessResponse<Record<string, SpotAssetInfo>>> {
    return this.get('0/public/Assets', params);
  }

  /**
   * Get Tradable Asset Pairs
   *
   * Get tradable asset pairs
   */
  getAssetPairs(
    params?: SpotGetAssetPairsParams,
  ): Promise<SpotAPISuccessResponse<Record<string, SpotAssetPair>>> {
    return this.get('0/public/AssetPairs', params);
  }

  /**
   * Get Ticker Information
   *
   * Get ticker information for all or requested markets.
   * Note: Today's prices start at midnight UTC.
   * Leaving the pair parameter blank will return tickers for all tradeable assets on Kraken.
   */
  getTicker(params?: {
    pair?: string;
    asset_class?: 'tokenized_asset' | 'forex';
  }): Promise<SpotAPISuccessResponse<Record<string, SpotAssetTickerInfo>>> {
    return this.get('0/public/Ticker', params);
  }

  /**
   * Get OHLC Data
   *
   * Retrieve OHLC market data. The last entry in the OHLC array is for the current, not-yet-committed timeframe,
   * and will always be present, regardless of the value of since. Returns up to 720 of the most recent entries
   * (older data cannot be retrieved, regardless of the value of since).
   */
  getCandles(
    params: SpotGetOHLCParams,
  ): Promise<SpotAPISuccessResponse<SpotOHLCResponse>> {
    return this.get('0/public/OHLC', params);
  }

  /**
   * Get Order Book
   *
   * Returns level 2 (L2) order book, which describes the individual price levels in the book with aggregated
   * order quantities at each level.
   */
  getOrderBook(
    params: SpotGetOrderBookParams,
  ): Promise<SpotAPISuccessResponse<SpotOrderBookResponse>> {
    return this.get('0/public/Depth', params);
  }

  /**
   * Get Grouped Order Book
   *
   * Aggregates order book volume over a configurable tick grouping.
   */
  getGroupedBook(
    params: SpotGetGroupedBookParams,
  ): Promise<SpotAPISuccessResponse<SpotGroupedBookResponse>> {
    return this.get('0/public/GroupedBook', params);
  }

  /**
   * Get Level 3 Order Book
   *
   * Individual order-level book data. Requires authentication.
   */
  getLevel3OrderBook(
    params: SpotGetLevel3Params,
  ): Promise<SpotAPISuccessResponse<SpotLevel3OrderBookResponse>> {
    return this.postPrivate('0/private/Level3', { body: params });
  }

  /**
   * Get Recent Trades
   *
   * Returns the last 1000 trades by default
   */
  getRecentTrades(
    params: SpotGetRecentTradesParams,
  ): Promise<SpotAPISuccessResponse<SpotRecentTradesResponse>> {
    return this.get('0/public/Trades', params);
  }

  /**
   * Get Recent Spreads
   *
   * Returns the last ~200 top-of-book spreads for a given pair
   */
  getRecentSpreads(
    params: SpotGetRecentSpreadsParams,
  ): Promise<SpotAPISuccessResponse<SpotRecentSpreadsResponse>> {
    return this.get('0/public/Spread', params);
  }

  /**
   *
   * Spot REST API - Account Data
   *
   */

  /**
   * Get Account Balance
   *
   * Retrieve all cash balances, net of pending withdrawals.
   * Pass account_id to retrieve balances for a specific wallet.
   */
  getAccountBalance(
    params?: SpotGetAccountBalanceParams,
  ): Promise<SpotAPISuccessResponse<SpotAccountBalance>> {
    const { account_id, ...body } = params ?? {};
    return this.postPrivate('0/private/Balance', {
      body,
      query: account_id ? { account_id } : undefined,
    });
  }

  /**
   * Get API Key Info
   *
   * Retrieve configuration and usage details for the API key used in the request.
   */
  getApiKeyInfo(
    params?: SpotGetApiKeyInfoParams,
  ): Promise<SpotAPISuccessResponse<SpotApiKeyInfo>> {
    return this.postPrivate('0/private/GetApiKeyInfo', { body: params });
  }

  /**
   * List Wallet Accounts
   *
   * Retrieve the wallet accounts associated with the authenticated user.
   */
  getWalletAccounts(): Promise<
    SpotAPISuccessResponse<SpotListWalletAccountsResponse>
  > {
    return this.postPrivate('0/private/ListWalletAccounts', { body: {} });
  }

  /**
   * Get Extended Balance
   *
   * Retrieve all extended account balances, including credits and held amounts.
   * Balance available for trading is calculated as: available balance = balance + credit - credit_used - hold_trade
   */
  getExtendedBalance(params?: {
    rebase_multiplier?: 'rebased' | 'base';
    account_id?: string;
  }): Promise<SpotAPISuccessResponse<SpotExtendedBalance>> {
    const { account_id, ...body } = params ?? {};
    return this.postPrivate('0/private/BalanceEx', {
      body,
      query: account_id ? { account_id } : undefined,
    });
  }

  /**
   * Get Credit Lines
   *
   * Retrieve all credit line details for VIPs with this functionality.
   */
  getCreditLines(params?: {
    rebase_multiplier?: 'rebased' | 'base';
    account_id?: string;
  }): Promise<SpotAPISuccessResponse<SpotCreditLines | null>> {
    const { account_id, ...body } = params ?? {};
    return this.postPrivate('0/private/CreditLines', {
      body,
      query: account_id ? { account_id } : undefined,
    });
  }

  /**
   * Get Trade Balance
   *
   * Retrieve a summary of collateral balances, margin position valuations, equity and margin level.
   */
  getTradeBalance(params?: {
    rebase_multiplier?: 'rebased' | 'base';
    account_id?: string;
  }): Promise<SpotAPISuccessResponse<SpotTradeBalance>> {
    const { account_id, ...body } = params ?? {};
    return this.postPrivate('0/private/TradeBalance', {
      body,
      query: account_id ? { account_id } : undefined,
    });
  }

  /**
   * Get Open Orders
   *
   * Retrieve information about currently open orders.
   */
  getOpenOrders(
    params?: SpotGetOpenOrdersParams,
  ): Promise<SpotAPISuccessResponse<SpotOpenOrdersResponse>> {
    const { account_id, ...body } = params ?? {};
    return this.postPrivate('0/private/OpenOrders', {
      body,
      query: account_id ? { account_id } : undefined,
    });
  }

  /**
   * Get Closed Orders
   *
   * Retrieve information about orders that have been closed (filled or cancelled).
   * 50 results are returned at a time, the most recent by default.
   */
  getClosedOrders(
    params?: SpotGetClosedOrdersParams,
  ): Promise<SpotAPISuccessResponse<SpotClosedOrdersResponse>> {
    const { account_id, ...body } = params ?? {};
    return this.postPrivate('0/private/ClosedOrders', {
      body,
      query: account_id ? { account_id } : undefined,
    });
  }

  /**
   * Query Orders Info
   *
   * Retrieve information about specific orders.
   */
  getOrders(
    params: SpotQueryOrdersParams,
  ): Promise<SpotAPISuccessResponse<SpotQueryOrdersResponse>> {
    const { account_id, ...body } = params;
    return this.postPrivate('0/private/QueryOrders', {
      body,
      query: account_id ? { account_id } : undefined,
    });
  }

  /**
   * Get Order Amends
   *
   * Retrieves an audit trail of amend transactions on the specified order.
   * The list is ordered by ascending amend timestamp.
   */
  getOrderAmends(params: {
    order_id: string;
    rebase_multiplier?: 'rebased' | 'base';
    account_id?: string;
  }): Promise<SpotAPISuccessResponse<SpotOrderAmendsResponse>> {
    const { account_id, ...body } = params;
    return this.postPrivate('0/private/OrderAmends', {
      body,
      query: account_id ? { account_id } : undefined,
    });
  }

  /**
   * Get Trades History
   *
   * Retrieve information about trades/fills. 50 results are returned at a time, the most recent by default.
   */
  getTradesHistory(
    params?: SpotGetTradesHistoryParams,
  ): Promise<SpotAPISuccessResponse<SpotTradesHistoryResponse>> {
    const { account_id, ...body } = params ?? {};
    return this.postPrivate('0/private/TradesHistory', {
      body,
      query: account_id ? { account_id } : undefined,
    });
  }

  /**
   * Query Trades Info
   *
   * Retrieve information about specific trades/fills.
   */
  getTrades(
    params: SpotQueryTradesParams,
  ): Promise<SpotAPISuccessResponse<SpotQueryTradesResponse>> {
    const { account_id, ...body } = params;
    return this.postPrivate('0/private/QueryTrades', {
      body,
      query: account_id ? { account_id } : undefined,
    });
  }

  /**
   * Get Open Positions
   *
   * Get information about open margin positions.
   */
  getOpenPositions(
    params?: SpotGetOpenPositionsParams,
  ): Promise<SpotAPISuccessResponse<SpotOpenPositionsResult>> {
    const { account_id, ...body } = params ?? {};
    return this.postPrivate('0/private/OpenPositions', {
      body,
      query: account_id ? { account_id } : undefined,
    });
  }

  /**
   * Get Ledgers Info
   *
   * Retrieve information about ledger entries. 50 results are returned at a time, the most recent by default.
   * Pass account_id to retrieve ledger entries for a specific wallet.
   */
  getLedgersInfo(
    params?: SpotGetLedgersInfoParams,
  ): Promise<SpotAPISuccessResponse<SpotLedgersInfoResponse>> {
    const { account_id, ...body } = params ?? {};
    return this.postPrivate('0/private/Ledgers', {
      body,
      query: account_id ? { account_id } : undefined,
    });
  }

  /**
   * Query Ledgers
   *
   * Retrieve information about specific ledger entries.
   */
  getLedgers(
    params: SpotQueryLedgersParams,
  ): Promise<SpotAPISuccessResponse<SpotQueryLedgersResponse>> {
    const { account_id, ...body } = params;
    return this.postPrivate('0/private/QueryLedgers', {
      body,
      query: account_id ? { account_id } : undefined,
    });
  }

  /**
   * Get Trade Volume
   *
   * Returns 30 day USD trading volume and resulting fee schedule for any asset pair(s) provided.
   * Also use this endpoint (with a Spot API key) to determine Futures fee rates as of 2026-06-22.
   */
  getTradingVolume(
    params?: SpotGetTradingVolumeParams,
  ): Promise<SpotAPISuccessResponse<SpotTradeVolume>> {
    return this.postPrivate('0/private/TradeVolume', { body: params });
  }

  /**
   * Request Export Report
   *
   * Request export of trades or ledgers.
   */
  requestLedgersExport(
    params: SpotRequestExportReportParams,
  ): Promise<SpotAPISuccessResponse<SpotRequestExportReportResponse>> {
    return this.postPrivate('0/private/AddExport', { body: params });
  }

  /**
   * Get Export Report Status
   *
   * Get status of requested data exports.
   */
  getLedgersExportStatus(params: {
    report: 'trades' | 'ledgers';
  }): Promise<SpotAPISuccessResponse<SpotExportReportStatus[]>> {
    return this.postPrivate('0/private/ExportStatus', { body: params });
  }

  /**
   * Retrieve Data Export
   *
   * Retrieve a processed data export (binary zip archive).
   */
  getLedgersExport(params: { id: string }): Promise<any> {
    return this.postPrivate('0/private/RetrieveExport', { body: params });
  }

  /**
   * Delete Export Report
   *
   * Delete or cancel exported trades/ledgers report.
   */
  deleteLedgersExport(params: {
    id: string;
    type: 'cancel' | 'delete';
  }): Promise<SpotAPISuccessResponse<SpotDeleteExportReportResponse>> {
    return this.postPrivate('0/private/RemoveExport', { body: params });
  }

  /**
   *
   * Spot REST API - Trading
   *
   */

  /**
   * Add Order
   *
   * Place a new order.
   * Note: See the getAssetPairs() endpoint for details on the available trading pairs, their price and quantity precisions,
   * order minimums, available leverage, etc.
   */
  submitOrder(
    params: SpotSubmitOrderParams,
  ): Promise<SpotAPISuccessResponse<SpotSubmitOrderResponse>> {
    return this.postPrivate('0/private/AddOrder', {
      body: params,
    });
  }

  /**
   * Amend Order
   *
   * Amend an existing order. The order identifiers assigned by Kraken and/or client will stay the same.
   * Queue priority in the order book will be maintained where possible.
   */
  amendOrder(params: SpotAmendOrderParams): Promise<
    SpotAPISuccessResponse<{
      amend_id: string;
    }>
  > {
    return this.postPrivate('0/private/AmendOrder', {
      body: params,
    });
  }

  /**
   * Cancel Order
   *
   * Cancel a particular open order (or set of open orders) by txid, userref or cl_ord_id.
   */
  cancelOrder(params: { txid?: string | number; cl_ord_id?: string }): Promise<
    SpotAPISuccessResponse<{
      count: number;
      pending?: boolean;
    }>
  > {
    return this.postPrivate('0/private/CancelOrder', {
      body: params,
    });
  }

  /**
   * Cancel All Orders
   *
   * Cancel all open orders.
   */
  cancelAllOrders(): Promise<
    SpotAPISuccessResponse<{
      count: number;
      pending: boolean;
    }>
  > {
    return this.postPrivate('0/private/CancelAll', { body: {} });
  }

  /**
   * Cancel All Orders After X
   *
   * CancelAllOrdersAfter provides a "Dead Man's Switch" mechanism to protect the client from network malfunction,
   * extreme latency or unexpected matching engine downtime. The client can send a request with a timeout (in seconds),
   * that will start a countdown timer which will cancel all client orders when the timer expires.
   */
  cancelAllOrdersAfter(params: { timeout: number }): Promise<
    SpotAPISuccessResponse<{
      currentTime: string;
      triggerTime: string;
    }>
  > {
    return this.postPrivate('0/private/CancelAllOrdersAfter', {
      body: params,
    });
  }

  /**
   * Get Websockets Token
   *
   * An authentication token must be requested via this REST API endpoint in order to connect to and authenticate
   * with the Websockets API. The token should be used within 15 minutes of creation.
   */
  getWebSocketsToken(): Promise<
    SpotAPISuccessResponse<SpotWebSocketsTokenResponse>
  > {
    return this.postPrivate('0/private/GetWebSocketsToken', { body: {} });
  }

  /**
   * Add Order Batch
   *
   * Sends a collection of orders (minimum of 2 and maximum 15). All orders in batch are limited to a single pair.
   * Validation is performed on the whole batch prior to submission. If an order fails validation, the whole batch will be rejected.
   */
  submitBatchOrders(params: SpotSubmitOrderBatchParams): Promise<
    SpotAPISuccessResponse<{
      orders: SpotBatchOrderResult[];
    }>
  > {
    return this.postPrivate('0/private/AddOrderBatch', {
      body: params,
    });
  }

  /**
   * Cancel Order Batch
   *
   * Cancel multiple open orders by txid, userref or cl_ord_id (maximum 50 total unique IDs/references).
   */
  cancelBatchOrders(params: {
    orders?: Array<string | number>;
    cl_ord_ids?: string[];
  }): Promise<
    SpotAPISuccessResponse<{
      count: number;
    }>
  > {
    return this.postPrivate('0/private/CancelOrderBatch', {
      body: params,
    });
  }

  /**
   *
   * Spot REST API - Algo Trading
   *
   */

  /**
   * Add Strategy
   *
   * Submit a TWAP strategy with a time horizon of at least 60 seconds.
   * Returns an AS-prefixed strategy ID, or an empty string when validate is true.
   */
  submitStrategy(params: SpotSubmitStrategyParams): Promise<
    SpotAPISuccessResponse<{
      strategy_id: string;
    }>
  > {
    return this.postPrivate('0/private/AddStrategy', { body: params });
  }

  /**
   * Cancel Strategy
   *
   * Cancel a pending or open strategy. Use queryStrategies() for the final status and fills.
   */
  cancelStrategy(params: { strategy_id: string }): Promise<
    SpotAPISuccessResponse<{
      strategy_id: string;
    }>
  > {
    return this.postPrivate('0/private/CancelStrategy', { body: params });
  }

  /**
   * Get Open Strategies
   *
   * Get pending and open strategies keyed by strategy ID.
   */
  getOpenStrategies(params?: { strategy_type?: 'twap' }): Promise<
    SpotAPISuccessResponse<{
      open: Record<string, SpotAlgoStrategy>;
    }>
  > {
    return this.postPrivate('0/private/GetOpenStrategies', { body: params });
  }

  /**
   * Query Strategies
   *
   * Query up to 20 comma-delimited strategy IDs. Unmatched IDs are omitted.
   */
  queryStrategies(params: { strategy_ids: string }): Promise<
    SpotAPISuccessResponse<{
      strategies: Record<string, SpotAlgoStrategy>;
    }>
  > {
    return this.postPrivate('0/private/QueryStrategies', { body: params });
  }

  /**
   * Get Closed Strategies
   *
   * Get terminal strategies with cursor pagination (limit 1-100, default 100).
   * Repeat the original filters with next_cursor as cursor. No ofs or count is supported.
   */
  getClosedStrategies(
    params?: SpotGetClosedStrategiesParams,
  ): Promise<SpotAPISuccessResponse<SpotClosedStrategiesResponse>> {
    return this.postPrivate('0/private/GetClosedStrategies', { body: params });
  }

  /**
   *
   * Spot REST API - Funding
   *
   */

  /**
   * Get Deposit Methods
   *
   * Retrieve methods available for depositing a particular asset.
   */
  getDepositMethods(
    params: SpotGetDepositMethodsParams,
  ): Promise<SpotAPISuccessResponse<SpotDepositMethod[]>> {
    return this.postPrivate('0/private/DepositMethods', { body: params });
  }

  /**
   * Get Deposit Addresses
   *
   * Retrieve (or generate a new) deposit addresses for a particular asset and method.
   */
  getDepositAddresses(
    params: SpotGetDepositAddressesParams,
  ): Promise<SpotAPISuccessResponse<SpotDepositAddress[]>> {
    return this.postPrivate('0/private/DepositAddresses', { body: params });
  }

  /**
   * Get Status of Recent Deposits
   *
   * Retrieve information about recent deposits. Results are sorted by recency.
   */
  getDepositsStatus(
    params?: SpotGetDepositStatusParams,
  ): Promise<SpotAPISuccessResponse<SpotDepositStatusResponse>> {
    return this.postPrivate('0/private/DepositStatus', { body: params });
  }

  /**
   * Get Withdrawal Methods
   *
   * Retrieve a list of withdrawal methods available for the user.
   */
  getWithdrawalMethods(
    params?: SpotGetWithdrawalMethodsParams,
  ): Promise<SpotAPISuccessResponse<SpotWithdrawalMethod[]>> {
    return this.postPrivate('0/private/WithdrawMethods', { body: params });
  }

  /**
   * Get Withdrawal Addresses
   *
   * Retrieve a list of withdrawal addresses available for the user.
   */
  getWithdrawalAddresses(
    params?: SpotGetWithdrawalAddressesParams,
  ): Promise<SpotAPISuccessResponse<SpotWithdrawalAddress[]>> {
    return this.postPrivate('0/private/WithdrawAddresses', { body: params });
  }

  /**
   * Get Withdrawal Information
   *
   * Retrieve fee information about potential withdrawals for a particular asset, key and amount.
   */
  getWithdrawalInfo(
    params: SpotGetWithdrawalInfoParams,
  ): Promise<SpotAPISuccessResponse<SpotWithdrawalInfo>> {
    return this.postPrivate('0/private/WithdrawInfo', { body: params });
  }

  /**
   * Withdraw Funds
   *
   * Make a withdrawal request.
   */
  submitWithdrawal(params: SpotWithdrawFundsParams): Promise<
    SpotAPISuccessResponse<{
      refid: string;
    }>
  > {
    return this.postPrivate('0/private/Withdraw', { body: params });
  }

  /**
   * Get Status of Recent Withdrawals
   *
   * Retrieve information about recent withdrawals. Results are sorted by recency.
   */
  getWithdrawalsStatus(
    params?: SpotGetWithdrawalsStatusParams,
  ): Promise<SpotAPISuccessResponse<SpotWithdrawalStatus[]>> {
    return this.postPrivate('0/private/WithdrawStatus', { body: params });
  }

  /**
   * Request Withdrawal Cancellation
   *
   * Cancel a recently requested withdrawal, if it has not already been successfully processed.
   */
  cancelWithdrawal(params: {
    asset: string;
    refid: string;
  }): Promise<SpotAPISuccessResponse<boolean>> {
    return this.postPrivate('0/private/WithdrawCancel', { body: params });
  }

  /**
   * Request Wallet Transfer
   *
   * Transfer from a Kraken spot wallet to a Kraken Futures wallet.
   * Note: Transfer in the other direction must be requested via the Kraken Futures API.
   */
  submitTransferToFutures(params: SpotWalletTransferParams): Promise<
    SpotAPISuccessResponse<{
      refid: string;
    }>
  > {
    return this.postPrivate('0/private/WalletTransfer', { body: params });
  }

  /**
   *
   * Subaccounts
   *
   */

  /**
   * Create Subaccount
   *
   * Create a trading subaccount.
   * Note: CreateSubaccount must be called using an API key from the master account.
   */
  createSubaccount(params: {
    username: string;
    email: string;
  }): Promise<SpotAPISuccessResponse<boolean>> {
    return this.postPrivate('0/private/CreateSubaccount', { body: params });
  }

  /**
   * Account Transfer
   *
   * Transfer funds to and from master and subaccounts.
   * Note: AccountTransfer must be called using an API key from the master account.
   */
  submitSubaccountTransfer(
    params: SpotAccountTransferParams,
  ): Promise<SpotAPISuccessResponse<SpotAccountTransferResponse>> {
    return this.postPrivate('0/private/AccountTransfer', { body: params });
  }

  /**
   *
   * Earn
   *
   */

  /**
   * Allocate Earn Funds
   *
   * Allocate funds to the Strategy.
   * This method is asynchronous. Use getAllocationStatus() to poll the result.
   */
  allocateEarnFunds(params: {
    amount: string;
    strategy_id: string;
  }): Promise<SpotAPISuccessResponse<boolean>> {
    return this.postPrivate('0/private/Earn/Allocate', { body: params });
  }

  /**
   * Deallocate Earn Funds
   *
   * Deallocate funds from a strategy.
   * This method is asynchronous. Use getDeallocationStatus() to poll the result.
   */
  deallocateEarnFunds(params: {
    amount: string;
    strategy_id: string;
  }): Promise<SpotAPISuccessResponse<boolean>> {
    return this.postPrivate('0/private/Earn/Deallocate', { body: params });
  }

  /**
   * Get Allocation Status
   *
   * Get the status of the last allocation request.
   */
  getEarnAllocationStatus(params: { strategy_id: string }): Promise<
    SpotAPISuccessResponse<{
      pending: boolean;
    }>
  > {
    return this.postPrivate('0/private/Earn/AllocateStatus', { body: params });
  }

  /**
   * Get Deallocation Status
   *
   * Get the status of the last deallocation request.
   */
  getEarnDeallocationStatus(params: { strategy_id: string }): Promise<
    SpotAPISuccessResponse<{
      pending: boolean;
    }>
  > {
    return this.postPrivate('0/private/Earn/DeallocateStatus', {
      body: params,
    });
  }

  /**
   * List Earn Strategies
   *
   * List earn strategies along with their parameters.
   * Returns only strategies that are available to the user based on geographic region.
   */
  getEarnStrategies(params?: SpotListEarnStrategiesParams): Promise<
    SpotAPISuccessResponse<{
      items: SpotEarnStrategy[];
      next_cursor?: string;
    }>
  > {
    return this.postPrivate('0/private/Earn/Strategies', { body: params });
  }

  /**
   * List Earn Allocations
   *
   * List all allocations for the user.
   * By default all allocations are returned, even for strategies that have been used in the past and have zero balance now.
   */
  getEarnAllocations(
    params?: SpotListEarnAllocationsParams,
  ): Promise<SpotAPISuccessResponse<SpotListEarnAllocationsResponse>> {
    return this.postPrivate('0/private/Earn/Allocations', { body: params });
  }

  /**
   *
   * Transparency
   *
   */

  /**
   * Pre-Trade Data
   *
   * Returns the price levels in the order book with aggregated order quantities at each price level.
   * The top 10 levels are returned for each trading pair.
   */
  getPreTradeData(params: {
    symbol: string;
  }): Promise<SpotAPISuccessResponse<SpotPreTradeData>> {
    return this.get('0/public/PreTrade', params);
  }

  /**
   * Post-Trade Data
   *
   * Returns a list of trades on the spot exchange.
   * If no filter parameters are specified, the last 1000 trades for all pairs are received.
   */
  getPostTradeData(
    params?: SpotGetPostTradeDataParams,
  ): Promise<SpotAPISuccessResponse<SpotPostTradeDataResponse>> {
    return this.get('0/public/PostTrade', params);
  }

  /**
   *
   * Spot REST API - OAuth
   *
   */

  /**
   * Get Access Token
   *
   * Retrieve the access token.
   * Note: This endpoint uses Basic authentication (Authorization header with base64-encoded client credentials).
   */
  getOAuthAccessToken(
    params: OauthGetAccessTokenParams,
  ): Promise<OauthGetAccessTokenResponse> {
    return this.post('oauth/token', { body: params });
  }

  /**
   * Get User Info
   *
   * Returns the email address and IIBAN of the user.
   * Note: Requires OAuth2 Bearer token. Scopes required: account.info:basic
   */
  getOAuthUserInfo(): Promise<OauthGetUserInfoResponse> {
    return this.getPrivate('oauth/userinfo');
  }

  /**
   * Create Fast API Key
   *
   * Creates a Fast API key.
   * Note: Requires OAuth2 Bearer token. Scopes required: account.fast-api-key:write
   */
  createOAuthFastApiKey(
    params: OauthCreateFastApiKeyParams,
  ): Promise<OauthCreateFastApiKeyResponse> {
    return this.postPrivate('oauth/fast-api-key', { body: params });
  }

  /**
   * Delete Fast API Key
   *
   * Deletes a Fast API key.
   * Note: Requires OAuth2 Bearer token. Scopes required: account.fast-api-key:write
   */
  deleteOAuthFastApiKey(params: {
    api_key_name: string; // max 32 chars
  }): Promise<{
    result: boolean;
  }> {
    return this.deletePrivate('oauth/fast-api-key', { body: params });
  }

  /**
   * Update Fast API Key
   *
   * Updates a Fast API key.
   * Note: Requires OAuth2 Bearer token. Scopes required: account.fast-api-key:write
   */
  updateOAuthFastApiKey(params: OauthUpdateFastApiKeyParams): Promise<{
    result: boolean;
  }> {
    return this.putPrivate('oauth/fast-api-key', { body: params });
  }

  /**
   * List Fast API Keys
   *
   * List all Fast API keys.
   * Note: Requires OAuth2 Bearer token. Scopes required: account.fast-api-key:read
   */
  listOAuthFastApiKeys(): Promise<{
    result: OauthFastApiKey[];
  }> {
    return this.getPrivate('oauth/fast-api-keys');
  }
}
