import { nanoid } from 'nanoid';

import { BaseRestClient } from './lib/BaseRestClient.js';
import { REST_CLIENT_TYPE_ENUM, RestClientType } from './lib/requestUtils.js';
import {
  FuturesAddAssignmentPreferenceParams,
  FuturesBatchOrderParams,
  FuturesCancelOrderParams,
  FuturesEditOrderParams,
  FuturesGetAccountLogParams,
  FuturesGetAnalyticsParams,
  FuturesGetCandlesParams,
  FuturesGetOrderEventsParams,
  FuturesGetPositionEventsParams,
  FuturesGetTriggerEventsParams,
  FuturesHistoryBaseParams,
  FuturesInitiateSubaccountTransferParams,
  FuturesInitiateWalletTransferParams,
  FuturesMarketHistoryBaseParams,
  FuturesSendOrderParams,
  FuturesSetRfqAssignmentMaxLeverageParams,
  FuturesSubmitToSpotParams,
  FuturesUpdateSelfTradeStrategyParams,
} from './types/request/derivatives.types.js';
import {
  FuturesAccountLog,
  FuturesAccounts,
  FuturesAnalyticsResponse,
  FuturesApiKeyV3Check,
  FuturesAssignmentProgram,
  FuturesAssignmentProgramHistory,
  FuturesBatchOrderStatus,
  FuturesCancelAllOrdersStatus,
  FuturesCancelOrderStatus,
  FuturesCandles,
  FuturesDeadMansSwitchStatus,
  FuturesEditOrderStatus,
  FuturesFeeSchedule,
  FuturesFill,
  FuturesHistoricalFundingRate,
  FuturesHistoryExecutionEvent,
  FuturesHistoryOrderEvent,
  FuturesHistoryResponse,
  FuturesHistoryTriggerEvent,
  FuturesInstrument,
  FuturesInstrumentStatus,
  FuturesLeveragePreference,
  FuturesMarketHistoryResponse,
  FuturesMarketShare,
  FuturesNotification,
  FuturesOpenOffer,
  FuturesOpenOrder,
  FuturesOpenPosition,
  FuturesOrderBook,
  FuturesOrderStatusInfo,
  FuturesPnlPreference,
  FuturesPortfolioMarginParameters,
  FuturesPortfolioSimulation,
  FuturesPositionUpdateEvent,
  FuturesPublicExecutionEvent,
  FuturesPublicMarkPriceEvent,
  FuturesPublicOrderEvent,
  FuturesResolution,
  FuturesRfq,
  FuturesSelfTradeStrategy,
  FuturesSendOrderStatus,
  FuturesSubaccountsInfo,
  FuturesTicker,
  FuturesTickType,
  FuturesTradeHistoryItem,
  FuturesUnwindQueuePosition,
} from './types/response/derivatives.types.js';
import { DerivativesAPISuccessResponse } from './types/response/shared.types.js';

/**
 * The DerivativesClient provides integration to the Kraken Derivatives API.
 *
 * Docs:
 * - https://docs.kraken.com/api/docs/guides/futures-introduction
 * - https://docs.kraken.com/api/docs/guides/futures-rest
 * - https://docs.kraken.com/api/docs/futures-api/trading/get-history
 */
export class DerivativesClient extends BaseRestClient {
  getClientType(): RestClientType {
    return REST_CLIENT_TYPE_ENUM.derivatives;
  }

  /**
   *
   * Misc Utility Methods
   *
   */

  generateNewOrderID(): string {
    return nanoid(32);
  }

  /**
   *
   * Futures REST API - Trading - Market Data
   *
   */

  /**
   * Get trade history
   *
   * This endpoint returns the most recent 100 trades prior to the specified lastTime value up to past 7 days or recent trading engine restart (whichever is sooner).
   * If no lastTime specified, it will return 100 most recent trades.
   */
  getTradeHistory(params: {
    symbol: string;
    lastTime?: string;
  }): Promise<
    DerivativesAPISuccessResponse<{ history: FuturesTradeHistoryItem[] }>
  > {
    return this.get('derivatives/api/v3/history', params);
  }

  /**
   * Get orderbook
   *
   * This endpoint returns the entire non-cumulative order book of currently listed Futures contracts.
   */
  getOrderbook(params: {
    symbol: string;
  }): Promise<DerivativesAPISuccessResponse<{ orderBook: FuturesOrderBook }>> {
    return this.get('derivatives/api/v3/orderbook', params);
  }

