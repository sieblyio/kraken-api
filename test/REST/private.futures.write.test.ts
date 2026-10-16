import { DerivativesClient } from '../../src/index.js';
import { getTestProxy } from '../proxy.util.js';

/**
 * Live futures checks only.
 * Kraken retired the Futures demo on 14 July 2026, so nothing in this file
 * may place, amend, cancel, transfer, or otherwise write against the live API.
 * Former write calls are replaced with the matching read endpoint where one exists.
 */
describe('REST PRIVATE FUTURES LIVE READ', () => {
  const account = {
    key: process.env.API_FUTURES_KEY,
    secret: process.env.API_FUTURES_SECRET,
  };

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

  describe('read-only replacements for former write calls', () => {
    it('should succeed calling getLeverageSettings', async () => {
      try {
        const res = await rest.getLeverageSettings();

        expect(res).toMatchObject({
          result: 'success',
          leveragePreferences: expect.any(Array),
        });
      } catch (e: any) {
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        expect(e).not.toBeDefined();
      }
    });

    it('should succeed calling getSelfTradeStrategy', async () => {
      try {
        const res = await rest.getSelfTradeStrategy();

        expect(res).toMatchObject({
          result: 'success',
          strategy: expect.any(String),
        });
      } catch (e: any) {
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        expect(e).not.toBeDefined();
      }
    });

    it('should get assignment programs or report unaccepted terms', async () => {
      try {
        const res = await rest.getAssignmentPrograms();

        expect(res).toMatchObject({
          result: 'success',
          participants: expect.any(Array),
        });
      } catch (e: any) {
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        // Live accounts may not have accepted the assignment program terms.
        expect(e?.body).toMatchObject({
          result: 'error',
          error: 'assignmentProgramTermsNotAcceptedFrontend',
        });
      }
    });

    it('should get assignment preferences history or report unaccepted terms', async () => {
      try {
        const res = await rest.getAssignmentPreferencesHistory();

        expect(res).toMatchObject({
          result: 'success',
          participants: expect.any(Array),
        });
      } catch (e: any) {
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        // Live accounts may not have accepted the assignment program terms.
        expect(e?.body).toMatchObject({
          result: 'error',
          error: 'assignmentProgramTermsNotAcceptedFrontend',
        });
      }
    });

    it('should succeed calling getNotifications', async () => {
      try {
        const res = await rest.getNotifications();

        expect(res).toMatchObject({
          result: 'success',
          notifications: expect.any(Array),
        });
      } catch (e: any) {
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        expect(e).not.toBeDefined();
      }
    });

    it('should succeed calling getOrderEvents', async () => {
      try {
        const res = await rest.getOrderEvents();

        // History responses do not include the trading API's result field.
        expect(res).toMatchObject({
          elements: expect.any(Array),
        });
      } catch (e: any) {
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        expect(e).not.toBeDefined();
      }
    });

    it('should succeed calling getExecutionEvents', async () => {
      try {
        const res = await rest.getExecutionEvents();

        // History responses do not include the trading API's result field.
        expect(res).toMatchObject({
          elements: expect.any(Array),
        });
      } catch (e: any) {
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        expect(e).not.toBeDefined();
      }
    });

    it('should succeed calling getPositionPercentile', async () => {
      try {
        const res = await rest.getPositionPercentile();

        expect(res).toMatchObject({
          result: 'success',
          queue: expect.any(Array),
        });
      } catch (e: any) {
        console.log(`err "${expect.getState().currentTestName}"`, e?.body || e);
        expect(e).not.toBeDefined();
      }
    });
  });
});
