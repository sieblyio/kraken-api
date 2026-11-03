import {
  SpotAlgoStrategy,
  SpotClient,
  SpotClosedStrategiesResponse,
  SpotGetClosedStrategiesParams,
  SpotSubmitStrategyParams,
} from '../../src/index.js';

class StrategyClient extends SpotClient {
  public postPrivate = jest.fn();
}

describe('Spot algo strategies', () => {
  const client = new StrategyClient();
  const strategyId = 'ASABCDE-12345-ABCDEF';
  const marketParams: SpotSubmitStrategyParams = {
    strategy_type: 'twap',
    symbol: 'BTC/USD',
    asset_class: 'forex',
    side: 'buy',
    volume: '1.50000000',
    ordertype: 'market',
    expiretm: '+3600',
  };
  const strategy: SpotAlgoStrategy = {
    strategy_id: strategyId,
    status: 'pending',
    details: {
      strategy_type: 'twap',
      symbol: 'BTC/USD',
      asset_class: 'forex',
      side: 'buy',
      volume: '1.50000000',
      filled_volume: '0',
      avg_price: '',
      total_cost: '0',
      total_fee: '0',
      starttm: '1781169958',
      expiretm: '1781173558',
      ordertype: 'market',
    },
  };

  beforeEach(() => {
    client.postPrivate.mockReset();
  });

  it.each<SpotSubmitStrategyParams>([
    marketParams,
    {
      ...marketParams,
      side: 'sell',
      ordertype: 'limit',
      price: '67000.00',
      starttm: '+300',
    },
  ])('submits a $ordertype TWAP with the original body', async (params) => {
    const response = { error: [], result: { strategy_id: strategyId } };
    client.postPrivate.mockResolvedValueOnce(response);

    await expect(client.submitStrategy(params)).resolves.toBe(response);
    expect(client.postPrivate).toHaveBeenCalledWith('0/private/AddStrategy', {
      body: params,
    });
  });

  it('preserves validate-only requests and the empty strategy ID', async () => {
    const params = { ...marketParams, validate: true };
    const response = { error: [], result: { strategy_id: '' } };
    client.postPrivate.mockResolvedValueOnce(response);

    await expect(client.submitStrategy(params)).resolves.toBe(response);
    expect(client.postPrivate).toHaveBeenCalledWith('0/private/AddStrategy', {
      body: params,
    });
  });

  it('cancels by strategy ID and returns the acknowledgement', async () => {
    const params = { strategy_id: strategyId };
    const response = { error: [], result: params };
    client.postPrivate.mockResolvedValueOnce(response);

    await expect(client.cancelStrategy(params)).resolves.toBe(response);
    expect(client.postPrivate).toHaveBeenCalledWith(
      '0/private/CancelStrategy',
      {
        body: params,
      },
    );
  });

  it.each([undefined, { strategy_type: 'twap' as const }])(
    'retrieves open strategies with optional filters: %p',
    async (params) => {
      const response = {
        error: [],
        result: { open: { [strategyId]: strategy } },
      };
      client.postPrivate.mockResolvedValueOnce(response);

      await expect(client.getOpenStrategies(params)).resolves.toBe(response);
      expect(client.postPrivate).toHaveBeenCalledWith(
        '0/private/GetOpenStrategies',
        { body: params },
      );
    },
  );

  it('queries comma-delimited IDs and preserves all lifecycle states', async () => {
    const statuses: SpotAlgoStrategy['status'][] = [
      'pending',
      'open',
      'closed',
      'expired',
      'cancelled',
    ];
    const strategies = Object.fromEntries(
      statuses.map((status, index) => {
        const id = `ASABCDE-12345-ABCDE${index}`;
        return [id, { ...strategy, strategy_id: id, status }];
      }),
    );
    const params = { strategy_ids: Object.keys(strategies).join(',') };
    const response = { error: [], result: { strategies } };
    client.postPrivate.mockResolvedValueOnce(response);

    await expect(client.queryStrategies(params)).resolves.toBe(response);
    expect(client.postPrivate).toHaveBeenCalledWith(
      '0/private/QueryStrategies',
      {
        body: params,
      },
    );
  });

  it('passes cursor pages and repeated filters without offset or count', async () => {
    const params: SpotGetClosedStrategiesParams = {
      asset_class: 'forex',
      strategy_type: 'twap',
      status: 'cancelled',
      start: 1781100000,
      end: 1781200000,
      query_time_mode: 'close',
      limit: 1,
    };
    const firstPage: SpotClosedStrategiesResponse = {
      closed: [{ ...strategy, status: 'cancelled', reason: 'userRequested' }],
      next_cursor: 'opaque-next-page',
    };
    const lastPage: SpotClosedStrategiesResponse = { closed: [] };
    client.postPrivate
      .mockResolvedValueOnce({ error: [], result: firstPage })
      .mockResolvedValueOnce({ error: [], result: lastPage });

    const first = await client.getClosedStrategies(params);
    expect(first.result).toBe(firstPage);
    const nextParams = { ...params, cursor: first.result.next_cursor };
    const last = await client.getClosedStrategies(nextParams);
    expect(last.result).toBe(lastPage);
    expect(last.result.next_cursor).toBeUndefined();
    expect(client.postPrivate).toHaveBeenNthCalledWith(
      1,
      '0/private/GetClosedStrategies',
      { body: params },
    );
    expect(client.postPrivate).toHaveBeenNthCalledWith(
      2,
      '0/private/GetClosedStrategies',
      { body: nextParams },
    );
  });

  it('retrieves closed strategies without filters', async () => {
    const response = { error: [], result: { closed: [] } };
    client.postPrivate.mockResolvedValueOnce(response);

    await expect(client.getClosedStrategies()).resolves.toBe(response);
    expect(client.postPrivate).toHaveBeenCalledWith(
      '0/private/GetClosedStrategies',
      { body: undefined },
    );
  });

  it('propagates private request failures', async () => {
    const error = new Error('EGeneral:Invalid arguments');
    client.postPrivate.mockRejectedValueOnce(error);

    await expect(client.submitStrategy(marketParams)).rejects.toBe(error);
  });

  it('excludes unsupported pagination fields and active status filters', () => {
    // @ts-expect-error Closed strategies use cursor pagination, not offsets.
    const offset: SpotGetClosedStrategiesParams = { ofs: 1 };
    // @ts-expect-error Closed strategies have no count request parameter.
    const count: SpotGetClosedStrategiesParams = { count: 10 };
    // @ts-expect-error Only terminal statuses are valid filters.
    const active: SpotGetClosedStrategiesParams = { status: 'open' };
    // @ts-expect-error There is no total count in the response.
    const response: SpotClosedStrategiesResponse = { closed: [], count: 0 };
    expect([offset, count, active, response]).toHaveLength(4);
  });
});