  /**
   * Get tickers
   *
   * This endpoint returns current market data for all currently listed Futures contracts and indices.
   */
  getTickers(): Promise<
    DerivativesAPISuccessResponse<{ tickers: FuturesTicker[] }>
  > {
    return this.get('derivatives/api/v3/tickers');
  }

  /**
   * Get ticker by symbol
   *
   * Get market data for contract or index by symbol.
   */
  getTicker(params: {
    symbol: string;
  }): Promise<DerivativesAPISuccessResponse<{ ticker: FuturesTicker }>> {
    return this.get(`derivatives/api/v3/tickers/${params.symbol}`);
  }

  /**
   *
   * Futures REST API - Trading - Instrument Details
   *
   */

  /**
   * Get instruments
   *
   * Returns specifications for all currently listed markets and indices.
   */
  getInstruments(): Promise<
    DerivativesAPISuccessResponse<{ instruments: FuturesInstrument[] }>
  > {
    return this.get('derivatives/api/v3/instruments');
  }

  /**
   * Get trading instruments
   *
   * Returns specifications for all currently accessible markets and indices.
   */
  getTradingInstruments(): Promise<
    DerivativesAPISuccessResponse<{ instruments: FuturesInstrument[] }>
  > {
    return this.getPrivate('derivatives/api/v3/trading/instruments');
  }

  /**
   * Get instrument status list
   *
   * Returns price dislocation and volatility details for all markets.
   */
  getInstrumentStatusList(): Promise<
    DerivativesAPISuccessResponse<{
      instrumentStatus: FuturesInstrumentStatus[];
    }>
  > {
    return this.get('derivatives/api/v3/instruments/status');
  }

  /**
   * Get instrument status
   *
   * Returns price dislocation and volatility details for given market.
   */
  getInstrumentStatus(params: {
    symbol: string;
  }): Promise<DerivativesAPISuccessResponse<FuturesInstrumentStatus>> {
    return this.get(`derivatives/api/v3/instruments/${params.symbol}/status`);
  }

  /**
   *
   * Futures REST API - Trading - Order Management
   *
   */

  /**
   * Batch order management
   *
   * This endpoint allows sending limit or stop order(s) and/or cancelling open order(s) and/or editing open order(s) for a currently listed Futures contract in batch.
   * When editing an order, if the trailingStopMaxDeviation and trailingStopDeviationUnit parameters are sent unchanged, the system will recalculate a new stop price upon successful order modification.
   *
   * On an edit instruction, `size` follows Kraken `qtyMode` (default `RELATIVE`): it sets the open (remaining) size, not the total quantity including fills. Pass `qtyMode: 'ABSOLUTE'` to set the total size including past fills.
   */
  batchOrderManagement(
    params: FuturesBatchOrderParams,
  ): Promise<
    DerivativesAPISuccessResponse<{ batchStatus: FuturesBatchOrderStatus[] }>
  > {
    const { ProcessBefore, json } = params;
    return this.postPrivate('derivatives/api/v3/batchorder', {
      body: {
        ProcessBefore: ProcessBefore,
        json,
      },
    });
  }

  /**
   * Cancel all orders
   *
   * This endpoint allows cancelling orders which are associated with a future's contract or a margin account. If no arguments are specified all open orders will be cancelled.
   */
  cancelAllOrders(params?: { symbol?: string }): Promise<
    DerivativesAPISuccessResponse<{
      cancelStatus: FuturesCancelAllOrdersStatus;
    }>
  > {
    return this.postPrivate('derivatives/api/v3/cancelallorders', {
      body: params,
    });
  }

  /**
   * Dead man's switch
   *
   * This endpoint provides a Dead Man's Switch mechanism to protect the user from network malfunctions. The user can send a request with a timeout in seconds which will trigger a countdown timer that will cancel all user orders when timeout expires. The user has to keep sending request to push back the timeout expiration or they can deactivate the mechanism by specifying a timeout of zero (0).
   * The recommended mechanism usage is making a call every 15 to 20 seconds and provide a timeout of 60 seconds. This allows the user to keep the orders in place on a brief network failure, while keeping them safe in case of a network breakdown.
   */
  cancelAllOrdersAfter(params: {
    timeout: number;
  }): Promise<
    DerivativesAPISuccessResponse<{ status: FuturesDeadMansSwitchStatus }>
  > {
    return this.postPrivate('derivatives/api/v3/cancelallordersafter', {
      body: params,
    });
  }

