
# Endpoint maps

<p align="center">
  <a href="https://www.npmjs.com/package/@siebly/kraken-api">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/sieblyio/kraken-api/blob/main/docs/images/logoDarkMode2.svg?raw=true#gh-dark-mode-only">
      <img alt="SDK Logo" src="https://github.com/sieblyio/kraken-api/blob/main/docs/images/logoBrightMode2.svg?raw=true#gh-light-mode-only">
    </picture>
  </a>
</p>

Each REST client is a JavaScript class, which provides functions individually mapped to each endpoint available in the exchange's API offering. 

The following table shows all methods available in each REST client, whether the method requires authentication (automatically handled if API keys are provided), as well as the exact endpoint each method is connected to.

This can be used to easily find which method to call, once you have [found which endpoint you're looking to use](https://github.com/sieblyio/awesome-crypto-examples/wiki/How-to-find-SDK-functions-that-match-API-docs-endpoint).

All REST clients are in the [src](/src) folder. For usage examples, make sure to check the [examples](/examples) folder.

List of clients:
- [SpotClient](#spotclientts)
- [DerivativesClient](#derivativesclientts)
- [InstitutionalClient](#institutionalclientts)
- [PartnerClient](#partnerclientts)
- [AffiliateClient](#affiliateclientts)
- [WebsocketAPIClient](#websocketapiclientts)


If anything is missing or wrong, please open an issue or let us know in our [Node.js Traders](https://t.me/nodetraders) telegram group!

## How to use table

Table consists of 4 parts:

- Function name
- AUTH
- HTTP Method
- Endpoint

**Function name** is the name of the function that can be called through the SDK. Check examples folder in the repo for more help on how to use them!

**AUTH** is a boolean value that indicates if the function requires authentication - which means you need to pass your API key and secret to the SDK.

**HTTP Method** shows HTTP method that the function uses to call the endpoint. Sometimes endpoints can have same URL, but different HTTP method so you can use this column to differentiate between them.

**Endpoint** is the URL that the function uses to call the endpoint. Best way to find exact function you need for the endpoint is to search for URL in this table and find corresponding function name.


# SpotClient.ts

This table includes all endpoints from the official Exchange API docs and corresponding SDK functions for each endpoint that are found in [SpotClient.ts](/src/SpotClient.ts). 

| Function | AUTH | HTTP Method | Endpoint |
| -------- | :------: | :------: | -------- |
| [getSystemStatus()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L151) |  | GET | `0/public/SystemStatus` |
| [getMaintenanceSchedule()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L160) |  | GET | `0/public/MaintenanceSchedule` |
| [getAssetInfo()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L171) |  | GET | `0/public/Assets` |
| [getAssetPairs()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L183) |  | GET | `0/public/AssetPairs` |
| [getTicker()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L196) |  | GET | `0/public/Ticker` |
| [getCandles()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L210) |  | GET | `0/public/OHLC` |
| [getOrderBook()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L222) |  | GET | `0/public/Depth` |
| [getGroupedBook()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L233) |  | GET | `0/public/GroupedBook` |
| [getLevel3OrderBook()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L244) | :closed_lock_with_key:  | POST | `0/private/Level3` |
| [getRecentTrades()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L255) |  | GET | `0/public/Trades` |
| [getRecentSpreads()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L266) |  | GET | `0/public/Spread` |
| [getAccountBalance()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L284) | :closed_lock_with_key:  | POST | `0/private/Balance` |
| [getApiKeyInfo()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L299) | :closed_lock_with_key:  | POST | `0/private/GetApiKeyInfo` |
| [getWalletAccounts()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L310) | :closed_lock_with_key:  | POST | `0/private/ListWalletAccounts` |
| [getExtendedBalance()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L322) | :closed_lock_with_key:  | POST | `0/private/BalanceEx` |
| [getCreditLines()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L338) | :closed_lock_with_key:  | POST | `0/private/CreditLines` |
| [getTradeBalance()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L354) | :closed_lock_with_key:  | POST | `0/private/TradeBalance` |
| [getOpenOrders()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L370) | :closed_lock_with_key:  | POST | `0/private/OpenOrders` |
| [getClosedOrders()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L386) | :closed_lock_with_key:  | POST | `0/private/ClosedOrders` |
| [getOrders()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L401) | :closed_lock_with_key:  | POST | `0/private/QueryOrders` |
| [getOrderAmends()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L417) | :closed_lock_with_key:  | POST | `0/private/OrderAmends` |
| [getTradesHistory()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L434) | :closed_lock_with_key:  | POST | `0/private/TradesHistory` |
| [getTrades()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L449) | :closed_lock_with_key:  | POST | `0/private/QueryTrades` |
| [getOpenPositions()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L464) | :closed_lock_with_key:  | POST | `0/private/OpenPositions` |
| [getLedgersInfo()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L480) | :closed_lock_with_key:  | POST | `0/private/Ledgers` |
| [getLedgers()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L495) | :closed_lock_with_key:  | POST | `0/private/QueryLedgers` |
| [getTradingVolume()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L511) | :closed_lock_with_key:  | POST | `0/private/TradeVolume` |
| [requestLedgersExport()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L522) | :closed_lock_with_key:  | POST | `0/private/AddExport` |
| [getLedgersExportStatus()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L533) | :closed_lock_with_key:  | POST | `0/private/ExportStatus` |
| [getLedgersExport()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L544) | :closed_lock_with_key:  | POST | `0/private/RetrieveExport` |
| [deleteLedgersExport()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L553) | :closed_lock_with_key:  | POST | `0/private/RemoveExport` |
| [submitOrder()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L573) | :closed_lock_with_key:  | POST | `0/private/AddOrder` |
| [amendOrder()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L587) | :closed_lock_with_key:  | POST | `0/private/AmendOrder` |
| [cancelOrder()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L602) | :closed_lock_with_key:  | POST | `0/private/CancelOrder` |
| [cancelAllOrders()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L618) | :closed_lock_with_key:  | POST | `0/private/CancelAll` |
| [cancelAllOrdersAfter()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L634) | :closed_lock_with_key:  | POST | `0/private/CancelAllOrdersAfter` |
| [getWebSocketsToken()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L651) | :closed_lock_with_key:  | POST | `0/private/GetWebSocketsToken` |
| [submitBatchOrders()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L663) | :closed_lock_with_key:  | POST | `0/private/AddOrderBatch` |
| [cancelBatchOrders()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L678) | :closed_lock_with_key:  | POST | `0/private/CancelOrderBatch` |
| [getDepositMethods()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L702) | :closed_lock_with_key:  | POST | `0/private/DepositMethods` |
| [getDepositAddresses()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L713) | :closed_lock_with_key:  | POST | `0/private/DepositAddresses` |
| [getDepositsStatus()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L724) | :closed_lock_with_key:  | POST | `0/private/DepositStatus` |
| [getWithdrawalMethods()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L735) | :closed_lock_with_key:  | POST | `0/private/WithdrawMethods` |
| [getWithdrawalAddresses()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L746) | :closed_lock_with_key:  | POST | `0/private/WithdrawAddresses` |
| [getWithdrawalInfo()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L757) | :closed_lock_with_key:  | POST | `0/private/WithdrawInfo` |
| [submitWithdrawal()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L768) | :closed_lock_with_key:  | POST | `0/private/Withdraw` |
| [getWithdrawalsStatus()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L781) | :closed_lock_with_key:  | POST | `0/private/WithdrawStatus` |
| [cancelWithdrawal()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L792) | :closed_lock_with_key:  | POST | `0/private/WithdrawCancel` |
| [submitTransferToFutures()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L805) | :closed_lock_with_key:  | POST | `0/private/WalletTransfer` |
| [createSubaccount()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L825) | :closed_lock_with_key:  | POST | `0/private/CreateSubaccount` |
| [submitSubaccountTransfer()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L838) | :closed_lock_with_key:  | POST | `0/private/AccountTransfer` |
| [allocateEarnFunds()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L856) | :closed_lock_with_key:  | POST | `0/private/Earn/Allocate` |
| [deallocateEarnFunds()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L869) | :closed_lock_with_key:  | POST | `0/private/Earn/Deallocate` |
| [getEarnAllocationStatus()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L881) | :closed_lock_with_key:  | POST | `0/private/Earn/AllocateStatus` |
| [getEarnDeallocationStatus()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L894) | :closed_lock_with_key:  | POST | `0/private/Earn/DeallocateStatus` |
| [getEarnStrategies()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L910) | :closed_lock_with_key:  | POST | `0/private/Earn/Strategies` |
| [getEarnAllocations()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L925) | :closed_lock_with_key:  | POST | `0/private/Earn/Allocations` |
| [getPreTradeData()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L943) |  | GET | `0/public/PreTrade` |
| [getPostTradeData()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L955) |  | GET | `0/public/PostTrade` |
| [getOAuthAccessToken()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L973) |  | POST | `oauth/token` |
| [getOAuthUserInfo()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L985) | :closed_lock_with_key:  | GET | `oauth/userinfo` |
| [createOAuthFastApiKey()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L995) | :closed_lock_with_key:  | POST | `oauth/fast-api-key` |
| [deleteOAuthFastApiKey()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L1007) | :closed_lock_with_key:  | DELETE | `oauth/fast-api-key` |
| [updateOAuthFastApiKey()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L1021) | :closed_lock_with_key:  | PUT | `oauth/fast-api-key` |
| [listOAuthFastApiKeys()](https://github.com/sieblyio/kraken-api/blob/main/src/SpotClient.ts#L1033) | :closed_lock_with_key:  | GET | `oauth/fast-api-keys` |

# DerivativesClient.ts

This table includes all endpoints from the official Exchange API docs and corresponding SDK functions for each endpoint that are found in [DerivativesClient.ts](/src/DerivativesClient.ts). 

| Function | AUTH | HTTP Method | Endpoint |
| -------- | :------: | :------: | -------- |
| [getTradeHistory()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L110) |  | GET | `derivatives/api/v3/history` |
| [getOrderbook()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L124) |  | GET | `derivatives/api/v3/orderbook` |
| [getTickers()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L135) |  | GET | `derivatives/api/v3/tickers` |
| [getTicker()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L146) |  | GET | `derivatives/api/v3/tickers/{symbol}` |
| [getInstruments()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L163) |  | GET | `derivatives/api/v3/instruments` |
| [getTradingInstruments()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L174) | :closed_lock_with_key:  | GET | `derivatives/api/v3/trading/instruments` |
| [getInstrumentStatusList()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L185) |  | GET | `derivatives/api/v3/instruments/status` |
| [getInstrumentStatus()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L198) |  | GET | `derivatives/api/v3/instruments/{symbol}/status` |
| [batchOrderManagement()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L218) | :closed_lock_with_key:  | POST | `derivatives/api/v3/batchorder` |
| [cancelAllOrders()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L237) | :closed_lock_with_key:  | POST | `derivatives/api/v3/cancelallorders` |
| [cancelAllOrdersAfter()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L253) | :closed_lock_with_key:  | POST | `derivatives/api/v3/cancelallordersafter` |
| [cancelOrder()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L268) | :closed_lock_with_key:  | POST | `derivatives/api/v3/cancelorder` |
| [editOrder()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L288) | :closed_lock_with_key:  | POST | `derivatives/api/v3/editorder` |
| [getOpenOrders()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L303) | :closed_lock_with_key:  | GET | `derivatives/api/v3/openorders` |
| [submitOrder()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L314) | :closed_lock_with_key:  | POST | `derivatives/api/v3/sendorder` |
| [getOrderStatus()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L329) | :closed_lock_with_key:  | POST | `derivatives/api/v3/orders/status` |
| [getPnlPreferences()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L351) | :closed_lock_with_key:  | GET | `derivatives/api/v3/pnlpreferences` |
| [setPnlPreference()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L363) | :closed_lock_with_key:  | PUT | `derivatives/api/v3/pnlpreferences` |
| [getLeverageSettings()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L377) | :closed_lock_with_key:  | GET | `derivatives/api/v3/leveragepreferences` |
| [setLeverageSettings()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L391) | :closed_lock_with_key:  | PUT | `derivatives/api/v3/leveragepreferences` |
| [getRfqAssignmentMaxLeverage()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L405) | :closed_lock_with_key:  | GET | `derivatives/api/v3/rfq-assignment/max-leverage` |
| [setRfqAssignmentMaxLeverage()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L416) | :closed_lock_with_key:  | PUT | `derivatives/api/v3/rfq-assignment/max-leverage` |
| [deleteRfqAssignmentMaxLeverage()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L429) | :closed_lock_with_key:  | DELETE | `derivatives/api/v3/rfq-assignment/max-leverage` |
| [getAccounts()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L448) | :closed_lock_with_key:  | GET | `derivatives/api/v3/accounts` |
| [getOpenPositions()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L460) | :closed_lock_with_key:  | GET | `derivatives/api/v3/openpositions` |
| [getPositionPercentile()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L471) | :closed_lock_with_key:  | GET | `derivatives/api/v3/unwindqueue` |
| [getPortfolioMarginParameters()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L486) | :closed_lock_with_key:  | GET | `derivatives/api/v3/portfolio-margining/parameters` |
| [simulateMarginRequirements()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L500) | :closed_lock_with_key:  | POST | `derivatives/api/v3/portfolio-margining/simulate` |
| [getAssignmentPrograms()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L519) | :closed_lock_with_key:  | GET | `derivatives/api/v3/assignmentprogram/current` |
| [addAssignmentPreference()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L530) | :closed_lock_with_key:  | POST | `derivatives/api/v3/assignmentprogram/add` |
| [deleteAssignmentPreference()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L543) | :closed_lock_with_key:  | POST | `derivatives/api/v3/assignmentprogram/delete` |
| [getAssignmentPreferencesHistory()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L556) | :closed_lock_with_key:  | GET | `derivatives/api/v3/assignmentprogram/history` |
| [getFeeSchedules()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L577) |  | GET | `derivatives/api/v3/feeschedules` |
| [getFeeScheduleVolumes()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L590) | :closed_lock_with_key:  | GET | `derivatives/api/v3/feeschedules/volumes` |
| [getNotifications()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L609) | :closed_lock_with_key:  | GET | `derivatives/api/v3/notifications` |
| [getFills()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L626) | :closed_lock_with_key:  | GET | `derivatives/api/v3/fills` |
| [getHistoricalFundingRates()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L643) |  | GET | `derivatives/api/v3/historical-funding-rates` |
| [getSelfTradeStrategy()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L662) | :closed_lock_with_key:  | GET | `derivatives/api/v3/self-trade-strategy` |
| [updateSelfTradeStrategy()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L675) | :closed_lock_with_key:  | PUT | `derivatives/api/v3/self-trade-strategy` |
| [getSubaccountTradingStatus()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L698) | :closed_lock_with_key:  | GET | `derivatives/api/v3/subaccount/{subaccountUid}/trading-enabled` |
| [updateSubaccountTradingStatus()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L711) | :closed_lock_with_key:  | PUT | `derivatives/api/v3/subaccount/{subaccountUid}/trading-enabled` |
| [getSubaccounts()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L727) | :closed_lock_with_key:  | GET | `derivatives/api/v3/subaccounts` |
| [submitWalletTransfer()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L744) | :closed_lock_with_key:  | POST | `derivatives/api/v3/transfer` |
| [submitSubaccountTransfer()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L757) | :closed_lock_with_key:  | POST | `derivatives/api/v3/transfer/subaccount` |
| [submitTransferToSpot()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L771) | :closed_lock_with_key:  | POST | `derivatives/api/v3/withdrawal` |
| [getOpenRFQs()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L793) |  | GET | `derivatives/api/v3/rfqs` |
| [getOpenRFQ()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L807) |  | GET | `derivatives/api/v3/rfqs/{rfqUid}` |
| [getRFQOpenOffers()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L821) | :closed_lock_with_key:  | GET | `derivatives/api/v3/rfqs/open-offers` |
| [submitRFQNewOffer()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L835) | :closed_lock_with_key:  | POST | `derivatives/api/v3/rfqs/{rfqUid}/place-offer` |
| [updateRFQOpenOffer()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L854) | :closed_lock_with_key:  | PUT | `derivatives/api/v3/rfqs/{rfqUid}/replace-offer` |
| [cancelRFQOffer()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L873) | :closed_lock_with_key:  | DELETE | `derivatives/api/v3/rfqs/{rfqUid}/cancel-offer` |
| [getExecutionEvents()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L892) | :closed_lock_with_key:  | GET | `api/history/v3/executions` |
| [getOrderEvents()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L907) | :closed_lock_with_key:  | GET | `api/history/v3/orders` |
| [getTriggerEvents()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L922) | :closed_lock_with_key:  | GET | `api/history/v3/triggers` |
| [getPositionEvents()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L937) | :closed_lock_with_key:  | GET | `api/history/v3/positions` |
| [getAccountLog()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L953) | :closed_lock_with_key:  | GET | `api/history/v3/account-log` |
| [getAccountLogCsv()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L964) | :closed_lock_with_key:  | GET | `api/history/v3/accountlogcsv` |
| [getPublicExecutionEvents()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L979) |  | GET | `api/history/v3/market/{tradeable}/executions` |
| [getPublicOrderEvents()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L993) |  | GET | `api/history/v3/market/{tradeable}/orders` |
| [getPublicMarkPriceEvents()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L1007) |  | GET | `api/history/v3/market/{tradeable}/price` |
| [getTickTypes()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L1027) |  | GET | `api/charts/v1/` |
| [getMarketsForTickType()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L1037) |  | GET | `api/charts/v1/{tickType}` |
| [getResolutions()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L1050) |  | GET | `api/charts/v1/{tickType}/{symbol}` |
| [getCandles()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L1065) |  | GET | `api/charts/v1/{tickType}/{symbol}/{resolution}` |
| [getLiquidityPoolStatistic()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L1083) |  | GET | `api/charts/v1/analytics/liquidity-pool` |
| [getMarketAnalytics()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L1094) |  | GET | `api/charts/v1/analytics/{symbol}/{analyticsType}` |
| [checkApiKeyV3()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L1114) | :closed_lock_with_key:  | GET | `api/auth/v1/api-keys/v3/check` |
| [getAccountMarketShare()](https://github.com/sieblyio/kraken-api/blob/main/src/DerivativesClient.ts#L1130) | :closed_lock_with_key:  | GET | `api/stats/v1/rebates/self-market-share` |

# InstitutionalClient.ts

This table includes all endpoints from the official Exchange API docs and corresponding SDK functions for each endpoint that are found in [InstitutionalClient.ts](/src/InstitutionalClient.ts). 

| Function | AUTH | HTTP Method | Endpoint |
| -------- | :------: | :------: | -------- |
| [listCustodyVaults()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L73) | :closed_lock_with_key:  | POST | `0/private/ListCustodyVaults` |
| [getCustodyVaultbyId()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L86) | :closed_lock_with_key:  | POST | `0/private/GetCustodyVault` |
| [getCustodyDepositMethods()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L103) | :closed_lock_with_key:  | POST | `0/private/DepositMethods` |
| [getCustodyDepositAddresses()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L119) | :closed_lock_with_key:  | POST | `0/private/DepositAddresses` |
| [listCustodyTransactions()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L134) | :closed_lock_with_key:  | POST | `0/private/ListCustodyTransactions` |
| [getCustodyTransactionbyId()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L149) | :closed_lock_with_key:  | POST | `0/private/GetCustodyTransaction` |
| [getCustodyWithdrawMethods()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L170) | :closed_lock_with_key:  | POST | `0/private/WithdrawMethods` |
| [getCustodyWithdrawAddresses()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L185) | :closed_lock_with_key:  | POST | `0/private/WithdrawAddresses` |
| [listCustodyTasks()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L211) | :closed_lock_with_key:  | POST | `0/private/ListCustodyTasks` |
| [getCustodyTaskbyId()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L224) | :closed_lock_with_key:  | POST | `0/private/GetCustodyTask` |
| [listCustodyActivities()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L240) | :closed_lock_with_key:  | POST | `0/private/ListCustodyActivities` |
| [getCustodyActivitybyId()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L253) | :closed_lock_with_key:  | POST | `0/private/GetCustodyActivity` |
| [createOtcQuoteRequest()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L276) | :closed_lock_with_key:  | POST | `0/private/CreateOtcQuoteRequest` |
| [updateOtcQuote()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L290) | :closed_lock_with_key:  | POST | `0/private/UpdateOtcQuote` |
| [getOtcPairs()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L304) | :closed_lock_with_key:  | POST | `0/private/GetOtcPairs` |
| [getOtcActiveQuotes()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L316) | :closed_lock_with_key:  | POST | `0/private/GetOtcActiveQuotes` |
| [getOtcHistoricalQuotes()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L331) | :closed_lock_with_key:  | POST | `0/private/GetOtcHistoricalQuotes` |
| [getOtcExposures()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L345) | :closed_lock_with_key:  | POST | `0/private/GetOtcExposures` |
| [checkOtcClient()](https://github.com/sieblyio/kraken-api/blob/main/src/InstitutionalClient.ts#L359) | :closed_lock_with_key:  | POST | `0/private/CheckOtcClient` |

# PartnerClient.ts

This table includes all endpoints from the official Exchange API docs and corresponding SDK functions for each endpoint that are found in [PartnerClient.ts](/src/PartnerClient.ts). 

| Function | AUTH | HTTP Method | Endpoint |
| -------- | :------: | :------: | -------- |
| [createEmbedUser()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L94) | :closed_lock_with_key:  | POST | `b2b/users` |
| [getEmbedUser()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L107) | :closed_lock_with_key:  | GET | `b2b/users/{user}` |
| [updateEmbedUser()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L116) | :closed_lock_with_key:  | PATCH | `b2b/users/{user}` |
| [submitEmbedVerification()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L138) | :closed_lock_with_key:  | POST | `b2b/verifications/{user}` |
| [listEmbedAssets()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L159) | :closed_lock_with_key:  | GET | `b2b/assets` |
| [getEmbedAsset()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L170) | :closed_lock_with_key:  | GET | `b2b/assets/{asset}` |
| [listEmbedAssetRates()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L183) | :closed_lock_with_key:  | GET | `b2b/assets/{asset}/rates` |
| [requestEmbedQuote()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L201) | :closed_lock_with_key:  | POST | `b2b/quotes` |
| [getEmbedQuote()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L216) | :closed_lock_with_key:  | GET | `b2b/quotes/{quote_id}` |
| [executeEmbedQuote()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L228) | :closed_lock_with_key:  | PUT | `b2b/quotes/{quote_id}` |
| [getEmbedQuoteLimits()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L242) | :closed_lock_with_key:  | GET | `b2b/quotes/limits` |
| [requestEmbedProspectiveQuote()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L253) | :closed_lock_with_key:  | POST | `b2b/quotes/prospective` |
| [createEmbedCustomOrder()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L274) | :closed_lock_with_key:  | POST | `b2b/custom-orders` |
| [listEmbedCustomOrders()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L289) | :closed_lock_with_key:  | GET | `b2b/custom-orders` |
| [getEmbedCustomOrder()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L300) | :closed_lock_with_key:  | GET | `b2b/custom-orders/{order_id}` |
| [cancelEmbedCustomOrder()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L312) | :closed_lock_with_key:  | POST | `b2b/custom-orders/{id}/cancel` |
| [getEmbedPortfolioSummary()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L332) | :closed_lock_with_key:  | GET | `b2b/portfolio/{user}/summary` |
| [getEmbedPortfolioHistory()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L345) | :closed_lock_with_key:  | GET | `b2b/portfolio/{user}/history` |
| [listEmbedPortfolioDetails()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L357) | :closed_lock_with_key:  | GET | `b2b/portfolio/{user}/details` |
| [listEmbedPortfolioTransactions()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L369) | :closed_lock_with_key:  | GET | `b2b/portfolio/{user}/transactions` |
| [getEmbedEarnSummary()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L388) | :closed_lock_with_key:  | GET | `b2b/earn/{user}` |
| [listEmbedEarnAssets()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L401) | :closed_lock_with_key:  | GET | `b2b/earn/assets` |
| [toggleEmbedAutoEarn()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L414) | :closed_lock_with_key:  | PUT | `b2b/earn/{user}/auto` |
| [withdrawEmbedFunds()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L435) | :closed_lock_with_key:  | POST | `b2b/funds/withdrawals` |
| [listEmbedFundingTransactions()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L450) | :closed_lock_with_key:  | GET | `b2b/funds/transactions` |
| [listEmbedSettlementReports()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L468) | :closed_lock_with_key:  | GET | `b2b/reports/settlement` |
| [getEmbedSettlementReport()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L479) | :closed_lock_with_key:  | GET | `b2b/reports/settlement/{id}` |
| [listRampBuyCryptoAssets()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L497) | :closed_lock_with_key:  | GET | `b2b/ramp/buy/crypto` |
| [listRampFiatCurrencies()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L506) | :closed_lock_with_key:  | GET | `b2b/ramp/fiat-currencies` |
| [listRampPaymentMethods()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L516) | :closed_lock_with_key:  | GET | `b2b/ramp/payment-methods` |
| [listRampCountries()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L526) | :closed_lock_with_key:  | GET | `b2b/ramp/countries` |
| [getRampLimits()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L541) | :closed_lock_with_key:  | GET | `b2b/ramp/limits` |
| [getRampProspectiveQuote()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L553) | :closed_lock_with_key:  | GET | `b2b/ramp/quotes/prospective` |
| [getRampCheckoutUrl()](https://github.com/sieblyio/kraken-api/blob/main/src/PartnerClient.ts#L571) | :closed_lock_with_key:  | GET | `b2b/ramp/checkout` |

# AffiliateClient.ts

This table includes all endpoints from the official Exchange API docs and corresponding SDK functions for each endpoint that are found in [AffiliateClient.ts](/src/AffiliateClient.ts). 

| Function | AUTH | HTTP Method | Endpoint |
| -------- | :------: | :------: | -------- |
| [getCpaProgress()](https://github.com/sieblyio/kraken-api/blob/main/src/AffiliateClient.ts#L26) | :closed_lock_with_key:  | GET | `affiliate/v1/cpa-progress` |
| [getPayoutHistory()](https://github.com/sieblyio/kraken-api/blob/main/src/AffiliateClient.ts#L35) | :closed_lock_with_key:  | GET | `affiliate/v1/payout-history` |
| [getDailyActivity()](https://github.com/sieblyio/kraken-api/blob/main/src/AffiliateClient.ts#L44) | :closed_lock_with_key:  | GET | `affiliate/v1/daily-activity` |

# WebsocketAPIClient.ts

This table includes all endpoints from the official Exchange API docs and corresponding SDK functions for each endpoint that are found in [WebsocketAPIClient.ts](/src/WebsocketAPIClient.ts). 

This client provides WebSocket API endpoints which allow for faster interactions with the Kraken API via a WebSocket connection.

| Function | AUTH | HTTP Method | Endpoint |
| -------- | :------: | :------: | -------- |
| [submitSpotOrder()](https://github.com/sieblyio/kraken-api/blob/main/src/WebsocketAPIClient.ts#L85) | :closed_lock_with_key:  | WS | `add_order` |
| [amendSpotOrder()](https://github.com/sieblyio/kraken-api/blob/main/src/WebsocketAPIClient.ts#L99) | :closed_lock_with_key:  | WS | `amend_order` |
| [cancelSpotOrder()](https://github.com/sieblyio/kraken-api/blob/main/src/WebsocketAPIClient.ts#L113) | :closed_lock_with_key:  | WS | `cancel_order` |
| [cancelAllSpotOrders()](https://github.com/sieblyio/kraken-api/blob/main/src/WebsocketAPIClient.ts#L127) | :closed_lock_with_key:  | WS | `cancel_all` |
| [cancelAllSpotOrdersAfter()](https://github.com/sieblyio/kraken-api/blob/main/src/WebsocketAPIClient.ts#L139) | :closed_lock_with_key:  | WS | `cancel_all_orders_after` |
| [batchSubmitSpotOrders()](https://github.com/sieblyio/kraken-api/blob/main/src/WebsocketAPIClient.ts#L158) | :closed_lock_with_key:  | WS | `batch_add` |
| [batchCancelSpotOrders()](https://github.com/sieblyio/kraken-api/blob/main/src/WebsocketAPIClient.ts#L172) | :closed_lock_with_key:  | WS | `batch_cancel` |
| [editSpotOrder()](https://github.com/sieblyio/kraken-api/blob/main/src/WebsocketAPIClient.ts#L189) | :closed_lock_with_key:  | WS | `edit_order` |