import { DerivativesClient } from '../../src/index.js';
import { getTestProxy } from '../proxy.util.js';

describe('REST PRIVATE FUTURES READ', () => {
  const account = {
    key: process.env.API_FUTURES_KEY, // Use keys with WRITE access (empty sub-account), because read only give auth error only
    secret: process.env.API_FUTURES_SECRET,
  };

  // Live only. Kraken retired the Futures demo on 14 July 2026, so testnet is not set.
  const rest = new DerivativesClient(
    {
      apiKey: account.key,
      apiSecret: account.secret,
    },
    getTestProxy(),
  );

  it('should have credentials to test with', () => {
    expect(account.key).toBeDefined();
    expect(account.secret).toBeDefined();
  });

  describe('public endpoints (with keys provided)', () => {
    it('should succeed making a GET request to getTradeHistory', async () => {
      try {
        const res = await rest.getTradeHistory({ symbol: 'PF_XBTUSD' });

        // console.log(`res "${expect.getState().currentTestName}"`, res);
        expect(res).toMatchObject({
          result: 'success',
          history: expect.any(Array),
        });
      } catch (e: any) {
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        expect(e).not.toBeDefined();
      }
    });
  });

  describe('private read endpoints', () => {
    describe('without params', () => {
      it('should succeed calling getAccounts', async () => {
        try {
          const res = await rest.getAccounts();

          // console.log(`res "${expect.getState().currentTestName}"`, res);
          expect(res).toMatchObject({
            result: 'success',
            accounts: expect.any(Object),
          });
        } catch (e: any) {
          console.log(
            `err "${expect.getState().currentTestName}"`,
            e?.body || e,
          );
          expect(e).not.toBeDefined();
        }
      });

      it('should succeed calling getPnlPreferences', async () => {
        try {
          const res = await rest.getPnlPreferences();

          // console.log(`res "${expect.getState().currentTestName}"`, res);
          expect(res).toMatchObject({
            result: 'success',
            preferences: expect.any(Array),
          });
        } catch (e: any) {
          console.log(
            `err "${expect.getState().currentTestName}"`,
            e?.body || e,
          );
          expect(e).not.toBeDefined();
        }
      });

      it('should succeed calling getOpenOrders', async () => {
        try {
          const res = await rest.getOpenOrders();

          //console.log(`res "${expect.getState().currentTestName}"`, res);
          expect(res).toMatchObject({
            result: 'success',
            openOrders: expect.any(Array),
          });
        } catch (e: any) {
          console.log(
            `err "${expect.getState().currentTestName}"`,
            e?.body || e,
          );
          expect(e).not.toBeDefined();
        }
      });

      it('should succeed calling getOpenPositions', async () => {
        try {
          const res = await rest.getOpenPositions();

          // console.log(`res "${expect.getState().currentTestName}"`, res);
          expect(res).toMatchObject({
            result: 'success',
            openPositions: expect.any(Array),
          });
        } catch (e: any) {
          console.log(
            `err "${expect.getState().currentTestName}"`,
            e?.body || e,
          );
          expect(e).not.toBeDefined();
        }
      });
    });

    describe('with params', () => {
      it('should succeed calling getFills with params', async () => {
        try {
          const res = await rest.getFills({
            lastFillTime: '2020-07-22T13:45:00.000Z',
          });

          // console.log(`res "${expect.getState().currentTestName}"`, res);
          expect(res).toMatchObject({
            result: 'success',
            fills: expect.any(Array),
          });
        } catch (e: any) {
          console.log(
            `err "${expect.getState().currentTestName}"`,
            e?.body || e,
          );
          expect(e).not.toBeDefined();
        }
      });

      it('should succeed calling getOrderStatus with params', async () => {
        try {
          const res = await rest.getOrderStatus({
            orderIds: ['a02ed7b1-096f-4629-877c-24749fab6560'],
          });

          // console.log(`res "${expect.getState().currentTestName}"`, res);
          expect(res).toMatchObject({
            result: 'success',
            orders: expect.any(Array),
          });
        } catch (e: any) {
          console.log(
            `err "${expect.getState().currentTestName}"`,
            e?.body || e,
          );
          expect(e).not.toBeDefined();
        }
      });
    });
  });
});