  /**
   * Cancel order
   *
   * This endpoint allows cancelling an open order for a Futures contract.
   */
  cancelOrder(
    params: FuturesCancelOrderParams,
  ): Promise<
    DerivativesAPISuccessResponse<{ cancelStatus: FuturesCancelOrderStatus }>
  > {
    return this.postPrivate('derivatives/api/v3/cancelorder', {
      body: params,
    });
  }

  /**
   * Edit order
   *
   * This endpoint allows editing an existing order for a currently listed Futures contract.
   * When editing an order, if the trailingStopMaxDeviation and trailingStopDeviationUnit parameters are sent unchanged, the system will recalculate a new stop price upon successful order modification.
   *
   * `size` follows Kraken `qtyMode`, which defaults to `RELATIVE` when omitted. That sets the open (remaining / unfilled) size, not the total quantity including fills. Pass `qtyMode: 'ABSOLUTE'` to set the total order size, including past fills, to `size`.
   *
   * @see https://docs.kraken.com/api-reference/order-management/edit-order
   */
  editOrder(
    params: FuturesEditOrderParams,
  ): Promise<
    DerivativesAPISuccessResponse<{ editStatus: FuturesEditOrderStatus }>
  > {
    return this.postPrivate('derivatives/api/v3/editorder', {
      body: params,
    });
  }

  /**
   * Get open orders
   *
   * This endpoint returns information on all open orders for all Futures contracts.
   */
  getOpenOrders(): Promise<
    DerivativesAPISuccessResponse<{ openOrders: FuturesOpenOrder[] }>
  > {
    return this.getPrivate('derivatives/api/v3/openorders');
  }

  /**
   * Send order
   *
   * This endpoint allows sending a limit, stop, take profit or immediate-or-cancel order for a currently listed Futures contract.
   */
  submitOrder(
    params: FuturesSendOrderParams,
  ): Promise<
    DerivativesAPISuccessResponse<{ sendStatus: FuturesSendOrderStatus }>
  > {
    return this.postPrivate('derivatives/api/v3/sendorder', {
      body: params,
    });
  }

  /**
   * Get Specific Orders' Status
   *
   * Returns information on specified orders which are open or were filled/cancelled in the last 5 seconds.
   */
  getOrderStatus(params?: {
    orderIds?: string[];
    cliOrdIds?: string[];
  }): Promise<
    DerivativesAPISuccessResponse<{ orders: FuturesOrderStatusInfo[] }>
  > {
    return this.postPrivate('derivatives/api/v3/orders/status', {
      body: params,
    });
  }

  /**
   *
   * Futures REST API - Trading - Multi-Collateral
   *
   */

  /**
   * Get PNL currency preferences
   *
   * The PNL currency preference is used to determine which currency to pay out when realizing PNL gains.
   */
  getPnlPreferences(): Promise<
    DerivativesAPISuccessResponse<{ preferences: FuturesPnlPreference[] }>
  > {
    return this.getPrivate('derivatives/api/v3/pnlpreferences');
  }

  /**
   * Set PNL currency preference
   *
   * The PNL currency preference is used to determine which currency to pay out when realizing PNL gains.
   * Calling this API can result in the following error codes: 87 (Contract does not exist), 88 (Contract not a multi-collateral futures contract), 89 (Currency does not exist), 90 (Currency is not enabled for multi-collateral futures), 41 (Would cause liquidation).
   */
  setPnlPreference(params: {
    symbol: string;
    pnlPreference: string;
  }): Promise<DerivativesAPISuccessResponse<Record<string, never>>> {
    return this.putPrivate('derivatives/api/v3/pnlpreferences', {
      query: params,
    });
  }

  /**
   * Get leverage settings
   *
   * Returns list of configured leverage preferences.
   */
  getLeverageSettings(): Promise<
    DerivativesAPISuccessResponse<{
      leveragePreferences: FuturesLeveragePreference[];
    }>
  > {
    return this.getPrivate('derivatives/api/v3/leveragepreferences');
  }

  /**
   * Set leverage settings
   *
   * Sets a contract's margin mode, either "isolated" or "cross" margin.
   * When specifying a max leverage, the contract's margin mode will be isolated.
   */
  setLeverageSettings(params: {
    symbol: string;
    maxLeverage?: number;
  }): Promise<DerivativesAPISuccessResponse<Record<string, never>>> {
    return this.putPrivate('derivatives/api/v3/leveragepreferences', {
      query: params,
    });
  }

  /**
   * Get the off-book max leverage cap
   *
   * Returns the account-level off-book maximum leverage cap, or null when no cap is configured.
   */
  getRfqAssignmentMaxLeverage(): Promise<
    DerivativesAPISuccessResponse<{ maxLeverage: number | null }>
  > {
    return this.getPrivate('derivatives/api/v3/rfq-assignment/max-leverage');
  }

