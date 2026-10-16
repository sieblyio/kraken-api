/* eslint-disable @typescript-eslint/no-unused-vars */
import { DerivativesClient } from '../../../src/index.js';

// This example shows how to call Kraken API testnet (demo) endpoints with either node.js,
// javascript (js) or typescript (ts) with the npm module "@siebly/kraken-api" for Kraken exchange
//
// UPDATE: Kraken retired the Futures demo on 14 July 2026. testnet: true throws.
// There is no replacement demo host. These calls use the live Derivatives REST API.
// See https://support.kraken.com/articles/360024809011-api-testing-environment-derivatives

/**
 * import { DerivativesClient } from '@siebly/kraken-api';
 */

/**
 * Kraken Derivatives has a demo environment (testnet) that you can connect to via WebSocket. All you need to do is set the `testnet` option to `true` when creating the WebsocketClient instance, as shown below.
 * Everything else behaves exactly the same way.
 *
 * Note: as of November 2025, only the DerivativesClient supports testnet connections. Kraken refer to this as the "Demo" environment, but it is effectively a testnet.
 * This is a place to test your API integration. It is not a good place to test strategy performance, as the liquidity and orderbook dynamics are very different to the live environment.
 *
 * Refer to the following for more information:
 * https://github.com/tiagosiebler/awesome-crypto-examples/wiki/CEX-Testnets
 */
const client = new DerivativesClient({
  // https://demo-futures.kraken.com to create demo account
  // Retired 14 July 2026. Do not set testnet: it throws. There is no replacement demo host.
  apiKey: 'testnetKeyHere',
  apiSecret: 'testnetSecretHere',
});

async function getWallets() {
  try {
    // Get all wallets (cash and margin accounts)
    const wallets = await client.getAccounts();
    console.log('Wallets: ', JSON.stringify(wallets, null, 2));

    // Response includes:
    // - cash: Cash account with balances
    // - flex: Multi-collateral wallet with margin info
    // - Available margin, portfolio value, PnL
    // - Initial/maintenance margin requirements
    // For each margin account:
    //   - balances, auxiliary (pv, pnl, af, funding)
    //   - marginRequirements (im, mm, lt, tt)
    //   - triggerEstimates
  } catch (e) {
    console.error('Get wallets error: ', e);
  }
}

async function getOpenPositions() {
  try {
    // Get all open Futures positions
    const openPositions = await client.getOpenPositions();
    console.log('Open Positions: ', JSON.stringify(openPositions, null, 2));

    // Response includes for each position:
    // - symbol: Futures symbol
    // - side: long or short
    // - size: Position size
    // - price: Average entry price
    // - fillTime: When position was opened
    // - unrealizedFunding: Unrealized funding
  } catch (e) {
    console.error('Get open positions error: ', e);
  }
}

async function getFills() {
  try {
    // Get filled orders history (last 100)
    const fills = await client.getFills();
    console.log('Fills: ', JSON.stringify(fills, null, 2));

    // Response includes for each fill:
    // - fill_id: Unique fill identifier
    // - order_id: Associated order ID
    // - symbol: Futures symbol
    // - side: buy or sell
    // - size: Fill size
    // - price: Fill price
    // - fillTime: Execution time
    // - fillType: maker, taker, liquidation, etc.
  } catch (e) {
    console.error('Get fills error: ', e);
  }
}

async function getFillsBeforeTime() {
  try {
    // Get fills before specific time
    const fillsBeforeTime = await client.getFills({
      lastFillTime: new Date(Date.now() - 86400000).toISOString(), // 24h ago
    });
    console.log('Fills (24h ago): ', JSON.stringify(fillsBeforeTime, null, 2));

    // Returns 100 fills before specified time
  } catch (e) {
    console.error('Get fills before time error: ', e);
  }
}