  /**
   * Set the off-book max leverage cap
   *
   * Sets the account-level off-book maximum leverage cap for the authenticated master account.
   */
  setRfqAssignmentMaxLeverage(
    params: FuturesSetRfqAssignmentMaxLeverageParams,
  ): Promise<DerivativesAPISuccessResponse<{ maxLeverage: number | null }>> {
    return this.putPrivate('derivatives/api/v3/rfq-assignment/max-leverage', {
      query: params,
    });
  }

  /**
   * Clear the off-book max leverage cap
   *
   * Clears the account-level off-book maximum leverage cap for the authenticated master account.
   */
  deleteRfqAssignmentMaxLeverage(): Promise<
    DerivativesAPISuccessResponse<{ maxLeverage: number | null }>
  > {
    return this.deletePrivate('derivatives/api/v3/rfq-assignment/max-leverage');
  }

  /**
   *
   * Futures REST API - Trading - Account Information
   *
   */

  /**
   * Get wallets
   *
   * This endpoint returns key information relating to all your accounts which may either be cash accounts or margin accounts.
   * This includes digital asset balances, instrument balances, margin requirements, margin trigger estimates and
   * auxiliary information such as available funds, PnL of open positions and portfolio value.
   */
  getAccounts(): Promise<
    DerivativesAPISuccessResponse<{ accounts: FuturesAccounts }>
  > {
    return this.getPrivate('derivatives/api/v3/accounts');
  }

  /**
   * Get open positions
   *
   * This endpoint returns the size and average entry price of all open positions in Futures contracts.
   * This includes Futures contracts that have matured but have not yet been settled.
   */
  getOpenPositions(): Promise<
    DerivativesAPISuccessResponse<{ openPositions: FuturesOpenPosition[] }>
  > {
    return this.getPrivate('derivatives/api/v3/openpositions');
  }

  /**
   * Get position percentile of unwind queue
   *
   * This endpoint returns the percentile of the open position in case of unwinding.
   */
  getPositionPercentile(): Promise<
    DerivativesAPISuccessResponse<{ queue: FuturesUnwindQueuePosition[] }>
  > {
    return this.getPrivate('derivatives/api/v3/unwindqueue');
  }

  /**
   * Get portfolio margin parameters
   *
   * Retrieve current portfolio margin calculation parameters.
   * Also includes user specific limits related to options trading.
   * Note: This is currently available exclusively in the Kraken Futures DEMO environment.
   *
   * @deprecated Kraken retired the Futures demo environment on 14 July 2026, so this endpoint is no longer available. See https://support.kraken.com/articles/360024809011-api-testing-environment-derivatives
   */
  getPortfolioMarginParameters(): Promise<
    DerivativesAPISuccessResponse<FuturesPortfolioMarginParameters>
  > {
    return this.getPrivate('derivatives/api/v3/portfolio-margining/parameters');
  }

  /**
   * Calculate portfolio margin, pnl and greeks
   *
   * For a given portfolio of balances and positions (futures and options), calculate the margin requirements, pnl and option greeks.
   * Note: This is currently available exclusively in the Kraken Futures DEMO environment.
   *
   * @deprecated Kraken retired the Futures demo environment on 14 July 2026, so this endpoint is no longer available. See https://support.kraken.com/articles/360024809011-api-testing-environment-derivatives
   */
  simulateMarginRequirements(params: {
    json: any; // Complex structure for portfolio simulation
  }): Promise<DerivativesAPISuccessResponse<FuturesPortfolioSimulation>> {
    return this.postPrivate('derivatives/api/v3/portfolio-margining/simulate', {
      query: params,
    });
  }

  /**
   *
   * Futures REST API - Trading - Assignment Program
   *
   */

  /**
   * List assignment programs
   *
   * This endpoint returns information on currently active assignment programs.
   */
  getAssignmentPrograms(): Promise<
    DerivativesAPISuccessResponse<{ participants: FuturesAssignmentProgram[] }>
  > {
    return this.getPrivate('derivatives/api/v3/assignmentprogram/current');
  }

  /**
   * Add assignment preference
   *
   * This endpoint adds an assignment program preference.
   */
  addAssignmentPreference(
    params: FuturesAddAssignmentPreferenceParams,
  ): Promise<DerivativesAPISuccessResponse<FuturesAssignmentProgram>> {
    return this.postPrivate('derivatives/api/v3/assignmentprogram/add', {
      body: params,
    });
  }

  /**
   * Delete assignment preference
   *
   * This endpoint deletes an assignment program preference.
   */
  deleteAssignmentPreference(params: {
    id: number;
  }): Promise<DerivativesAPISuccessResponse<FuturesAssignmentProgram>> {
    return this.postPrivate('derivatives/api/v3/assignmentprogram/delete', {
      body: params,
    });
  }

  /**
   * List assignment preferences history
   *
   * This endpoint returns information on assignment program preferences change history.
   */
  getAssignmentPreferencesHistory(): Promise<
    DerivativesAPISuccessResponse<{
      participants: FuturesAssignmentProgramHistory[];
    }>
  > {
    return this.getPrivate('derivatives/api/v3/assignmentprogram/history');
  }

  /**
   *
   * Futures REST API - Trading - Fee Schedules
   *
   */

  /**
   * Get fee schedules
   *
   * This endpoint lists all fee schedules.
   *
   * @deprecated Effective 2026-06-22. Use SpotClient.getTradingVolume() with a Spot API key instead.
   */
  getFeeSchedules(): Promise<
    DerivativesAPISuccessResponse<{ feeSchedules: FuturesFeeSchedule[] }>
  > {
    return this.get('derivatives/api/v3/feeschedules');
  }

  /**
   * Get fee schedule volumes
   *
   * Returns your fee schedule volumes for each fee schedule.
   *
   * @deprecated Effective 2026-06-22. Use SpotClient.getTradingVolume() with a Spot API key instead.
   */
  getFeeScheduleVolumes(): Promise<
    DerivativesAPISuccessResponse<{
      volumesByFeeSchedule: Record<string, number>;
    }>
  > {
    return this.getPrivate('derivatives/api/v3/feeschedules/volumes');
  }

  /**
   *
   * Futures REST API - Trading - General
   *
   */

  /**
   * Get notifications
   *
   * This endpoint provides the platform's notifications.
   */
  getNotifications(): Promise<
    DerivativesAPISuccessResponse<{ notifications: FuturesNotification[] }>
  > {
    return this.getPrivate('derivatives/api/v3/notifications');
  }

  /**
   *
   * Futures REST API - Trading - Historical Data
   *
   */

  /**
   * Get your fills
   *
   * This endpoint returns information on your filled orders for all futures contracts.
   */
  getFills(params?: {
    lastFillTime?: string;
  }): Promise<DerivativesAPISuccessResponse<{ fills: FuturesFill[] }>> {
    return this.getPrivate('derivatives/api/v3/fills', params);
  }

  /**
   *
   * Futures REST API - Trading - Historical Funding Rates
   *
   */

  /**
   * Historical funding rates
   *
   * Returns list of historical funding rates for given market.
   */
  getHistoricalFundingRates(params: {
    symbol: string;
  }): Promise<
    DerivativesAPISuccessResponse<{ rates: FuturesHistoricalFundingRate[] }>
  > {
    return this.get('derivatives/api/v3/historical-funding-rates', params);
  }

  /**
   *
   * Futures REST API - Trading - Trading Settings
   *
   */

  /**
   * Get self trade strategy
   *
   * Returns account-wide self-trade matching strategy.
   */
  getSelfTradeStrategy(): Promise<
    DerivativesAPISuccessResponse<{
      strategy: FuturesSelfTradeStrategy;
    }>
  > {
    return this.getPrivate('derivatives/api/v3/self-trade-strategy');
  }

  /**
   * Update self trade strategy
   *
   * Updates account-wide self-trade matching behavior to given strategy.
   */
  updateSelfTradeStrategy(
    params: FuturesUpdateSelfTradeStrategyParams,
  ): Promise<
    DerivativesAPISuccessResponse<{
      strategy: FuturesSelfTradeStrategy;
    }>
  > {
    return this.putPrivate('derivatives/api/v3/self-trade-strategy', {
      query: params,
    });
  }

  /**
   *
   * Futures REST API - Trading - Subaccounts
   *
   */

  /**
   * Check subaccount trading status
   *
   * Returns trading capability info for given subaccount.
   */
  getSubaccountTradingStatus(params: {
    subaccountUid: string;
  }): Promise<DerivativesAPISuccessResponse<{ tradingEnabled: boolean }>> {
    return this.getPrivate(
      `derivatives/api/v3/subaccount/${params.subaccountUid}/trading-enabled`,
    );
  }