async function initiateWalletTransfer() {
  try {
    // Transfer between margin accounts or to/from cash account
    const transfer = await client.submitWalletTransfer({
      fromAccount: 'cash', // or margin account name
      toAccount: 'flex', // or other margin account
      unit: 'EUR',
      amount: 10000,
    });
    console.log('Transfer Result: ', JSON.stringify(transfer, null, 2));

    // Transfers funds between accounts instantly
  } catch (e) {
    console.error('Initiate wallet transfer error: ', e);
  }
}

async function initiateWithdrawalToSpot() {
  try {
    // Withdraw from Futures to Spot wallet
    const withdrawal = await client.submitTransferToSpot({
      currency: 'USDT',
      amount: '100',
      sourceWallet: 'cash', // Default is cash wallet
    });
    console.log('Withdrawal Result: ', JSON.stringify(withdrawal, null, 2));

    // Response includes:
    // - uid: Withdrawal reference ID
  } catch (e) {
    console.error('Initiate withdrawal to spot error: ', e);
  }
}

async function getOrderEvents() {
  try {
    // Get order history events
    const orderEvents = await client.getOrderEvents({
      count: 50,
      sort: 'desc', // desc = newest first
      opened: true, // Include opened orders
      closed: true, // Include closed orders
    });
    console.log('Order Events: ', JSON.stringify(orderEvents, null, 2));

    // Response includes:
    // - elements: Array of order events
    // - Order placed, cancelled, rejected, executed events
    // - continuationToken: For pagination
  } catch (e) {
    console.error('Get order events error: ', e);
  }
}

async function getOrderEventsBySymbol() {
  try {
    // Filter order events by symbol
    const orderEventsBySymbol = await client.getOrderEvents({
      tradeable: 'PF_ETHUSD',
      count: 50,
    });
    console.log(
      'Order Events (PF_ETHUSD): ',
      JSON.stringify(orderEventsBySymbol, null, 2),
    );
  } catch (e) {
    console.error('Get order events by symbol error: ', e);
  }
}

async function getExecutionEvents() {
  try {
    // Get execution/trade history
    const executions = await client.getExecutionEvents({
      count: 50,
      sort: 'desc',
    });
    console.log('Execution Events: ', JSON.stringify(executions, null, 2));

    // Response includes for each execution:
    // - execution: Fill details (price, quantity, timestamp)
    // - order: Associated order details
    // - fee: Fee paid
    // - positionSize: Position size after execution
  } catch (e) {
    console.error('Get execution events error: ', JSON.stringify(e, null, 2));
  }
}

async function getExecutionEventsBySymbol() {
  try {
    // Filter executions by symbol
    const executionsBySymbol = await client.getExecutionEvents({
      tradeable: 'PF_ETHUSD',
      count: 50,
    });
    console.log(
      'Executions (PF_ETHUSD): ',
      JSON.stringify(executionsBySymbol, null, 2),
    );
  } catch (e) {
    console.error(
      'Get execution events by symbol error: ',
      JSON.stringify(e, null, 2),
    );
  }
}

async function getAccountLog() {
  try {
    // Get account log (all account activities)
    const accountLog = await client.getAccountLog({
      count: 50,
      sort: 'desc',
    });
    console.log('Account Log: ', JSON.stringify(accountLog, null, 2));

    // Log includes:
    // - futures trade, liquidation, funding rate change
    // - conversions, transfers, settlements
    // - interest payments, fees
  } catch (e) {
    console.error('Get account log error: ', e);
  }
}

async function getAccountLogFiltered() {
  try {
    // Filter account log by info types
    const filteredLog = await client.getAccountLog({
      info: ['futures trade', 'transfer', 'funding rate change'],
      count: 50,
    });
    console.log('Filtered Account Log: ', JSON.stringify(filteredLog, null, 2));
  } catch (e) {
    console.error('Get filtered account log error: ', e);
  }
}

// Uncomment the function you want to test:

getWallets();
getOpenPositions();
getFills();
getFillsBeforeTime();
// initiateWalletTransfer();
// initiateWithdrawalToSpot();
getOrderEvents();
getOrderEventsBySymbol();
getExecutionEvents();
getExecutionEventsBySymbol();
getAccountLog();
getAccountLogFiltered();