  /**
   * Update subaccount trading status
   *
   * Updates trading capabilities for given subaccount.
   */
  updateSubaccountTradingStatus(params: {
    subaccountUid: string;
    tradingEnabled: boolean;
  }): Promise<DerivativesAPISuccessResponse<{ tradingEnabled: boolean }>> {
    const { subaccountUid, ...otherParams } = params;
    return this.putPrivate(
      `derivatives/api/v3/subaccount/${subaccountUid}/trading-enabled`,
      { query: otherParams },
    );
  }

  /**
   * Get subaccounts
   *
   * Return information about subaccounts, including balances and UIDs.
   */
  getSubaccounts(): Promise<
    DerivativesAPISuccessResponse<FuturesSubaccountsInfo>
  > {
    return this.getPrivate('derivatives/api/v3/subaccounts');
  }

  /**
   *
   * Futures REST API - Trading - Transfers
   *
   */

  /**
   * Initiate wallet transfer
   *
   * This endpoint allows you to transfer funds between two margin accounts with the same collateral currency, or between a margin account and your cash account.
   */
  submitWalletTransfer(
    params: FuturesInitiateWalletTransferParams,
  ): Promise<DerivativesAPISuccessResponse<Record<string, never>>> {
    return this.postPrivate('derivatives/api/v3/transfer', {
      body: params,
    });
  }

  /**
   * Initiate sub account transfer
   *
   * This endpoint allows you to transfer funds between the current account and a sub account, between two margin accounts with the same collateral currency, or between a margin account and your cash account.
   */
  submitSubaccountTransfer(
    params: FuturesInitiateSubaccountTransferParams,
  ): Promise<DerivativesAPISuccessResponse<Record<string, never>>> {
    return this.postPrivate('derivatives/api/v3/transfer/subaccount', {
      body: params,
    });
  }

  /**
   * Initiate withdrawal to Spot wallet
   *
   * This endpoint allows you to request to withdraw digital assets to your Kraken Spot wallet.
   * Wallet names can be found in the 'accounts' structure in the Get Wallets /accounts response.
   */
  submitTransferToSpot(
    params: FuturesSubmitToSpotParams,
  ): Promise<DerivativesAPISuccessResponse<{ uid: string }>> {
    return this.postPrivate('derivatives/api/v3/withdrawal', {
      body: params,
    });
  }

  /**
   *
   * Futures REST API - Trading - RFQs
   *
   */

  /**
   * List all open RFQs
   *
   * Retrieve all currently open RFQs.
   * Note: This is currently available exclusively in the Kraken Futures DEMO environment.
   *
   * @deprecated Kraken retired the Futures demo environment on 14 July 2026, so this endpoint is no longer available. See https://support.kraken.com/articles/360024809011-api-testing-environment-derivatives
   */
  getOpenRFQs(): Promise<
    DerivativesAPISuccessResponse<{ rfqs: FuturesRfq[] }>
  > {
    return this.get('derivatives/api/v3/rfqs');
  }

  /**
   * Retrieve a single open RFQ
   *
   * Retrieve a specific open RFQ by its unique identifier.
   * Note: This is currently available exclusively in the Kraken Futures DEMO environment.
   *
   * @deprecated Kraken retired the Futures demo environment on 14 July 2026, so this endpoint is no longer available. See https://support.kraken.com/articles/360024809011-api-testing-environment-derivatives
   */
  getOpenRFQ(params: {
    rfqUid: string;
  }): Promise<DerivativesAPISuccessResponse<{ rfq: FuturesRfq }>> {
    return this.get(`derivatives/api/v3/rfqs/${params.rfqUid}`);
  }

  /**
   * List open offers on open RFQs
   *
   * Retrieve all open offers for the account on currently open RFQs.
   * Note: This is currently available exclusively in the Kraken Futures DEMO environment.
   *
   * @deprecated Kraken retired the Futures demo environment on 14 July 2026, so this endpoint is no longer available. See https://support.kraken.com/articles/360024809011-api-testing-environment-derivatives
   */
  getRFQOpenOffers(): Promise<
    DerivativesAPISuccessResponse<{ openOffers: FuturesOpenOffer[] }>
  > {
    return this.getPrivate('derivatives/api/v3/rfqs/open-offers');
  }

  /**
   * Place new offer on an open RFQ
   *
   * Place a new offer for the given amount in USD on the specified open RFQ, bid and ask are optional but at least one must be provided.
   * Note: This is currently available exclusively in the Kraken Futures DEMO environment.
   *
   * @deprecated Kraken retired the Futures demo environment on 14 July 2026, so this endpoint is no longer available. See https://support.kraken.com/articles/360024809011-api-testing-environment-derivatives
   */
  submitRFQNewOffer(params: {
    rfqUid: string;
    bid?: number;
    ask?: number;
  }): Promise<DerivativesAPISuccessResponse<{ offerUid: string }>> {
    const { rfqUid, ...bodyParams } = params;
    return this.postPrivate(`derivatives/api/v3/rfqs/${rfqUid}/place-offer`, {
      body: bodyParams,
    });
  }

  /**
   * Replace open offer on open RFQ
   *
   * Replace the current open offer on the specified open RFQ, bid and ask are optional but at least one must be provided.
   * Note: This is currently available exclusively in the Kraken Futures DEMO environment.
   *
   * @deprecated Kraken retired the Futures demo environment on 14 July 2026, so this endpoint is no longer available. See https://support.kraken.com/articles/360024809011-api-testing-environment-derivatives
   */
  updateRFQOpenOffer(params: {
    rfqUid: string;
    bid?: number;
    ask?: number;
  }): Promise<DerivativesAPISuccessResponse<Record<string, never>>> {
    const { rfqUid, ...bodyParams } = params;
    return this.putPrivate(`derivatives/api/v3/rfqs/${rfqUid}/replace-offer`, {
      body: bodyParams,
    });
  }

  /**
   * Cancel open offer on open RFQ
   *
   * Cancel the current open offer on the specified open RFQ.
   * Note: This is currently available exclusively in the Kraken Futures DEMO environment.
   *
   * @deprecated Kraken retired the Futures demo environment on 14 July 2026, so this endpoint is no longer available. See https://support.kraken.com/articles/360024809011-api-testing-environment-derivatives
   */
  cancelRFQOffer(params: {
    rfqUid: string;
  }): Promise<DerivativesAPISuccessResponse<Record<string, never>>> {
    return this.deletePrivate(
      `derivatives/api/v3/rfqs/${params.rfqUid}/cancel-offer`,
    );
  }

  /**
   *
   * Futures REST API - History - Account History
   *
   */

  /**
   * Get execution events
   *
   * Lists executions/trades for authenticated account.
   */
  getExecutionEvents(
    params?: FuturesHistoryBaseParams,
  ): Promise<
    DerivativesAPISuccessResponse<
      FuturesHistoryResponse<FuturesHistoryExecutionEvent>
    >
  > {
    return this.getPrivate('api/history/v3/executions', params);
  }

  /**
   * Get order events
   *
   * Lists order events for authenticated account.
   */
  getOrderEvents(
    params?: FuturesGetOrderEventsParams,
  ): Promise<
    DerivativesAPISuccessResponse<
      FuturesHistoryResponse<FuturesHistoryOrderEvent>
    >
  > {
    return this.getPrivate('api/history/v3/orders', params);
  }

  /**
   * Get trigger events
   *
   * Lists trigger events for authenticated account.
   */
  getTriggerEvents(
    params?: FuturesGetTriggerEventsParams,
  ): Promise<
    DerivativesAPISuccessResponse<
      FuturesHistoryResponse<FuturesHistoryTriggerEvent>
    >
  > {
    return this.getPrivate('api/history/v3/triggers', params);
  }

  /**
   * Get position update events
   *
   * Lists position events for authenticated account.
   */
  getPositionEvents(
    params?: FuturesGetPositionEventsParams,
  ): Promise<
    DerivativesAPISuccessResponse<
      FuturesHistoryResponse<FuturesPositionUpdateEvent>
    >
  > {
    return this.getPrivate('api/history/v3/positions', params);
  }

  /**
   * Get account log
   *
   * Lists account log entries, paged by timestamp or by ID.
   * To request entries by time range, use the since and before parameters. To request entries by ID range, use the from and to parameters. Any combination of since, before, from and to can be used to restrict the requested range of entries.
   */
  getAccountLog(
    params?: FuturesGetAccountLogParams,
  ): Promise<DerivativesAPISuccessResponse<FuturesAccountLog>> {
    return this.getPrivate('api/history/v3/account-log', params);
  }

  /**
   * Account log (CSV)
   *
   * Lists recent account log entries in CSV format.
   */
  getAccountLogCsv(params?: { conversion_details?: boolean }): Promise<string> {
    return this.getPrivate('api/history/v3/accountlogcsv', params);
  }

  /**
   *
   * Futures REST API - History - Market History
   *
   */

  /**
   * Get public execution events
   *
   * Lists trades for a market.
   */
  getPublicExecutionEvents(
    params: FuturesMarketHistoryBaseParams,
  ): Promise<FuturesMarketHistoryResponse<FuturesPublicExecutionEvent>> {
    const { tradeable, ...otherParams } = params;
    return this.get(`api/history/v3/market/${tradeable}/executions`, {
      params: otherParams,
    });
  }

  /**
   * Get public order events
   *
   * Lists order events for a market.
   */
  getPublicOrderEvents(
    params: FuturesMarketHistoryBaseParams,
  ): Promise<FuturesMarketHistoryResponse<FuturesPublicOrderEvent>> {
    const { tradeable, ...otherParams } = params;
    return this.get(`api/history/v3/market/${tradeable}/orders`, {
      params: otherParams,
    });
  }

  /**
   * Get public mark price events
   *
   * Lists price events for a market.
   */
  getPublicMarkPriceEvents(
    params: FuturesMarketHistoryBaseParams,
  ): Promise<FuturesMarketHistoryResponse<FuturesPublicMarkPriceEvent>> {
    const { tradeable, ...otherParams } = params;
    return this.get(`api/history/v3/market/${tradeable}/price`, {
      params: otherParams,
    });
  }

  /**
   *
   * Futures REST API - Charts - Candles
   *
   */

  /**
   * Tick Types
   *
   * Returns all available tick types to use with the getMarketsForTickType() endpoint.
   */
  getTickTypes(): Promise<FuturesTickType[]> {
    return this.get('api/charts/v1/');
  }

  /**
   * Markets
   *
   * Markets available for specified tick type.
   * List of available tick types can be fetched from the getTickTypes() endpoint.
   */
  getMarketsForTickType(params: {
    tickType: FuturesTickType;
  }): Promise<string[]> {
    return this.get(`api/charts/v1/${params.tickType}`);
  }

  /**
   * Resolutions
   *
   * Candle resolutions available for specified tick type and market.
   * List of available tick types can be fetched from the getTickTypes() endpoint.
   * List of available markets can be fetched from the getMarketsForTickType() endpoint.
   */
  getResolutions(params: {
    tickType: FuturesTickType;
    symbol: string;
  }): Promise<FuturesResolution[]> {
    return this.get(`api/charts/v1/${params.tickType}/${params.symbol}`);
  }

  /**
   * Market Candles
   *
   * Candles for specified tick type, market, and resolution.
   * List of available tick types can be fetched from the getTickTypes() endpoint.
   * List of available markets can be fetched from the getMarketsForTickType() endpoint.
   * List of available resolutions can be fetched from the getResolutions() endpoint.
   */
  getCandles(params: FuturesGetCandlesParams): Promise<FuturesCandles> {
    const { tickType, symbol, resolution, ...otherParams } = params;
    return this.get(`api/charts/v1/${tickType}/${symbol}/${resolution}`, {
      params: otherParams,
    });
  }

  /**
   *
   * Futures REST API - Charts - Analytics
   *
   */

  /**
   * Get liquidity pool statistic
   *
   * Get liquidity pool statistic including usd value.
   */
  getLiquidityPoolStatistic(
    params: FuturesGetAnalyticsParams,
  ): Promise<FuturesAnalyticsResponse> {
    return this.get('api/charts/v1/analytics/liquidity-pool', params);
  }

  /**
   * Market Analytics
   *
   * Analytics data divided into time buckets.
   */
  getMarketAnalytics(
    params: FuturesGetAnalyticsParams,
  ): Promise<FuturesAnalyticsResponse> {
    const { symbol, analyticsType, ...otherParams } = params;
    return this.get(`api/charts/v1/analytics/${symbol}/${analyticsType}`, {
      params: otherParams,
    });
  }

  /**
   *
   * Futures REST API - Auth - API Keys
   *
   */

  /**
   * Check v3 API key
   *
   * Verify API key access and return the authenticated key's details.
   */
  checkApiKeyV3(): Promise<FuturesApiKeyV3Check> {
    return this.getPrivate('api/auth/v1/api-keys/v3/check');
  }

  /**
   *
   * Futures REST API - Stats - Market Share
   *
   */

  /**
   * Get account's market share
   *
   * Get account's market share, volumes, and accrued rebates data in contracts configured for rebates.
   * The data may not be available immediately. In these cases HTTP 204 is returned.
   */
  getAccountMarketShare(): Promise<FuturesMarketShare> {
    return this.getPrivate('api/stats/v1/rebates/self-market-share');
  }
}
